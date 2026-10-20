// ==UserScript==
// @name         Clean Links & Bypass Redirects
// @namespace    Violentmonkey Scripts
// @version      1.0.0
// @author       tcdtist
// @description  Bỏ qua màn hình chuyển hướng trung gian (Facebook, YouTube) và loại bỏ tham số tracking (fbclid, utm_*, si, gclid)
// @match        https://*.facebook.com/*
// @match        https://*.youtube.com/*
// @match        https://*.google.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // 1. Danh sách tham số theo dõi (Tracking Parameters) cần dọn dẹp
  const TRACKING_PARAMS = [
    'fbclid',
    'gclid',
    'si',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'ref_src',
    'igshid',
  ];

  // 2. Dọn sạch tracking parameters khỏi URL hiện tại trên thanh địa chỉ
  function cleanCurrentUrl() {
    try {
      const url = new URL(window.location.href);
      let isModified = false;

      TRACKING_PARAMS.forEach((param) => {
        if (url.searchParams.has(param)) {
          url.searchParams.delete(param);
          isModified = true;
        }
      });

      if (isModified) {
        window.history.replaceState(null, '', url.toString());
      }
    } catch (_) {}
  }

  // 3. Giải mã URL đích thực sự từ URL chuyển hướng trung gian của FB và YouTube
  function extractTargetUrl(href) {
    if (!href) return null;

    try {
      // Facebook: lm.facebook.com/l.php?u=TARGET_URL hoặc www.facebook.com/l.php?u=...
      if (href.includes('facebook.com/l.php')) {
        const url = new URL(href);
        const target = url.searchParams.get('u');
        if (target) return decodeURIComponent(target);
      }

      // YouTube: youtube.com/redirect?q=TARGET_URL
      if (href.includes('youtube.com/redirect')) {
        const url = new URL(href);
        const target = url.searchParams.get('q');
        if (target) return decodeURIComponent(target);
      }
    } catch (_) {}

    return null;
  }

  // 4. Bắt sự kiện click / mousedown ở capture phase (Event Delegation - 0ms CPU overhead)
  function handleLinkInteraction(event) {
    const anchor = event.target?.closest?.('a');
    if (!anchor || !anchor.href) return;

    const realUrl = extractTargetUrl(anchor.href);
    if (realUrl) {
      anchor.href = realUrl;
    }
  }

  // Khởi chạy dọn sạch URL khi nạp trang
  cleanCurrentUrl();

  // Bắt sự kiện click và mousedown trên toàn trang (capture phase)
  document.addEventListener('click', handleLinkInteraction, true);
  document.addEventListener('mousedown', handleLinkInteraction, true);
})();
