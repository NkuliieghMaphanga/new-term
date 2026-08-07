/*==========================================
    CASE STUDY JAVASCRIPT
    Author: Nonkululeko Mphoentle Maphanga
==========================================*/

document.addEventListener("DOMContentLoaded", () => {

    initSmoothScrolling();

    initScrollReveal();

    initActiveSidebar();

    initBackToTop();

    initGalleryLightbox();

});

/*==========================================
    Smooth Scrolling
==========================================*/

function initSmoothScrolling(){

    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {

        link.addEventListener("click", function(e){

            const target = document.querySelector(this.getAttribute("href"));

            if(!target) return;

            e.preventDefault();

            target.scrollIntoView({

                behavior:"smooth",
                block:"start"

            });

        });

    });

}

/*==========================================
    Scroll Reveal Animation
==========================================*/

function initScrollReveal(){

    const cards = document.querySelectorAll(".card");

    const observer = new IntersectionObserver((entries)=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                entry.target.classList.add("show");

            }

        });

    },{

        threshold:.15

    });

    cards.forEach(card=>{

        card.classList.add("fade-up");

        observer.observe(card);

    });

}

/*==========================================
    Active Sidebar Navigation
==========================================*/

function initActiveSidebar(){

    const sections = document.querySelectorAll("section");

    const navLinks = document.querySelectorAll(".sidebar a");

    window.addEventListener("scroll",()=>{

        let current = "";

        sections.forEach(section=>{

            const sectionTop = section.offsetTop - 150;

            if(pageYOffset >= sectionTop){

                current = section.getAttribute("id");

            }

        });

        navLinks.forEach(link=>{

            link.classList.remove("active");

            if(link.getAttribute("href")==="#" + current){

                link.classList.add("active");

            }

        });

    });

}

/*==========================================
    Back To Top Button
==========================================*/

function initBackToTop(){

    const button = document.createElement("button");

    button.className = "back-to-top";

    button.innerHTML =

    '<i class="fas fa-arrow-up"></i>';

    document.body.appendChild(button);

    window.addEventListener("scroll",()=>{

        if(window.scrollY > 500){

            button.classList.add("show");

        }

        else{

            button.classList.remove("show");

        }

    });

    button.addEventListener("click",()=>{

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    });

}

/*==========================================
    Professional Gallery Lightbox
==========================================*/

function initGalleryLightbox(){

    const images = document.querySelectorAll(".gallery-grid img");

    if(images.length === 0) return;

    let currentImage = 0;

    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";

    lightbox.innerHTML = `

        <span class="lightbox-close">&times;</span>

        <button class="lightbox-prev">
            <i class="fas fa-chevron-left"></i>
        </button>

        <img src="" alt="Project Screenshot">

        <button class="lightbox-next">
            <i class="fas fa-chevron-right"></i>
        </button>

        <div class="lightbox-counter"></div>

    `;

    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector("img");

    const closeButton = lightbox.querySelector(".lightbox-close");

    const previousButton = lightbox.querySelector(".lightbox-prev");

    const nextButton = lightbox.querySelector(".lightbox-next");

    const counter = lightbox.querySelector(".lightbox-counter");

    function updateImage(index){

        currentImage = index;

        lightboxImage.src = images[currentImage].src;

        lightboxImage.alt = images[currentImage].alt;

        counter.textContent =
            `${currentImage + 1} / ${images.length}`;

    }

    images.forEach((image,index)=>{

        image.addEventListener("click",()=>{

            lightbox.classList.add("active");

            document.body.style.overflow = "hidden";

            updateImage(index);

        });

    });

    closeButton.addEventListener("click",closeLightbox);

    function closeLightbox(){

        lightbox.classList.remove("active");

        document.body.style.overflow = "auto";

    }

    previousButton.addEventListener("click",()=>{

        currentImage--;

        if(currentImage < 0){

            currentImage = images.length - 1;

        }

        updateImage(currentImage);

    });

    nextButton.addEventListener("click",()=>{

        currentImage++;

        if(currentImage >= images.length){

            currentImage = 0;

        }

        updateImage(currentImage);

    });

    lightbox.addEventListener("click",(event)=>{

        if(event.target === lightbox){

            closeLightbox();

        }

    });

    document.addEventListener("keydown",(event)=>{

        if(!lightbox.classList.contains("active")) return;

        switch(event.key){

            case "Escape":

                closeLightbox();

                break;

            case "ArrowLeft":

                previousButton.click();

                break;

            case "ArrowRight":

                nextButton.click();

                break;

        }

    });

}

/*==========================================
    Gallery Hover Animation
==========================================*/

const galleryImages = document.querySelectorAll(".gallery-grid img");

galleryImages.forEach(image=>{

    image.addEventListener("mouseenter",()=>{

        image.style.transform = "scale(1.05)";

    });

    image.addEventListener("mouseleave",()=>{

        image.style.transform = "scale(1)";

    });

});

/*==========================================
    Image Lazy Loading
==========================================*/

const lazyImages = document.querySelectorAll("img");

const lazyObserver = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("loaded");

        }

    });

});

lazyImages.forEach(image=>{

    lazyObserver.observe(image);

});

/*==========================================
    Hero Button Hover Effect
==========================================*/

const heroButtons = document.querySelectorAll(".btn, .btn-outline");

heroButtons.forEach(button=>{

    button.addEventListener("mouseenter",()=>{

        button.style.transform = "translateY(-4px)";

    });

    button.addEventListener("mouseleave",()=>{

        button.style.transform = "translateY(0)";

    });

});

/*==========================================
    Card Hover Effect
==========================================*/

const cards = document.querySelectorAll(".project-card, .info-card");

cards.forEach(card=>{

    card.addEventListener("mouseenter",()=>{

        card.style.transition = ".3s";

    });

});

/*==========================================
    Section Fade-In
==========================================*/

const sections = document.querySelectorAll("section");

const sectionObserver = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

},{
    threshold:.2
});

sections.forEach(section=>{

    sectionObserver.observe(section);

});

/*==========================================
    Animated Statistics Counter
==========================================*/

function animateCounters(){

    const counters = document.querySelectorAll("[data-count]");

    if(counters.length === 0) return;

    const observer = new IntersectionObserver((entries)=>{

        entries.forEach(entry=>{

            if(!entry.isIntersecting) return;

            const counter = entry.target;

            const target = Number(counter.dataset.count);

            let current = 0;

            const increment = Math.max(1, Math.ceil(target / 80));

            const timer = setInterval(()=>{

                current += increment;

                if(current >= target){

                    current = target;

                    clearInterval(timer);

                }

                counter.textContent = current;

            },20);

            observer.unobserve(counter);

        });

    },{

        threshold:0.6

    });

    counters.forEach(counter=>observer.observe(counter));

}

animateCounters();

/*==========================================
    Reading Progress Bar
==========================================*/

const progressBar = document.createElement("div");

progressBar.className = "reading-progress";

document.body.appendChild(progressBar);

window.addEventListener("scroll",()=>{

    const scrollTop = document.documentElement.scrollTop;

    const pageHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const progress = (scrollTop / pageHeight) * 100;

    progressBar.style.width = progress + "%";

});

/*==========================================
    Typing Effect
==========================================*/

const heroTitle = document.querySelector(".hero h1");

if(heroTitle){

    const text = heroTitle.textContent;

    heroTitle.textContent = "";

    let i = 0;

    function typeWriter(){

        if(i < text.length){

            heroTitle.textContent += text.charAt(i);

            i++;

            setTimeout(typeWriter,50);

        }

    }

    typeWriter();

}

/*==========================================
    Navbar Shadow
==========================================*/

window.addEventListener("scroll",()=>{

    const sidebar = document.querySelector(".sidebar");

    if(!sidebar) return;

    if(window.scrollY > 120){

        sidebar.style.boxShadow =
            "0 0 30px rgba(0,191,255,.55)";

    }

    else{

        sidebar.style.boxShadow =
            "0 0 20px rgba(0,191,255,.35)";

    }

});

/*==========================================
    Current Year
==========================================*/

const year = document.querySelector(".current-year");

if(year){

    year.textContent = new Date().getFullYear();

}

/*==========================================
    Console Message
==========================================*/

console.log(
"%cPortfolio Case Study Loaded Successfully",
"color:#00bfff;font-size:18px;font-weight:bold;"
);

/*==========================================
    Performance Optimization
==========================================*/

window.addEventListener("load",()=>{

    document.body.classList.add("loaded");

});

/*==========================================
    End of File
==========================================*/