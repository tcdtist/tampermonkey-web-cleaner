// ==UserScript==
// @name         YouTube Hide Blocks (Targeted & Safe)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Ẩn Shorts, Popular Uploads, YouTube Mix trên YouTube
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const ytKeywords = ['shorts', 'popular uploads', 'youtube mix'];

    function hideShelves() {
        document.querySelectorAll('ytd-rich-shelf-renderer').forEach(shelf => {
            const heading = shelf.querySelector('h2');
            const text = heading?.textContent?.trim().toLowerCase();

            if (text && ytKeywords.some(kw => text.includes(kw))) {
                shelf.style.display = 'none';

                const section = shelf.closest('ytd-rich-section-renderer');
                if (section) section.style.display = 'none';
            }
        });
    }

    new MutationObserver(hideShelves).observe(document.body, { childList: true, subtree: true });

    hideShelves();
})();
