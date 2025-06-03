// auth.js - Sistema de autenticação global para todas as páginas

// Configuração dos utilizadores
const userProfiles = {
    "user@petotel.com": {
        name: "Rhyan Matos",
        role: "user",
        avatar: "assets/people/RyanMatos.png",
        editUrl: "account-edit.html"
    },
    "prestador@petotel.com": {
        name: "Tiago Fernandes",
        role: "prestador-de-servicos",
        avatar: "assets/people/tiago.png",
        editUrl: "prestador-edit.html"
    }
};

// Classe para gerir a autenticação
class AuthManager {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.init();
    }

    // Obter utilizador atual do sessionStorage
    getCurrentUser() {
        const userStr = sessionStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    }

    // Verificar se o utilizador está logado
    isLoggedIn() {
        return this.currentUser && this.currentUser.isLoggedIn;
    }

    // Obter informações do perfil do utilizador
    getUserProfile() {
        if (!this.isLoggedIn()) return null;
        return userProfiles[this.currentUser.email] || null;
    }

    // Fazer logout
    logout() {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }

    // Inicializar o sistema de autenticação
    init() {
        // Aguardar o DOM carregar
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.updateUI();
                // Update dropdown links for existing menus in HTML
                if (this.isLoggedIn()) {
                    const profile = this.getUserProfile();
                    if (profile && profile.role) {
                        this.updateDropdownLinksForRole(profile.role);
                    }
                }
            });
        } else {
            this.updateUI();
            // Update dropdown links for existing menus in HTML
            if (this.isLoggedIn()) {
                const profile = this.getUserProfile();
                if (profile && profile.role) {
                    this.updateDropdownLinksForRole(profile.role);
                }
            }
        }
    }

    // Atualizar a interface com base no estado de login
    updateUI() {
        const userIcons = document.querySelectorAll('.icon-user');
        const profile = this.getUserProfile();

        if (this.isLoggedIn() && profile) {
            // Utilizador está logado
            userIcons.forEach(icon => {
                // Atualizar a imagem do ícone
                if (icon.tagName === 'IMG') {
                    icon.src = profile.avatar;
                    icon.alt = profile.name;
                    icon.style.borderRadius = '50%';
                    icon.style.width = '32px';
                    icon.style.height = '32px';
                    icon.style.objectFit = 'cover';
                    icon.style.cursor = 'pointer';
                }

                // Remover links antigos
                const parentLink = icon.closest('a');
                if (parentLink) {
                    parentLink.removeAttribute('href');
                }

                // Adicionar menu dropdown
                const menuContainer = icon.closest('.menu-user') || icon.closest('.menu-utilizador');
                if (menuContainer && !menuContainer.querySelector('.user-dropdown')) {
                    this.createUserDropdown(menuContainer, profile);
                }
            });

            // Adicionar classe ao body para estilos específicos
            document.body.classList.add('user-logged-in');
            document.body.classList.add(`role-${profile.role}`);

            // Atualizar links do dropdown existente baseado no role
            this.updateDropdownLinksForRole(profile.role);

        } else {
            // Utilizador não está logado
            userIcons.forEach(icon => {
                icon.style.cursor = 'pointer';
                
                // Garantir que o ícone padrão é usado
                if (icon.tagName === 'IMG' && icon.classList.contains('icon-user')) {
                    icon.src = 'assets/header/user.svg';
                    icon.alt = 'Utilizador';
                    icon.style.borderRadius = '0';
                    icon.style.width = '24px';
                    icon.style.height = '24px';
                }

                // Adicionar evento de clique apenas ao ícone de utilizador
                if (icon.classList.contains('icon-user')) {
                    icon.addEventListener('click', (e) => {
                        e.preventDefault();
                        window.location.href = 'login.html';
                    });
                }

                // Se o ícone está dentro de um link, atualizar o link
                const parentLink = icon.closest('a');
                if (parentLink) {
                    parentLink.href = 'login.html';
                }
            });
        }
    }

    // Atualizar links do dropdown baseado no role do utilizador
    updateDropdownLinksForRole(role) {
        const isPrestador = role === 'prestador-de-servicos';
        
        // Define URL mappings based on role
        const urlMappings = {
            'messages.html': isPrestador ? 'messages_prestador.html' : 'messages.html',
            'messages_prestador.html': isPrestador ? 'messages_prestador.html' : 'messages.html',
            'notifications.html': isPrestador ? 'notifications_prestador.html' : 'notifications.html',
            'notifications_prestador.html': isPrestador ? 'notifications_prestador.html' : 'notifications.html',
            'reservations.html': isPrestador ? 'reservations_prestador.html' : 'reservations.html',
            'reservations_prestador.html': isPrestador ? 'reservations_prestador.html' : 'reservations.html',
            'wishlists.html': isPrestador ? 'wishlists_prestador.html' : 'wishlists.html',
            'wishlists_prestador.html': isPrestador ? 'wishlists_prestador.html' : 'wishlists.html'
        };
        
        // Update links in all dropdown menus
        const dropdownMenus = document.querySelectorAll('.dropdown-menu');
        
        dropdownMenus.forEach(menu => {
            // Update navigation links
            const links = menu.querySelectorAll('a');
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href && urlMappings[href]) {
                    link.href = urlMappings[href];
                }
            });
            
            // Update account/prestador panel links
            const accountLinks = menu.querySelectorAll('a[href*="account-edit"], a[href*="prestador-edit"]');
            accountLinks.forEach(link => {
                if (isPrestador) {
                    link.href = 'prestador-edit.html';
                    if (link.textContent.includes('Account')) {
                        link.textContent = 'Painel Prestador';
                    }
                } else {
                    link.href = 'account-edit.html';
                    link.textContent = 'Account';
                }
            });
        });
        
        // Add prestador-specific menu items if needed
        if (isPrestador) {
            dropdownMenus.forEach(menu => {
                this.addPrestadorMenuItems(menu);
            });
        }
    }

    // Adicionar itens específicos do menu prestador
    addPrestadorMenuItems(menu) {
        const dropdownSections = menu.querySelectorAll('.dropdown-section');
        if (dropdownSections.length > 0) {
            const firstSection = dropdownSections[0];
            
            // Verificar se os itens já existem
            if (!menu.querySelector('a[href*="criar_servico"]')) {
                const newItems = [
                    { href: 'criar_servico.html', text: 'Criar Serviço' },
                    { href: 'edit-services.html', text: 'Meus Serviços' },
                    { href: 'prestador-dashboard.html', text: 'Dashboard' }
                ];

                newItems.forEach(item => {
                    const link = document.createElement('a');
                    link.href = item.href;
                    link.className = 'dropdown-item';
                    link.textContent = item.text;
                    firstSection.appendChild(link);
                });
            }
        }
    }

    // Criar menu dropdown do utilizador
    createUserDropdown(container, profile) {
        // Criar wrapper para o ícone de utilizador se necessário
        const userIcon = container.querySelector('.icon-user');
        let dropdownContainer = userIcon.parentElement;
        
        // Se o ícone está diretamente no menu-user, criar um wrapper
        if (dropdownContainer.classList.contains('menu-user') || dropdownContainer.classList.contains('menu-utilizador')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'user-icon-wrapper';
            wrapper.style.position = 'relative';
            userIcon.parentNode.insertBefore(wrapper, userIcon);
            wrapper.appendChild(userIcon);
            dropdownContainer = wrapper;
        }

        // Determine URLs based on role
        const isPrestador = profile.role === 'prestador-de-servicos';
        const messageUrl = isPrestador ? 'messages_prestador.html' : 'messages.html';
        const notificationsUrl = isPrestador ? 'notifications_prestador.html' : 'notifications.html';
        const reservationsUrl = isPrestador ? 'reservations_prestador.html' : 'reservations.html';
        const wishlistsUrl = isPrestador ? 'wishlists_prestador.html' : 'wishlists.html';

        // Criar estrutura do dropdown
        const dropdown = document.createElement('div');
        dropdown.className = 'user-dropdown';
        dropdown.innerHTML = `
            <div class="dropdown-header">
                <img src="${profile.avatar}" alt="${profile.name}" class="dropdown-avatar">
                <div class="dropdown-info">
                    <span class="dropdown-name">${profile.name}</span>
                    <span class="dropdown-role">${profile.role === 'user' ? 'Utilizador' : 'Prestador de Serviços'}</span>
                </div>
            </div>
            <div class="dropdown-menu">
                <a href="${messageUrl}" class="dropdown-item">
                    <span class="dropdown-icon">💬</span>
                    <span>Mensagens</span>
                </a>
                <a href="${notificationsUrl}" class="dropdown-item">
                    <span class="dropdown-icon">🔔</span>
                    <span>Notificações</span>
                </a>
                <a href="${reservationsUrl}" class="dropdown-item">
                    <span class="dropdown-icon">📅</span>
                    <span>Reservas</span>
                </a>
                <a href="${wishlistsUrl}" class="dropdown-item">
                    <span class="dropdown-icon">❤️</span>
                    <span>Favoritos</span>
                </a>
                <div class="dropdown-divider"></div>
                <a href="${profile.editUrl}" class="dropdown-item">
                    <span class="dropdown-icon">👤</span>
                    <span>Meu Perfil</span>
                </a>
                ${profile.role === 'prestador-de-servicos' ? `
                    <a href="edit-services.html" class="dropdown-item">
                        <span class="dropdown-icon">🛠️</span>
                        <span>Meus Serviços</span>
                    </a>
                    <a href="criar_servico.html" class="dropdown-item">
                        <span class="dropdown-icon">➕</span>
                        <span>Criar Serviço</span>
                    </a>
                    <a href="prestador-dashboard.html" class="dropdown-item">
                        <span class="dropdown-icon">📊</span>
                        <span>Dashboard</span>
                    </a>
                ` : ''}
                <a href="#" class="dropdown-item" id="logoutBtn">
                    <span class="dropdown-icon">🚪</span>
                    <span>Sair</span>
                </a>
            </div>
        `;

        // Adicionar estilos CSS
        this.addDropdownStyles();

        // Adicionar ao container correto
        dropdownContainer.appendChild(dropdown);

        // Evento de clique para mostrar/esconder dropdown
        userIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Se estamos na página index, verificar role e redirecionar
            if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
                if (e.target.closest('.texto') || e.target.closest('.imagem')) {
                    // Clique na imagem grande do perfil na seção prestador
                    window.location.href = profile.editUrl;
                    return;
                }
            }
            
            dropdown.classList.toggle('show');
        });

        // Fechar dropdown ao clicar fora
        document.addEventListener('click', (e) => {
            if (!dropdownContainer.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });

        // Evento de logout
        const logoutBtn = dropdown.querySelector('#logoutBtn');
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Tem certeza que deseja sair?')) {
                this.logout();
            }
        });
    }

    // Adicionar estilos CSS para o dropdown
    addDropdownStyles() {
        if (document.getElementById('auth-dropdown-styles')) return;

        const style = document.createElement('style');
        style.id = 'auth-dropdown-styles';
        style.textContent = `
            .user-dropdown {
                position: absolute;
                top: 100%;
                right: 0;
                margin-top: 10px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                min-width: 250px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                z-index: 1000;
            }
            
            .user-icon-wrapper .user-dropdown {
                right: 0;
            }

            .user-dropdown.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .dropdown-header {
                display: flex;
                align-items: center;
                padding: 1rem;
                border-bottom: 1px solid #e0e0e0;
            }

            .dropdown-avatar {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                margin-right: 12px;
                object-fit: cover;
            }

            .dropdown-info {
                display: flex;
                flex-direction: column;
            }

            .dropdown-name {
                font-weight: 600;
                color: #333;
                margin-bottom: 2px;
            }

            .dropdown-role {
                font-size: 0.85rem;
                color: #666;
            }

            .dropdown-menu {
                padding: 0.5rem;
            }

            .dropdown-item {
                display: flex;
                align-items: center;
                padding: 0.75rem 1rem;
                color: #333;
                text-decoration: none;
                border-radius: 8px;
                transition: background-color 0.2s ease;
            }

            .dropdown-item:hover {
                background-color: #f5f5f5;
            }

            .dropdown-icon {
                margin-right: 12px;
                font-size: 1.1rem;
            }

            .menu-user, .menu-utilizador {
                position: relative;
            }
            
            .user-icon-wrapper {
                position: relative;
                display: inline-block;
            }

            .user-logged-in .icon-user {
                border: 2px solid #3DAAE5;
                padding: 2px;
                background: white;
            }
            
            .menu-user, .menu-utilizador {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .icon-menu {
                cursor: pointer;
                width: 24px;
                height: 24px;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .user-dropdown {
                    right: -20px;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Criar instância global do AuthManager
const authManager = new AuthManager();

// Exportar para uso global
window.authManager = authManager;