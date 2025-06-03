// index.js - Index page specific functionality with role awareness

document.addEventListener('DOMContentLoaded', function() {
    initializeIndexHeader();
    setupServiceCardClicks();
    setupPrestadorSection();
});

function initializeIndexHeader() {
    // Check if user is logged in
    const isLoggedIn = checkUserSession();
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    
    console.log('Index page - User logged in:', isLoggedIn);
    console.log('Index page - Current user:', currentUser);
    
    // Add body class for CSS targeting
    if (isLoggedIn) {
        document.body.classList.add('user-logged-in');
        if (currentUser.role) {
            document.body.classList.add(`role-${currentUser.role}`);
        }
        initializeDropdownMenu(); // Only initialize dropdown if logged in
    }
    
    // Get header elements
    const menuIcon = document.querySelector('.cabecalho .icon-menu');
    const userIcon = document.querySelector('.cabecalho .icon-user');
    
    // Update menu icon visibility
    if (menuIcon) {
        if (!isLoggedIn) {
            menuIcon.style.display = 'none';
            console.log('Menu icon hidden - user not logged in');
        } else {
            menuIcon.style.display = 'block';
            console.log('Menu icon shown - user logged in');
        }
    }
    
    // Setup user icon click behavior
    if (userIcon) {
        userIcon.style.cursor = 'pointer';
        
        // Clear any existing event listeners
        const newUserIcon = userIcon.cloneNode(true);
        userIcon.parentNode.replaceChild(newUserIcon, userIcon);
        
        newUserIcon.addEventListener('click', function(e) {
            console.log('User icon clicked. Logged in:', isLoggedIn);
            
            if (!isLoggedIn) {
                // Simple redirect to login
                console.log('Redirecting to login page');
                window.location.href = 'login.html';
            }
            // If logged in, the dropdown will handle this
        });
    }
    
    // Setup logout functionality
    setupLogoutFunctionality(isLoggedIn, currentUser);
    
    // Update UI for logged in user
    updateUIForLoggedInUser(isLoggedIn, currentUser);
}

function initializeDropdownMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const userIcon = document.getElementById('userIcon');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownOverlay = document.getElementById('dropdownOverlay');
    const logoutLink = document.querySelector('.logout-link');
    
    if (!menuToggle || !dropdownMenu || !dropdownOverlay) {
        console.log('Dropdown elements not found');
        return;
    }
    
    console.log('Initializing dropdown menu for logged in user');
    
    // Get current user for role-based updates
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    
    // Update dropdown links based on user role
    updateDropdownLinks(currentUser.role);
    
    // Menu icon opens dropdown
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Menu icon clicked - toggling dropdown');
        toggleDropdown();
    });
    
    // User icon also opens dropdown when logged in
    if (userIcon) {
        userIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('User icon clicked by logged in user - toggling dropdown');
            toggleDropdown();
        });
    }
    
    // Close dropdown when overlay is clicked
    dropdownOverlay.addEventListener('click', function() {
        closeDropdown();
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.menu-utilizador') && !e.target.closest('.dropdown-menu')) {
            closeDropdown();
        }
    });
    
    // Handle logout
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

function updateDropdownLinks(role) {
    const dropdownMenu = document.getElementById('dropdownMenu');
    if (!dropdownMenu) return;
    
    // Update account link based on user role
    const accountLinks = dropdownMenu.querySelectorAll('a[href*="account-edit"], a[href*="prestador-edit"]');
    accountLinks.forEach(link => {
        if (role === 'prestador-de-servicos') {
            link.href = 'prestador-edit.html';
            link.textContent = 'Painel Prestador';
        } else {
            link.href = 'account-edit.html';
            link.textContent = 'Account';
        }
    });
    
    // Add prestador-specific items if needed
    if (role === 'prestador-de-servicos') {
        const firstSection = dropdownMenu.querySelector('.dropdown-section');
        if (firstSection && !dropdownMenu.querySelector('a[href*="criar_servico"]')) {
            // Add prestador-specific links
            const prestadorItems = [
                { href: 'criar_servico.html', text: 'Criar Serviço' },
                { href: 'edit-services.html', text: 'Meus Serviços' }
            ];
            
            const accountLink = firstSection.querySelector('a[href*="prestador-edit"]');
            prestadorItems.forEach(item => {
                const link = document.createElement('a');
                link.href = item.href;
                link.className = 'dropdown-item';
                link.textContent = item.text;
                
                if (accountLink && accountLink.nextSibling) {
                    firstSection.insertBefore(link, accountLink.nextSibling);
                } else {
                    firstSection.appendChild(link);
                }
            });
        }
    }
}

// Setup the prestador section with dynamic profile image
function setupPrestadorSection() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const prestadorImage = document.querySelector('.prestador .card-prestador img');
    
    if (currentUser.isLoggedIn && prestadorImage) {
        // Get user profile
        const userProfiles = {
            "user@petotel.com": {
                avatar: "assets/people/RyanMatos.png",
                editUrl: "account-edit.html"
            },
            "prestador@petotel.com": {
                avatar: "assets/people/tiago.png",
                editUrl: "prestador-edit.html"
            }
        };
        
        const profile = userProfiles[currentUser.email];
        if (profile) {
            // Update the prestador image to user's profile image
            prestadorImage.src = profile.avatar;
            prestadorImage.alt = currentUser.name || 'Perfil';
            prestadorImage.style.borderRadius = '50%';
            prestadorImage.style.width = '200px';
            prestadorImage.style.height = '200px';
            prestadorImage.style.objectFit = 'cover';
            prestadorImage.style.cursor = 'pointer';
            
            // Make the image clickable
            prestadorImage.addEventListener('click', function() {
                window.location.href = profile.editUrl;
            });
            
            // Also make the parent card clickable if it exists
            const cardPrestador = prestadorImage.closest('.card-prestador');
            if (cardPrestador) {
                cardPrestador.style.cursor = 'pointer';
                cardPrestador.addEventListener('click', function(e) {
                    if (e.target === prestadorImage) return; // Avoid double navigation
                    window.location.href = profile.editUrl;
                });
            }
        }
    }
}

function toggleDropdown() {
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownOverlay = document.getElementById('dropdownOverlay');
    const menuIcon = document.getElementById('menuToggle');
    
    if (dropdownMenu && dropdownOverlay) {
        const isOpen = dropdownMenu.classList.contains('show');
        
        if (isOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    }
}

function openDropdown() {
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownOverlay = document.getElementById('dropdownOverlay');
    const menuIcon = document.getElementById('menuToggle');
    
    if (dropdownMenu && dropdownOverlay) {
        dropdownMenu.classList.add('show');
        dropdownOverlay.classList.add('show');
        if (menuIcon) {
            menuIcon.classList.add('active');
        }
        console.log('Dropdown opened');
    }
}

function closeDropdown() {
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownOverlay = document.getElementById('dropdownOverlay');
    const menuIcon = document.getElementById('menuToggle');
    
    if (dropdownMenu && dropdownOverlay) {
        dropdownMenu.classList.remove('show');
        dropdownOverlay.classList.remove('show');
        if (menuIcon) {
            menuIcon.classList.remove('active');
        }
        console.log('Dropdown closed');
    }
}

// Check if user is logged in
function checkUserSession() {
    try {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
        const isLoggedIn = currentUser.isLoggedIn === true;
        
        console.log('Session check - User data:', currentUser);
        console.log('Session check - Is logged in:', isLoggedIn);
        
        return isLoggedIn;
    } catch (error) {
        console.error('Error checking user session:', error);
        return false;
    }
}

// Setup logout functionality
function setupLogoutFunctionality(isLoggedIn) {
    if (isLoggedIn) {
        console.log('Logout functionality available');
        
        // Add keyboard shortcut for logout (Ctrl+L)
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'l') {
                e.preventDefault();
                if (confirm('Deseja fazer logout?')) {
                    logout();
                }
            }
        });
    }
}

// Logout function
function logout() {
    console.log('Logging out user...');
    
    // Clear session
    sessionStorage.removeItem('currentUser');
    
    // Reload page to update UI
    window.location.reload();
}

// Update UI for logged in user
function updateUIForLoggedInUser(isLoggedIn, currentUser) {
    if (isLoggedIn) {
        console.log(`Welcome back, ${currentUser.name}!`);
        
        // Update "Torna-te Prestador" button based on user role
        const prestadorButton = document.querySelector('.botao-prestador');
        if (prestadorButton) {
            if (currentUser.role === 'prestador-de-servicos') {
                prestadorButton.textContent = 'Meu Painel';
                prestadorButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.location.href = 'prestador-edit.html';
                });
            } else {
                // Regular users can still become prestador
                prestadorButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.location.href = 'prestador.html';
                });
            }
        }
        
        // Update the bottom "Torna-te Prestador" button as well
        const bottomPrestadorButton = document.querySelector('.btn-prestador');
        if (bottomPrestadorButton) {
            if (currentUser.role === 'prestador-de-servicos') {
                bottomPrestadorButton.textContent = 'Ir para Meu Painel';
                bottomPrestadorButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.location.href = 'prestador-edit.html';
                });
            }
        }
    }
}

// Service card click handling
function setupServiceCardClicks() {
    const serviceCards = document.querySelectorAll('.cards-servicos .card');
    
    serviceCards.forEach(card => {
        // Prevent propagation on favorite button
        const favorito = card.querySelector('.favorito');
        if (favorito) {
            favorito.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
        
        // Prevent propagation on circular image (prestador link)
        const imagemCircular = card.querySelector('.imagem-circular');
        if (imagemCircular) {
            imagemCircular.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
        
        // Add cursor pointer to clickable areas
        const mainImageLink = card.querySelector('.card-image-wrapper > a:first-child');
        if (mainImageLink) {
            mainImageLink.style.cursor = 'pointer';
        }
    });
    
    console.log('Service card clicks configured');
}

// Toggle favorite function
function toggleFavorito(el) {
    el.classList.toggle('ativo');
    
    const isActive = el.classList.contains('ativo');
    console.log('Favorito', isActive ? 'adicionado' : 'removido');
    
    // Here you can add logic to save favorite state
    // For example, save to localStorage or send to server
}