// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Security headers sent with every page (HTML) response and, through the generated
// `_headers` file, with static files too. See DEPLOY.md ("Security") for what each one does.
// If you add a new external service (analytics, chat widget, another font host ...),
// add its address to the matching Content-Security-Policy directive below.
const CSP = [
  "default-src 'self'",
  // 'unsafe-inline' is required for the small inline bootstrap scripts of TanStack Start.
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "frame-src https://www.google.com https://challenges.cloudflare.com",
  "connect-src 'self' https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = {
  "Content-Security-Policy": CSP,
  "Strict-Transport-Security": "max-age=31536000",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
};

export default defineConfig({
  // Typed loosely: the wrapper's TypeScript types do not list `routeRules` or `wrangler`,
  // but Nitro accepts both (verified in the build output: wrangler.json and _headers).
  nitro: {
    // Fixed Worker name (otherwise it is guessed from the git remote).
    cloudflare: { wrangler: { name: "ashadeep-computer-institute" } },
    routeRules: { "/**": { headers: SECURITY_HEADERS } },
  } as never,
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
