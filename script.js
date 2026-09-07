/* Smooth scrolling for sidebar links */
document.querySelectorAll(".sidebar a").forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    });
});

/* Education carousel */
const slides = document.querySelectorAll(".education-slide");
const indicators = document.querySelectorAll(".indicator");
const nextButton = document.querySelector(".next-btn");
const prevButton = document.querySelector(".prev-btn");

let currentSlide = 0;

function displaySlide(index) {
    slides.forEach(slide => slide.classList.remove("active"));
    indicators.forEach(indicator => indicator.classList.remove("active"));

    if (slides[index]) {
        slides[index].classList.add("active");
    }
    if (indicators[index]) {
        indicators[index].classList.add("active");
    }
}

if (nextButton && prevButton && slides.length) {
    nextButton.addEventListener("click", () => {
        currentSlide = (currentSlide + 1) % slides.length;
        displaySlide(currentSlide);
    });

    prevButton.addEventListener("click", () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        displaySlide(currentSlide);
    });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener("click", () => {
            currentSlide = index;
            displaySlide(currentSlide);
        });
    });

    // Auto play
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        displaySlide(currentSlide);
    }, 5000);
}

/* Contact form feedback */
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", function () {
        // FormSubmit handles the actual send; this is just UX feedback
        setTimeout(() => {
            alert("Thank you! Your message has been sent successfully.");
        }, 300);
    });
}
