/* =========================================================
   SYNTAX CIRCUIT — PREMIUM INTERACTION SYSTEM
   script.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =====================================================
       HELPERS
       ===================================================== */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* =====================================================
       PAGE LOADER
       ===================================================== */

    const pageLoader = $(".page-loader");

    if (pageLoader) {
        const hideLoader = () => {
            pageLoader.classList.add("loaded");

            setTimeout(() => {
                pageLoader.style.display = "none";
            }, 700);
        };

        if (document.readyState === "complete") {
            setTimeout(hideLoader, 250);
        } else {
            window.addEventListener("load", () => {
                setTimeout(hideLoader, 450);
            });
        }
    }


    /* =====================================================
       CUSTOM CURSOR
       ===================================================== */

    const cursorDot = $(".cursor-dot");
    const cursorOutline = $(".cursor-outline");

    if (
        cursorDot &&
        cursorOutline &&
        window.matchMedia("(pointer: fine)").matches &&
        !prefersReducedMotion
    ) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        let outlineX = mouseX;
        let outlineY = mouseY;

        document.addEventListener("mousemove", (event) => {
            mouseX = event.clientX;
            mouseY = event.clientY;

            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        const animateCursor = () => {
            outlineX += (mouseX - outlineX) * 0.14;
            outlineY += (mouseY - outlineY) * 0.14;

            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;

            requestAnimationFrame(animateCursor);
        };

        animateCursor();

        const interactiveElements = $$(
            "a, button, input, textarea, select, .course-row, .project-card, .faq-question"
        );

        interactiveElements.forEach((element) => {
            element.addEventListener("mouseenter", () => {
                document.body.classList.add("cursor-hover");
            });

            element.addEventListener("mouseleave", () => {
                document.body.classList.remove("cursor-hover");
            });
        });
    }


    /* =====================================================
       HEADER / NAVBAR
       ===================================================== */

    const header = $(".site-header");

    const updateHeader = () => {
        if (!header) return;

        if (window.scrollY > 30) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    };

    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );


    /* =====================================================
       MOBILE NAVIGATION
       ===================================================== */

    const menuToggle = $(".menu-toggle");
    const mobileMenu = $(".mobile-menu");

    if (menuToggle && mobileMenu) {
        const closeMobileMenu = () => {
            menuToggle.classList.remove("active");
            mobileMenu.classList.remove("active");
            document.body.classList.remove("menu-open");

            menuToggle.setAttribute("aria-expanded", "false");
        };

        menuToggle.addEventListener("click", () => {
            const isOpen = menuToggle.classList.toggle("active");

            mobileMenu.classList.toggle("active", isOpen);
            document.body.classList.toggle("menu-open", isOpen);

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });

        $$(".mobile-menu a", mobileMenu).forEach((link) => {
            link.addEventListener("click", closeMobileMenu);
        });

        document.addEventListener("click", (event) => {
            if (
                mobileMenu.classList.contains("active") &&
                !mobileMenu.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMobileMenu();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) {
                closeMobileMenu();
            }
        });
    }


    /* =====================================================
       ACTIVE NAVIGATION
       ===================================================== */

    const sections = $$("section[id]");
    const navLinks = $$(".desktop-nav .nav-link");

    if (sections.length && navLinks.length) {
        const updateActiveNavigation = () => {
            const scrollPosition = window.scrollY + 180;

            let currentSection = "";

            sections.forEach((section) => {
                const top = section.offsetTop;
                const height = section.offsetHeight;

                if (
                    scrollPosition >= top &&
                    scrollPosition < top + height
                ) {
                    currentSection = section.id;
                }
            });

            navLinks.forEach((link) => {
                const href = link.getAttribute("href");

                link.classList.toggle(
                    "active",
                    href === `#${currentSection}`
                );
            });
        };

        window.addEventListener(
            "scroll",
            updateActiveNavigation,
            { passive: true }
        );

        updateActiveNavigation();
    }


    /* =====================================================
       SMOOTH SCROLL
       ===================================================== */

    $$('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#" ||
                targetId.length < 2
            ) {
                return;
            }

            const target = $(targetId);

            if (!target) return;

            event.preventDefault();

            const headerHeight = header
                ? header.offsetHeight
                : 80;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight -
                20;

            window.scrollTo({
                top: targetPosition,
                behavior: prefersReducedMotion
                    ? "auto"
                    : "smooth"
            });
        });
    });


    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    const revealElements = $$(".reveal");

    if (revealElements.length) {
        if (
            "IntersectionObserver" in window &&
            !prefersReducedMotion
        ) {
            const revealObserver =
                new IntersectionObserver(
                    (entries, observer) => {
                        entries.forEach((entry) => {
                            if (!entry.isIntersecting) return;

                            entry.target.classList.add("revealed");

                            observer.unobserve(entry.target);
                        });
                    },
                    {
                        threshold: 0.12,
                        rootMargin: "0px 0px -60px 0px"
                    }
                );

            revealElements.forEach((element) => {
                revealObserver.observe(element);
            });
        } else {
            revealElements.forEach((element) => {
                element.classList.add("revealed");
            });
        }
    }


    /* =====================================================
       STAGGERED CHILD ANIMATIONS
       ===================================================== */

    $$(".course-list, .project-grid, .testimonial-grid, .tuition-grid").forEach(
        (container) => {
            const children = [...container.children];

            children.forEach((child, index) => {
                child.style.setProperty(
                    "--reveal-delay",
                    `${Math.min(index * 80, 500)}ms`
                );
            });
        }
    );


    /* =====================================================
       COUNTER ANIMATION
       ===================================================== */

    const counters = $$(".counter");

    const animateCounter = (element) => {
        const target = parseFloat(
            element.dataset.target ||
            element.textContent.replace(/[^\d.]/g, "") ||
            "0"
        );

        const suffix =
            element.dataset.suffix ||
            element.textContent.replace(/[\d.,\s]/g, "");

        const duration = 1600;
        const startTime = performance.now();

        const update = (currentTime) => {
            const progress = Math.min(
                (currentTime - startTime) / duration,
                1
            );

            const eased =
                1 - Math.pow(1 - progress, 3);

            const value = target * eased;

            if (Number.isInteger(target)) {
                element.textContent =
                    `${Math.floor(value)}${suffix}`;
            } else {
                element.textContent =
                    `${value.toFixed(1)}${suffix}`;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (Number.isInteger(target)) {
                    element.textContent =
                        `${target}${suffix}`;
                } else {
                    element.textContent =
                        `${target.toFixed(1)}${suffix}`;
                }
            }
        };

        requestAnimationFrame(update);
    };

    if (counters.length) {
        if ("IntersectionObserver" in window) {
            const counterObserver =
                new IntersectionObserver(
                    (entries, observer) => {
                        entries.forEach((entry) => {
                            if (!entry.isIntersecting) return;

                            animateCounter(entry.target);

                            observer.unobserve(entry.target);
                        });
                    },
                    {
                        threshold: 0.7
                    }
                );

            counters.forEach((counter) => {
                counterObserver.observe(counter);
            });
        } else {
            counters.forEach(animateCounter);
        }
    }


    /* =====================================================
       TERMINAL TYPING EFFECT
       ===================================================== */

    const terminalCode = $(".terminal-code");

    if (terminalCode && !prefersReducedMotion) {
        const originalHTML = terminalCode.innerHTML;

        terminalCode.innerHTML = "";
        terminalCode.style.opacity = "1";

        let index = 0;

        const typeTerminal = () => {
            if (index >= originalHTML.length) {
                terminalCode.innerHTML = originalHTML;
                return;
            }

            /*
             * Preserve HTML tags while typing visible text.
             */
            if (originalHTML[index] === "<") {
                const closingIndex =
                    originalHTML.indexOf(">", index);

                if (closingIndex !== -1) {
                    terminalCode.innerHTML +=
                        originalHTML.substring(
                            index,
                            closingIndex + 1
                        );

                    index = closingIndex + 1;
                    typeTerminal();
                    return;
                }
            }

            terminalCode.innerHTML += originalHTML[index];
            index++;

            setTimeout(
                typeTerminal,
                18
            );
        };

        setTimeout(typeTerminal, 700);
    }


    /* =====================================================
       FAQ ACCORDION
       ===================================================== */

    const faqItems = $$(".faq-item");

    faqItems.forEach((item) => {
        const question = $(".faq-question", item);
        const answer = $(".faq-answer", item);

        if (!question || !answer) return;

        question.setAttribute(
            "aria-expanded",
            item.classList.contains("active")
                ? "true"
                : "false"
        );

        question.addEventListener("click", () => {
            const isActive =
                item.classList.contains("active");

            /*
             * Close all other FAQ items.
             */
            faqItems.forEach((otherItem) => {
                if (otherItem === item) return;

                otherItem.classList.remove("active");

                const otherQuestion =
                    $(".faq-question", otherItem);

                const otherAnswer =
                    $(".faq-answer", otherItem);

                if (otherQuestion) {
                    otherQuestion.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }

                if (otherAnswer) {
                    otherAnswer.style.maxHeight = null;
                }
            });

            if (isActive) {
                item.classList.remove("active");

                question.setAttribute(
                    "aria-expanded",
                    "false"
                );

                answer.style.maxHeight = null;
            } else {
                item.classList.add("active");

                question.setAttribute(
                    "aria-expanded",
                    "true"
                );

                answer.style.maxHeight =
                    `${answer.scrollHeight}px`;
            }
        });
    });


    /* =====================================================
       THEME TOGGLE
       ===================================================== */

    const themeToggle = $(".theme-toggle");

    const savedTheme =
        localStorage.getItem("syntax-theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    const updateThemeIcon = () => {
        if (!themeToggle) return;

        const icon =
            $("i", themeToggle);

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
    };

    updateThemeIcon();

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const isDark =
                document.body.classList.toggle(
                    "dark-mode"
                );

            localStorage.setItem(
                "syntax-theme",
                isDark ? "dark" : "light"
            );

            updateThemeIcon();
        });
    }


    /* =====================================================
       HERO PARALLAX
       ===================================================== */

    const hero = $(".hero");

    if (
        hero &&
        !prefersReducedMotion &&
        window.matchMedia("(pointer: fine)").matches
    ) {
        const glow = $(".hero-glow");
        const orbit = $(".visual-orbit");

        hero.addEventListener("mousemove", (event) => {
            const rect =
                hero.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) /
                rect.width -
                0.5;

            const y =
                (event.clientY - rect.top) /
                rect.height -
                0.5;

            if (glow) {
                glow.style.transform =
                    `translate(${x * 35}px, ${y * 35}px)`;
            }

            if (orbit) {
                orbit.style.transform =
                    `translate(${x * -18}px, ${y * -18}px)`;
            }
        });

        hero.addEventListener("mouseleave", () => {
            if (glow) {
                glow.style.transform =
                    "translate(0, 0)";
            }

            if (orbit) {
                orbit.style.transform =
                    "translate(0, 0)";
            }
        });
    }


    /* =====================================================
       FLOATING CARDS TILT
       ===================================================== */

    const tiltElements = $$(
        ".floating-card, .terminal-window, .project-card"
    );

    if (
        tiltElements.length &&
        !prefersReducedMotion &&
        window.matchMedia("(pointer: fine)").matches
    ) {
        tiltElements.forEach((element) => {
            element.addEventListener(
                "mousemove",
                (event) => {
                    const rect =
                        element.getBoundingClientRect();

                    const x =
                        (event.clientX - rect.left) /
                        rect.width -
                        0.5;

                    const y =
                        (event.clientY - rect.top) /
                        rect.height -
                        0.5;

                    element.style.transform =
                        `perspective(1000px)
                         rotateX(${y * -3}deg)
                         rotateY(${x * 3}deg)
                         translateY(-3px)`;
                }
            );

            element.addEventListener(
                "mouseleave",
                () => {
                    element.style.transform = "";
                }
            );
        });
    }


    /* =====================================================
       MAGNETIC BUTTONS
       ===================================================== */

    const magneticButtons = $$(
        ".button-primary, .button-ghost"
    );

    if (
        !prefersReducedMotion &&
        window.matchMedia("(pointer: fine)").matches
    ) {
        magneticButtons.forEach((button) => {
            button.addEventListener(
                "mousemove",
                (event) => {
                    const rect =
                        button.getBoundingClientRect();

                    const x =
                        event.clientX -
                        (rect.left + rect.width / 2);

                    const y =
                        event.clientY -
                        (rect.top + rect.height / 2);

                    button.style.transform =
                        `translate(${x * 0.08}px, ${y * 0.08}px)`;
                }
            );

            button.addEventListener(
                "mouseleave",
                () => {
                    button.style.transform = "";
                }
            );
        });
    }


    /* =====================================================
       COURSE ROW INTERACTION
       ===================================================== */

    const courseRows = $$(".course-row");

    courseRows.forEach((row) => {
        row.addEventListener("mouseenter", () => {
            courseRows.forEach((other) => {
                if (other !== row) {
                    other.classList.add("dimmed");
                }
            });
        });

        row.addEventListener("mouseleave", () => {
            courseRows.forEach((other) => {
                other.classList.remove("dimmed");
            });
        });
    });


    /* =====================================================
       PROJECT CARD INTERACTION
       ===================================================== */

    $$(".project-card").forEach((card) => {
        card.addEventListener("mouseenter", () => {
            card.classList.add("project-active");
        });

        card.addEventListener("mouseleave", () => {
            card.classList.remove("project-active");
        });
    });


    /* =====================================================
       CONTACT FORM
       ===================================================== */

    const contactForm = $("#contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const name =
                $("#name", contactForm)?.value.trim() || "";

            const email =
                $("#email", contactForm)?.value.trim() || "";

            const phone =
                $("#phone", contactForm)?.value.trim() || "";

            const message =
                $("#message", contactForm)?.value.trim() || "";

            const course =
                $("#course", contactForm)?.value.trim() || "";

            const errors = [];

            if (name.length < 2) {
                errors.push("Please enter your name.");
            }

            if (
                !email ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            ) {
                errors.push(
                    "Please enter a valid email address."
                );
            }

            if (message.length < 5) {
                errors.push(
                    "Please enter a short message."
                );
            }

            if (errors.length) {
                showFormMessage(
                    contactForm,
                    errors.join(" "),
                    "error"
                );

                return;
            }

            const recipient =
                "info@syntaxcircuit.in";

            const subject =
                `New enquiry from ${name}`;

            const body = [
                `Name: ${name}`,
                `Email: ${email}`,
                `Phone: ${phone}`,
                `Course: ${course}`,
                "",
                "Message:",
                message
            ].join("\n");

            const mailto =
                `mailto:${recipient}` +
                `?subject=${encodeURIComponent(subject)}` +
                `&body=${encodeURIComponent(body)}`;

            window.location.href = mailto;

            showFormMessage(
                contactForm,
                "Opening your email application...",
                "success"
            );
        });
    }

    function showFormMessage(
        form,
        message,
        type
    ) {
        let messageElement =
            $(".form-message", form);

        if (!messageElement) {
            messageElement =
                document.createElement("div");

            messageElement.className =
                "form-message";

            form.appendChild(messageElement);
        }

        messageElement.textContent = message;
        messageElement.className =
            `form-message ${type}`;

        clearTimeout(
            messageElement._timeout
        );

        messageElement._timeout =
            setTimeout(() => {
                messageElement.classList.add(
                    "hide"
                );
            }, 5000);
    }


    /* =====================================================
       BACK TO TOP
       ===================================================== */

    const backTop = $(".back-top");

    if (backTop) {
        const updateBackTop = () => {
            backTop.classList.toggle(
                "visible",
                window.scrollY > 500
            );
        };

        updateBackTop();

        window.addEventListener(
            "scroll",
            updateBackTop,
            { passive: true }
        );

        backTop.addEventListener(
            "click",
            (event) => {
                event.preventDefault();

                window.scrollTo({
                    top: 0,
                    behavior: prefersReducedMotion
                        ? "auto"
                        : "smooth"
                });
            }
        );
    }


    /* =====================================================
       WHATSAPP BUTTON
       ===================================================== */

    const whatsappButton =
        $(".whatsapp-button");

    if (whatsappButton) {
        whatsappButton.addEventListener(
            "click",
            () => {
                /*
                 * Keep the destination from HTML.
                 * This prevents JS from overriding a
                 * manually configured WhatsApp URL.
                 */
                const href =
                    whatsappButton.getAttribute(
                        "href"
                    );

                if (!href || href === "#") {
                    console.warn(
                        "WhatsApp link is not configured."
                    );
                }
            }
        );
    }


    /* =====================================================
       MARQUEE PAUSE ON HOVER
       ===================================================== */

    $$(".marquee-section").forEach(
        (marquee) => {
            marquee.addEventListener(
                "mouseenter",
                () => {
                    marquee.classList.add(
                        "marquee-paused"
                    );
                }
            );

            marquee.addEventListener(
                "mouseleave",
                () => {
                    marquee.classList.remove(
                        "marquee-paused"
                    );
                }
            );
        }
    );


    /* =====================================================
       NUMBER / TEXT SCRAMBLE EFFECT
       ===================================================== */

    const scrambleElements =
        $$("[data-scramble]");

    if (
        scrambleElements.length &&
        !prefersReducedMotion
    ) {
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        scrambleElements.forEach((element) => {
            const original =
                element.textContent.trim();

            element.addEventListener(
                "mouseenter",
                () => {
                    let iteration = 0;

                    clearInterval(
                        element._scrambleInterval
                    );

                    element._scrambleInterval =
                        setInterval(() => {
                            element.textContent =
                                original
                                    .split("")
                                    .map(
                                        (letter, index) => {
                                            if (
                                                index <
                                                iteration
                                            ) {
                                                return original[
                                                    index
                                                ];
                                            }

                                            return characters[
                                                Math.floor(
                                                    Math.random() *
                                                    characters.length
                                                )
                                            ];
                                        }
                                    )
                                    .join("");

                            iteration += 0.7;

                            if (
                                iteration >=
                                original.length
                            ) {
                                clearInterval(
                                    element._scrambleInterval
                                );

                                element.textContent =
                                    original;
                            }
                        }, 30);
                }
            );
        });
    }


    /* =====================================================
       SCROLL PROGRESS
       ===================================================== */

    let progressBar =
        $(".scroll-progress");

    if (!progressBar) {
        progressBar =
            document.createElement("div");

        progressBar.className =
            "scroll-progress";

        document.body.appendChild(progressBar);
    }

    const updateScrollProgress = () => {
        const documentHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        if (documentHeight <= 0) {
            progressBar.style.width = "0%";
            return;
        }

        const progress =
            (window.scrollY / documentHeight) *
            100;

        progressBar.style.width =
            `${Math.min(progress, 100)}%`;
    };

    window.addEventListener(
        "scroll",
        updateScrollProgress,
        { passive: true }
    );

    updateScrollProgress();


    /* =====================================================
       KEYBOARD ACCESSIBILITY
       ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {
            /*
             * ESC closes mobile navigation.
             */
            if (
                event.key === "Escape" &&
                mobileMenu &&
                mobileMenu.classList.contains("active")
            ) {
                menuToggle?.click();
            }
        }
    );


    /* =====================================================
       IMAGE LAZY LOAD FALLBACK
       ===================================================== */

    $$("img").forEach((image) => {
        if (!image.hasAttribute("loading")) {
            image.setAttribute(
                "loading",
                "lazy"
            );
        }

        image.addEventListener(
            "error",
            () => {
                image.classList.add(
                    "image-error"
                );
            }
        );
    });


    /* =====================================================
       EXTERNAL LINKS
       ===================================================== */

    $$('a[href^="http"]').forEach((link) => {
        const url =
            link.getAttribute("href");

        if (
            url &&
            !url.includes(
                window.location.hostname
            )
        ) {
            link.setAttribute(
                "target",
                "_blank"
            );

            link.setAttribute(
                "rel",
                "noopener noreferrer"
            );
        }
    });


    /* =====================================================
       CURRENT YEAR
       ===================================================== */

    $$("[data-current-year]").forEach(
        (element) => {
            element.textContent =
                new Date().getFullYear();
        }
    );


    /* =====================================================
       VISIBILITY / TAB TITLE
       ===================================================== */

    const originalTitle =
        document.title;

    document.addEventListener(
        "visibilitychange",
        () => {
            if (
                document.hidden
            ) {
                document.title =
                    "Come back & keep building • Syntax Circuit";
            } else {
                document.title =
                    originalTitle;
            }
        }
    );


    /* =====================================================
       PERFORMANCE — DISABLE HEAVY EFFECTS ON MOBILE
       ===================================================== */

    const isMobile =
        window.matchMedia(
            "(max-width: 768px)"
        ).matches;

    if (isMobile) {
        document.body.classList.add(
            "is-mobile"
        );
    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    document.body.classList.add(
        "js-ready"
    );

    /*
     * Small delay ensures CSS transitions don't
     * fire before the page has initialized.
     */
    requestAnimationFrame(() => {
        document.body.classList.add(
            "page-ready"
        );
    });

    console.log(
        "%cSYNTAX CIRCUIT",
        "font-size:18px;font-weight:800;"
    );

    console.log(
        "%cLearn. Build. Grow.",
        "font-size:13px;"
    );
});
