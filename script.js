/* ===========================
   Smooth Scrolling
=========================== */

document.querySelectorAll(".sidebar a").forEach(link => {

    link.addEventListener("click", function(e){

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if(target){

            target.scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});

/*=================================
        EDUCATION CAROUSEL
==================================*/

const slides = document.querySelectorAll(".education-slide");
const indicators = document.querySelectorAll(".indicator");

const nextButton = document.querySelector(".next-btn");
const prevButton = document.querySelector(".prev-btn");

let currentSlide = 0;

function displaySlide(index){

    slides.forEach(slide=>{

        slide.classList.remove("active");

    });

    indicators.forEach(indicator=>{

        indicator.classList.remove("active");

    });

    slides[index].classList.add("active");

    indicators[index].classList.add("active");

}

// Next
nextButton.addEventListener("click",()=>{

    currentSlide++;

    if(currentSlide >= slides.length){

        currentSlide = 0;

    }

    displaySlide(currentSlide);

});

// Previous
prevButton.addEventListener("click",()=>{

    currentSlide--;

    if(currentSlide < 0){

        currentSlide = slides.length - 1;

    }

    displaySlide(currentSlide);

});

// Indicators
indicators.forEach((indicator,index)=>{

    indicator.addEventListener("click",()=>{

        currentSlide = index;

        displaySlide(currentSlide);

    });

});

// Auto Play
setInterval(()=>{

    currentSlide++;

    if(currentSlide >= slides.length){

        currentSlide = 0;

    }

    displaySlide(currentSlide);

},5000);

/* ===========================
   Contact Form
=========================== */

const contactForm = document.querySelector(".contact-form");

if(contactForm){

    contactForm.addEventListener("submit", function(){

        alert("Thank you! Your message has been sent successfully.");

    });

}