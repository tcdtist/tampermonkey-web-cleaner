// ==UserScript==
// @name         Hide Sections on Facebook (Safe Targeted)
// @namespace    Violentmonkey Scripts
// @version      1.3
// @author       tcdtist
// @description  Ẩn Reels, Stories, Gợi ý kết bạn, Quảng cáo... trên Facebook
// @match        https://www.facebook.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const FB_KEYWORDS = [
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

  const TARGET_CLASSES = ["x1n2onr6.xh8yej3.x1ja2u2z.xod5an3"];
  const MENU_CLASSES = [
    "x1iyjqo2.xmlsiyf.x1hxoosp.x1l38jg0.x1awlv9s.x13fj5qh.x1gz44f",
  ];
  const STORIES_SELECTOR = "div.x193iq5w.xgmub6v.x1ceravr";
  const LEFT_SIDEBAR_SELECTOR =
    "div.x9f619.x1ja2u2z.xnp8db0.x112wk31.xnjgh8c.xxc7z9f.x1t2pt76.x1u2d2a2.x6ikm8r";
  const RIGHT_SIDEBAR_SELECTOR =
    "div.x9f619.x1ja2u2z.xnp8db0.x112wk31.xnjgh8c.xxc7z9f.x1t2pt76.x1u2d2a2.x6ikm8r.x10wlt62.x7wzq59.xxzkxad.x1daaz14";

  const hideElement = (element) => {
    if (element) element.style.display = "none";
  };

  const hideAll = (selector, callback) => {
    document.querySelectorAll(selector).forEach(callback);
  };

  const findFeedContainer = (element) =>
    element.closest('div[data-pagelet*="FeedUnit"]') ||
    element.closest('div[class*="x1n2onr6"][class*="xh8yej3"]') ||
    element.closest('div[role="article"]');

  const hideFacebookBlocks = () => {
    hideElement(document.querySelector(STORIES_SELECTOR));
    hideElement(document.querySelector(LEFT_SIDEBAR_SELECTOR));
    hideElement(document.querySelector(RIGHT_SIDEBAR_SELECTOR));

    TARGET_CLASSES.forEach((className) => {
      hideAll(`div.${className}`, (element) => {
        const text = element.textContent?.toLowerCase();
        if (text && FB_KEYWORDS.some((keyword) => text.includes(keyword))) {
          hideElement(element);
        }
      });
    });

    MENU_CLASSES.forEach((className) => {
      hideAll(`li.${className}`, hideElement);
    });

    hideAll("h4", (heading) => {
      const text = heading.textContent?.toLowerCase();
      if (!text?.includes("join")) return;

      const container =
        heading.closest('div[class*="x1n2onr6"]') ||
        heading.parentElement?.parentElement;
      hideElement(container);
    });

    hideAll('a[href*="#?gag"]', (link) => {
      hideElement(findFeedContainer(link));
    });

    hideAll('a[href*="/ads/about/"]', (link) => {
      hideElement(findFeedContainer(link));
    });
  };

  if (!window.location.hostname.includes("facebook.com")) return;

  new MutationObserver(hideFacebookBlocks).observe(document.body, {
    childList: true,
    subtree: true,
  });

  hideFacebookBlocks();
})();
