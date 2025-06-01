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
        // Manter o email se "lembrar-me" estava ativo
        // localStorage.removeItem('rememberedEmail'); // Comentado para manter o email
        window.location.href = 'index.html';
    }

    // Inicializar o sistema de autenticação
    init() {
        // Aguardar o DOM carregar
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.updateUI());
        } else {
            this.updateUI();
        }
    }

    // Atualizar a interface com base no estado de login
    updateUI() {
        // Selecionar apenas o ícone de utilizador, não o menu
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
                const menuContainer = icon.closest('.menu-user');
                if (menuContainer && !menuContainer.querySelector('.user-dropdown')) {
                    this.createUserDropdown(menuContainer, profile);
                }
            });

            // Adicionar classe ao body para estilos específicos
            document.body.classList.add('user-logged-in');
            document.body.classList.add(`role-${profile.role}`);

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

    // Criar menu dropdown do utilizador
    createUserDropdown(container, profile) {
        // Criar wrapper para o ícone de utilizador se necessário
        const userIcon = container.querySelector('.icon-user');
        let dropdownContainer = userIcon.parentElement;
        
        // Se o ícone está diretamente no menu-user, criar um wrapper
        if (dropdownContainer.classList.contains('menu-user')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'user-icon-wrapper';
            wrapper.style.position = 'relative';
            userIcon.parentNode.insertBefore(wrapper, userIcon);
            wrapper.appendChild(userIcon);
            dropdownContainer = wrapper;
        }

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
                <a href="${profile.editUrl}" class="dropdown-item">
                    <span class="dropdown-icon">👤</span>
                    <span>Meu Perfil</span>
                </a>
                ${profile.role === 'prestador-de-servicos' ? `
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

            .menu-user {
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
            
            .menu-user {
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