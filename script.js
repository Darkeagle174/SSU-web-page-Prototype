 document.addEventListener('DOMContentLoaded', () => {

            // --- Mobile Menu Toggle ---
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const menuClose = document.getElementById('menuClose');
            const navMenu = document.getElementById('navMenu');
            const navLinks = navMenu.querySelectorAll('a'); // Get all links inside nav

            if (mobileMenuBtn && menuClose && navMenu) {
                mobileMenuBtn.addEventListener('click', () => {
                    navMenu.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent background scroll
                });

                menuClose.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    document.body.style.overflow = ''; // Restore scroll
                });

                // Close menu when a link is clicked
                navLinks.forEach(link => {
                    link.addEventListener('click', () => {
                        navMenu.classList.remove('active');
                        document.body.style.overflow = ''; // Restore scroll
                    });
                });

                 // Close menu if clicking outside of it (optional)
                 document.addEventListener('click', (event) => {
                    if (navMenu.classList.contains('active') && !navMenu.contains(event.target) && event.target !== mobileMenuBtn) {
                         navMenu.classList.remove('active');
                         document.body.style.overflow = '';
                    }
                });
            }


            // --- Smooth Scroll for Navigation Links (Enhanced) ---
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    // Ensure it's an internal link and not just "#"
                    if (href && href.startsWith('#') && href.length > 1) {
                        e.preventDefault();
                        const targetElement = document.querySelector(href);
                        const header = document.getElementById('header');
                        const headerHeight = header ? header.offsetHeight : 0; // Get header height

                        if (targetElement) {
                            const elementPosition = targetElement.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                            window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                            });

                            // Close mobile menu if open (handled by navLinks listener above)
                        }
                    } else if (href === '#') {
                        e.preventDefault(); // Prevent jumping for "#" links
                        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
                    }
                    // Allow default behavior for external links or non-hash links
                });
            });

            // --- Sticky Header ---
            const header = document.getElementById('header');
            if (header) {
                const stickyPoint = header.offsetTop + 50; // Point where header becomes sticky
                window.addEventListener('scroll', () => {
                    header.classList.toggle('scrolled', window.pageYOffset > stickyPoint);
                });
                 // Initial check in case page loads scrolled down
                 header.classList.toggle('scrolled', window.pageYOffset > stickyPoint);
            }


            // --- FAQ Accordion ---
            const faqItems = document.querySelectorAll('.faq-item');
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question');
                if (question) {
                    question.addEventListener('click', () => {
                        // Toggle active class on the clicked item
                        const currentlyActive = item.classList.contains('active');
                        // Optional: Close other FAQ items when one is opened
                        // faqItems.forEach(otherItem => {
                        //     otherItem.classList.remove('active');
                        //     otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                        // });

                        if (!currentlyActive) {
                            item.classList.add('active');
                            question.setAttribute('aria-expanded', 'true');
                        } else {
                             item.classList.remove('active');
                             question.setAttribute('aria-expanded', 'false');
                        }
                    });
                }
            });

            // --- Semester Tabs ---
            const semesterTabs = document.querySelectorAll('.semester-tab');
            const semesterContents = document.querySelectorAll('.semester-content');

            semesterTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    // Remove active class from all tabs
                    semesterTabs.forEach(t => t.classList.remove('active'));
                    // Add active class to the clicked tab
                    tab.classList.add('active');

                    // Hide all semester content
                    semesterContents.forEach(content => content.classList.remove('active'));

                    // Show the corresponding semester content
                    const semesterId = tab.getAttribute('data-semester');
                    const targetContent = document.getElementById(semesterId);
                    if (targetContent) {
                        targetContent.classList.add('active');
                        // Optional: Trigger animations on newly shown elements
                        const elementsToAnimate = targetContent.querySelectorAll('.fade-in, .scale-in, .slide-in-left, .slide-in-right');
                        elementsToAnimate.forEach(el => {
                            // Reset animation state if needed (e.g., remove 'visible' then re-add based on viewport)
                            // Or simply ensure the observer watches them
                        });
                    }
                });
            });

            // --- Testimonial Slider ---
            const slides = document.querySelectorAll('.testimonial-slide');
            const dots = document.querySelectorAll('.slider-dot');
            const prevArrow = document.querySelector('.prev-slide');
            const nextArrow = document.querySelector('.next-slide');

            if (slides.length > 0 && dots.length === slides.length) { // Ensure elements exist
                let currentSlideIndex = 0;
                const totalSlides = slides.length;

                function showSlide(index) {
                    // Wrap index around
                    if (index >= totalSlides) index = 0;
                    if (index < 0) index = totalSlides - 1;

                    // Update slides and dots
                    slides.forEach((slide, i) => {
                        slide.classList.toggle('active', i === index);
                    });
                    dots.forEach((dot, i) => {
                        dot.classList.toggle('active', i === index);
                    });

                    currentSlideIndex = index;
                }

                dots.forEach((dot, index) => {
                    dot.addEventListener('click', () => {
                        showSlide(index);
                    });
                });

                if (prevArrow && nextArrow) {
                    prevArrow.addEventListener('click', () => {
                        showSlide(currentSlideIndex - 1);
                    });

                    nextArrow.addEventListener('click', () => {
                        showSlide(currentSlideIndex + 1);
                    });
                }

                // Auto-play (optional)
                // let autoPlayInterval = setInterval(() => {
                //     showSlide(currentSlideIndex + 1);
                // }, 5000); // Change slide every 5 seconds

                // // Pause autoplay on hover (optional)
                // const sliderContainer = document.querySelector('.testimonial-slider');
                // if(sliderContainer) {
                //     sliderContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
                //     sliderContainer.addEventListener('mouseleave', () => {
                //         autoPlayInterval = setInterval(() => {
                //            showSlide(currentSlideIndex + 1);
                //         }, 5000);
                //     });
                // }


                // Initial display
                showSlide(0);
            }

            // --- Scroll Animations (Intersection Observer) ---
            const animatedElements = document.querySelectorAll('.fade-in, .scale-in, .slide-in-left, .slide-in-right');

            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries, observerInstance) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            // Small delay before adding 'visible' for better effect
                            setTimeout(() => {
                                entry.target.classList.add('visible');
                            }, 100); // 100ms delay, adjust as needed
                            observerInstance.unobserve(entry.target); // Stop observing once visible
                        }
                    });
                }, {
                    threshold: 0.1, // Trigger when 10% is visible
                    // rootMargin: '0px 0px -50px 0px' // Optional: Trigger slightly before element fully enters view
                });

                animatedElements.forEach(el => observer.observe(el));
            } else {
                // Fallback for browsers that don't support IntersectionObserver
                console.warn('IntersectionObserver not supported, animations will show immediately.');
                animatedElements.forEach(el => el.classList.add('visible'));
            }

        }); // End DOMContentLoaded