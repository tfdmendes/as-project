// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize edit services functionality
    initializeEditServices();
    // Load services from localStorage
    loadUserServices();
});

function initializeEditServices() {
    // Initialize service management features
    initializeServiceManagement();
    
    // Close any open menus when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.service-menu-dropdown') && !e.target.closest('.service-menu')) {
            removeExistingMenus();
        }
    });
}

// Load services from localStorage and add to the grid
function loadUserServices() {
    const servicesGrid = document.querySelector('.services-grid');
    const userServices = JSON.parse(localStorage.getItem('userServices') || '[]');
    
    // Filter only active services (not drafts)
    const activeServices = userServices.filter(service => service.status === 'active');
    
    activeServices.forEach(service => {
        const serviceCard = createServiceCard(service);
        servicesGrid.appendChild(serviceCard);
    });
    
    // Add event handlers to newly created cards
    attachEventHandlersToNewCards();
    
    // Add a button to create new service if it doesn't exist
    addCreateServiceButton();
}

// Create a service card element
function createServiceCard(service) {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.dataset.serviceId = service.id;
    card.dataset.isUserService = 'true'; // Mark as user-created service
    
    // Use first image or placeholder
    const imageUrl = (service.images && service.images.length > 0) 
        ? service.images[0].src 
        : 'assets/edit-services/service-placeholder.png';
    
    // Calculate rating display
    const rating = service.rating || 0;
    const reviewCount = service.reviews || 0;
    const stars = generateStarsHTML(rating);
    
    card.innerHTML = `
        <div class="service-image-container">
            <img src="${imageUrl}" alt="${service.name}" class="service-image" loading="lazy">
            <div class="service-menu">
                <span class="service-menu-dots">•••</span>
            </div>
        </div>
        <div class="service-content">
            <h3 class="service-title">${service.name}</h3>
            <p class="service-location">${service.location}</p>
            <div class="service-rating">
                <div class="stars">
                    ${stars}
                </div>
                <span class="rating-text">${rating > 0 ? rating + '/5' : 'Sem avaliações'}</span>
                <span class="reviews-count">${reviewCount} avaliações</span>
            </div>
            <div class="service-price">${service.price}€${service.availability === 'always' ? '/dia' : ''}</div>
        </div>
    `;
    
    return card;
}

// Generate stars HTML based on rating
function generateStarsHTML(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<span class="star filled">★</span>';
        } else {
            stars += '<span class="star">★</span>';
        }
    }
    return stars;
}

// Attach event handlers to newly created cards
function attachEventHandlersToNewCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    const serviceMenus = document.querySelectorAll('.service-menu');
    
    serviceCards.forEach(card => {
        // Remove existing listeners to avoid duplicates
        card.replaceWith(card.cloneNode(true));
    });
    
    // Re-select after cloning
    const newServiceCards = document.querySelectorAll('.service-card');
    const newServiceMenus = document.querySelectorAll('.service-menu');
    
    // Add click handlers for service cards
    newServiceCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on menu
            if (!e.target.closest('.service-menu')) {
                handleServiceCardClick(this);
            }
        });
    });
    
    // Add click handlers for service menus
    newServiceMenus.forEach(menu => {
        menu.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            handleServiceMenuClick(this);
        });
    });
}

function handleServiceCardClick(card) {
    // Get service title from the card
    const serviceTitle = card.querySelector('.service-title').textContent;
    const serviceId = card.dataset.serviceId;
    
    console.log('Service card clicked:', serviceTitle);
    
    // Here you could implement navigation to service detail page
    // window.location.href = `service-detail.html?id=${serviceId}`;
}

function handleServiceMenuClick(menu) {
    // Get the service card
    const serviceCard = menu.closest('.service-card');
    const serviceTitle = serviceCard.querySelector('.service-title').textContent;
    const isUserService = serviceCard.dataset.isUserService === 'true';
    const serviceId = serviceCard.dataset.serviceId;
    
    // Show service menu options
    showServiceMenu(menu, serviceTitle, isUserService, serviceId);
}

function showServiceMenu(menuElement, serviceTitle, isUserService, serviceId) {
    // Remove any existing menus
    removeExistingMenus();
    
    // Create menu dropdown
    const menuDropdown = document.createElement('div');
    menuDropdown.className = 'service-menu-dropdown';
    
    // Different menu options for user-created vs static services
    if (isUserService) {
        menuDropdown.innerHTML = `
            <div class="menu-item primary" onclick="editService('${serviceId}', '${serviceTitle}')">
                <span>✏️ Editar Serviço</span>
            </div>
            <div class="menu-item" onclick="viewServiceStats('${serviceId}', '${serviceTitle}')">
                <span>📊 Ver Estatísticas</span>
            </div>
            <div class="menu-item" onclick="duplicateService('${serviceId}', '${serviceTitle}')">
                <span>📋 Duplicar Serviço</span>
            </div>
            <div class="menu-item" onclick="toggleServiceStatus('${serviceId}', '${serviceTitle}')">
                <span>🔄 Ativar/Desativar</span>
            </div>
            <div class="menu-divider"></div>
            <div class="menu-item danger" onclick="deleteService('${serviceId}', '${serviceTitle}')">
                <span>🗑️ Eliminar Serviço</span>
            </div>
        `;
    } else {
        // Static services have limited options
        menuDropdown.innerHTML = `
            <div class="menu-item" onclick="viewServiceStats(null, '${serviceTitle}')">
                <span>📊 Ver Estatísticas</span>
            </div>
            <div class="menu-item" onclick="alert('Este é um serviço de exemplo e não pode ser editado.')">
                <span>ℹ️ Serviço de Exemplo</span>
            </div>
        `;
    }
    
    // Position the menu
    const rect = menuElement.getBoundingClientRect();
    menuDropdown.style.position = 'fixed';
    menuDropdown.style.top = (rect.bottom + 8) + 'px';
    menuDropdown.style.right = (window.innerWidth - rect.right) + 'px';
    menuDropdown.style.zIndex = '1000';
    
    // Add to body
    document.body.appendChild(menuDropdown);
    
    // Add click outside to close with a small delay
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menuDropdown.contains(e.target) && !menuElement.contains(e.target)) {
                removeExistingMenus();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

function removeExistingMenus() {
    const existingMenus = document.querySelectorAll('.service-menu-dropdown');
    existingMenus.forEach(menu => {
        menu.style.opacity = '0';
        menu.style.transform = 'translateY(-10px)';
        setTimeout(() => menu.remove(), 200);
    });
}

function editService(serviceId, serviceTitle) {
    console.log('Edit service:', serviceId, serviceTitle);
    removeExistingMenus();
    
    // Redirect to criar_servico.html with the service ID for editing
    window.location.href = `criar_servico.html?edit=${serviceId}`;
}

function viewServiceStats(serviceId, serviceTitle) {
    console.log('View stats for:', serviceId, serviceTitle);
    removeExistingMenus();
    
    if (serviceId) {
        // Get service data from localStorage
        const services = JSON.parse(localStorage.getItem('userServices') || '[]');
        const service = services.find(s => s.id === serviceId);
        
        if (service) {
            const stats = `
                📊 Estatísticas para: ${serviceTitle}
                
                📍 Localização: ${service.location}
                💰 Preço: ${service.price}€
                ⭐ Avaliação: ${service.rating || 0}/5
                💬 Avaliações: ${service.reviews || 0}
                📅 Criado em: ${new Date(service.createdAt).toLocaleDateString('pt-PT')}
                🔄 Última atualização: ${new Date(service.updatedAt).toLocaleDateString('pt-PT')}
                📌 Status: ${service.status === 'active' ? 'Ativo' : 'Inativo'}
            `;
            alert(stats);
        }
    } else {
        alert(`Ver estatísticas para: ${serviceTitle}\n\nEste é um serviço de exemplo.`);
    }
}

function duplicateService(serviceId, serviceTitle) {
    console.log('Duplicate service:', serviceId, serviceTitle);
    removeExistingMenus();
    
    if (confirm(`Duplicar o serviço "${serviceTitle}"?`)) {
        const services = JSON.parse(localStorage.getItem('userServices') || '[]');
        const originalService = services.find(s => s.id === serviceId);
        
        if (originalService) {
            // Create a copy with new ID
            const duplicatedService = {
                ...originalService,
                id: 'service_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                name: originalService.name + ' (Cópia)',
                rating: 0,
                reviews: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            // Add to services array
            services.push(duplicatedService);
            localStorage.setItem('userServices', JSON.stringify(services));
            
            // Add to DOM
            const servicesGrid = document.querySelector('.services-grid');
            const newCard = createServiceCard(duplicatedService);
            servicesGrid.appendChild(newCard);
            
            // Re-attach event handlers
            attachEventHandlersToNewCards();
            
            alert(`Serviço "${serviceTitle}" duplicado com sucesso!`);
        }
    }
}

function toggleServiceStatus(serviceId, serviceTitle) {
    console.log('Toggle status for:', serviceId, serviceTitle);
    removeExistingMenus();
    
    const services = JSON.parse(localStorage.getItem('userServices') || '[]');
    const service = services.find(s => s.id === serviceId);
    
    if (service) {
        const newStatus = service.status === 'active' ? 'inactive' : 'active';
        const action = newStatus === 'active' ? 'ativar' : 'desativar';
        
        if (confirm(`Deseja ${action} o serviço "${serviceTitle}"?`)) {
            service.status = newStatus;
            service.updatedAt = new Date().toISOString();
            localStorage.setItem('userServices', JSON.stringify(services));
            
            // Update UI
            const card = document.querySelector(`[data-service-id="${serviceId}"]`);
            if (newStatus === 'inactive') {
                card.style.opacity = '0.6';
                card.querySelector('.service-title').textContent += ' (Inativo)';
            } else {
                location.reload(); // Reload to refresh the display
            }
            
            alert(`Serviço "${serviceTitle}" ${newStatus === 'active' ? 'ativado' : 'desativado'} com sucesso!`);
        }
    }
}

function deleteService(serviceId, serviceTitle) {
    if (confirm(`⚠️ ATENÇÃO!\n\nTem certeza que deseja eliminar permanentemente o serviço "${serviceTitle}"?\n\nEsta ação não pode ser desfeita.`)) {
        console.log('Delete service:', serviceId, serviceTitle);
        
        // Remove from localStorage
        let services = JSON.parse(localStorage.getItem('userServices') || '[]');
        services = services.filter(s => s.id !== serviceId);
        localStorage.setItem('userServices', JSON.stringify(services));
        
        // Find and remove the service card with animation
        const card = document.querySelector(`[data-service-id="${serviceId}"]`);
        if (card) {
            card.style.transition = 'all 0.3s ease';
            card.style.transform = 'scale(0.8)';
            card.style.opacity = '0';
            
            setTimeout(() => {
                card.remove();
                alert(`Serviço "${serviceTitle}" eliminado com sucesso!`);
                
                // Check if there are no more user services
                const remainingUserServices = document.querySelectorAll('[data-is-user-service="true"]');
                if (remainingUserServices.length === 0) {
                    // Re-add the create button if needed
                    addCreateServiceButton();
                }
            }, 300);
        }
    }
    removeExistingMenus();
}

// Add a button to create new services
function addCreateServiceButton() {
    // Check if button already exists
    if (document.querySelector('.add-service-button')) {
        return;
    }
    
    const servicesGrid = document.querySelector('.services-grid');
    
    // Create add service card
    const addCard = document.createElement('div');
    addCard.className = 'service-card add-service-button';
    addCard.style.cursor = 'pointer';
    addCard.style.minHeight = '380px';
    addCard.style.display = 'flex';
    addCard.style.alignItems = 'center';
    addCard.style.justifyContent = 'center';
    addCard.style.background = 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)';
    addCard.style.border = '2px dashed #3DAAE5';
    
    addCard.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem; color: #3DAAE5;">➕</div>
            <h3 style="font-size: 1.2rem; font-weight: 600; color: #333; margin-bottom: 0.5rem;">Adicionar Novo Serviço</h3>
            <p style="font-size: 0.9rem; color: #666;">Clique para criar um novo serviço</p>
        </div>
    `;
    
    addCard.addEventListener('click', function() {
        window.location.href = 'criar_servico.html';
    });
    
    servicesGrid.appendChild(addCard);
}

function initializeServiceManagement() {
    // Add styles for service menu dropdown
    if (!document.getElementById('service-menu-styles')) {
        const styles = document.createElement('style');
        styles.id = 'service-menu-styles';
        styles.textContent = `
            .service-menu-dropdown {
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
                min-width: 200px;
                overflow: hidden;
                animation: menuFadeIn 0.3s ease;
                border: 1px solid #e1e5e9;
            }
            
            @keyframes menuFadeIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            .menu-item {
                padding: 12px 16px;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 0.9rem;
                color: #333;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .menu-item:hover {
                background-color: #f8f9fa;
                color: #3DAAE5;
            }
            
            .menu-item.primary {
                background-color: #3DAAE5;
                color: white;
                font-weight: 500;
            }
            
            .menu-item.primary:hover {
                background-color: #2d8bc7;
                color: white;
            }
            
            .menu-item.danger {
                color: #dc3545;
            }
            
            .menu-item.danger:hover {
                background-color: #f8d7da;
                color: #721c24;
            }
            
            .menu-divider {
                height: 1px;
                background-color: #e1e5e9;
                margin: 4px 0;
            }
            
            .add-service-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(61, 170, 229, 0.3) !important;
            }
        `;
        document.head.appendChild(styles);
    }
}

// Export functions for potential use in other scripts
window.editServicesUtils = {
    editService,
    viewServiceStats,
    duplicateService,
    toggleServiceStatus,
    deleteService,
    loadUserServices
};