// ==UserScript==
// @name         YouTube Columns Adjuster
// @namespace    Violentmonkey Scripts
// @version      1.0.0
// @author       tcdtist
// @description  Adjust the number of video columns on YouTube
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  GM_addStyle(` // Adjust the number of video columns on YouTube (YouTube's video columns adjuster)
        ytd-rich-grid-renderer {
            --ytd-rich-grid-items-per-row: 5 !important;
        }
        ytd-two-column-browse-results-renderer.grid:not(.grid-disabled) {
            max-width: 80vw !important;
        }
        ytd-two-column-browse-results-renderer.grid-6-columns, .grid-6-columns.ytd-two-column-browse-results-renderer {
            width: 80vw !important;
        }
    `);
})();
