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
npx wrangler secret put RESEND_API_KEY    # contact email delivery
npx wrangler secret put RECAPTCHA_SECRET  # optional: server-side reCAPTCHA check
npx wrangler deploy
```

Then set `ENDPOINT` at the top of `assets/forms.js` to the deployed Worker URL, and add any extra
site origins (e.g. the staging URL) to `ALLOWED_ORIGINS` in `wrangler.toml`.

### Email

Contact emails are sent through [Resend](https://resend.com). `MAIL_FROM` must be on a domain verified
there, which needs DNS records (SPF/DKIM) on `a4i.iiitb.ac.in` — ask IIITB IT. Until that is done the
submission is still saved in D1 and the user sees success; the Worker logs `Contact stored but inbox email was not sent`.

### Reading submissions

```bash
npx wrangler d1 execute a4i-forms --remote --command "SELECT * FROM submissions ORDER BY id DESC LIMIT 20"
```
