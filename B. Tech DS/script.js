document.addEventListener("DOMContentLoaded", () => {
  // --- Mobile Menu Toggle ---
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const menuClose = document.getElementById("menuClose");
  const navMenu = document.getElementById("navMenu");
  const body = document.body; // Get the body element

  // Debug: Log found elements
  // console.log("Mobile Menu Elements:", { mobileMenuBtn, menuClose, navMenu, body });

  if (mobileMenuBtn && menuClose && navMenu) {
    const navLinks = navMenu.querySelectorAll("a");
    // console.log("Nav Links Found:", navLinks.length);

    mobileMenuBtn.addEventListener("click", () => {
      // console.log("Hamburger button clicked!");
      navMenu.classList.add("active");
      body.classList.add("mobile-menu-active"); // Add class to body for icon toggle
      body.style.overflow = "hidden"; // Prevent background scroll
      mobileMenuBtn.setAttribute("aria-expanded", "true"); // Accessibility
      mobileMenuBtn.style.display = "none"; // Hide the mobile menu button
    });

    // Helper function to handle closing the menu and resetting states
    const closeMobileMenu = () => {
      // console.log("Closing mobile menu.");
      navMenu.classList.remove("active");
      body.classList.remove("mobile-menu-active"); // Remove class from body for icon toggle
      body.style.overflow = ""; // Restore scroll
      mobileMenuBtn.setAttribute("aria-expanded", "false"); // Accessibility
      mobileMenuBtn.style.display = ""; // Show the mobile menu button again
    };

    menuClose.addEventListener("click", closeMobileMenu);

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("click", (event) => {
      if (navMenu.classList.contains("active")) {
        const isClickInsideNav = navMenu.contains(event.target);
        // Check if the click is on the mobileMenuBtn itself or its children
        const isClickOnMobileBtn =
          mobileMenuBtn.contains(event.target) ||
          event.target === mobileMenuBtn;
        // Check if the click is on the menuClose button itself or its children
        const isClickOnCloseBtn =
          menuClose.contains(event.target) || event.target === menuClose;

        // If the click is outside the nav, and not on the open button, and not on the close button
        if (!isClickInsideNav && !isClickOnMobileBtn && !isClickOnCloseBtn) {
          // console.log("Clicked outside, closing menu. Target:", event.target);
          closeMobileMenu();
        } else {
          // console.log("Clicked inside menu or on a toggle button. Target:", event.target);
        }
      }
    });
  } else {
    console.error(
      "One or more mobile menu elements (mobileMenuBtn, menuClose, navMenu) not found!"
    );
  }

  // --- Smooth Scroll for Navigation Links (Enhanced) ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      // Ensure it's an internal link and not just "#"
      if (href && href.startsWith("#") && href.length > 1) {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        const header = document.getElementById("header");
        const headerHeight = header ? header.offsetHeight : 0; // Get header height

        if (targetElement) {
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });

          // Mobile menu is already closed by its own navLink click listener
        }
      } else if (href === "#") {
        e.preventDefault(); // Prevent jumping for "#" links
        window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
      }
      // Allow default behavior for external links or non-hash links
    });
  });

  // --- Sticky Header ---
  const header = document.getElementById("header");
  if (header) {
    const stickyPoint = header.offsetTop + 50; // Point where header becomes sticky

    const handleScroll = () => {
      // Using requestAnimationFrame for smoother scroll-based animations/toggles
      window.requestAnimationFrame(() => {
        header.classList.toggle("scrolled", window.pageYOffset > stickyPoint);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true }); // Use passive for better scroll performance
    // Initial check in case page loads scrolled down
    handleScroll();
  }

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    if (question) {
      question.addEventListener("click", () => {
        // Toggle active class on the clicked item
        const currentlyActive = item.classList.contains("active");

        // Optional: Close other FAQ items when one is opened
        // faqItems.forEach(otherItem => {
        //     if (otherItem !== item) { // Don't close the one being clicked
        //        otherItem.classList.remove('active');
        //        const otherQuestion = otherItem.querySelector('.faq-question');
        //        if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
        //     }
        // });

        if (!currentlyActive) {
          item.classList.add("active");
          question.setAttribute("aria-expanded", "true");
        } else {
          item.classList.remove("active");
          question.setAttribute("aria-expanded", "false");
        }
      });
    }
  });

  // --- Semester Tabs ---
  const semesterTabs = document.querySelectorAll(".semester-tab");
  const semesterContents = document.querySelectorAll(".semester-content");

  if (semesterTabs.length > 0 && semesterContents.length > 0) {
    semesterTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // Remove active class from all tabs
        semesterTabs.forEach((t) => t.classList.remove("active"));
        // Add active class to the clicked tab
        tab.classList.add("active");

        // Hide all semester content
        semesterContents.forEach((content) =>
          content.classList.remove("active")
        );

        // Show the corresponding semester content
        const semesterId = tab.getAttribute("data-semester");
        const targetContent = document.getElementById(semesterId);
        if (targetContent) {
          targetContent.classList.add("active");
          // Optional: Re-trigger animations on newly shown elements if using IntersectionObserver
          // and elements were previously unobserved. If not, they might need manual class reset.
          const elementsToAnimate = targetContent.querySelectorAll(
            ".fade-in, .scale-in, .slide-in-left, .slide-in-right"
          );
          elementsToAnimate.forEach((el) => {
            // If animations are one-shot and you want them to replay when tab is re-selected:
            el.classList.remove("visible");
            // Then, if not using IntersectionObserver or if it was unobserved:
            // setTimeout(() => el.classList.add("visible"), 50); // Re-add with a tiny delay
            // If using IntersectionObserver, just ensure it's observing these elements or re-observe
          });
        }
      });
    });
  }

  // --- Testimonial Slider ---
  const slides = document.querySelectorAll(".testimonial-slide");
  const dots = document.querySelectorAll(".slider-dot");
  const prevArrow = document.querySelector(".prev-slide");
  const nextArrow = document.querySelector(".next-slide");
  const sliderContainer = document.querySelector(".testimonial-slider"); // For autoplay pause

  if (slides.length > 0) {
    // Only need slides to exist for basic functionality
    let currentSlideIndex = 0;
    const totalSlides = slides.length;
    let autoPlayInterval = null; // For managing autoplay

    function showSlide(index) {
      // Wrap index around
      if (index >= totalSlides) index = 0;
      if (index < 0) index = totalSlides - 1;

      // Update slides
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
      });
      // Update dots only if they exist and match the number of slides
      if (dots.length === totalSlides) {
        dots.forEach((dot, i) => {
          dot.classList.toggle("active", i === index);
        });
      }
      currentSlideIndex = index;
    }

    if (dots.length === totalSlides) {
      // Attach dot listeners only if they match
      dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
          showSlide(index);
          // if (autoPlayInterval) restartAutoPlay(); // Restart autoplay if manual navigation
        });
      });
    }

    if (prevArrow && nextArrow) {
      prevArrow.addEventListener("click", () => {
        showSlide(currentSlideIndex - 1);
        // if (autoPlayInterval) restartAutoPlay();
      });

      nextArrow.addEventListener("click", () => {
        showSlide(currentSlideIndex + 1);
        // if (autoPlayInterval) restartAutoPlay();
      });
    }

    function startAutoPlay() {
      // clearInterval(autoPlayInterval); // Clear existing interval if any
      // autoPlayInterval = setInterval(() => {
      //     showSlide(currentSlideIndex + 1);
      // }, 5000); // Change slide every 5 seconds
    }

    function restartAutoPlay() {
      // clearInterval(autoPlayInterval);
      // startAutoPlay();
    }

    // Optional: Pause autoplay on hover
    // if(sliderContainer) {
    //     sliderContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    //     sliderContainer.addEventListener('mouseleave', () => startAutoPlay());
    // }

    // Initial display
    showSlide(0);
    // startAutoPlay(); // Start autoplay initially
  }

  // --- Scroll Animations (Intersection Observer) ---
  const animatedElements = document.querySelectorAll(
    ".fade-in, .scale-in, .slide-in-left, .slide-in-right"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Small delay before adding 'visible' for better effect
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, 50); // Reduced delay, adjust as needed
            observerInstance.unobserve(entry.target); // Stop observing once visible
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% is visible
        // rootMargin: '0px 0px -50px 0px' // Optional: Trigger slightly before element fully enters view
      }
    );

    animatedElements.forEach((el) => {
      // If element is already in viewport on load (e.g. hero section elements)
      // and not part of a tabbed content that might be initially hidden
      if (!el.closest(".semester-content:not(.active)")) {
        // Basic check
        observer.observe(el);
      }
    });

    // Special handling for elements inside initially hidden tabs (semester content)
    // Re-observe when a tab becomes active
    if (semesterTabs.length > 0) {
      semesterTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          const semesterId = tab.getAttribute("data-semester");
          const targetContent = document.getElementById(semesterId);
          if (targetContent) {
            const elementsInTab = targetContent.querySelectorAll(
              ".fade-in, .scale-in, .slide-in-left, .slide-in-right"
            );
            elementsInTab.forEach((el) => {
              // el.classList.remove('visible'); // Ensure it's not already visible
              observer.observe(el); // Re-observe
            });
          }
        });
      });
    }
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    console.warn(
      "IntersectionObserver not supported, animations will show immediately."
    );
    animatedElements.forEach((el) => el.classList.add("visible"));
  }
}); // End DOMContentLoadedGH
