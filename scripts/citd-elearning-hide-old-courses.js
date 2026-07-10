// ==UserScript==
// @name         Hide Old Courses - CITD Elearning (Homepage only)
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @author       tcdtist
// @description  Hide old courses on CITD Elearning homepage only
// @match        https://elearning.citd.edu.vn/*
// @grant        none
// ==/UserScript==


// Google Chrome:
(function () {
  "use strict";

  // Block child pages: If not homepage (or index.php), stop script immediately
  const path = window.location.pathname;
  if (path !== "/" && path !== "/index.php") {
    return;
  }

  // List of 5 courses I want to KEEP THIS SEMESTER (Sorted by order)
  const currentCourses = [
    "IT005.F32.CN1.TTNT",
    "SS007.F31.CN1.CNTT",
    "CS114.F31.CN2.TTNT",
    "CS106.F31.CN2.TTNT",
    "CS112.F31.LT.TTNT",
  ];

  function processCourses() {
    const courseCodeRegex = /^[A-Z]+\d+/;

    // 1. Hide old courses
    document
      .querySelectorAll(".coursebox .coursename a.aalink")
      .forEach((link) => {
        const text = link.textContent.trim();
        if (courseCodeRegex.test(text)) {
          const isCurrent = currentCourses.some((course) =>
            text.includes(course),
          );
          if (!isCurrent) {
            const container = link.closest(".coursebox");
            if (container && (container as HTMLElement).style.display !== "none") {
              (container as HTMLElement).style.display = "none";
            }
          }
        }
      });

    // 2. Sort again (Target specifically into the main course list)
    const courseList = document.querySelector(
      ".frontpage-course-list-enrolled",
    );
    if (courseList) {
      const pagingNode = courseList.querySelector(".paging"); // Button "All courses"
      const allBoxes = Array.from(courseList.querySelectorAll(".coursebox"));

      currentCourses.forEach((courseCode) => {
        // Filter to find the exact box containing the course code
        const targetBox = allBoxes.find((box) => {
          const titleEl = box.querySelector(".coursename a.aalink");
          return titleEl && titleEl.textContent.includes(courseCode);
        });

        if (targetBox) {
          // Use insertBefore to insert nodes in the order of the array
          if (pagingNode) {
            courseList.insertBefore(targetBox, pagingNode);
          } else {
            courseList.appendChild(targetBox);
          }
        }
      });
    }
  }

  // Optimize MutationObserver by flag to prevent Infinite Loop safely
  let isProcessing = false;
  const observer = new MutationObserver(() => {
    if (isProcessing) return;

    isProcessing = true;
    processCourses();

    // Wait for DOM update to finish before re-enabling processing
    setTimeout(() => {
      isProcessing = false;
    }, 50);
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Execute immediately
  processCourses();
})();


// Microsoft Edge:
(function() {
    'use strict';

    // Block child pages: If not homepage (or index.php), stop script immediately
    const path = window.location.pathname;
    if (path !== '/' && path !== '/index.php') {
        return;
    }

    // List of 5 courses I want to KEEP THIS SEMESTER (Sorted by order)
    const currentCourses = [
        'IT005.F32.CN1.TTNT',
        'SS007.F31.CN1.CNTT',
        'CS114.F31.CN2.TTNT',
        'CS106.F31.CN2.TTNT',
        'CS112.F31.LT.TTNT'
    ];

    function processCourses() {
        const courseCodeRegex = /^[A-Z]+\d+/;

        // 1. Hide old courses
        document.querySelectorAll('.coursebox .coursename a.aalink').forEach(link => {
            const text = link.textContent.trim();
            if (courseCodeRegex.test(text)) {
                const isCurrent = currentCourses.some(course => text.includes(course));
                if (!isCurrent) {
                    const container = link.closest('.coursebox');
                    if (container && (container as HTMLElement).style.display !== 'none') {
                        (container as HTMLElement).style.display = 'none';
                    }
                }
            }
        });

        // 2. Sort again (Target specifically into the main course list)
        const courseList = document.querySelector('.frontpage-course-list-enrolled');
        if (courseList) {
            const pagingNode = courseList.querySelector('.paging'); // Button "All courses"
            const allBoxes = Array.from(courseList.querySelectorAll('.coursebox'));

            currentCourses.forEach(courseCode => {
                // Filter to find the exact box containing the course code
                const targetBox = allBoxes.find(box => {
                    const titleEl = box.querySelector('.coursename a.aalink');
                    return titleEl && titleEl.textContent.includes(courseCode);
                });

                if (targetBox) {
                    // Use insertBefore to insert nodes in the order of the array
                    if (pagingNode) {
                        courseList.insertBefore(targetBox, pagingNode);
                    } else {
                        courseList.appendChild(targetBox);
                    }
                }
            });
        }
    }

    // Optimize MutationObserver by flag to prevent Infinite Loop safely
    let isProcessing = false;
    const observer = new MutationObserver(() => {
        if (isProcessing) return;

        isProcessing = true;
        processCourses();

        // Wait for DOM update to finish before re-enabling processing
        setTimeout(() => { isProcessing = false; }, 50);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Execute immediately
    processCourses();
})();
