// Pet-O-Tel - Script principal
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== MAPA INTERATIVO =====
    function initMap() {
        // Coordenadas de Aveiro, Portugal
        const aveiroCoords = { lat: 40.6443, lng: -8.6455 };
        
        // Criar o mapa
        const map = new google.maps.Map(document.querySelector('.map-img').parentElement, {
            zoom: 15,
            center: aveiroCoords,
            mapTypeId: 'roadmap',
            styles: [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                }
            ]
        });

        // Adicionar marcador
        const marker = new google.maps.Marker({
            position: aveiroCoords,
            map: map,
            title: 'TOP Spa & Grooming',
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="18" fill="#007BFF" stroke="white" stroke-width="2"/>
                        <text x="20" y="26" text-anchor="middle" fill="white" font-size="24">🐾</text>
                    </svg>
                `),
                scaledSize: new google.maps.Size(40, 40)
            }
        });

        // Info window com informações do estabelecimento
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px; font-family: 'Montserrat', sans-serif;">
                    <h3 style="color: #007BFF; margin: 0 0 10px 0;">TOP Spa & Grooming</h3>
                    <p style="margin: 5px 0;"><strong>Horário:</strong> 9h às 19h</p>
                    <p style="margin: 5px 0;"><strong>Contacto:</strong> 123456789</p>
                    <p style="margin: 5px 0;"><strong>Avaliação:</strong> ⭐⭐⭐⭐⭐ 5/5</p>
                </div>
            `
        });

        // Mostrar info window ao clicar no marcador
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });

        // Substituir a imagem estática pelo mapa
        const mapContainer = document.querySelector('.map-img').parentElement;
        mapContainer.innerHTML = '<div id="google-map" style="width: 100%; height: 300px; border-radius: 10px;"></div>';
        
        // Reinicializar o mapa no novo container
        new google.maps.Map(document.getElementById('google-map'), {
            zoom: 15,
            center: aveiroCoords,
            mapTypeId: 'roadmap'
        });
        
        new google.maps.Marker({
            position: aveiroCoords,
            map: new google.maps.Map(document.getElementById('google-map'), {
                zoom: 15,
                center: aveiroCoords
            }),
            title: 'TOP Spa & Grooming'
        });
    }

    // Fallback caso o Google Maps não esteja disponível
    function createStaticMap() {
        const mapImg = document.querySelector('.map-img');
        if (mapImg) {
            mapImg.style.cursor = 'pointer';
            mapImg.addEventListener('click', function() {
                window.open('https://www.google.com/maps/search/spa+grooming+aveiro/@40.6443,-8.6455,15z', '_blank');
            });
            
            // Adicionar tooltip
            mapImg.title = 'Clique para abrir no Google Maps';
        }
    }

    // Inicializar mapa (usar fallback se Google Maps não estiver disponível)
    if (typeof google !== 'undefined' && google.maps) {
        initMap();
    } else {
        createStaticMap();
    }

    // ===== EFEITOS DE HOVER NOS SERVIÇOS =====
    function initServiceHovers() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            // Efeito de hover
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
                this.style.boxShadow = '0 15px 30px rgba(0, 123, 255, 0.15)';
                this.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                
                // Efeito na imagem
                const img = this.querySelector('img');
                if (img) {
                    img.style.transform = 'scale(1.1)';
                    img.style.transition = 'transform 0.3s ease';
                }
                
                // Efeito no preço
                const price = this.querySelector('.price');
                if (price) {
                    price.style.color = '#196085';
                    price.style.fontWeight = 'bold';
                    price.style.transition = 'all 0.3s ease';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                
                // Resetar imagem
                const img = this.querySelector('img');
                if (img) {
                    img.style.transform = 'scale(1)';
                }
                
                // Resetar preço
                const price = this.querySelector('.price');
                if (price) {
                    price.style.color = '#333';
                    price.style.fontWeight = 'normal';
                }
            });
            
            // Efeito de clique
            card.addEventListener('click', function() {
                this.style.transform = 'translateY(-5px) scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-10px) scale(1.02)';
                }, 150);
            });
        });
    }

    // ===== GALERIA DE IMAGENS COM MODAL =====
    function initImageGallery() {
        // Criar o modal
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <span class="modal-close">&times;</span>
                    <img class="modal-image" src="" alt="">
                    <div class="modal-nav">
                        <button class="modal-prev">&#8249;</button>
                        <button class="modal-next">&#8250;</button>
                    </div>
                    <div class="modal-counter">
                        <span class="current-image">1</span> / <span class="total-images">1</span>
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar estilos do modal
        const modalStyles = document.createElement('style');
        modalStyles.textContent = `
            .image-modal {
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.9);
                animation: fadeIn 0.3s ease;
            }
            
            .modal-overlay {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            .modal-content {
                position: relative;
                max-width: 90%;
                max-height: 90%;
                text-align: center;
            }
            
            .modal-image {
                max-width: 100%;
                max-height: 80vh;
                object-fit: contain;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            }
            
            .modal-close {
                position: absolute;
                top: -40px;
                right: 0;
                color: white;
                font-size: 35px;
                font-weight: bold;
                cursor: pointer;
                transition: color 0.3s ease;
            }
            
            .modal-close:hover {
                color: #196085;
            }
            
            .modal-nav {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 100%;
                display: flex;
                justify-content: space-between;
                pointer-events: none;
            }
            
            .modal-prev, .modal-next {
                background: #196085;
                color: white;
                border: none;
                padding: 15px 20px;
                font-size: 24px;
                cursor: pointer;
                border-radius: 50%;
                pointer-events: all;
                transition: all 0.3s ease;
            }
            
            .modal-prev:hover, .modal-next:hover {
                background: #196085;
                transform: scale(1.1);
            }
            
            .modal-prev {
                margin-left: -60px;
            }
            
            .modal-next {
                margin-right: -60px;
            }
            
            .modal-counter {
                color: white;
                margin-top: 15px;
                font-size: 16px;
                font-family: 'Montserrat', sans-serif;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .gallery img {
                cursor: pointer;
                transition: all 0.3s ease;
                border-radius: 10px;
            }
            
            .gallery img:hover {
                transform: scale(1.05);
                box-shadow: 0 10px 25px rgba(0, 123, 255, 0.3);
            }
            
            @media (max-width: 768px) {
                .modal-prev, .modal-next {
                    padding: 10px 15px;
                    font-size: 18px;
                }
                
                .modal-prev {
                    margin-left: -50px;
                }
                
                .modal-next {
                    margin-right: -50px;
                }
            }
        `;
        
        document.head.appendChild(modalStyles);
        document.body.appendChild(modal);
        
        // Coletar todas as imagens da galeria
        const galleryImages = document.querySelectorAll('.gallery img');
        const imageUrls = Array.from(galleryImages).map(img => img.src);
        let currentImageIndex = 0;
        
        // Função para mostrar imagem
        function showImage(index) {
            const modalImage = modal.querySelector('.modal-image');
            const currentCounter = modal.querySelector('.current-image');
            const totalCounter = modal.querySelector('.total-images');
            
            modalImage.src = imageUrls[index];
            currentCounter.textContent = index + 1;
            totalCounter.textContent = imageUrls.length;
            currentImageIndex = index;
        }
        
        // Adicionar event listeners às imagens
        galleryImages.forEach((img, index) => {
            img.addEventListener('click', function() {
                modal.style.display = 'block';
                showImage(index);
                document.body.style.overflow = 'hidden'; // Prevenir scroll
            });
        });
        
        // Fechar modal
        const closeModal = () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };
        
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-overlay').addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });
        
        // Navegação entre imagens
        modal.querySelector('.modal-prev').addEventListener('click', function() {
            currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : imageUrls.length - 1;
            showImage(currentImageIndex);
        });
        
        modal.querySelector('.modal-next').addEventListener('click', function() {
            currentImageIndex = currentImageIndex < imageUrls.length - 1 ? currentImageIndex + 1 : 0;
            showImage(currentImageIndex);
        });
        
        // Navegação por teclado
        document.addEventListener('keydown', function(e) {
            if (modal.style.display === 'block') {
                switch(e.key) {
                    case 'Escape':
                        closeModal();
                        break;
                    case 'ArrowLeft':
                        modal.querySelector('.modal-prev').click();
                        break;
                    case 'ArrowRight':
                        modal.querySelector('.modal-next').click();
                        break;
                }
            }
        });
    }

    // ===== SISTEMA DE RATING INTERATIVO =====
    function initRatingSystem() {
        const ratingContainers = document.querySelectorAll('.rating');
        
        ratingContainers.forEach(ratingContainer => {
            const stars = ratingContainer.querySelectorAll('span');
            let selectedRating = 0;
            let isRated = false;
            
            stars.forEach((star, index) => {
                // Efeito de hover
                star.addEventListener('mouseenter', function() {
                    if (!isRated) {
                        // Destacar estrelas até a atual
                        for (let i = 0; i <= index; i++) {
                            stars[i].style.transform = 'scale(1.2)';
                            stars[i].style.filter = 'drop-shadow(0 0 8px #FFD700)';
                            stars[i].style.transition = 'all 0.3s ease';
                        }
                        
                        // Resetar estrelas após a atual
                        for (let i = index + 1; i < stars.length; i++) {
                            stars[i].style.transform = 'scale(1)';
                            stars[i].style.filter = 'none';
                        }
                    }
                });
                
                // Remover hover quando sair (só se não foi avaliado)
                star.addEventListener('mouseleave', function() {
                    if (!isRated) {
                        stars.forEach(s => {
                            s.style.transform = 'scale(1)';
                            s.style.filter = 'none';
                        });
                    }
                });
                
                // Sistema de clique para rating
                star.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    selectedRating = index + 1;
                    isRated = true;
                    
                    // Fixar o visual das estrelas selecionadas
                    stars.forEach((s, i) => {
                        if (i <= index) {
                            s.style.transform = 'scale(1.1)';
                            s.style.filter = 'drop-shadow(0 0 5px #FFD700)';
                            s.style.color = '#FFD700';
                            s.style.transition = 'all 0.3s ease';
                        } else {
                            s.style.transform = 'scale(1)';
                            s.style.filter = 'none';
                            s.style.color = '#ddd';
                        }
                    });
                    
                    // Adicionar indicador visual de que foi avaliado
                    ratingContainer.style.pointerEvents = 'none';
                    ratingContainer.style.opacity = '0.8';
                    
                    // Mostrar popup de confirmação
                    showRatingConfirmation(selectedRating);
                });
                
                // Adicionar cursor pointer
                star.style.cursor = 'pointer';
            });
            
            // Reset hover quando sair do container inteiro
            ratingContainer.addEventListener('mouseleave', function() {
                if (!isRated) {
                    stars.forEach(s => {
                        s.style.transform = 'scale(1)';
                        s.style.filter = 'none';
                    });
                }
            });
        });
    }
    
    // ===== POPUP DE CONFIRMAÇÃO DE RATING =====
    function showRatingConfirmation(rating) {
        // Criar o popup
        const popup = document.createElement('div');
        popup.className = 'rating-popup';
        
        // Gerar estrelas para mostrar no popup
        const starsHtml = '★'.repeat(rating) + '☆'.repeat(5 - rating);
        
        popup.innerHTML = `
            <div class="popup-overlay">
                <div class="popup-content">
                    <div class="popup-icon">🎉</div>
                    <h3>Obrigado pela sua avaliação!</h3>
                    <div class="popup-stars">${starsHtml}</div>
                    <p>A sua avaliação de <strong>${rating} estrela${rating > 1 ? 's' : ''}</strong> foi guardada com sucesso.</p>
                    <button class="popup-close-btn">Fechar</button>
                </div>
            </div>
        `;
        
        // Adicionar estilos do popup
        const popupStyles = document.createElement('style');
        popupStyles.textContent = `
            .rating-popup {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
                animation: popupFadeIn 0.3s ease;
            }
            
            .popup-overlay {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            .popup-content {
                background: white;
                padding: 40px 30px;
                border-radius: 20px;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                max-width: 400px;
                width: 90%;
                animation: popupSlideIn 0.4s ease;
                font-family: 'Montserrat', sans-serif;
            }
            
            .popup-icon {
                font-size: 50px;
                margin-bottom: 20px;
                animation: bounce 0.6s ease;
            }
            
            .popup-content h3 {
                color: #196085;
                margin: 0 0 20px 0;
                font-size: 24px;
                font-weight: 600;
            }
            
            .popup-stars {
                font-size: 30px;
                color: #FFD700;
                margin: 15px 0;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            
            .popup-content p {
                color: #666;
                margin: 20px 0;
                font-size: 16px;
                line-height: 1.5;
            }
            
            .popup-close-btn {
                background: linear-gradient(135deg, #196085, #85C6B2);
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 25px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: 'Montserrat', sans-serif;
            }
            
            .popup-close-btn:hover {
                background: linear-gradient(135deg, #196085, #85C6B2);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 123, 255, 0.4);
            }
            
            @keyframes popupFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes popupSlideIn {
                from { 
                    opacity: 0;
                    transform: translateY(-50px) scale(0.8);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% {
                    transform: translateY(0);
                }
                40% {
                    transform: translateY(-10px);
                }
                60% {
                    transform: translateY(-5px);
                }
            }
            
            @media (max-width: 480px) {
                .popup-content {
                    padding: 30px 20px;
                    margin: 20px;
                }
                
                .popup-content h3 {
                    font-size: 20px;
                }
                
                .popup-stars {
                    font-size: 25px;
                }
            }
        `;
        
        // Adicionar estilos ao head se ainda não existirem
        if (!document.querySelector('#rating-popup-styles')) {
            popupStyles.id = 'rating-popup-styles';
            document.head.appendChild(popupStyles);
        }
        
        // Adicionar popup ao body
        document.body.appendChild(popup);
        
        // Prevenir scroll do body
        document.body.style.overflow = 'hidden';
        
        // Função para fechar popup
        const closePopup = () => {
            popup.style.animation = 'popupFadeIn 0.3s ease reverse';
            setTimeout(() => {
                if (document.body.contains(popup)) {
                    document.body.removeChild(popup);
                }
                document.body.style.overflow = 'auto';
            }, 300);
        };
        
        // Event listeners para fechar
        popup.querySelector('.popup-close-btn').addEventListener('click', closePopup);
        popup.querySelector('.popup-overlay').addEventListener('click', function(e) {
            if (e.target === this) closePopup();
        });
        
        // Fechar com ESC
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closePopup();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
        
        // Auto-fechar após 5 segundos
        setTimeout(() => {
            if (document.body.contains(popup)) {
                closePopup();
            }
        }, 5000);
    }

    // ===== EFEITOS ADICIONAIS =====
    function initAdditionalEffects() {
        // Botão de mensagem com efeito
        const messageBtn = document.querySelector('.message-btn');
        if (messageBtn) {
            messageBtn.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                this.style.background = 'linear-gradient(135deg, #196085, #85C6B2)';
                
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                    this.style.background = 'linear-gradient(135deg, #196085, #85C6B2)';
                }, 150);
                
                // Simular envio de mensagem
                alert('Mensagem enviada com sucesso! O prestador irá responder em breve.');
            });
        }
        
        // Scroll suave para seções
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ===== INICIALIZAÇÃO =====
    initServiceHovers();
    initImageGallery();
    initRatingSystem(); // Nova função de rating
    initAdditionalEffects();
    
    // Lazy loading simplificado
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '1';
                    img.style.transition = 'opacity 0.5s ease';
                    observer.unobserve(img);
                }
            });
        });
        
        // Iniciar com opacidade 0
        document.querySelectorAll('.service-card img, .gallery img').forEach(img => {
            img.style.opacity = '0';
            imageObserver.observe(img);
        });
    }
    
    console.log('Pet-O-Tel: Todos os scripts carregados com sucesso! 🐾');
});

// ===== FUNÇÃO PARA CARREGAR GOOGLE MAPS (opcional) =====
function loadGoogleMaps() {
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=SUA_API_KEY_AQUI&callback=initMap';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

// Descomente a linha abaixo e adicione sua API key do Google Maps se quiser usar o mapa interativo
// loadGoogleMaps();