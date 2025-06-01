// Handle heart/favorite button
document.querySelectorAll('.icon-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.querySelector('.fa-heart')) {
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#ff6b6b';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '#666';
            }
        }
    });
});

// Função para verificar se o usuário está logado
function isUserLoggedIn() {
    // Aqui você pode implementar sua lógica de verificação de login
    // Por exemplo, verificar se existe um token no localStorage, cookie, etc.
    // Por agora, vamos assumir que o usuário não está logado (você pode ajustar isso)
    return false; // Mude para true se quiser testar como usuário logado
}

// Handle reserve button
document.querySelector('.reserve-btn').addEventListener('click', function(e) {
    e.preventDefault();
    
    if (!isUserLoggedIn()) {
        alert('Por favor, faça login primeiro');
        // Redirecionar para página de login
        window.location.href = 'login.html'; // Ajuste o caminho conforme sua estrutura
    } else {
        // Se estiver logado, prosseguir com a reserva
        window.location.href = 'reserva-form.html';
    }
});

// Handle show more reviews button - removido o alert
document.querySelector('.show-more-btn').addEventListener('click', function() {
    // Aqui você pode implementar a funcionalidade real de carregar mais comentários
    // Por exemplo, fazer uma requisição AJAX ou mostrar comentários ocultos
    console.log('Carregando mais comentários...');
});

// Handle view map button - removido o alert e adicionado link do Google Maps
document.querySelector('.view-map-btn').addEventListener('click', function() {
    window.open('https://www.google.com/maps/place/41%C2%B009\'10.2%22N+8%C2%B037\'55.0%22W/@41.152837,-8.6348941,17z/data=!3m1!4b1!4m13!1m8!3m7!1s0xd24650b47f65075:0xc88efe2e1a5ce3be!2sRua+do+Campo+Alegre,+Porto!3b1!8m2!3d41.1528295!4d-8.6375316!16s%2Fg%2F119vl1183!3m3!8m2!3d41.152837!4d-8.63193?entry=ttu&g_ep=EgoyMDI1MDUyOC4wIKXMDSoASAFQAw%3D%3D', '_blank');
});

// Handle map image click - novo
document.querySelector('.map-img').addEventListener('click', function() {
    window.open('https://www.google.com/maps/place/41%C2%B009\'10.2%22N+8%C2%B037\'55.0%22W/@41.152837,-8.6348941,17z/data=!3m1!4b1!4m13!1m8!3m7!1s0xd24650b47f65075:0xc88efe2e1a5ce3be!2sRua+do+Campo+Alegre,+Porto!3b1!8m2!3d41.1528295!4d-8.6375316!16s%2Fg%2F119vl1183!3m3!8m2!3d41.152837!4d-8.63193?entry=ttu&g_ep=EgoyMDI1MDUyOC4wIKXMDSoASAFQAw%3D%3D', '_blank');
});

// Add smooth scrolling for any potential anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add hover effects to service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        this.style.transition = 'all 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });
});

// Add click handlers for contact buttons
document.querySelectorAll('.icon-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const icon = this.querySelector('i');
        if (icon.classList.contains('fa-envelope')) {
            window.location.href = 'mailto:pet_o_tel@gmail.com';
        } else if (icon.classList.contains('fa-phone')) {
            window.location.href = 'tel:123-456-7890';
        } else if (icon.classList.contains('fa-share')) {
            if (navigator.share) {
                navigator.share({
                    title: 'Banho & Tosquia Profissional - Pet-o-Tel',
                    text: 'Confira este serviço de grooming profissional para pets!',
                    url: window.location.href
                });
            } else {
                // Fallback for browsers that don't support Web Share API
                const url = window.location.href;
                navigator.clipboard.writeText(url).then(() => {
                    alert('Link copiado para a área de transferência!');
                });
            }
        }
    });
});

// Mobile menu toggle (if needed in future)
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
        const nav = document.querySelector('.nav-menu');
        nav.classList.toggle('active');
    });
}

// Add loading states for buttons - removido o alert
function addLoadingState(button, duration = 2000) {
    const originalText = button.textContent;
    button.textContent = 'Carregando...';
    button.disabled = true;
    button.style.opacity = '0.7';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        button.style.opacity = '1';
    }, duration);
}

// Add animation to rating bars on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bars = entry.target.querySelectorAll('.bar-fill');
            bars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.transition = 'width 1s ease-out';
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                }, index * 200);
            });
        }
    });
}, observerOptions);

const ratingsSection = document.querySelector('.rating-overview');
if (ratingsSection) {
    observer.observe(ratingsSection);
}

let currentPosition = 0;
const cardWidth = 270; // 250px + 20px gap
const visibleCards = 3;
const totalCards = document.querySelectorAll('.service-card').length;
const maxPosition = Math.max(0, totalCards - visibleCards);

function navigateCarousel(direction) {
    const servicesList = document.getElementById('servicesList');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (direction === 'next' && currentPosition < maxPosition) {
        currentPosition++;
    } else if (direction === 'prev' && currentPosition > 0) {
        currentPosition--;
    }

    // Aplicar transformação
    const translateX = -currentPosition * cardWidth;
    servicesList.style.transform = `translateX(${translateX}px)`;

    // Atualizar estado dos botões
    updateButtonStates(prevBtn, nextBtn);
}

function updateButtonStates(prevBtn, nextBtn) {
    // Botão anterior
    if (currentPosition === 0) {
        prevBtn.classList.add('disabled');
    } else {
        prevBtn.classList.remove('disabled');
    }

    // Botão próximo
    if (currentPosition >= maxPosition) {
        nextBtn.classList.add('disabled');
    } else {
        nextBtn.classList.remove('disabled');
    }
}

// Inicializar estados dos botões
document.addEventListener('DOMContentLoaded', function() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    updateButtonStates(prevBtn, nextBtn);
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in animation to sections
    const sections = document.querySelectorAll('.section, .service-header');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// CORRIGIDO: Sistema de scroll da div do preço mais suave e sem problemas visuais
document.addEventListener('DOMContentLoaded', function() {
    const titleRight = document.querySelector('.title-right');
    const container = document.querySelector('.container');
    
    if (!titleRight || !container) return;
    
    // Guarda a posição inicial
    const originalOffsetTop = titleRight.offsetTop;
    let originalOffsetLeft = titleRight.offsetLeft;
    
    function updateOriginalPosition() {
        // Remove temporariamente a classe fixed para calcular posição original
        const wasFixed = titleRight.classList.contains('fixed');
        if (wasFixed) {
            titleRight.classList.remove('fixed');
            titleRight.style.left = '';
            titleRight.style.top = '';
        }
        
        originalOffsetLeft = titleRight.offsetLeft;
        
        if (wasFixed) {
            titleRight.classList.add('fixed');
            titleRight.style.left = originalOffsetLeft + 'px';
            titleRight.style.top = '20px';
        }
    }
    
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const containerRect = container.getBoundingClientRect();
        const containerBottom = containerRect.bottom + scrollTop;
        const windowHeight = window.innerHeight;
        
        // Condições mais precisas para quando ativar/desativar o fixed
        const shouldBeFixed = scrollTop > originalOffsetTop - 100 && 
                             scrollTop < containerBottom - titleRight.offsetHeight - 100;
        
        if (shouldBeFixed && !titleRight.classList.contains('fixed')) {
            titleRight.classList.add('fixed');
            titleRight.style.left = originalOffsetLeft + 'px';
            titleRight.style.top = '20px';
        } else if (!shouldBeFixed && titleRight.classList.contains('fixed')) {
            titleRight.classList.remove('fixed');
            titleRight.style.left = '';
            titleRight.style.top = '';
        }
    }
    
    // Otimização com throttle para melhor performance
    let ticking = false;
    function optimizedHandleScroll() {
        if (!ticking) {
            requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', optimizedHandleScroll);
    
    // Recalcula posições quando a janela é redimensionada
    window.addEventListener('resize', function() {
        titleRight.classList.remove('fixed');
        titleRight.style.left = '';
        titleRight.style.top = '';
        
        setTimeout(() => {
            updateOriginalPosition();
            handleScroll();
        }, 100);
    });
    
    // Calcula a posição inicial
    updateOriginalPosition();
});