/**
 * A4I website — custom GA4 event tracking.
 *
 * Replaces the WPCode footer snippet that was lost when the site moved off
 * WordPress onto GitHub Pages. Page views, scrolls and outbound clicks are
 * still handled automatically by GA4 Enhanced Measurement — this file only
 * covers the CTA clicks that need explicit events.
 *
 * The gtag bootstrap lives inline in each page's <head>; it defines
 * window.A4I_GA_ENABLED (true only on the production hostname) and the global
 * gtag() function. This file assumes both exist.
 *
 * Events emitted:
 *   cta_click { cta_label, cta_location, cta_destination, link_text }
 *
 * NOTE: the newsletter and contact forms still POST to WordPress PHP endpoints
 * that no longer exist, so no form_submit tracking is wired up here yet. Add it
 * once the forms are re-pointed at a working endpoint, otherwise every event
 * would represent a submission that silently failed.
 */
(function () {
  'use strict';

  /**
   * Ordered rules — first match wins. `test` receives the anchor element.
   * Add new CTAs here; nothing else needs to change.
   */
  var CTA_RULES = [
    {
      label: 'write_to_us',
      test: function (a) {
        return /^mailto:/i.test(a.getAttribute('href') || '');
      }
    },
    {
      label: 'contact_us',
      test: function (a) {
        return /contact-us/i.test(a.getAttribute('href') || '');
      }
    },
    {
      label: 'know_more',
      test: function (a) {
        // Markup nests the label twice for the hover animation, so the
        // normalised text reads "KNOW MORE KNOW MORE".
        return /^(know\s*more\s*)+$/i.test(textOf(a));
      }
    }
  ];

  function textOf(el) {
    return (el.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function locationOf(el) {
    if (el.closest('header')) return 'header';
    if (el.closest('footer')) return 'footer';
    return 'body';
  }

  function send(name, params) {
    if (window.A4I_GA_ENABLED) {
      window.gtag('event', name, params);
    } else if (window.console && console.debug) {
      // Staging and local: log instead of sending so the wiring stays testable
      // without polluting production data.
      console.debug('[a4i-analytics] would send', name, params);
    }
  }

  document.addEventListener(
    'click',
    function (event) {
      var target = event.target;
      if (!target || !target.closest) return;

      var anchor = target.closest('a[href]');
      if (!anchor) return;

      for (var i = 0; i < CTA_RULES.length; i++) {
        if (!CTA_RULES[i].test(anchor)) continue;

        send('cta_click', {
          cta_label: CTA_RULES[i].label,
          cta_location: locationOf(anchor),
          cta_destination: anchor.getAttribute('href') || '',
          link_text: textOf(anchor).slice(0, 100)
        });
        return;
      }
    },
    true // capture, so it still fires if a handler stops propagation
  );
})();
