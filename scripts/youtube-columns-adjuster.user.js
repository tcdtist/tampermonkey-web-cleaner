// ==UserScript==
// @name         YouTube Columns Adjuster
// @namespace    Violentmonkey Scripts
// @version      1.1.0
// @author       tcdtist
// @description  Adjust the number of video columns on YouTube with smooth native performance
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // Configurable number of video columns per row (default: 5)
  const COLUMNS = 5;

  const css = `
    /* Enforce column count via native YouTube CSS variables */
    ytd-rich-grid-renderer {
      --ytd-rich-grid-items-per-row: ${COLUMNS} !important;
      --ytd-rich-grid-posts-per-row: ${COLUMNS} !important;
      --ytd-rich-grid-slim-items-per-row: ${COLUMNS + 1} !important;
    }

    /* Flatten rigid row wrappers to allow fluid item reflow */
    ytd-rich-grid-row,
    #contents.ytd-rich-grid-row {
      display: contents !important;
    }

    /* Enforce exact card dimensions while preserving native margins */
    ytd-rich-item-renderer:not([is-shelf-item]) {
      width: calc(100% / var(--ytd-rich-grid-items-per-row, ${COLUMNS}) - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;
      max-width: calc(100% / var(--ytd-rich-grid-items-per-row, ${COLUMNS}) - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;
      margin-left: calc(var(--ytd-rich-grid-item-margin, 16px) / 2) !important;
      margin-right: calc(var(--ytd-rich-grid-item-margin, 16px) / 2) !important;
    }

    /* Expand container fluidly on wider displays */
    ytd-two-column-browse-results-renderer.grid:not(.grid-disabled) {
      max-width: 100% !important;
    }
    #primary.ytd-two-column-browse-results-renderer {
      max-width: 100% !important;
    }
  `;

  function injectStyle() {
    if (document.getElementById('yt-columns-adjuster-style')) return;
    const style = document.createElement('style');
    style.id = 'yt-columns-adjuster-style';
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }

  if (document.head || document.documentElement) {
    injectStyle();
  } else {
    document.addEventListener('DOMContentLoaded', injectStyle, { once: true });
  }
})();
