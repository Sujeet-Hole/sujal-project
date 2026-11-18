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
const RATE_LIMIT = 5; // enquiries ...
const RATE_WINDOW_MS = 10 * 60 * 1000; // ... per 10 minutes, per IP and per mobile number

// Best-effort limiter (memory of this server instance only). The real protection
// is Turnstile plus the Cloudflare rate-limiting rule described in DEPLOY.md.
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

/** Remove control characters (keeps normal text, spaces and new lines). */
function clean(value: string | undefined): string {
  let out = "";
  for (const ch of value ?? "") {
    const code = ch.charCodeAt(0);
    const control = code < 32 && code !== 10 && code !== 13 && code !== 9;
    if (!control && code !== 127) out += ch;
  }
  return out.trim();
}

// Turnstile verification function ko update kiya gaya hai
async function verifyTurnstile(token: string | undefined, ip: string, secret: string | undefined): Promise<boolean> {
  if (!secret) {
    // Not configured (local development or Turnstile not setup yet).
    return true;
  }
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

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => submitSchema.parse(data))
  .handler(async ({ data }): Promise<EnquiryResult> => {
    const { getRequestHeader } = await import("@tanstack/react-start/server");
    const ip = clean(getRequestHeader("cf-connecting-ip") ?? "").slice(0, 64);

    // 1. Bots: filled honeypot or a form "submitted" faster than a person can type.
    if (clean(data.website) !== "") return { ok: true };
    if (typeof data.elapsedMs === "number" && data.elapsedMs < MIN_FILL_MS) return { ok: true };

    // 2. Cloudflare Turnstile (human check) - Ab env handler ke andar access ho raha hai
    const turnstileSecret = process.env["TURNSTILE_SECRET_KEY"];
    if (!(await verifyTurnstile(data.token, ip, turnstileSecret))) {
      return { ok: false, error: "Verification failed. Please refresh the page and try again." };
    }

    // 3. Rate limit per IP and per mobile number.
    if ((ip && tooMany(`ip:${ip}`)) || tooMany(`mobile:${data.mobile}`)) {
      return { ok: false, error: "Too many enquiries. Please call us instead." };
    }

    // 4. Deliver to the Google Apps Script web app (Google Sheet + email).
    // Ab env handler ke andar access ho raha hai, module level pe nahi
    const rawUrl = process.env["ENQUIRY_WEBHOOK_URL"];
    let url: URL | null = null;
    
    if (rawUrl) {
      try {
        const parsed = new URL(rawUrl);
        const hostOk = parsed.hostname === "script.google.com" || parsed.hostname.endsWith(".google.com");
        const localOk = parsed.hostname === "127.0.0.1" || parsed.hostname === "localhost";
        if (parsed.protocol === "https:" && hostOk) url = parsed;
        else if (localOk) url = parsed;
      } catch {
        // ignore
      }
    }

    if (!url) {
      console.error("ENQUIRY_WEBHOOK_URL is missing or invalid; enquiry was not delivered.");
      return { ok: false, error: GENERIC_ERROR };
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "text/plain;charset=utf-8" },
        redirect: "follow",
        signal: AbortSignal.timeout(12000),
        body: JSON.stringify({
          secret: process.env["ENQUIRY_WEBHOOK_SECRET"] ?? "",
          name: clean(data.name),
          mobile: clean(data.mobile),
          course: clean(data.course),
          message: clean(data.message),
          page: "website contact form",
        }),
      });
      const json = (await res.json().catch(() => null)) as { ok?: boolean } | null;
      if (!res.ok || json?.ok !== true) {
        console.error("Enquiry webhook rejected the request, status", res.status);
        return { ok: false, error: GENERIC_ERROR };
      }
      return { ok: true };
    } catch (err) {
      console.error("Enquiry webhook failed:", err instanceof Error ? err.message : err);
      return { ok: false, error: GENERIC_ERROR };
    }
  });