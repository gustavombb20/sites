/**
 * POWERFIT GYM - COMPORTAMENTOS E INTERATIVIDADE (JS PURO)
 * --------------------------------------------------------------------------
 * Desenvolvido de forma moderna, limpa e modular.
 */

document.addEventListener("DOMContentLoaded", () => {
    // Inicializar módulos
    initMobileMenu();
    initScrollHeader();
    initScrollReveal();
    initStatsCounter();
    initBackToTop();
    initContactForm();
});

/**
 * 1. MENU MOBILE (HAMBÚRGUER & DRAWER)
 */
function initMobileMenu() {
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (!navToggle || !navMenu) return;

    // Toggle menu state on click
    navToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        navToggle.classList.toggle("active");
        navMenu.classList.toggle("active");
        
        // Bloquear scroll do body quando menu estiver ativo
        if (navMenu.classList.contains("active")) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navToggle.classList.remove("active");
            navMenu.classList.remove("active");
            document.body.style.overflow = "";
        });
    });

    // Close menu when clicking outside of the drawer
    document.addEventListener("click", (e) => {
        if (navMenu.classList.contains("active") && !navMenu.contains(e.target) && e.target !== navToggle) {
            navToggle.classList.remove("active");
            navMenu.classList.remove("active");
            document.body.style.overflow = "";
        }
    });
}

/**
 * 2. COMPORTAMENTO HEADER AO ROLAR A PÁGINA (SCROLL CLASS)
 */
function initScrollHeader() {
    const header = document.getElementById("header");
    const sections = document.querySelectorAll("section[id]");
    
    if (!header) return;

    const handleScroll = () => {
        const scrollY = window.scrollY;

        // Adicionar background preto e borda vermelha após 80px de scroll
        if (scrollY > 80) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        // Destaque de Link Ativo no Menu conforme a seção visível
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120; // offset do header fixo
            const sectionId = section.getAttribute("id");
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add("active");
                } else {
                    navLink.classList.remove("active");
                }
            }
        });
    };

    window.addEventListener("scroll", handleScroll);
    // Disparar uma vez no load para garantir estado correto se a página recarregar no meio
    handleScroll();
}

/**
 * 3. ANIMAÇÃO DE ENTRADA AO ROLAR A PÁGINA (REVEAL ON SCROLL)
 * Utiliza Intersection Observer para máxima performance.
 */
function initScrollReveal() {
    const reveals = document.querySelectorAll(".reveal");
    
    if (reveals.length === 0) return;

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal-visible");
                // Parar de observar após animar (efeito roda apenas uma vez)
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, // Gatilho dispara quando 15% do elemento estiver visível
        rootMargin: "0px 0px -50px 0px" // Pequena margem de segurança no fundo da tela
    });

    reveals.forEach(element => {
        revealObserver.observe(element);
    });
}

/**
 * 4. ANIMAÇÃO DE CONTADORES NUMÉRICOS (ESTATÍSTICAS)
 */
function initStatsCounter() {
    const statsSection = document.querySelector(".about");
    const statNumbers = document.querySelectorAll(".stat-number");
    
    if (!statsSection || statNumbers.length === 0) return;

    let animated = false;

    const animateCounters = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute("data-target"), 10);
            const prefix = stat.getAttribute("data-prefix") || "";
            const duration = 2000; // Tempo de animação em ms
            const stepTime = Math.abs(Math.floor(duration / target));
            let current = 0;

            const increment = target / (duration / 16); // ~60fps
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = prefix + target;
                    clearInterval(timer);
                } else {
                    stat.textContent = prefix + Math.floor(current);
                }
            }, 1000 / 60);
        });
    };

    // Observer para disparar apenas quando a seção Sobre (onde ficam os status) entrar na viewport
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animateCounters();
                animated = true; // Impedir que anime novamente ao re-entrar
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
}

/**
 * 5. BOTÃO VOLTAR AO TOPO (BACK TO TOP)
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById("backToTop");
    
    if (!backToTopBtn) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 600) {
            backToTopBtn.classList.add("active");
        } else {
            backToTopBtn.classList.remove("active");
        }
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

/**
 * 6. FORMULÁRIO DE CONTATO COM FEEDBACK PREMIUM (TOAST)
 */
function initContactForm() {
    const form = document.getElementById("contactForm");
    
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Recuperar campos
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !message) {
            showToast("Por favor, preencha todos os campos obrigatórios.", "error");
            return;
        }

        // Alterar estado do botão para simular carregamento
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff" style="animation: rotate 1s linear infinite;">
                <g fill="none" fill-rule="evenodd">
                    <g transform="translate(1 1)" stroke-width="2">
                        <circle stroke-opacity=".5" cx="18" cy="18" r="18"/>
                        <path d="M36 18c0-9.94-8.06-18-18-18"/>
                    </g>
                </g>
            </svg> Enviando...
        `;

        // Estilo inline para animar a rotação do spinner de loading
        if (!document.getElementById("spinnerStyle")) {
            const style = document.createElement("style");
            style.id = "spinnerStyle";
            style.textContent = "@keyframes rotate { 100% { transform: rotate(360deg); } }";
            document.head.appendChild(style);
        }

        // Simular envio de API de 1.5 segundos
        setTimeout(() => {
            // Sucesso
            showToast(`Obrigado, ${name}! Sua mensagem foi enviada com sucesso. Nossa equipe entrará em contato em breve!`, "success");
            
            // Resetar formulário e botão
            form.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            // Remover estado de foco flutuante dos labels do formulário
            const inputs = form.querySelectorAll(".form-input");
            inputs.forEach(input => {
                input.blur();
            });
        }, 1500);
    });
}

/**
 * EXTRAS: SISTEMA DE TOAST PREMIUM (Notificações Flutuantes Glassmorphism)
 */
function showToast(message, type = "success") {
    // Remover toast anterior se existir
    const activeToast = document.querySelector(".toast-notification");
    if (activeToast) activeToast.remove();

    // Criar container do Toast
    const toast = document.createElement("div");
    toast.className = `toast-notification toast-${type}`;
    
    // SVG de ícone dependendo do tipo
    let iconSvg = "";
    if (type === "success") {
        iconSvg = `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    } else {
        iconSvg = `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;
    }

    toast.innerHTML = `
        <div class="toast-icon">${iconSvg}</div>
        <div class="toast-message">${message}</div>
    `;

    // Estilos dinâmicos do Toast para evitar poluição no arquivo CSS principal
    Object.assign(toast.style, {
        position: "fixed",
        bottom: "40px",
        left: "50%",
        transform: "translateX(-50%) translateY(100px)",
        background: type === "success" ? "rgba(23, 23, 23, 0.9)" : "rgba(180, 40, 40, 0.9)",
        color: "#fff",
        padding: "1rem 2rem",
        borderRadius: "50px",
        boxShadow: type === "success" ? "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(230, 57, 70, 0.15)" : "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(180, 40, 40, 0.3)",
        border: type === "success" ? "1px solid rgba(230, 57, 70, 0.25)" : "1px solid rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(12px)",
        webkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        zIndex: "9999",
        transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s",
        opacity: "0",
        maxWidth: "90%",
        width: "max-content",
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.95rem",
        fontWeight: "500",
        boxSizing: "border-box"
    });

    // Injetar no Body
    document.body.appendChild(toast);

    // Adicionar estilos de cor do ícone
    const iconWrapper = toast.querySelector(".toast-icon");
    if (iconWrapper) {
        iconWrapper.style.color = type === "success" ? "#E63946" : "#fff";
        iconWrapper.style.display = "flex";
        iconWrapper.style.alignItems = "center";
    }

    // Acionar animação de subida (Force reflow)
    setTimeout(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateX(-50%) translateY(0)";
    }, 50);

    // Remover automaticamente após 4.5 segundos
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(100px)";
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 4500);
}
