// ==UserScript==
// @name         Google Clean Search
// @namespace    https://github.com/tcdtist/userscripts
// @version      1.1.0
// @author       tcdtist
// @description  Dọn sạch kết quả tìm kiếm Google: ẩn quảng cáo tài trợ, dọn shopping và bóc tách link chuyển hướng. Kỹ thuật chọn lọc từ JeffersonScher/google-hit-hider-by-domain.
// @homepageURL  https://github.com/tcdtist/userscripts
// @supportURL   https://github.com/tcdtist/userscripts/issues
// @source       https://github.com/JeffersonScher/google-hit-hider-by-domain (Kỹ thuật neo phần tử cấu trúc Google Search & dọn ping/url redirect)
// @match        https://*.google.com/search*
// @match        https://*.google.com.*/search*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/**
 * THAM KHẢO & BÀI HỌC KỸ THUẬT TỪ CÁC DỰ ÁN NGUỒN:
 * 1. JeffersonScher/google-hit-hider-by-domain (Dự án mã nguồn mở tồn tại hơn 10 năm của Jefferson Scher):
 *    - Google thường xuyên băm ngẫu nhiên tên class (từ .rc sang .g sang .MjjYud...), do đó
 *      bộ lọc bền vững không được dựa vào tên class ngẫu nhiên mà phải bám vào các neo cấu trúc
 *      bất biến như: #taw (Top Ad Wrapper), #bottomads, div[data-text-ad], div[data-attrid].
 *    - Bóc tách thuộc tính 'ping' và giải mã query 'q' trên thẻ link để người dùng bấm trực tiếp vào
 *      trang đích mà không bị gửi dữ liệu hành vi về máy chủ Google Tracking.
 */

(function () {
  'use strict';

  // =========================================================================
  // BẢNG ĐIỀU KHIỂN CẤU HÌNH (Tùy chỉnh theo nhu cầu)
  // =========================================================================
  const CONFIG = {
    // 1. Ẩn toàn bộ quảng cáo tài trợ (Sponsored Ads) ở đầu và cuối trang
    hideSponsoredAds: true,

    // 2. Ẩn băng chuyền mua sắm Google Shopping
    hideShoppingCarousel: true,

    // 3. Ẩn mục "Mọi người cũng hỏi" (People Also Ask)
    hidePeopleAlsoAsk: true,

    // 4. Ẩn khối AI Overview (để false nếu vẫn muốn xem tóm tắt AI của Google)
    hideAIOverview: false,

    // 5. Gỡ bỏ chuyển hướng gián tiếp (google.com/url?q=...) và thuộc tính ping theo dõi
    cleanTrackingUrls: true,
  };

  // =========================================================================
  // 1. INJECT CSS TĨNH - 0ms CPU OVERHEAD (Chống giật hình, ẩn tức thì)
  // =========================================================================
  function applyCleanStyles() {
    const hiddenSelectors = [];

    // Bộ chọn quảng cáo theo neo cấu trúc của Google
    if (CONFIG.hideSponsoredAds) {
      hiddenSelectors.push(
        '#taw',
        '#bottomads',
        'div[data-text-ad]',
        'div[aria-label="Sponsored"]',
        'div[aria-label="Quảng cáo"]',
        'div[aria-label="Ads"]',
        '.commercial-unit-desktop-top',
        '.commercial-unit-desktop-rhs'
      );
    }

    // Bộ chọn mua sắm Shopping
    if (CONFIG.hideShoppingCarousel) {
      hiddenSelectors.push(
        '.cu-container',
        'div[data-attrid="shopping_carousel"]',
        'div[data-attrid="pl_carousel"]',
        'block-component:has([data-item-title])'
      );
    }

    // Bộ chọn People Also Ask
    if (CONFIG.hidePeopleAlsoAsk) {
      hiddenSelectors.push(
        'div[data-initq]',
        'div.related-question-pair',
        'div[jsname="yEVEwb"]'
      );
    }

    // Bộ chọn AI Overview
    if (CONFIG.hideAIOverview) {
      hiddenSelectors.push(
        'div[data-attrid="wa:/description"]',
        'div[jsname="pa3bYe"]'
      );
    }

    if (!hiddenSelectors.length) return;

    const css = `${hiddenSelectors.join(',\n')} {\n  display: none !important;\n}`;
    const styleId = 'google-clean-search-style';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }

  // =========================================================================
  // 2. BÓC TÁCH LINK THỰC SỰ (Kỹ thuật loại bỏ Google Redirect & Ping Tracking)
  // =========================================================================
  function handleLinkInteraction(event) {
    if (!CONFIG.cleanTrackingUrls) return;
    const anchor = event.target?.closest?.('a');
    if (!anchor || !anchor.href) return;

    try {
      // Nếu link bị Google bọc qua /url?q=TARGET_URL
      if (anchor.href.includes('/url?') && anchor.href.includes('q=')) {
        const url = new URL(anchor.href);
        const realTarget = url.searchParams.get('q');
        if (realTarget && realTarget.startsWith('http')) {
          anchor.href = decodeURIComponent(realTarget);
        }
      }
      // Gỡ bỏ thuộc tính ping theo dõi của Google
      if (anchor.hasAttribute('ping')) {
        anchor.removeAttribute('ping');
      }
    } catch (_) {}
  }

  // Khởi chạy CSS ngay lập tức tại document-start
  if (document.head || document.documentElement) {
    applyCleanStyles();
  } else {
    document.addEventListener('DOMContentLoaded', applyCleanStyles, { once: true });
  }

  // Bắt sự kiện click vào kết quả tìm kiếm (Event Delegation)
  document.addEventListener('click', handleLinkInteraction, true);
  document.addEventListener('mousedown', handleLinkInteraction, true);
})();
