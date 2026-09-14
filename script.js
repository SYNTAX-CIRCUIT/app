/* =========================================================
   SYNTAX CIRCUIT
   Main JavaScript
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     PRELOADER
  ======================================================== */

  const preloader = document.getElementById("preloader");

  if (preloader) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        preloader.classList.add("hidden");
      }, 700);
    });
  }


  /* =======================================================
     CUSTOM CURSOR
  ======================================================== */

  const cursor = document.getElementById("cursor");
  const cursorRing = document.getElementById("cursorRing");

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  let ringX = mouseX;
  let ringY = mouseY;

  if (cursor && cursorRing) {

    document.addEventListener("mousemove", (e) => {

      mouseX = e.clientX;
      mouseY = e.clientY;

      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;

    });


    const animateCursorRing = () => {

      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;

      requestAnimationFrame(animateCursorRing);
    };

    animateCursorRing();


    const interactiveElements = document.querySelectorAll(
      "a, button, input, textarea, .course-card, .project-card, .why-card, .team-card, .faq-item"
    );

    interactiveElements.forEach((element) => {

      element.addEventListener("mouseenter", () => {
        cursor.classList.add("active");
        cursorRing.classList.add("active");
      });

      element.addEventListener("mouseleave", () => {
        cursor.classList.remove("active");
        cursorRing.classList.remove("active");
      });

    });

  }


  /* =======================================================
     NAVBAR SCROLL EFFECT
  ======================================================== */

  const navbar = document.querySelector(".navbar");

  const handleNavbarScroll = () => {

    if (!navbar) return;

    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

  };

  window.addEventListener("scroll", handleNavbarScroll);

  handleNavbarScroll();


  /* =======================================================
     BACK TO TOP
  ======================================================== */

  const backToTop = document.getElementById("backToTop");

  const handleBackToTop = () => {

    if (!backToTop) return;

    if (window.scrollY > 500) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }

  };

  window.addEventListener("scroll", handleBackToTop);

  handleBackToTop();


  if (backToTop) {

    backToTop.addEventListener("click", (e) => {

      e.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    });

  }


  /* =======================================================
     SCROLL REVEAL
  ======================================================== */

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add("visible");

            observer.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );


    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });

  } else {

    revealElements.forEach((element) => {
      element.classList.add("visible");
    });

  }


  /* =======================================================
     COUNTER ANIMATION
  ======================================================== */

  const counters = document.querySelectorAll("[data-count]");

  const animateCounter = (element) => {

    const target = parseInt(
      element.getAttribute("data-count"),
      10
    );

    const suffix =
      element.getAttribute("data-suffix") || "";

    if (Number.isNaN(target)) return;

    const duration = 1500;

    const startTime = performance.now();


    const updateCounter = (currentTime) => {

      const elapsed = currentTime - startTime;

      const progress = Math.min(
        elapsed / duration,
        1
      );


      /* Ease-out cubic */
      const eased =
        1 - Math.pow(1 - progress, 3);

      const currentValue = Math.floor(
        eased * target
      );


      element.textContent =
        currentValue.toLocaleString() + suffix;


      if (progress < 1) {

        requestAnimationFrame(updateCounter);

      } else {

        element.textContent =
          target.toLocaleString() + suffix;

      }

    };


    requestAnimationFrame(updateCounter);

  };


  if ("IntersectionObserver" in window) {

    const counterObserver = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            animateCounter(entry.target);

            observer.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.5
      }
    );


    counters.forEach((counter) => {
      counterObserver.observe(counter);
    });

  } else {

    counters.forEach((counter) => {
      animateCounter(counter);
    });

  }


  /* =======================================================
     DARK MODE
  ======================================================== */

  const darkModeToggle =
    document.getElementById("darkModeToggle");

  const darkModeIcon =
    document.getElementById("darkModeIcon");


  const updateDarkModeIcon = () => {

    if (!darkModeIcon) return;

    if (document.body.classList.contains("dark-mode")) {

      darkModeIcon.classList.remove("fa-moon");

      darkModeIcon.classList.add("fa-sun");

    } else {

      darkModeIcon.classList.remove("fa-sun");

      darkModeIcon.classList.add("fa-moon");

    }

  };


  const savedTheme =
    localStorage.getItem("syntaxCircuitTheme");


  if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

  }


  updateDarkModeIcon();


  if (darkModeToggle) {

    darkModeToggle.addEventListener("click", () => {

      document.body.classList.toggle("dark-mode");


      const isDark =
        document.body.classList.contains("dark-mode");


      localStorage.setItem(
        "syntaxCircuitTheme",
        isDark ? "dark" : "light"
      );


      updateDarkModeIcon();

    });

  }


  /* =======================================================
     FAQ ACCORDION
  ======================================================== */

  const faqItems =
    document.querySelectorAll(".faq-item");


  faqItems.forEach((item) => {

    const question =
      item.querySelector(".faq-question");

    if (!question) return;


    question.addEventListener("click", () => {

      const isOpen =
        item.classList.contains("open");


      /*
       * Close all other FAQ items
       */
      faqItems.forEach((otherItem) => {

        if (otherItem !== item) {

          otherItem.classList.remove("open");

        }

      });


      /*
       * Toggle selected FAQ
       */
      if (isOpen) {

        item.classList.remove("open");

      } else {

        item.classList.add("open");

      }

    });

  });


  /* =======================================================
     CONTACT FORM VALIDATION
  ======================================================== */

  const contactForm =
    document.getElementById("contactForm");

  const submitBtn =
    document.getElementById("submitBtn");

  const formSuccess =
    document.getElementById("formSuccess");


  const nameInput =
    document.getElementById("name");

  const phoneInput =
    document.getElementById("phone");

  const emailInput =
    document.getElementById("email");

  const messageInput =
    document.getElementById("message");


  const nameError =
    document.getElementById("nameError");

  const phoneError =
    document.getElementById("phoneError");

  const emailError =
    document.getElementById("emailError");

  const messageError =
    document.getElementById("messageError");


  const setError = (input, error) => {

    if (input) {
      input.classList.add("error");
    }

    if (error) {
      error.classList.add("show");
    }

  };


  const clearError = (input, error) => {

    if (input) {
      input.classList.remove("error");
    }

    if (error) {
      error.classList.remove("show");
    }

  };


  const validateName = () => {

    if (!nameInput) return true;

    const valid =
      nameInput.value.trim().length >= 2;


    if (!valid) {

      setError(nameInput, nameError);

    } else {

      clearError(nameInput, nameError);

    }


    return valid;

  };


  const validatePhone = () => {

    if (!phoneInput) return true;

    const phone =
      phoneInput.value.replace(/\D/g, "");


    const valid =
      /^[0-9]{10}$/.test(phone);


    if (!valid) {

      setError(phoneInput, phoneError);

    } else {

      clearError(phoneInput, phoneError);

    }


    return valid;

  };


  const validateEmail = () => {

    if (!emailInput) return true;

    const email =
      emailInput.value.trim();


    const valid =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


    if (!valid) {

      setError(emailInput, emailError);

    } else {

      clearError(emailInput, emailError);

    }


    return valid;

  };


  const validateMessage = () => {

    if (!messageInput) return true;

    const valid =
      messageInput.value.trim().length >= 5;


    if (!valid) {

      setError(messageInput, messageError);

    } else {

      clearError(messageInput, messageError);

    }


    return valid;

  };


  if (nameInput) {

    nameInput.addEventListener(
      "input",
      validateName
    );

  }


  if (phoneInput) {

    phoneInput.addEventListener(
      "input",
      () => {

        /*
         * Keep only digits
         */
        phoneInput.value =
          phoneInput.value
            .replace(/\D/g, "")
            .slice(0, 10);

        validatePhone();

      }
    );

  }


  if (emailInput) {

    emailInput.addEventListener(
      "input",
      validateEmail
    );

  }


  if (messageInput) {

    messageInput.addEventListener(
      "input",
      validateMessage
    );

  }


  if (contactForm) {

    contactForm.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();


        const validName =
          validateName();

        const validPhone =
          validatePhone();

        const validEmail =
          validateEmail();

        const validMessage =
          validateMessage();


        const isValid =
          validName &&
          validPhone &&
          validEmail &&
          validMessage;


        if (!isValid) {

          const firstError =
            contactForm.querySelector(".error");


          if (firstError) {

            firstError.focus();

          }


          return;

        }


        if (submitBtn) {

          submitBtn.disabled = true;

          submitBtn.classList.add("loading");

        }


        /*
         * Prepare email information
         */
        const name =
          nameInput.value.trim();

        const phone =
          phoneInput.value.trim();

        const email =
          emailInput.value.trim();

        const message =
          messageInput.value.trim();


        const subject =
          encodeURIComponent(
            `Syntax Circuit Enquiry from ${name}`
          );


        const body =
          encodeURIComponent(
`Hello Syntax Circuit,

Name: ${name}
WhatsApp Number: ${phone}
Email: ${email}

Message:
${message}

Regards,
${name}`
          );


        /*
         * Give the UI a short moment
         * before opening the email client.
         */
        setTimeout(() => {

          if (submitBtn) {

            submitBtn.disabled = false;

            submitBtn.classList.remove(
              "loading"
            );

          }


          if (formSuccess) {

            formSuccess.classList.add("show");

          }


          window.location.href =
            `mailto:info@syntaxcircuit.in?subject=${subject}&body=${body}`;


          setTimeout(() => {

            if (formSuccess) {

              formSuccess.classList.remove(
                "show"
              );

            }

          }, 5000);


        }, 700);

      }
    );

  }


  /* =======================================================
     PARALLAX HERO BLOBS
  ======================================================== */

  const blobs =
    document.querySelectorAll(".hero-glow");


  if (
    blobs.length &&
    window.matchMedia("(hover: hover)").matches
  ) {

    document.addEventListener(
      "mousemove",
      (event) => {

        const x =
          (event.clientX / window.innerWidth) -
          0.5;

        const y =
          (event.clientY / window.innerHeight) -
          0.5;


        blobs.forEach((blob, index) => {

          const intensity =
            (index + 1) * 10;


          blob.style.transform =
            `translate(
              ${x * intensity}px,
              ${y * intensity}px
            )`;

        });

      }
    );

  }


  /* =======================================================
     SMOOTH ANCHOR SCROLLING
  ======================================================== */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {

      link.addEventListener("click", (event) => {

        const href =
          link.getAttribute("href");


        if (
          !href ||
          href === "#" ||
          href.length <= 1
        ) {

          return;

        }


        const target =
          document.querySelector(href);


        if (!target) return;


        event.preventDefault();


        const offset = 80;

        const targetPosition =
          target.getBoundingClientRect().top +
          window.scrollY -
          offset;


        window.scrollTo({

          top: targetPosition,

          behavior: "smooth"

        });

      });

    });


  /* =======================================================
     CLOSE MOBILE NAV ON CLICK
  ======================================================== */

  document
    .querySelectorAll("#nav .nav-link")
    .forEach((link) => {

      link.addEventListener("click", () => {

        const navCollapse =
          document.getElementById("nav");


        if (!navCollapse) return;


        /*
         * Bootstrap 5 collapse instance
         */
        if (
          typeof bootstrap !== "undefined" &&
          bootstrap.Collapse
        ) {

          const bsCollapse =
            bootstrap.Collapse.getInstance(
              navCollapse
            );


          if (bsCollapse) {

            bsCollapse.hide();

          }

        }

      });

    });


  /* =======================================================
     PAUSE TICKER WHEN HOVERED
  ======================================================== */

  const ticker =
    document.querySelector(".ticker-track");


  if (ticker) {

    const tickerWrap =
      document.querySelector(".ticker-wrap");


    if (tickerWrap) {

      tickerWrap.addEventListener(
        "mouseenter",
        () => {
          ticker.style.animationPlayState =
            "paused";
        }
      );


      tickerWrap.addEventListener(
        "mouseleave",
        () => {
          ticker.style.animationPlayState =
            "running";
        }
      );

    }

  }


  /* =======================================================
     EXTERNAL LINKS
  ======================================================== */

  document
    .querySelectorAll('a[href^="http"]')
    .forEach((link) => {

      /*
       * Do not modify WhatsApp links.
       * They should open normally.
       */
      if (
        link.href.includes("wa.me")
      ) {
        return;
      }


      link.setAttribute(
        "target",
        "_blank"
      );

      link.setAttribute(
        "rel",
        "noopener noreferrer"
      );

    });


  /* =======================================================
     KEYBOARD ACCESSIBILITY
  ======================================================== */

  document.addEventListener(
    "keydown",
    (event) => {

      /*
       * Escape closes all open FAQ items
       */
      if (event.key === "Escape") {

        faqItems.forEach((item) => {

          item.classList.remove("open");

        });

      }

    }
  );


  /* =======================================================
     INITIAL PAGE STATE
  ======================================================== */

  document.body.classList.add("page-ready");

});
