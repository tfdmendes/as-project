const servicesData = [
    {
        icon: 'assets/search/hamster1.jpg',
        category: 'Hotel Hamster',
        title: 'Pacote Roda Relax',
        rating: '★★★★★',
        ratingText: '5.0 (24 avaliações)',
        location: '99 Rua do Carmo, Medas, Portugal',
        description: 'Aberto, das 8h30 às 19h30'
    },
    {
        icon: 'assets/search/hamster2.jpg',
        category: 'Resort Fofuxo',
        title: 'Suite Toca Quentinha',
        rating: '★★★★☆',
        ratingText: '4.8 (15 avaliações)',
        location: '25 Rua da Agra, Medas, Portugal',
        description: 'Aberto, das 9h às 20h'
    },
    {
        icon: 'assets/search/hamster3.jpg',
        category: 'Refúgio Roedor',
        title: 'Ninho Zen',
        rating: '★★★★★',
        ratingText: '4.9 (32 avaliações)',
        location: '113 Rua dos Carvalhos, Medas, Portugal',
        description: 'Aberto, das 9h às 21h'
    },

];

//------------------- Pesquisa na barra
document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.querySelector('.search-button');
    const searchInput = document.querySelector('.search-input');
    const filterSelect = document.querySelector('.filter-select');

    if (searchButton && searchInput && filterSelect) {
        searchButton.addEventListener('click', function (event) {
            // Previne navegação imediata se estiver num <a>
            event.preventDefault();

            const termo = searchInput.value.trim() || 'tudo';
            const categoriaSelecionada = filterSelect.options[filterSelect.selectedIndex].text;

            alert(`A pesquisar "${termo}" na categoria de ${categoriaSelecionada}...`);

            // Depois do alert, podes redirecionar se quiseres:
            window.location.href = "search.html";
        });
    }
});


function updateFeaturedService(serviceIndex) {
    const service = servicesData[serviceIndex];

    const featuredIcon = document.getElementById('featured-icon');
    featuredIcon.src = service.icon;
    featuredIcon.alt = service.category;
    
    
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

document.getElementById("mapImage").addEventListener("click", function () {
    // Obter o card ativo
    const activeCard = document.querySelector(".service-card.active");

    if (!activeCard) {
        alert("Nenhum serviço selecionado.");
        return;
    }

    // Obter a localização
    const locationText = activeCard.querySelector(".service-location").textContent;

    // Remover o ícone 📍 se existir
    const cleanedLocation = locationText.replace("📍", "").trim();

    // Codificar para URL
    const query = encodeURIComponent(cleanedLocation);

    // Abrir Google Maps com a localização
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
});

document.getElementById("featured-icon").addEventListener("click", function () {
    alert("A redirecionar para a página...");
    // Aqui podes depois adicionar a lógica de redirecionamento se quiseres
});




// Atualiza a sidebar com o primeiro serviço ao carregar a página
updateFeaturedService(0);

// Opcional: define o primeiro cartão como "ativo" visualmente
document.querySelectorAll('.service-card')[0].classList.add('active');
