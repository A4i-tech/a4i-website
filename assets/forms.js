/**
 * A4I website — contact and newsletter form submission.
 *
 * Forms opt in with data-a4i-form="contact|newsletter". They are POSTed as JSON
 * to the forms Worker (workers/forms) and show an in-page success/error
 * message. On a confirmed success response a `a4i:form-success` event is
 * dispatched on the form; assets/analytics.js turns that into GA4 form_submit.
 */
(function () {
  'use strict';

  // URL of the deployed forms Worker (see workers/forms/README.md).
  var ENDPOINT = 'https://a4i-forms.dev-a4i.workers.dev';
  var RECAPTCHA_SITE_KEY = '6LfplXksAAAAANqCVDdWFza19fwe4wm34fQYU4CW';

  var MESSAGES = {
    contact: 'Thank you! Your message has been sent. We will get back to you soon.',
    newsletter: 'Thank you for subscribing!',
    error: 'Sorry, something went wrong. Please try again, or email us at a4i@iiitb.ac.in.'
  };

  function statusEl(form) {
    var el = form.parentNode.querySelector('.a4i-form-status');
    if (!el) {
      el = document.createElement('p');
      el.className = 'a4i-form-status';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      el.style.cssText = 'margin:12px 0 0;font-size:15px;line-height:1.4;';
      form.parentNode.insertBefore(el, form.nextSibling);
    }
    return el;
  }

  function show(form, text, ok) {
    var el = statusEl(form);
    el.textContent = text;
    el.style.color = ok ? '#1a7f37' : '#c62828';
  }

  function ensureHoneypot(form) {
    if (form.querySelector('[name="company_website"]')) return;
    var wrap = document.createElement('div');
    wrap.setAttribute('aria-hidden', 'true');
    wrap.style.cssText = 'position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;';
    wrap.innerHTML = '<input type="text" name="company_website" tabindex="-1" autocomplete="off">';
    form.appendChild(wrap);
  }

  // Tokens expire after ~2 minutes, so fetch a fresh one at submit time.
  function recaptchaToken(action) {
    return new Promise(function (resolve) {
      if (!window.grecaptcha || !grecaptcha.ready) return resolve('');
      var done = false;
      var timer = setTimeout(function () {
        if (!done) { done = true; resolve(''); }
      }, 5000);
      grecaptcha.ready(function () {
        grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: action }).then(
          function (t) { if (!done) { done = true; clearTimeout(timer); resolve(t); } },
          function () { if (!done) { done = true; clearTimeout(timer); resolve(''); } }
        );
      });
    });
  }

  function collect(form) {
    var data = {};
    new FormData(form).forEach(function (v, k) {
      if (typeof v === 'string') data[k] = v;
    });
    return data;
  }

  function submit(form, type) {
    var button = form.querySelector('button[type="submit"]');
    if (button) button.disabled = true;
    show(form, 'Sending…', true);

    return recaptchaToken(type)
      .then(function (token) {
        var data = collect(form);
        if (token) data.recaptcha_token = token;
        return fetch(ENDPOINT + '/' + type, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      })
      .then(function (res) {
        return res.json().then(
          function (body) { return { res: res, body: body }; },
          function () { return { res: res, body: {} }; }
        );
      })
      .then(function (r) {
        if (r.res.ok && r.body && r.body.ok) {
          form.reset();
          show(form, MESSAGES[type], true);
          form.dispatchEvent(new CustomEvent('a4i:form-success', { bubbles: true, detail: { form_type: type } }));
        } else {
          show(form, (r.body && r.body.error) || MESSAGES.error, false);
        }
      })
      .catch(function () {
        show(form, MESSAGES.error, false);
      })
      .then(function () {
        if (button) button.disabled = false;
      });
  }

  function init() {
    var forms = document.querySelectorAll('form[data-a4i-form]');
    Array.prototype.forEach.call(forms, function (form) {
      var type = form.getAttribute('data-a4i-form');
      if (type !== 'contact' && type !== 'newsletter') return;
      ensureHoneypot(form);
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (form.checkValidity && !form.checkValidity()) {
          if (form.reportValidity) form.reportValidity();
          return;
        }
        submit(form, type);
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
