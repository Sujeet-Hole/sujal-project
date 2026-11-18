// Enquiry form submission: a public server function that validates the input,
// blocks bots (honeypot, minimum fill time, Cloudflare Turnstile), rate-limits
// repeat submissions and forwards each enquiry to a Google Apps Script web app,
// which saves it in the institute's Google Sheet and emails the Ashadeep Gmail.
// No database and no third-party mail service are used.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/** Shared (client + server) validation schema for the enquiry fields. */
export const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(100, "Name must be under 100 characters"),
  mobile: z
    .string()
    .trim()
    .regex(/^(\+91[\s-]?)?[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  course: z.string().trim().min(1, "Please select a course").max(120),
  message: z.string().trim().max(1000, "Message must be under 1000 characters").optional(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

/** What the browser actually sends: the fields plus the anti-bot signals. */
const submitSchema = enquirySchema.extend({
  /** Honeypot: hidden field that real visitors never fill in. */
  website: z.string().max(200).optional(),
  /** Cloudflare Turnstile token. */
  token: z.string().max(4096).optional(),
  /** Milliseconds between opening the form and pressing send. */
  elapsedMs: z.number().finite().optional(),
});

export interface EnquiryResult {
  ok: boolean;
  error?: string;
}

const GENERIC_ERROR = "Could not send your enquiry right now. Please try again or call us.";
const MIN_FILL_MS = 1500;
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

const recent = new Map<string, number[]>();

function tooMany(key: string): boolean {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_LIMIT) {
    recent.set(key, hits);
    return true;
  }
  hits.push(now);
  recent.set(key, hits);
  if (recent.size > 2000) {
    for (const [k, v] of recent) if (v.every((t) => now - t >= RATE_WINDOW_MS)) recent.delete(k);
  }
  return false;
}

function clean(value: string | undefined): string {
  let out = "";
  for (const ch of value ?? "") {
    const code = ch.charCodeAt(0);
    const control = code < 32 && code !== 10 && code !== 13 && code !== 9;
    if (!control && code !== 127) out += ch;
  }
  return out.trim();
}

// 👇 YAHAN MAIN CHANGE HAI: getEnv ko hata kar direct context.env use kiya hai 👇
async function verifyTurnstile(token: string | undefined, ip: string, env: any): Promise<boolean> {
  const secret = env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(8000),
    });
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch (err) {
    console.error("Turnstile verification failed:", err instanceof Error ? err.message : err);
    return false;
  }
}

function webhookUrl(env: any): URL | null {
  const raw = env.ENQUIRY_WEBHOOK_URL;
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const hostOk = url.hostname === "script.google.com" || url.hostname.endsWith(".google.com");
    const localOk = url.hostname === "127.0.0.1" || url.hostname === "localhost";
    if (url.protocol === "https:" && hostOk) return url;
    if (localOk) return url;
  } catch {
    /* fall through */
  }
  return null;
}

function fail(code: string, detail?: string): EnquiryResult {
  console.error(`Enquiry not delivered [${code}]`, detail ?? "");
  return { ok: false, error: `${GENERIC_ERROR} (Error code: ${code})` };
}

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => submitSchema.parse(data))
  // 👇 YAHAN CONTEXT SE ENV NIKALA HAI JO CLOUDFLARE KA ASLI TARIKA HAI 👇
  .handler(async ({ data, context }): Promise<EnquiryResult> => {
    // Cloudflare apna environment variables context mein bhejta hai
    const env = (context as any)?.cloudflare?.env || (context as any)?.env || process.env;

    const { getRequestHeader } = await import("@tanstack/react-start/server");
    const ip = clean(getRequestHeader("cf-connecting-ip") ?? "").slice(0, 64);

    if (clean(data.website) !== "") return { ok: true };
    if (typeof data.elapsedMs === "number" && data.elapsedMs < MIN_FILL_MS) return { ok: true };

    if (!(await verifyTurnstile(data.token, ip, env))) {
      return { ok: false, error: "Verification failed. Please refresh the page and try again." };
    }

    if ((ip && tooMany(`ip:${ip}`)) || tooMany(`mobile:${data.mobile}`)) {
      return { ok: false, error: "Too many enquiries. Please call us instead." };
    }

    if (!env.ENQUIRY_WEBHOOK_SECRET) return fail("ENV_SECRET_MISSING");
    if (!env.ENQUIRY_WEBHOOK_URL) return fail("ENV_URL_MISSING");
    
    const url = webhookUrl(env);
    if (!url) return fail("ENV_URL_INVALID");
    
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "text/plain;charset=utf-8" },
        redirect: "follow",
        signal: AbortSignal.timeout(12000),
        body: JSON.stringify({
          secret: env.ENQUIRY_WEBHOOK_SECRET,
          name: clean(data.name),
          mobile: clean(data.mobile),
          course: clean(data.course),
          message: clean(data.message),
          page: "website contact form",
        }),
      });
      const text = await res.text();
      let json: { ok?: boolean; error?: string } | null = null;
      try {
        json = JSON.parse(text) as { ok?: boolean; error?: string };
      } catch {}
      
      if (json?.ok === true) return { ok: true };
      if (json?.error === "unauthorized") return fail("HOOK_UNAUTHORIZED");
      if (json && !("ok" in json)) return fail("HOOK_NO_OK_FIELD", text.slice(0, 120));
      if (json)
        return fail(
          `HOOK_${String(json.error ?? "REJECTED").toUpperCase().slice(0, 20)}`,
        );
      return fail(`HOOK_NOT_JSON_HTTP_${res.status}`, text.slice(0, 120));
    } catch (err) {
      return fail("NETWORK", err instanceof Error ? err.message : String(err));
    }
  });