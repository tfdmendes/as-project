// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize edit services functionality
    initializeEditServices();
});

function initializeEditServices() {
    // Get all service cards
    const serviceCards = document.querySelectorAll('.service-card');
    const serviceMenus = document.querySelectorAll('.service-menu');
    
    // Add click handlers for service cards
    serviceCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on menu
            if (!e.target.closest('.service-menu')) {
                handleServiceCardClick(this);
            }
        });
    });
    
    // Add click handlers for service menus
    serviceMenus.forEach(menu => {
        menu.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            handleServiceMenuClick(this);
        });
    });
    
    // Initialize service management features
    initializeServiceManagement();
    
    // Close any open menus when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.service-menu-dropdown') && !e.target.closest('.service-menu')) {
            removeExistingMenus();
        }
    });
}

function handleServiceCardClick(card) {
    // Get service title from the card
    const serviceTitle = card.querySelector('.service-title').textContent;
    
    // You can implement navigation to service detail page here
    console.log('Service card clicked:', serviceTitle);
    
    // For now, just show alert - replace with actual navigation
    // window.location.href = `service-detail.html?service=${encodeURIComponent(serviceTitle)}`;
}

function handleServiceMenuClick(menu) {
    // Get the service card
    const serviceCard = menu.closest('.service-card');
    const serviceTitle = serviceCard.querySelector('.service-title').textContent;
    
    // Show service menu options
    showServiceMenu(menu, serviceTitle);
}

function showServiceMenu(menuElement, serviceTitle) {
    // Remove any existing menus
    removeExistingMenus();
    
    // Create menu dropdown
    const menuDropdown = document.createElement('div');
    menuDropdown.className = 'service-menu-dropdown';
    menuDropdown.innerHTML = `
        <div class="menu-item primary" onclick="editService('${serviceTitle}')">
            <span>✏️ Editar Serviço</span>
        </div>
        <div class="menu-item" onclick="viewServiceStats('${serviceTitle}')">
            <span>📊 Ver Estatísticas</span>
        </div>
        <div class="menu-item" onclick="duplicateService('${serviceTitle}')">
            <span>📋 Duplicar Serviço</span>
        </div>
        <div class="menu-item" onclick="toggleServiceStatus('${serviceTitle}')">
            <span>🔄 Ativar/Desativar</span>
        </div>
        <div class="menu-divider"></div>
        <div class="menu-item danger" onclick="deleteService('${serviceTitle}')">
            <span>🗑️ Eliminar Serviço</span>
        </div>
    `;
    
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

function editService(serviceTitle) {
    console.log('Edit service:', serviceTitle);
    removeExistingMenus();
    
    // Create a modal or redirect to edit page
    alert(`Editar serviço: ${serviceTitle}\n\nEsta funcionalidade irá redirecionar para a página de edição do serviço.`);
    
    // Example of what you could implement:
    window.location.href = `criar_servico.html?service=${encodeURIComponent(serviceTitle)}`;
}

function viewServiceStats(serviceTitle) {
    console.log('View stats for:', serviceTitle);
    removeExistingMenus();
    
    alert(`Ver estatísticas para: ${serviceTitle}\n\nAqui seria mostrado:\n- Número de reservas\n- Avaliações recentes\n- Rendimentos\n- Taxa de ocupação`);
}

function duplicateService(serviceTitle) {
    console.log('Duplicate service:', serviceTitle);
    removeExistingMenus();
    
    if (confirm(`Duplicar o serviço "${serviceTitle}"?`)) {
        alert(`Serviço "${serviceTitle}" duplicado com sucesso!`);
        // Here you would implement the duplication logic
    }
}

function toggleServiceStatus(serviceTitle) {
    console.log('Toggle status for:', serviceTitle);
    removeExistingMenus();
    
    const action = confirm(`Deseja alterar o status do serviço "${serviceTitle}"?`) ? 'ativado' : 'cancelado';
    if (action === 'ativado') {
        alert(`Status do serviço "${serviceTitle}" alterado com sucesso!`);
    }
}

function deleteService(serviceTitle) {
    if (confirm(`⚠️ ATENÇÃO!\n\nTem certeza que deseja eliminar permanentemente o serviço "${serviceTitle}"?\n\nEsta ação não pode ser desfeita.`)) {
        console.log('Delete service:', serviceTitle);
        
        // Find and remove the service card with animation
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            if (card.querySelector('.service-title').textContent === serviceTitle) {
                card.style.transition = 'all 0.3s ease';
                card.style.transform = 'scale(0.8)';
                card.style.opacity = '0';
                
                setTimeout(() => {
                    card.remove();
                    alert(`Serviço "${serviceTitle}" eliminado com sucesso!`);
                }, 300);
            }
        });
    }
    removeExistingMenus();
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
        `;
        document.head.appendChild(styles);
    }
}

// Add new service functionality (you can expand this)
function addNewService() {
    console.log('Add new service');
    // window.location.href = 'service-create.html';
}

// Export functions for potential use in other scripts
window.editServicesUtils = {
    editService,
    viewServiceStats,
    duplicateService,
    toggleServiceStatus,
    deleteService,
    addNewService
};