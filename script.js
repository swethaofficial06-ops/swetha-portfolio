"use strict";

document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // 1. THEME SWITCHER
    // =====================================

    const themeButtons = document.querySelectorAll(".theme-button");

    const availableThemes = [
        "purple",
        "blue",
        "pink",
        "orange"
    ];

    function applyTheme(theme) {
        if (!availableThemes.includes(theme)) {
            theme = "purple";
        }

        document.body.dataset.theme = theme;

        themeButtons.forEach(function (button) {
            const isActive = button.dataset.theme === theme;

            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        try {
            localStorage.setItem("swethaTheme", theme);
        } catch (error) {
            // Theme still works if local storage is unavailable.
        }
    }

    themeButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            applyTheme(button.dataset.theme);
        });
    });

    try {
        applyTheme(localStorage.getItem("swethaTheme") || "purple");
    } catch (error) {
        applyTheme("purple");
    }


    // =====================================
    // 2. MOBILE NAVIGATION
    // =====================================

    const menuButton = document.getElementById("menuBtn");
    const navbar = document.getElementById("navbar");

    if (menuButton && navbar) {

        menuButton.addEventListener("click", function () {
            const isOpen = navbar.classList.toggle("open");

            menuButton.textContent = isOpen ? "✕" : "☰";
            menuButton.setAttribute("aria-expanded", String(isOpen));
            menuButton.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );
        });

        navbar.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navbar.classList.remove("open");
                menuButton.textContent = "☰";
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute("aria-label", "Open navigation");
            });
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 850) {
                navbar.classList.remove("open");
                menuButton.textContent = "☰";
                menuButton.setAttribute("aria-expanded", "false");
            }
        });
    }


    // =====================================
    // 3. SCROLL REVEAL ANIMATION
    // =====================================

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach(function (element, index) {
            element.style.transitionDelay = (index % 4) * 80 + "ms";
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(function (element) {
            element.classList.add("visible");
        });

    }


    // =====================================
    // 4. ANIMATED SKILL BARS
    // =====================================

    const skillCards = document.querySelectorAll(".skill-card");

    skillCards.forEach(function (card) {

        const value = Number(card.dataset.progress);
        const safeValue = Number.isFinite(value)
            ? Math.max(0, Math.min(100, value))
            : 0;

        const fill = card.querySelector(".skill-progress-fill");
        const percent = card.querySelector(".skill-percent");

        if (fill) {
            fill.dataset.width = safeValue + "%";
        }

        if (percent) {
            percent.textContent = safeValue + "%";
        }

        if (fill && "IntersectionObserver" in window) {

            const skillObserver = new IntersectionObserver(
                function (entries, observer) {

                    entries.forEach(function (entry) {

                        if (entry.isIntersecting) {
                            entry.target.style.width = entry.target.dataset.width;
                            observer.unobserve(entry.target);
                        }

                    });

                },
                {
                    threshold: 0.3
                }
            );

            skillObserver.observe(fill);

        } else if (fill) {
            fill.style.width = safeValue + "%";
        }

    });


    // =====================================
    // 5. FLOATING PARTICLES
    // =====================================

    const particleContainer = document.getElementById("particles");

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (particleContainer && !reduceMotion) {

        const particleCount = window.innerWidth < 600 ? 15 : 30;

        for (let i = 0; i < particleCount; i++) {

            const particle = document.createElement("span");

            particle.className = "particle";

            particle.style.left = Math.random() * 100 + "%";

            particle.style.setProperty(
                "--duration",
                (8 + Math.random() * 12) + "s"
            );

            particle.style.setProperty(
                "--delay",
                (-Math.random() * 15) + "s"
            );

            particle.style.setProperty(
                "--drift",
                (-70 + Math.random() * 140) + "px"
            );

            const size = 2 + Math.random() * 4;

            particle.style.width = size + "px";
            particle.style.height = size + "px";

            particleContainer.appendChild(particle);
        }

    }


    // =====================================
    // 6. 3D PROJECT CARD EFFECT
    // =====================================

    const projectCards = document.querySelectorAll(".project-card");

    const desktopPointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    if (desktopPointer && !reduceMotion) {

        projectCards.forEach(function (card) {

            card.addEventListener("mousemove", function (event) {

                const rect = card.getBoundingClientRect();

                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -3;
                const rotateY = ((x - centerX) / centerX) * 3;

                card.style.transform =
                    "perspective(1000px) rotateX(" +
                    rotateX +
                    "deg) rotateY(" +
                    rotateY +
                    "deg) translateY(-3px)";
            });

            card.addEventListener("mouseleave", function () {
                card.style.transform = "";
            });

        });

    }


    // =====================================
    // 7. BUTTON CLICK EFFECT
    // =====================================

    document.querySelectorAll(".btn").forEach(function (button) {

        button.addEventListener("pointerdown", function () {

            if (reduceMotion) return;

            button.animate(
                [
                    { transform: "scale(1)" },
                    { transform: "scale(0.97)" },
                    { transform: "scale(1)" }
                ],
                {
                    duration: 220,
                    easing: "ease-out"
                }
            );

        });

    });


    // =====================================
    // 8. BACK TO TOP
    // =====================================

    const backToTop = document.getElementById("backToTop");

    if (backToTop) {

        window.addEventListener("scroll", function () {

            backToTop.classList.toggle(
                "visible",
                window.scrollY > 400
            );

        });

        backToTop.addEventListener("click", function () {

            window.scrollTo({
                top: 0,
                behavior: reduceMotion ? "auto" : "smooth"
            });

        });

    }


    // =====================================
    // 9. CONTACT FORM VALIDATION
    // =====================================

    const contactForm = document.getElementById("contactForm");
    const contactStatus = document.getElementById("contactStatus");

    if (contactForm && contactStatus) {

        contactForm.addEventListener("submit", function (event) {

            event.preventDefault();

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            contactStatus.textContent =
                "Your form is valid, but email delivery has not been configured yet.";

            contactStatus.style.color = "var(--primary)";

        });

    }


    // =====================================
    // 10. CURRENT YEAR
    // =====================================

    const yearElement = document.getElementById("currentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    // =====================================
    // 11. ACTIVE NAVIGATION
    // =====================================

    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll("#navbar a");

    if ("IntersectionObserver" in window) {

        const sectionObserver = new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (!entry.isIntersecting) return;

                    navLinks.forEach(function (link) {

                        const active =
                            link.getAttribute("href") === "#" + entry.target.id;

                        if (active) {
                            link.setAttribute("aria-current", "location");
                        } else {
                            link.removeAttribute("aria-current");
                        }

                    });

                });

            },
            {
                rootMargin: "-25% 0px -60% 0px"
            }
        );

        sections.forEach(function (section) {
            sectionObserver.observe(section);
        });

    }


    // =====================================
    // 12. LOADING SCREEN
    // =====================================

    const loader = document.getElementById("loader");

    let loaderHidden = false;

    function hideLoader() {

        if (!loader || loaderHidden) return;

        loaderHidden = true;
        loader.classList.add("hidden");

        window.setTimeout(function () {
            if (loader.isConnected) {
                loader.remove();
            }
        }, 700);

    }

    if (document.readyState === "complete") {
        window.setTimeout(hideLoader, 300);
    } else {
        window.addEventListener(
            "load",
            function () {
                window.setTimeout(hideLoader, 300);
            },
            { once: true }
        );
    }

    window.setTimeout(hideLoader, 4000);


    // =====================================
    // 13. IMAGE LOADING FALLBACK
    // =====================================

    document.querySelectorAll("img").forEach(function (img) {

        img.addEventListener("error", function () {

            img.style.opacity = "0.35";
            img.style.backgroundColor = "var(--surface)";
            img.setAttribute("title", "Image unavailable. Check your internet connection.");

        });

    });


    console.log("Swetha Portfolio loaded successfully!");

});