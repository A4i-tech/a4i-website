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
npx wrangler secret put RECAPTCHA_SECRET  # optional: server-side reCAPTCHA check
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

### Reading submissions

```bash
npx wrangler d1 execute a4i-forms --remote --command "SELECT * FROM submissions ORDER BY id DESC LIMIT 20"
```
