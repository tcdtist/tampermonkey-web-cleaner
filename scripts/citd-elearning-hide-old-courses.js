// ==UserScript==
// @name         Hide Old Courses - CITD Elearning (Homepage only)
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @author       tcdtist
// @description  Hide old courses on CITD Elearning homepage only
// @match        https://elearning.citd.edu.vn/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Block child pages: If not homepage (or index.php), stop script immediately
  const path = window.location.pathname;
  if (path !== "/" && path !== "/index.php") {
    return;
  }

  // List of 5 courses I want to KEEP THIS SEMESTER
  const currentCourses = [
    "SS007.F31.CN1.CNTT",
    "IT005.F32.CN1.TTNT",
    "CS114.F31.CN2.TTNT",
    "CS112.F31.LT.TTNT",
    "CS106.F31.CN2.TTNT",
  ];

  function hideOldCourses() {
    // Regex matches both 2-digit (ENG01) and 3-digit (SS007, CS114) course codes
    const courseCodeRegex = /^[A-Z]{2,4}\d{2,3}/;

    document.querySelectorAll("a").forEach((link) => {
      const text = link.textContent.trim();

      if (courseCodeRegex.test(text)) {
        const isCurrent = currentCourses.some((course) =>
          text.includes(course),
        );

        if (!isCurrent) {
          // Find the block wrapping the entire course to hide
          let container = link.closest(
            ".coursebox, .card, .course-summaryitem, .list-group-item",
          );

          // Fallback DOM handling if the wrapping structure changes
          if (!container) {
            let ancestor = link.parentElement;
            while (ancestor && ancestor.tagName !== "BODY") {
              if (
                ancestor.tagName === "DIV" &&
                ancestor.textContent.includes("Giáo viên")
              ) {
                container = ancestor;
                break;
              }
              ancestor = ancestor.parentElement;
            }
          }

          if (container && (container as HTMLElement).style.display !== "none") {
            (container as HTMLElement).style.display = "none";
          }
        }
      }
    });
  }

  // Watch DOM changes (to prevent Moodle loading courses list slowly by AJAX)
  const observer = new MutationObserver(hideOldCourses);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // First execution
  hideOldCourses();
})();
