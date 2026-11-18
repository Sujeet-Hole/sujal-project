import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().min(2),
  mobile: z.string().min(10),
  course: z.string().min(1),
  message: z.string().optional(),
});

const submitSchema = enquirySchema.extend({
  website: z.string().optional(),
  token: z.string().optional(),
  elapsedMs: z.number().optional(),
});

export interface EnquiryResult {
  ok: boolean;
  error?: string;
}

// 👇 YAHAN SABSE SIMPLE CODE HAI JO EXACT ERROR DIKHAYEGA 👇
export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => submitSchema.parse(data))
  .handler(async ({ data }): Promise<EnquiryResult> => {
    try {
      const { getRequestEvent } = await import("@tanstack/react-start/server");
      const event = getRequestEvent();
      
      // Env variables nikalna (Cloudflare context se)
      const env = (event?.context as any)?.cloudflare?.env || (event?.context as any)?.env || process.env;

      const secret = env.ENQUIRY_WEBHOOK_SECRET;
      const url = env.ENQUIRY_WEBHOOK_URL;

      if (!secret) return { ok: false, error: "DEBUG: SECRET MISSING IN CLOUDFLARE ENV" };
      if (!url) return { ok: false, error: "DEBUG: URL MISSING IN CLOUDFLARE ENV" };

      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          secret: secret,
          name: data.name,
          mobile: data.mobile,
          course: data.course,
          message: data.message || "",
          page: "website",
        }),
      });

      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        return { ok: false, error: `DEBUG: Google returned bad JSON. Status: ${res.status}` };
      }

      if (json.ok === true) return { ok: true };
      
      // Google script ka error wapas bhejna
      return { ok: false, error: `DEBUG: Google Script says: ${json.error || "Unknown"}` };

    } catch (err: any) {
      return { ok: false, error: `DEBUG: CODE CRASHED: ${err.message}` };
    }
  });