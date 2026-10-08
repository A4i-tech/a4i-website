# a4i-website

Static export of the A4I WordPress site, served via GitHub Pages.

Migrated off shared cPanel hosting after repeated bot attacks — see [#528](https://github.com/A4i-tech/.github/issues/528) and [WordPress Hosting Options](https://docmost.a4i-lab.in/s/general/p/word-press-hosting-options-0qkQem5God) (Option 1) for background, and [WPLocal Restore & Static Export — Action Plan](https://docmost.a4i-lab.in/s/general/p/wplocal-restore-static-export-action-plan-PqAyNqAa2T) for the migration steps.

## Known gaps (static export has no PHP/DB backend)

- Contact form and newsletter signup are dead — need a static-form service (Formspree/Getform) swapped in, or accepted as broken
- Comments and search don't work — needed a live DB
- No wp-admin — content updates require: edit in a local WordPress instance → re-export → commit → push

## Structure

- Site content at repo root (`index.html`, page directories)
- `use.typekit.net/`, `p.typekit.net/`, `www.google.com/` — mirrored third-party assets (fonts, reCAPTCHA)
- `CNAME` — custom domain (`a4i.iiitb.ac.in`)
- `.nojekyll` — disables GitHub's Jekyll processing
- `sitemap.xml`, `robots.txt` — hand-generated, WP's dynamic versions don't exist in a static export

## SEO hygiene after a re-export

The HTTrack/WordPress export reintroduces things Google Search Console flags as soft 404s and duplicates (see [.github#584](https://github.com/A4i-tech/.github/issues/584)). After every re-export:

- Delete `feed/`, `comments/`, `sample-page/`, `category/*/feed/`, `tag/*/feed/`, `wp-json/` and the `index????.html` redirect stubs — they are RSS/JSON or `?p=` shortlink artifacts served as HTML
- Strip the WP head links that point at them (RSS/oEmbed/JSON `alternate`, `https://api.w.org/`, `EditURI`, `shortlink`)
- Canonicals must be absolute directory URLs (`https://a4i.iiitb.ac.in/about-us/`), never the exported `href="index.html"`
- Internal links use directory URLs (`../about-us/`), not `../about-us/index.html`
- `tag/*` and `category/*` archives are empty on this site — keep them `noindex, follow` and out of `sitemap.xml`
- Moved pages (`news/`, `careers/ai-architect/`) are redirect stubs with an absolute canonical and `noindex` — don't list them in `sitemap.xml`
