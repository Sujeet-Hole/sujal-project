# Cloudflare deploy: short version

Poori step-by-step guide (screens ke hisaab se, beginners ke liye) PDF mein hai:
**docs/Ashadeep_Cloudflare_Deploy_Guide.pdf**. Pehle wahi padho. Ye file uska chhota summary hai.

## Safety (sabse pehle)
- Deploy **sirf GitHub se** hota hai (Cloudflare Workers Builds, Ashadeep ke Cloudflare account mein).
- Terminal se **`npx wrangler deploy` ya `npm run deploy` kabhi mat chalao**. Agar computer pe personal Cloudflare
  login hai to site personal account mein chali jaayegi.
- `npx wrangler whoami` chalao. Personal account dikhe to `npx wrangler logout` chalao.
- Cloudflare dashboard hamesha **Ashadeep Chrome profile** mein kholo aur upar left mein account ka naam check karo.
- Is project ki config mein koi account id ya domain nahi likha hai (sirf worker ka naam).

## Steps
1. Ashadeep Google account se Cloudflare account banao (free).
2. Code GitHub pe push karo (repo ke root mein `package.json`).
3. Google Sheet + Apps Script banao (`docs/google-apps-script/Code.gs`), `WEBHOOK_SECRET` set karo, Web app deploy karke URL lo.
4. Cloudflare: Workers & Pages, Import a repository. Project name **`ashadeep-computer-institute`**,
   Build command `npm run build`, Deploy command `npx wrangler deploy`, Build variable `NODE_VERSION=22`.
5. Cloudflare Secrets (type Secret): `ENQUIRY_WEBHOOK_URL`, `ENQUIRY_WEBHOOK_SECRET`. Redeploy.
6. Live link pe form test karo (Sheet mein row + Gmail mein email).
7. (Optional, recommended) Turnstile: Build variable `VITE_TURNSTILE_SITE_KEY` + Secret `TURNSTILE_SECRET_KEY`. Dono saath ya dono nahi.
8. Domain (jab ready ho): Ashadeep ke Cloudflare mein domain add karo, nameservers badlo, Worker mein Custom domain jodo.
   Pehle check karo ki domain ka email (MX records) na tute.

## Security jo built-in hai
Security headers (`vite.config.ts`), Turnstile, honeypot, minimum fill time, rate limit, server validation,
CSRF protection, Sheet formula-injection guard. Naya external service jodo to CSP list update karo.

## Legal pages
`/privacy-policy` aur `/terms`. Text `src/data/legal.ts` mein hai. Live karne se pehle ek baar poora padho.

## Local par chalana
```bash
npm install
npm run dev
```
Local mein enquiry form tab chalta hai jab `ENQUIRY_WEBHOOK_URL` aur `ENQUIRY_WEBHOOK_SECRET` terminal mein set hon.
