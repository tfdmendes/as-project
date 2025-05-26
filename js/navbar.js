// Aguardar o carregamento do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do menu
    const menuToggle = document.getElementById('menuToggle');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownOverlay = document.getElementById('dropdownOverlay');
    
    // Estado do menu
    let isMenuOpen = false;
    
    // Toggle do menu
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            openMenu();
        } else {
            closeMenu();
        }
    }
    
    // Abrir menu
    function openMenu() {
        dropdownMenu.classList.add('active');
        dropdownOverlay.classList.add('active');
        menuToggle.classList.add('active');
        
        // Prevenir scroll do body quando o menu está aberto
        document.body.classList.add('menu-open');
    }
    
    // Fechar menu
    function closeMenu() {
        dropdownMenu.classList.remove('active');
        dropdownOverlay.classList.remove('active');
        menuToggle.classList.remove('active');
        
        // Restaurar scroll do body
        document.body.classList.remove('menu-open');
        isMenuOpen = false;
    }
    
    // Event listeners
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });
    }
    
    // Fechar ao clicar no overlay
    if (dropdownOverlay) {
        dropdownOverlay.addEventListener('click', closeMenu);
    }
    
    // Fechar ao clicar em um item do menu
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            closeMenu();
        });
    });
    
    // Fechar ao pressionar ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });
    
    // Prevenir fechamento ao clicar dentro do menu
    if (dropdownMenu) {
        dropdownMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', function(e) {
        if (isMenuOpen && !dropdownMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Adicionar animação suave ao scroll
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
});

// Função para criar o menu em outras páginas
function createNavbarMenu() {
    // Esta função pode ser usada para injetar o menu dinamicamente
    // se você preferir não repetir o HTML em cada página
    
    const menuHTML = `
        <div class="dropdown-menu" id="dropdownMenu">
            <div class="dropdown-section">
                <a href="messages.html" class="dropdown-item">Messages</a>
                <a href="notifications.html" class="dropdown-item">Notifications</a>
                <a href="reservations.html" class="dropdown-item">Reservations</a>
                <a href="wishlists.html" class="dropdown-item">Wishlists</a>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-section">
                <a href="account.html" class="dropdown-item">Account</a>
                <a href="help-center.html" class="dropdown-item">Help Center</a>
                <a href="logout.html" class="dropdown-item">Logout</a>
            </div>
        </div>
    `;
    
    const overlayHTML = `<div class="dropdown-overlay" id="dropdownOverlay"></div>`;
    
    // Adicionar ao menu-user se não existir
    const menuUser = document.querySelector('.menu-user');
    if (menuUser && !document.getElementById('dropdownMenu')) {
        menuUser.insertAdjacentHTML('beforeend', menuHTML);
        document.body.insertAdjacentHTML('beforeend', overlayHTML);
    }
}

// Chamar a função quando a página carregar
document.addEventListener('DOMContentLoaded', createNavbarMenu);




// Check if user is logged in
function checkUserSession() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    return currentUser.isLoggedIn === true;
}

// Update user icon behavior based on login status
function updateUserIconBehavior() {
    const userIcons = document.querySelectorAll('.icon-user');
    const isLoggedIn = checkUserSession();
    
    userIcons.forEach(icon => {
        icon.style.cursor = 'pointer';
        
        if (!isLoggedIn) {
            // If not logged in, clicking user icon goes to login
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = 'login.html';
            });
        } else {
            // If logged in, clicking user icon goes to account-edit
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = 'account-edit.html';
            });
        }
    });
}

// Handle dropdown menu (only for logged-in users)
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownOverlay = document.getElementById('dropdownOverlay');
    const isLoggedIn = checkUserSession();
    
    // Update user icon behavior
    updateUserIconBehavior();
    
    // Only show dropdown menu for logged-in users
    if (menuToggle && dropdownMenu && isLoggedIn) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
            dropdownOverlay.classList.toggle('show');
        });
        
        // Close dropdown when clicking overlay
        if (dropdownOverlay) {
            dropdownOverlay.addEventListener('click', function() {
                dropdownMenu.classList.remove('show');
                dropdownOverlay.classList.remove('show');
            });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdownMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                dropdownMenu.classList.remove('show');
                dropdownOverlay.classList.remove('show');
            }
        });
    }
    
    // Update login/logout links
    const loginLinks = document.querySelectorAll('a[href="login.html"], .nav-link:contains("Login")');
    loginLinks.forEach(link => {
        if (link.textContent.includes('Login')) {
            if (isLoggedIn) {
                link.textContent = 'Logout';
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Clear session
                    sessionStorage.removeItem('currentUser');
                    // Redirect to home
                    window.location.href = 'index.html';
                });
            }
        }
    });
    
    // Update user name in header if logged in
    if (isLoggedIn) {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const headerProfileImg = document.getElementById('headerProfileImg');
        if (headerProfileImg && currentUser.role === 'user') {
            headerProfileImg.src = 'assets/people/RyanMatos.png';
        }
    }
});

// Add logout functionality to logout links
document.addEventListener('DOMContentLoaded', function() {
    const logoutLinks = document.querySelectorAll('a[href="logout.html"]');
    logoutLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Clear session
            sessionStorage.removeItem('currentUser');
            // Redirect to home
            window.location.href = 'index.html';
        });
    });
});