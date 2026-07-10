// ==UserScript==
// @name         Hide Sections on Facebook
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @author       tcdtist
// @description  Hide blocks on Facebook
// @match        https://www.facebook.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  /** Facebook: Hide blocks containing keywords in fbKeywords */
  function handleFacebook() {
    const fbKeywords = [
      "reels",
      "follow",
      "people you may know",
      "anonymous member",
      "anonymous participant",
      "sponsored",
      "friend requests",
      "your shortcuts",
      "maclife",
      "suggested",
      "from a public group",
      "your group suggestions",
      "stories",
    ];
    const targetClasses = ["x1n2onr6.xh8yej3.x1ja2u2z.xod5an3"]; // 'x1yztbdb.x1n2onr6.xh8yej3.x1ja2u2z', 'x1n2onr6.x1uc6qws.xyen2ro', 'x1yztbdb.x1n2onr6.xh8yej3.x1ja2u2z'

    const hideFacebookByKeywords = () => {
      // Hide stories
      document.querySelector(`div.x193iq5w.xgmub6v.x1ceravr`).style.display =
        "none";
      // Hide left sidebar
      document.querySelector(
        `div.x9f619.x1ja2u2z.xnp8db0.x112wk31.xnjgh8c.xxc7z9f.x1t2pt76.x1u2d2a2.x6ikm8r`,
      ).style.display = "none";
      // Hide right sidebar
      document.querySelector(
        `div.x9f619.x1ja2u2z.xnp8db0.x112wk31.xnjgh8c.xxc7z9f.x1t2pt76.x1u2d2a2.x6ikm8r.x10wlt62.x7wzq59.xxzkxad.x1daaz14`,
      ).style.display = "none";

      targetClasses.forEach((className) => {
        document.querySelectorAll(`div.${className}`).forEach((el) => {
          const text = el.textContent?.toLowerCase();
          if (text && fbKeywords.some((kw) => text.includes(kw))) {
            el.style.display = "none";
          }
        });
      });

      const menuClasses = [
        "x1iyjqo2.xmlsiyf.x1hxoosp.x1l38jg0.x1awlv9s.x13fj5qh.x1gz44f",
      ];
      menuClasses.forEach((className) => {
        document.querySelectorAll(`li.${className}`).forEach((el) => {
          const text = el.textContent?.toLowerCase();
          // if (text && menuKeywords.some(kw => text.includes(kw))) {
          el.style.display = "none";
          // }
        });
      });

      // Hide H4 elements containing "Join" button (e.g. group suggestions) (Facebook's group suggestions)
      document.querySelectorAll("h4").forEach((h4) => {
        const text = h4.textContent?.toLowerCase();
        if (text?.includes("join")) {
          // Walk up to find a meaningful container to hide
          const container =
            h4.closest('div[class*="x1n2onr6"]') ||
            h4.parentElement?.parentElement;
          if (container) container.style.display = "none";
        }
      });

      // Hide sponsored posts - detect by Facebook's ad tracking fragment "#?gag" in href (Facebook's ad tracking fragment)
      document.querySelectorAll('a[href*="#?gag"]').forEach((el) => {
        const container =
          el.closest('div[data-pagelet*="FeedUnit"]') ||
          el.closest('div[class*="x1n2onr6"][class*="xh8yej3"]');
        if (container) container.style.display = "none";
      });
    };

    new MutationObserver(hideFacebookByKeywords).observe(document.body, {
      childList: true,
      subtree: true,
    });

    hideFacebookByKeywords();
  }

  /** Init by domain */
  const host = window.location.hostname;
  if (host.includes("facebook.com")) {
    handleFacebook();
  }
})();
