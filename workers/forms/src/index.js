/**
 * A4I forms Worker — receives the contact and newsletter form POSTs from the
 * static site, validates them, stores them in D1 and (for contact) emails the
 * team inbox.
 *
 *   POST /contact     { fullname, city, organisation, email, message?, recaptcha_token? }
 *   POST /newsletter  { email, recaptcha_token? }
 *
 * Responses are JSON: { ok: true } or { ok: false, error, fields? }.
 */

const MAX = { fullname: 100, city: 100, organisation: 150, email: 254, message: 5000 };
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
const MIN_RECAPTCHA_SCORE = 0.5;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const cors = corsHeaders(request, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== 'POST') {
      return json({ ok: false, error: 'Method not allowed' }, 405, cors);
    }
    // Browsers always send Origin on cross-origin POSTs; reject anything that
    // is not one of our sites so the endpoint can't be used from other pages.
    if (!cors['Access-Control-Allow-Origin']) {
      return json({ ok: false, error: 'Origin not allowed' }, 403, cors);
    }

    const route = url.pathname.replace(/\/+$/, '');
    if (route !== '/contact' && route !== '/newsletter') {
      return json({ ok: false, error: 'Not found' }, 404, cors);
    }
    const type = route.slice(1);

    let body;
    try {
      body = await readBody(request);
    } catch (e) {
      return json({ ok: false, error: 'Invalid request body' }, 400, cors);
    }

    // Honeypot: the site injects a hidden field that humans never fill in.
    // Pretend success so bots get no signal.
    if (clean(body.company_website)) {
      return json({ ok: true }, 200, cors);
    }

    const { data, errors } = type === 'contact' ? validateContact(body) : validateNewsletter(body);
    if (errors) {
      return json({ ok: false, error: 'Please check the highlighted fields.', fields: errors }, 422, cors);
    }

    if (env.RECAPTCHA_SECRET) {
      const ok = await verifyRecaptcha(env.RECAPTCHA_SECRET, clean(body.recaptcha_token), type, request);
      if (!ok) {
        return json({ ok: false, error: 'Spam check failed. Please refresh the page and try again.' }, 400, cors);
      }
    }

    // Store first: D1 is the durable record, email is best-effort notification.
    let stored = false;
    let duplicate = false;
    try {
      const res = await env.DB.prepare(
        `INSERT OR IGNORE INTO submissions
           (type, fullname, city, organisation, email, message, user_agent, page)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          type,
          data.fullname || null,
          data.city || null,
          data.organisation || null,
          data.email,
          data.message || null,
          (request.headers.get('User-Agent') || '').slice(0, 300),
          (request.headers.get('Referer') || '').slice(0, 300)
        )
        .run();
      stored = true;
      // Newsletter has a unique index on email; a repeat signup is a no-op.
      duplicate = type === 'newsletter' && res.meta && res.meta.changes === 0;
    } catch (e) {
      console.error('D1 insert failed', e);
    }

    let emailed = false;
    if (type === 'contact') {
      try {
        emailed = await sendContactEmail(env, data);
      } catch (e) {
        console.error('Email send failed', e);
      }
      if (!emailed && !stored) {
        return json({ ok: false, error: 'Something went wrong on our side. Please email us at a4i@iiitb.ac.in.' }, 502, cors);
      }
      if (!emailed) console.error('Contact stored but inbox email was not sent');
    } else if (!stored) {
      return json({ ok: false, error: 'Something went wrong on our side. Please try again later.' }, 502, cors);
    }

    return json({ ok: true, duplicate }, 200, cors);
  }
};

// ---------- helpers ----------

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin'
  };
  if (allowed.includes(origin)) headers['Access-Control-Allow-Origin'] = origin;
  return headers;
}

function json(payload, status, extra) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extra }
  });
}

async function readBody(request) {
  const type = request.headers.get('Content-Type') || '';
  if (type.includes('application/json')) return await request.json();
  const form = await request.formData();
  const out = {};
  for (const [k, v] of form.entries()) if (typeof v === 'string') out[k] = v;
  return out;
}

function clean(v) {
  return typeof v === 'string' ? v.trim() : '';
}

function validateContact(b) {
  const data = {
    fullname: clean(b.fullname),
    city: clean(b.city),
    organisation: clean(b.organisation),
    email: clean(b.email).toLowerCase(),
    message: clean(b.message)
  };
  const errors = {};
  for (const f of ['fullname', 'city', 'organisation']) {
    if (!data[f]) errors[f] = 'Required';
    else if (data[f].length > MAX[f]) errors[f] = 'Too long';
  }
  checkEmail(data, errors);
  if (data.message.length > MAX.message) errors.message = 'Too long';
  return Object.keys(errors).length ? { errors } : { data };
}

function validateNewsletter(b) {
  const data = { email: clean(b.email).toLowerCase() };
  const errors = {};
  checkEmail(data, errors);
  return Object.keys(errors).length ? { errors } : { data };
}

function checkEmail(data, errors) {
  if (!data.email) errors.email = 'Required';
  else if (data.email.length > MAX.email || !EMAIL_RE.test(data.email)) errors.email = 'Enter a valid email';
}

async function verifyRecaptcha(secret, token, action, request) {
  if (!token) return false;
  const params = new URLSearchParams({ secret, response: token });
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) params.set('remoteip', ip);
  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', { method: 'POST', body: params });
    const r = await res.json();
    if (!r.success) return false;
    // v3 returns score/action; tolerate v2 (no score).
    if (typeof r.score === 'number' && r.score < MIN_RECAPTCHA_SCORE) return false;
    if (r.action && r.action !== action) return false;
    return true;
  } catch (e) {
    console.error('reCAPTCHA verify failed', e);
    return false;
  }
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

async function sendContactEmail(env, d) {
  if (!env.RESEND_API_KEY || !env.MAIL_FROM || !env.CONTACT_TO) return false;
  // Strip CR/LF so user input can never inject extra headers into the subject.
  const subject = `A4I website contact: ${d.fullname}`.replace(/[\r\n]+/g, ' ').slice(0, 200);
  const rows = [
    ['Name', d.fullname],
    ['City', d.city],
    ['Organisation', d.organisation],
    ['Email', d.email],
    ['Message', d.message || '(none)']
  ];
  const html =
    '<table cellpadding="6" style="font-family:sans-serif">' +
    rows.map(([k, v]) => `<tr><td><b>${k}</b></td><td style="white-space:pre-wrap">${esc(v)}</td></tr>`).join('') +
    '</table>';
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.MAIL_FROM,
      to: env.CONTACT_TO.split(',').map((s) => s.trim()),
      reply_to: d.email,
      subject,
      html,
      text
    })
  });
  if (!res.ok) {
    console.error('Resend responded', res.status, await res.text());
    return false;
  }
  return true;
}
