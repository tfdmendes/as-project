const servicesData = [
            {
                icon: '🐾',
                category: 'Pet Care',
                title: 'Quinta Dona Maria',
                rating: '★★★★★',
                ratingText: '5.0 (24 avaliações)',
                location: '📍 Sintra, Portugal',
                description: 'Serviço especializado em cuidados com animais de estimação. Ambiente seguro e acolhedor para o seu pet.'
            },
            {
                icon: '🏠',
                category: 'House Sitting',
                title: 'Casa dos Sonhos',
                rating: '★★★★☆',
                ratingText: '4.8 (15 avaliações)',
                location: '📍 Cascais, Portugal',
                description: 'Cuidamos da sua casa como se fosse nossa. Serviço de confiança para quando está ausente.'
            },
            {
                icon: '🌸',
                category: 'Garden Care',
                title: 'Jardim Encantado',
                rating: '★★★★★',
                ratingText: '4.9 (32 avaliações)',
                location: '📍 Oeiras, Portugal',
                description: 'Manutenção profissional de jardins e espaços verdes. Transformamos o seu jardim num paraíso.'
            },
            {
                icon: '🚗',
                category: 'Transport',
                title: 'Transporte Rápido',
                rating: '★★★★☆',
                ratingText: '4.7 (18 avaliações)',
                location: '📍 Lisboa, Portugal',
                description: 'Serviço de transporte rápido e seguro. Chegue ao seu destino com conforto e pontualidade.'
            },
            {
                icon: '🏡',
                category: 'Cleaning',
                title: 'Limpeza Premium',
                rating: '★★★★★',
                ratingText: '5.0 (41 avaliações)',
                location: '📍 Almada, Portugal',
                description: 'Serviços de limpeza profissional. Deixamos a sua casa impecável e brilhante.'
            }
        ];

function updateFeaturedService(serviceIndex) {
    const service = servicesData[serviceIndex];
    
    document.getElementById('featured-icon').textContent = service.icon;
    document.getElementById('featured-category').textContent = service.category;
    document.getElementById('featured-title').textContent = service.title;
    document.getElementById('featured-rating').textContent = service.rating;
    document.getElementById('featured-rating-text').textContent = service.ratingText;
    document.getElementById('featured-location').textContent = service.location;
    document.getElementById('featured-description').textContent = service.description;
}

// Event listeners para os cartões de serviço
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', function() {
        // Remove active class from all cards
        document.querySelectorAll('.service-card').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked card
        this.classList.add('active');
        
        // Update featured service
        const serviceIndex = parseInt(this.dataset.service);
        updateFeaturedService(serviceIndex);
    });
});

// Smooth scroll effect for sidebar
window.addEventListener('scroll', function() {
    const sidebar = document.querySelector('.sidebar');
    const scrollTop = window.pageYOffset;
    
    // Add subtle parallax effect
    sidebar.style.transform = `translateY(${scrollTop * 0.1}px)`;
});