// ==UserScript==
// @name         YouTube Cleaner & Layout Adjuster
// @namespace    Violentmonkey Scripts
// @version      1.0.0
// @author       tcdtist
// @description  Dọn dẹp các khu vực gây xao nhãng (Shorts, mixes) và tùy chỉnh số cột video trên YouTube với hiệu năng tối đa
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // =========================================================================
  // BẢNG ĐIỀU KHIỂN CẤU HÌNH (Tùy chỉnh theo nhu cầu)
  // =========================================================================
  const CONFIG = {
    // 1. Tùy chỉnh số cột video trên trang chủ và danh sách kênh
    enableColumnAdjuster: true,
    columns: 5, // Số cột video mong muốn (4, 5, hoặc 6)

    // 2. Tự động ẩn các kệ / khu vực video rác theo từ khóa
    enableHideBlocks: true,
    keywords: [
      'shorts',
      'popular uploads',
      'youtube mix',
      'review phim',
    ],

    // 3. Tự động chuyển hướng YouTube Shorts về trình phát chuẩn (/watch?v=...)
    enableShortsRedirect: true,
  };

  // =========================================================================
  // 1. MODULE TÙY CHỈNH CỘT (Pure CSS Injection - 0ms CPU overhead)
  // =========================================================================
  function applyColumnAdjuster() {
    if (!CONFIG.enableColumnAdjuster) return;

    const css = `
      /* Ép số lượng cột bằng biến CSS gốc của YouTube */
      ytd-rich-grid-renderer {
        --ytd-rich-grid-items-per-row: ${CONFIG.columns} !important;
        --ytd-rich-grid-posts-per-row: ${CONFIG.columns} !important;
        --ytd-rich-grid-slim-items-per-row: ${CONFIG.columns + 1} !important;
      }

      /* Làm phẳng hàng container để card video tự động dàn đều mượt mà */
      ytd-rich-grid-row,
      #contents.ytd-rich-grid-row {
        display: contents !important;
      }

      /* Tính toán chính xác kích thước card video thông thường, trừ kệ Shorts */
      ytd-rich-item-renderer:not([is-shelf-item]) {
        width: calc(100% / var(--ytd-rich-grid-items-per-row, ${CONFIG.columns}) - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;
        max-width: calc(100% / var(--ytd-rich-grid-items-per-row, ${CONFIG.columns}) - var(--ytd-rich-grid-item-margin, 16px) - 0.01px) !important;
        margin-left: calc(var(--ytd-rich-grid-item-margin, 16px) / 2) !important;
        margin-right: calc(var(--ytd-rich-grid-item-margin, 16px) / 2) !important;
      }

      /* Mở rộng container tối đa để tận dụng không gian màn hình */
      ytd-two-column-browse-results-renderer.grid:not(.grid-disabled) {
        max-width: 100% !important;
      }
      #primary.ytd-two-column-browse-results-renderer {
        max-width: 100% !important;
      }
    `;

    const styleId = 'yt-cleaner-column-style';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }

  // =========================================================================
  // 2. MODULE ẨN KHỐI / KỆ RÁC (DOM MutationObserver)
  // =========================================================================
  function applyHideBlocks() {
    if (!CONFIG.enableHideBlocks || !CONFIG.keywords.length) return;

    const hideMatchingSections = () => {
      // 1. Quét kệ chuẩn: ytd-rich-shelf-renderer (Shorts, shelf rows)
      document.querySelectorAll('ytd-rich-shelf-renderer').forEach((shelf) => {
        const heading =
          shelf.querySelector('h2') ||
          shelf.querySelector('#title') ||
          shelf.querySelector('yt-formatted-string');
        const text = heading?.textContent?.trim().toLowerCase();
        if (text && CONFIG.keywords.some((kw) => text.includes(kw))) {
          shelf.style.display = 'none';
          const section = shelf.closest('ytd-rich-section-renderer, ytd-item-section-renderer');
          if (section) section.style.display = 'none';
        }
      });

      // 2. Quét kệ định dạng mới: grid-shelf-view-model
      document.querySelectorAll('grid-shelf-view-model').forEach((shelf) => {
        const heading =
          shelf.querySelector('h2') ||
          shelf.querySelector('.ytShelfHeaderLayoutTitle');
        const text = heading?.textContent?.trim().toLowerCase();
        if (text && CONFIG.keywords.some((kw) => text.includes(kw))) {
          shelf.style.display = 'none';
          const section = shelf.closest('ytd-rich-section-renderer, ytd-item-section-renderer');
          if (section) section.style.display = 'none';
        }
      });
    };

    const startObserver = () => {
      hideMatchingSections();
      new MutationObserver(hideMatchingSections).observe(document.body, {
        childList: true,
        subtree: true,
      });
    };

    if (document.body) {
      startObserver();
    } else {
      document.addEventListener('DOMContentLoaded', startObserver, { once: true });
    }
  }

  // =========================================================================
  // 3. MODULE CHUYỂN HƯỚNG SHORTS VỀ TRÌNH PHÁT CHUẨN (SPA Event Hook)
  // =========================================================================
  function applyShortsRedirect() {
    if (!CONFIG.enableShortsRedirect) return;

    const redirectToWatch = (urlPath) => {
      if (!urlPath) return;
      const match = urlPath.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
      if (match) {
        window.location.replace(`/watch?v=${match[1]}`);
      }
    };

    // 1. Kiểm tra ngay tức thì khi script nạp vào
    redirectToWatch(window.location.pathname);

    // 2. Bắt sự kiện điều hướng Client-side (SPA) của YouTube
    window.addEventListener('yt-navigate-start', (event) => {
      const targetUrl = event.detail?.url;
      redirectToWatch(targetUrl);
    });
  }

  // Khởi chạy ngay lập tức khi tải trang
  applyShortsRedirect();

  if (document.head || document.documentElement) {
    applyColumnAdjuster();
  } else {
    document.addEventListener('DOMContentLoaded', applyColumnAdjuster, { once: true });
  }

  applyHideBlocks();
})();
