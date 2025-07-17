// ==UserScript==
// @name         YouTube Columns Adjuster
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Điều chỉnh số cột video trên YouTube
// @author       Your Name
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    "use strict";

    const COLUMNS_PER_ROW = 7;       // số cột video trên 1 hàng
    const MAX_WIDTH_PERCENT = 80;    // chiều rộng tối đa theo phần trăm viewport (vw)

    const css = `
        ytd-rich-grid-renderer {
            --ytd-rich-grid-items-per-row: ${COLUMNS_PER_ROW} !important;
        }
        ytd-two-column-browse-results-renderer.grid:not(.grid-disabled) {
            max-width: ${MAX_WIDTH_PERCENT}vw !important;
        }
        ytd-two-column-browse-results-renderer.grid-6-columns,
        .grid-6-columns.ytd-two-column-browse-results-renderer {
            width: ${MAX_WIDTH_PERCENT}vw !important;
        }
    `;

    GM_addStyle(css);
})();
