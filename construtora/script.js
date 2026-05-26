const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const header = document.querySelector("header");


// MENU MOBILE
menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});


// ANIMAÇÕES
const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }

    });

});

const hiddenElements = document.querySelectorAll(
    ".card, .section-title, .projeto, .cta"
);

hiddenElements.forEach((el) => observer.observe(el));


// HEADER SOME QUANDO DESCE
let lastScroll = 0;

window.addEventListener("scroll", () => {

    const currentScroll =
    window.pageYOffset;

    // deixa header preto elegante
    if (currentScroll > 50) {
        header.style.background =
        "rgba(0,0,0,0.95)";
        header.style.boxShadow =
        "0 5px 20px rgba(0,0,0,0.3)";
    } else {
        header.style.background =
        "rgba(0,0,0,0.85)";
        header.style.boxShadow = "none";
    }

    // esconde descendo
    if(currentScroll > lastScroll
        && currentScroll > 100){

        header.style.transform =
        "translateY(-100%)";

    } else {

        header.style.transform =
        "translateY(0)";
    }

    lastScroll = currentScroll;

});