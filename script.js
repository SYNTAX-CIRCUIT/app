/* =========================================================
   SYNTAX CIRCUIT — PREMIUM INTERACTION SYSTEM
   script.js
   ========================================================= */

(() => {
    "use strict";

    /* ---------------------------------------------------------
       HELPERS
    --------------------------------------------------------- */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    const on = (element, event, callback, options = {}) => {
        if (element) {
            element.addEventListener(event, callback, options);
        }
    };

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* ---------------------------------------------------------
       DOM READY
    --------------------------------------------------------- */

    on(document, "DOMContentLoaded", () => {

        initLoader();
        initCustomCursor();
        initHeader();
        initMobileMenu();
        initTheme();
        initScrollReveal();
        initCounters();
        initFAQ();
        initSmoothScroll();
        initBackToTop();
        initContactForm();
        initParallax();
        initTiltCards();
        initMagneticButtons();
        initTerminal();
        initMarquee();
        initActiveNavigation();
        initYear();

    });


    /* =========================================================
       1. PAGE LOADER
       ========================================================= */

    function initLoader() {

        const loader = $(".page-loader");

        if (!loader) return;

        const hideLoader = () => {
            loader.classList.add("is-hidden");

            setTimeout(() => {
                loader.remove();
            }, 800);
        };

        if (document.readyState === "complete") {
            setTimeout(hideLoader, 400);
        } else {
            on(window, "load", () => {
                setTimeout(hideLoader, 500);
            });
        }

        // Safety fallback
        setTimeout(hideLoader, 3500);
    }


    /* =========================================================
       2. CUSTOM CURSOR
       ========================================================= */

    function initCustomCursor() {

        if (prefersReducedMotion) return;

        const dot = $(".cursor-dot");
        const outline = $(".cursor-outline");

        if (!dot || !outline) return;

        // Disable on touch devices
        if (
            window.matchMedia("(hover: none)").matches ||
            window.matchMedia("(pointer: coarse)").matches
        ) {
            dot.style.display = "none";
            outline.style.display = "none";
            return;
        }

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        let outlineX = mouseX;
        let outlineY = mouseY;

        on(document, "mousemove", (event) => {
            mouseX = event.clientX;
            mouseY = event.clientY;

            dot.style.transform =
                `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        });

        const animateCursor = () => {

            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;

            outline.style.transform =
                `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;

            requestAnimationFrame(animateCursor);
        };

        animateCursor();

        const interactiveElements = $$(
            "a, button, input, textarea, select, .course-row, .project-card, .team-card, .faq-item"
        );

        interactiveElements.forEach((element) => {

            on(element, "mouseenter", () => {
                document.body.classList.add("cursor-hover");
            });

            on(element, "mouseleave", () => {
                document.body.classList.remove("cursor-hover");
            });

        });
    }


    /* =========================================================
       3. HEADER / NAVBAR
       ========================================================= */

    function initHeader() {

        const header = $(".site-header");

        if (!header) return;

        const updateHeader = () => {

            if (window.scrollY > 40) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }

        };

        on(window, "scroll", updateHeader, { passive: true });

        updateHeader();
    }


    /* =========================================================
       4. MOBILE MENU
       ========================================================= */

    function initMobileMenu() {

        const menuToggle = $(".menu-toggle");
        const mobileMenu = $(".mobile-menu");

        if (!menuToggle || !mobileMenu) return;

        const closeMenu = () => {
            mobileMenu.classList.remove("active");
            menuToggle.classList.remove("active");
            document.body.classList.remove("menu-open");

            menuToggle.setAttribute("aria-expanded", "false");
        };

        const openMenu = () => {
            mobileMenu.classList.add("active");
            menuToggle.classList.add("active");
            document.body.classList.add("menu-open");

            menuToggle.setAttribute("aria-expanded", "true");
        };

        on(menuToggle, "click", () => {

            const isOpen = mobileMenu.classList.contains("active");

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }

        });

        $$(".mobile-menu a").forEach((link) => {

            on(link, "click", () => {
                closeMenu();
            });

        });

        on(document, "keydown", (event) => {

            if (event.key === "Escape") {
                closeMenu();
            }

        });

        // Close when clicking outside
        on(document, "click", (event) => {

            if (
                mobileMenu.classList.contains("active") &&
                !mobileMenu.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }

        });

    }


    /* =========================================================
       5. DARK / LIGHT MODE
       ========================================================= */

    function initTheme() {

        const themeToggle = $(".theme-toggle");

        if (!themeToggle) return;

        const savedTheme = localStorage.getItem("syntax-theme");

        if (savedTheme === "dark") {
            document.body.classList.add("dark-mode");
        }

        updateThemeIcon();

        on(themeToggle, "click", () => {

            document.body.classList.toggle("dark-mode");

            const isDark =
                document.body.classList.contains("dark-mode");

            localStorage.setItem(
                "syntax-theme",
                isDark ? "dark" : "light"
            );

            updateThemeIcon();

        });

        function updateThemeIcon() {

            const icon = $("i", themeToggle);

            if (!icon) return;

            const isDark =
                document.body.classList.contains("dark-mode");

            icon.className = isDark
                ? "fa-solid fa-sun"
                : "fa-solid fa-moon";

            themeToggle.setAttribute(
                "aria-label",
                isDark
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            );
        }
    }


    /* =========================================================
       6. SCROLL REVEAL
       ========================================================= */

    function initScrollReveal() {

        const elements = $$(".reveal");

        if (!elements.length) return;

        if (prefersReducedMotion) {

            elements.forEach((element) => {
                element.classList.add("visible");
            });

            return;
        }

        const observer = new IntersectionObserver(
            (entries, observerInstance) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("visible");

                    observerInstance.unobserve(entry.target);

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -50px 0px"
            }
        );

        elements.forEach((element) => {
            observer.observe(element);
        });
    }


    /* =========================================================
       7. ANIMATED COUNTERS
       ========================================================= */

    function initCounters() {

        const counters = $$("[data-counter]");

        if (!counters.length) return;

        const animateCounter = (element) => {

            const target =
                parseFloat(element.dataset.counter || "0");

            const duration =
                parseInt(element.dataset.duration || "1600", 10);

            const suffix =
                element.dataset.suffix || "";

            const prefix =
                element.dataset.prefix || "";

            const decimals =
                Number.isInteger(target)
                    ? 0
                    : (String(target).split(".")[1] || "").length;

            if (prefersReducedMotion) {

                element.textContent =
                    prefix +
                    target.toFixed(decimals) +
                    suffix;

                return;
            }

            const startTime = performance.now();

            const update = (currentTime) => {

                const elapsed = currentTime - startTime;

                const progress =
                    Math.min(elapsed / duration, 1);

                // Smooth ease-out
                const eased =
                    1 - Math.pow(1 - progress, 4);

                const current =
                    target * eased;

                element.textContent =
                    prefix +
                    current.toFixed(decimals) +
                    suffix;

                if (progress < 1) {
                    requestAnimationFrame(update);
                }

            };

            requestAnimationFrame(update);
        };

        const observer = new IntersectionObserver(
            (entries, observerInstance) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) return;

                    animateCounter(entry.target);

                    observerInstance.unobserve(entry.target);

                });

            },
            {
                threshold: 0.7
            }
        );

        counters.forEach((counter) => {
            observer.observe(counter);
        });
    }


    /* =========================================================
       8. FAQ ACCORDION
       ========================================================= */

    function initFAQ() {

        const faqItems = $$(".faq-item");

        if (!faqItems.length) return;

        faqItems.forEach((item) => {

            const question =
                $(".faq-question", item);

            const answer =
                $(".faq-answer", item);

            if (!question || !answer) return;

            on(question, "click", () => {

                const wasOpen =
                    item.classList.contains("active");

                // Close all
                faqItems.forEach((otherItem) => {

                    otherItem.classList.remove("active");

                    const otherQuestion =
                        $(".faq-question", otherItem);

                    if (otherQuestion) {
                        otherQuestion.setAttribute(
                            "aria-expanded",
                            "false"
                        );
                    }

                });

                // Open selected
                if (!wasOpen) {

                    item.classList.add("active");

                    question.setAttribute(
                        "aria-expanded",
                        "true"
                    );

                }

            });

        });
    }


    /* =========================================================
       9. SMOOTH SCROLL
       ========================================================= */

    function initSmoothScroll() {

        $$('a[href^="#"]').forEach((link) => {

            on(link, "click", (event) => {

                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#" ||
                    targetId.length < 2
                ) {
                    return;
                }

                const target =
                    document.querySelector(targetId);

                if (!target) return;

                event.preventDefault();

                const header =
                    $(".site-header");

                const offset =
                    header
                        ? header.offsetHeight + 20
                        : 20;

                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: prefersReducedMotion
                        ? "auto"
                        : "smooth"
                });

            });

        });
    }


    /* =========================================================
       10. BACK TO TOP
       ========================================================= */

    function initBackToTop() {

        const button = $(".back-top");

        if (!button) return;

        const update = () => {

            if (window.scrollY > 600) {
                button.classList.add("visible");
            } else {
                button.classList.remove("visible");
            }

        };

        on(window, "scroll", update, { passive: true });

        on(button, "click", () => {

            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion
                    ? "auto"
                    : "smooth"
            });

        });

        update();
    }


    /* =========================================================
       11. CONTACT FORM
       ========================================================= */

    function initContactForm() {

        const form = $(".contact-form");

        if (!form) return;

        on(form, "submit", (event) => {

            event.preventDefault();

            clearFormErrors();

            const name =
                $('[name="name"]', form);

            const email =
                $('[name="email"]', form);

            const phone =
                $('[name="phone"]', form);

            const subject =
                $('[name="subject"]', form);

            const message =
                $('[name="message"]', form);

            let valid = true;

            if (name && !name.value.trim()) {
                showError(name, "Please enter your name.");
                valid = false;
            }

            if (
                email &&
                (
                    !email.value.trim() ||
                    !isValidEmail(email.value)
                )
            ) {
                showError(
                    email,
                    "Please enter a valid email address."
                );
                valid = false;
            }

            if (message && !message.value.trim()) {
                showError(
                    message,
                    "Please enter your message."
                );
                valid = false;
            }

            if (!valid) return;

            const recipient =
                "info@syntaxcircuit.in";

            const mailSubject =
                subject && subject.value.trim()
                    ? subject.value.trim()
                    : "Enquiry from Syntax Circuit website";

            let body = "";

            body += `Name: ${name ? name.value.trim() : ""}\n`;
            body += `Email: ${email ? email.value.trim() : ""}\n`;

            if (phone && phone.value.trim()) {
                body += `Phone: ${phone.value.trim()}\n`;
            }

            body += "\nMessage:\n";
            body += message ? message.value.trim() : "";

            const mailto =
                `mailto:${recipient}` +
                `?subject=${encodeURIComponent(mailSubject)}` +
                `&body=${encodeURIComponent(body)}`;

            showFormSuccess(form);

            setTimeout(() => {
                window.location.href = mailto;
            }, 450);

        });

        function isValidEmail(value) {

            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                value.trim()
            );

        }

        function showError(field, message) {

            field.classList.add("error");

            const wrapper =
                field.closest(".form-field") ||
                field.parentElement;

            if (!wrapper) return;

            let error =
                $(".field-error", wrapper);

            if (!error) {

                error =
                    document.createElement("small");

                error.className =
                    "field-error";

                wrapper.appendChild(error);

            }

            error.textContent = message;

        }

        function clearFormErrors() {

            $$(".error", form).forEach((element) => {
                element.classList.remove("error");
            });

            $$(".field-error", form).forEach((element) => {
                element.remove();
            });

        }

        function showFormSuccess(formElement) {

            let message =
                $(".form-success", formElement);

            if (!message) {

                message =
                    document.createElement("div");

                message.className =
                    "form-success";

                formElement.appendChild(message);

            }

            message.innerHTML =
                `<i class="fa-solid fa-circle-check"></i>
                 <span>Opening your email client...</span>`;

            message.classList.add("visible");

        }

    }


    /* =========================================================
       12. PARALLAX BACKGROUND
       ========================================================= */

    function initParallax() {

        if (prefersReducedMotion) return;

        const blobs =
            $$(".hero-glow, .hero-orb, .parallax");

        if (!blobs.length) return;

        let ticking = false;

        const updateParallax = () => {

            const scrollY = window.scrollY;

            blobs.forEach((element, index) => {

                const speed =
                    parseFloat(
                        element.dataset.speed ||
                        (0.04 + index * 0.01)
                    );

                const movement =
                    scrollY * speed;

                element.style.transform =
                    `translate3d(0, ${movement}px, 0)`;

            });

            ticking = false;
        };

        on(window, "scroll", () => {

            if (!ticking) {

                requestAnimationFrame(
                    updateParallax
                );

                ticking = true;
            }

        }, { passive: true });

    }


    /* =========================================================
       13. CARD TILT EFFECT
       ========================================================= */

    function initTiltCards() {

        if (prefersReducedMotion) return;

        if (window.matchMedia("(hover: none)").matches) {
            return;
        }

        const cards =
            $$(".project-card, .course-card, .team-card, .tilt-card");

        cards.forEach((card) => {

            on(card, "mousemove", (event) => {

                const rect =
                    card.getBoundingClientRect();

                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;

                const centerX =
                    rect.width / 2;

                const centerY =
                    rect.height / 2;

                const rotateX =
                    ((y - centerY) / centerY) * -3;

                const rotateY =
                    ((x - centerX) / centerX) * 3;

                card.style.transform =
                    `perspective(1000px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translateY(-4px)`;

            });

            on(card, "mouseleave", () => {

                card.style.transform = "";

            });

        });

    }


    /* =========================================================
       14. MAGNETIC BUTTONS
       ========================================================= */

    function initMagneticButtons() {

        if (prefersReducedMotion) return;

        if (window.matchMedia("(hover: none)").matches) {
            return;
        }

        const buttons =
            $$(".button, .nav-actions .button");

        buttons.forEach((button) => {

            on(button, "mousemove", (event) => {

                const rect =
                    button.getBoundingClientRect();

                const x =
                    event.clientX -
                    rect.left -
                    rect.width / 2;

                const y =
                    event.clientY -
                    rect.top -
                    rect.height / 2;

                button.style.transform =
                    `translate(${x * 0.12}px, ${y * 0.12}px)`;

            });

            on(button, "mouseleave", () => {

                button.style.transform = "";

            });

        });

    }


    /* =========================================================
       15. TERMINAL ANIMATION
       ========================================================= */

    function initTerminal() {

        const terminal =
            $(".terminal-window");

        if (!terminal) return;

        const output =
            $(".terminal-output", terminal);

        if (!output) return;

        const lines = [
            "Initializing Syntax Circuit...",
            "Loading learning modules...",
            "Java Full Stack ........ READY",
            "Python & Django ....... READY",
            "Data Science .......... READY",
            "AI / ML Projects ...... READY",
            "Industry skills ....... READY",
            "System status: BUILD."
        ];

        if (prefersReducedMotion) {

            output.innerHTML =
                lines
                    .map(
                        (line) =>
                            `<div class="terminal-line">${escapeHTML(line)}</div>`
                    )
                    .join("");

            return;
        }

        output.innerHTML = "";

        let lineIndex = 0;

        const addLine = () => {

            if (lineIndex >= lines.length) {

                // Keep terminal alive and restart after pause
                setTimeout(() => {

                    output.innerHTML = "";
                    lineIndex = 0;
                    addLine();

                }, 5000);

                return;
            }

            const line =
                document.createElement("div");

            line.className =
                "terminal-line";

            line.textContent =
                lines[lineIndex];

            output.appendChild(line);

            lineIndex++;

            setTimeout(
                addLine,
                lineIndex === 1 ? 500 : 320
            );
        };

        setTimeout(addLine, 900);
    }


    /* =========================================================
       16. MARQUEE
       ========================================================= */

    function initMarquee() {

        const marquees =
            $$(".marquee-track");

        if (!marquees.length) return;

        marquees.forEach((track) => {

            // Duplicate content to create seamless movement
            const content =
                track.innerHTML;

            if (!track.dataset.duplicated) {

                track.innerHTML =
                    content + content;

                track.dataset.duplicated =
                    "true";

            }

        });
    }


    /* =========================================================
       17. ACTIVE NAVIGATION
       ========================================================= */

    function initActiveNavigation() {

        const sections =
            $$("main section[id]");

        const navLinks =
            $$(".desktop-nav .nav-link");

        if (!sections.length || !navLinks.length) {
            return;
        }

        const sectionMap = new Map();

        navLinks.forEach((link) => {

            const href =
                link.getAttribute("href");

            if (
                href &&
                href.startsWith("#")
            ) {
                sectionMap.set(
                    href.substring(1),
                    link
                );
            }

        });

        const observer =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        navLinks.forEach((link) => {
                            link.classList.remove("active");
                        });

                        const activeLink =
                            sectionMap.get(
                                entry.target.id
                            );

                        if (activeLink) {
                            activeLink.classList.add("active");
                        }

                    });

                },
                {
                    rootMargin:
                        "-35% 0px -55% 0px",
                    threshold: 0
                }
            );

        sections.forEach((section) => {
            observer.observe(section);
        });
    }


    /* =========================================================
       18. CURRENT YEAR
       ========================================================= */

    function initYear() {

        const yearElements =
            $$("[data-year]");

        const currentYear =
            new Date().getFullYear();

        yearElements.forEach((element) => {
            element.textContent =
                currentYear;
        });
    }


    /* =========================================================
       19. KEYBOARD ACCESSIBILITY
       ========================================================= */

    on(document, "keydown", (event) => {

        if (event.key !== "Tab") return;

        document.body.classList.add(
            "keyboard-navigation"
        );

    });


    on(document, "mousedown", () => {

        document.body.classList.remove(
            "keyboard-navigation"
        );

    });


    /* =========================================================
       20. IMAGE ERROR HANDLING
       ========================================================= */

    $$("img").forEach((image) => {

        on(image, "error", () => {

            image.classList.add("image-error");

            // Avoid broken-image visual dominating the layout
            image.setAttribute(
                "aria-hidden",
                "true"
            );

        });

    });


    /* =========================================================
       21. LAZY IMAGE EFFECT
       ========================================================= */

    const lazyImages =
        $$("img[loading='lazy']");

    if ("IntersectionObserver" in window) {

        const imageObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        const image =
                            entry.target;

                        image.classList.add(
                            "image-loaded"
                        );

                        observer.unobserve(image);

                    });

                },
                {
                    rootMargin: "100px"
                }
            );

        lazyImages.forEach((image) => {
            imageObserver.observe(image);
        });

    }


    /* =========================================================
       22. HERO MOUSE LIGHT
       ========================================================= */

    function initHeroLight() {

        if (prefersReducedMotion) return;

        const hero =
            $(".hero");

        if (!hero) return;

        if (window.matchMedia("(hover: none)").matches) {
            return;
        }

        on(hero, "mousemove", (event) => {

            const rect =
                hero.getBoundingClientRect();

            const x =
                ((event.clientX - rect.left) /
                    rect.width) *
                100;

            const y =
                ((event.clientY - rect.top) /
                    rect.height) *
                100;

            hero.style.setProperty(
                "--mouse-x",
                `${x}%`
            );

            hero.style.setProperty(
                "--mouse-y",
                `${y}%`
            );

        });

    }

    initHeroLight();


    /* =========================================================
       23. TEXT SCRAMBLE EFFECT
       ========================================================= */

    function initTextScramble() {

        if (prefersReducedMotion) return;

        const elements =
            $$("[data-scramble]");

        if (!elements.length) return;

        const chars =
            "!<>-_\\/[]{}—=+*^?#________";

        elements.forEach((element) => {

            const original =
                element.textContent;

            let frame = 0;

            const totalFrames =
                original.length * 3;

            const animate = () => {

                let output = "";

                for (
                    let i = 0;
                    i < original.length;
                    i++
                ) {

                    if (
                        original[i] === " "
                    ) {
                        output += " ";
                        continue;
                    }

                    const progress =
                        frame - i * 2;

                    if (progress > 8) {
                        output += original[i];
                    } else if (progress > 0) {
                        output +=
                            chars[
                                Math.floor(
                                    Math.random() *
                                    chars.length
                                )
                            ];
                    } else {
                        output += " ";
                    }

                }

                element.textContent =
                    output;

                frame++;

                if (frame <= totalFrames) {
                    requestAnimationFrame(
                        animate
                    );
                } else {
                    element.textContent =
                        original;
                }

            };

            // Start when visible
            const observer =
                new IntersectionObserver(
                    (entries, observerInstance) => {

                        if (
                            entries[0].isIntersecting
                        ) {

                            animate();

                            observerInstance.disconnect();
                        }

                    }
                );

            observer.observe(element);

        });
    }

    initTextScramble();


    /* =========================================================
       24. CURSOR TRAIL
       ========================================================= */

    function initCursorTrail() {

        if (prefersReducedMotion) return;

        if (
            window.matchMedia("(hover: none)")
                .matches
        ) {
            return;
        }

        let lastX = 0;
        let lastY = 0;
        let initialized = false;

        on(document, "mousemove", (event) => {

            if (!initialized) {

                lastX = event.clientX;
                lastY = event.clientY;

                initialized = true;

                return;
            }

            const distance =
                Math.hypot(
                    event.clientX - lastX,
                    event.clientY - lastY
                );

            if (distance < 60) return;

            const trail =
                document.createElement("span");

            trail.className =
                "cursor-trail";

            trail.style.left =
                `${event.clientX}px`;

            trail.style.top =
                `${event.clientY}px`;

            document.body.appendChild(
                trail
            );

            setTimeout(() => {
                trail.remove();
            }, 500);

            lastX = event.clientX;
            lastY = event.clientY;

        });

    }

    initCursorTrail();


    /* =========================================================
       25. UTILITY
       ========================================================= */

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent = value;

        return div.innerHTML;
    }


    /* =========================================================
       26. CONSOLE BRANDING
       ========================================================= */

    console.log(
        "%c Syntax Circuit ",
        "font-size:20px;font-weight:800;"
    );

    console.log(
        "%c Learn. Build. Grow. ",
        "font-size:13px;"
    );

})();
