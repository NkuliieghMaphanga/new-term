document.addEventListener("DOMContentLoaded", () => {

    /*==============================================
        SMOOTH SCROLL
    ==============================================*/

    const navLinks = document.querySelectorAll(".sidebar a");

    navLinks.forEach(link => {

        link.addEventListener("click", function (e) {

            const href = this.getAttribute("href");

            if (!href.startsWith("#")) return;

            e.preventDefault();

            const section = document.querySelector(href);

            if (!section) return;

            window.scrollTo({

                top: section.offsetTop - 30,

                behavior: "smooth"

            });

        });

    });

    /*==============================================
        ACTIVE NAVIGATION
    ==============================================*/

    const sections = document.querySelectorAll("section");

    function highlightNavigation() {

        let current = "";

        sections.forEach(section => {

            const top = section.offsetTop - 150;

            const height = section.offsetHeight;

            if (window.scrollY >= top &&
                window.scrollY < top + height) {

                current = section.getAttribute("id");

            }

        });

        navLinks.forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href") === "#" + current) {

                link.classList.add("active");

            }

        });

    }

    window.addEventListener("scroll", highlightNavigation);

    highlightNavigation();

    /*==============================================
        SCROLL TO TOP BUTTON
    ==============================================*/

    const scrollBtn = document.getElementById("scrollTopBtn");

    function toggleScrollButton() {

        if (!scrollBtn) return;

        if (window.scrollY > 400) {

            scrollBtn.style.display = "flex";

        } else {

            scrollBtn.style.display = "none";

        }

    }

    window.addEventListener("scroll", toggleScrollButton);

    toggleScrollButton();

    if (scrollBtn) {

        scrollBtn.addEventListener("click", () => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        });

    }

});

/*==============================================
    KEYBOARD SUPPORT
==============================================*/

document.addEventListener("keydown", (event) => {

    const lightbox = document.querySelector(".lightbox");

    if (!lightbox) return;

    if (event.key === "Escape") {

        lightbox.classList.remove("active");

        document.body.style.overflow = "auto";

    }

});

/*==============================================
    REFRESH ACTIVE NAVIGATION
==============================================*/

window.addEventListener("load", () => {

    const event = new Event("scroll");

    window.dispatchEvent(event);

});

window.addEventListener("resize", () => {

    const event = new Event("scroll");

    window.dispatchEvent(event);

});

/*==============================================
    ACCESSIBILITY
==============================================*/

const allButtons = document.querySelectorAll(

    ".btn, .btn-outline, .sidebar a"

);

allButtons.forEach(button => {

    button.addEventListener("focus", () => {

        button.style.outline = "2px solid #00bfff";

        button.style.outlineOffset = "4px";

    });

    button.addEventListener("blur", () => {

        button.style.outline = "none";

    });

});

/*==============================================
    IMAGE PRELOADING
==============================================*/

const projectImages = document.querySelectorAll(".project-image");

projectImages.forEach(image => {

    const preload = new Image();

    preload.src = image.src;

});

/*==============================================
    CONSOLE MESSAGE
==============================================*/

console.log("%cGoogle Keep Case Study Loaded Successfully!",

    "color:#00bfff;font-size:16px;font-weight:bold;"

);

console.log("%cDesigned & Developed by Nonkululeko Mphoentle Maphanga",

    "color:white;font-size:13px;"

);

/*==============================================
    END OF CASE STUDY JAVASCRIPT
==============================================*/