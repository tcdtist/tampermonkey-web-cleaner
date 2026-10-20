# userscripts

Personal userscripts for browsing and cleaning web interfaces (Facebook, YouTube).

## Usage

1. Install a userscript manager in your browser (recommended: [Violentmonkey](https://violentmonkey.github.io/), or [Tampermonkey](https://www.tampermonkey.net/)).
2. Install the desired script from `scripts/`:
   - `facebook-hide-blocks.user.js`: Hide reels, stories, suggestions, and sponsored ads (anti-obfuscation) on Facebook.
   - `youtube-cleaner.user.js`: Clean distracting sections (Shorts, mixes), adjust video grid columns, and auto-redirect Shorts to standard player on YouTube.
   - `clean-links.user.js`: Bypass intermediate redirection pages (Facebook, YouTube) and strip tracking tokens (`fbclid`, `gclid`, `si`, `utm_*`).
   - `google-clean-search.user.js`: Clean Google Search results by hiding sponsored ads, shopping carousels, "People also ask", and tracking redirects.

## License

MIT
