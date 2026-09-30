# a4i-forms Worker

Cloudflare Worker behind the site's contact and newsletter forms (A4i-tech/.github#581).

- `POST /contact` — validates, stores in D1, emails `a4i@iiitb.ac.in` (reply-to is the submitter)
- `POST /newsletter` — validates, stores in D1 (repeat signups are ignored)
- Front-end: `assets/forms.js` (fetch submit + in-page message), `assets/analytics.js` (GA4 `form_submit` on success only)

## One-time setup (Cloudflare account dev.a4i@iiitb.ac.in)

```bash
cd workers/forms
npx wrangler login
npx wrangler d1 create a4i-forms          # copy database_id into wrangler.toml
npx wrangler d1 execute a4i-forms --remote --file=schema.sql
npx wrangler secret put RECAPTCHA_SECRET  # REQUIRED: reCAPTCHA v3 secret key (see below)
npx wrangler deploy
```

Then set `ENDPOINT` at the top of `assets/forms.js` to the deployed Worker URL, and add any extra
site origins (e.g. the staging URL) to `ALLOWED_ORIGINS` in `wrangler.toml`.

### Email

Contact emails are sent with the Cloudflare Email Service `EMAIL` binding. Onboard the sending domain
once in the dashboard (**Compute > Email Service > Email Sending**, domain `a4i-lab.in`); Cloudflare adds
the MX/SPF/DKIM/DMARC records itself. `MAIL_FROM` must be an address on that domain.

Until the domain is onboarded the submission is still saved in D1 and the user sees success; the Worker
logs the send error (e.g. `E_SENDER_NOT_VERIFIED`) and `Contact stored but inbox email was not sent`.
View logs with `npx wrangler tail`.

### Bot protection (required)

The site was moved to static hosting after bot attacks, so this endpoint is locked down in layers:

- **reCAPTCHA v3 is mandatory.** The Worker returns 503 for every submission until `RECAPTCHA_SECRET` is set.
  Use the secret for the site key in `assets/forms.js` (`RECAPTCHA_SITE_KEY`), from the
  [reCAPTCHA admin console](https://www.google.com/recaptcha/admin). Add every hostname that serves the forms
  (`a4i.iiitb.ac.in`, `a4i-staging.dev-a4i.workers.dev`) to that key's domain list, or tokens will be rejected there.
- **Rate limiting** — 5 requests / 60 s per IP per route via the `RATE_LIMITER` binding (`wrangler.toml`).
  Responses over the limit are HTTP 429. Adjust `limit` if legitimate users hit it.
- Origin allowlist and a honeypot field sit in front of both. These only stop browser scripts on other sites and
  naive bots; a direct scripted POST can spoof `Origin`, which is why reCAPTCHA and rate limiting are required.

Newsletter signups are single opt-in and the response never reveals whether an address is already subscribed.

### Reading submissions

```bash
npx wrangler d1 execute a4i-forms --remote --command "SELECT * FROM submissions ORDER BY id DESC LIMIT 20"
```
