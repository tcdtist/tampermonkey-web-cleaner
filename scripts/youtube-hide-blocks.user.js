// ==UserScript==
// @name         Hide Sections on YouTube
// @namespace    Violentmonkey Scripts
// @version      1.0.0
// @author       tcdtist
// @description  Hide blocks on YouTube
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  /** YouTube: Hide sections with titles matching ytKeywords */
  function handleYouTube() {
    const ytKeywords = [
      "shorts",
      "popular uploads",
      "youtube mix",
      "review phim",
    ];

    const hideYouTubeByKeywords = () => {
      // 1. Target ytd-rich-shelf-renderer
      document.querySelectorAll("ytd-rich-shelf-renderer").forEach((shelf) => {
        const heading =
          shelf.querySelector("h2") ||
          shelf.querySelector("#title") ||
          shelf.querySelector("yt-formatted-string");

        const text = heading?.textContent?.trim().toLowerCase();

        if (text && ytKeywords.some((kw) => text.includes(kw))) {
          shelf.style.display = "none";

          const section = shelf.closest(
            "ytd-rich-section-renderer, ytd-item-section-renderer",
          );
          if (section) section.style.display = "none";
        }
      });

      // 2. Target grid-shelf-view-model (Fix selector according to HTML)
      document.querySelectorAll("grid-shelf-view-model").forEach((shelf) => {
        const heading =
          shelf.querySelector("h2") ||
          shelf.querySelector(".ytShelfHeaderLayoutTitle");
        const text = heading?.textContent?.trim().toLowerCase();

        if (text && ytKeywords.some((kw) => text.includes(kw))) {
          shelf.style.display = "none";
        }
      });
    };

    // Watch DOM changes to hide dynamically
    new MutationObserver(hideYouTubeByKeywords).observe(document.body, {
      childList: true,
      subtree: true,
    });

    hideYouTubeByKeywords();
  }

  /** Init by domain */
  const host = window.location.hostname;
  if (host.includes("youtube.com")) {
    handleYouTube();
  }
})();
