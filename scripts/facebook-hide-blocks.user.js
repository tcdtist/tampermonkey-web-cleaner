// ==UserScript==
// @name         Facebook Hide Blocks (Targeted & Safe)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Ẩn Reels, People You May Know, và các block chỉ định trên Facebook
// @match        https://www.facebook.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const fbKeywords = ['reels', 'people you may know', 'follow', 'anonymous member', 'anonymous participant'];

    const targetClasses = ['x1yztbdb.x1n2onr6.xh8yej3.x1ja2u2z',]; // 'x1lliihq', 'x1jx94hy'

    function hideBlocks() {
        // Hide stories
        document.querySelector(`div.x193iq5w.xgmub6v.x1ceravr`).style.display = 'none';
        
        // Hide posts
        targetClasses.forEach(className => {
            document.querySelectorAll(`div.${className}`).forEach(el => {
                const text = el.textContent?.toLowerCase();
                if (text && fbKeywords.some(kw => text.includes(kw))) {
                    el.style.display = 'none';
                }
            });
        });
    }

    new MutationObserver(hideBlocks).observe(document.body, { childList: true, subtree: true });

    hideBlocks();
})();
