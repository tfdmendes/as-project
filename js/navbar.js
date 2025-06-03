// navbar.js - Role-aware navigation for all pages except index.html

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navbar functionality
    initializeNavbar();
});

function initializeNavbar() {
    // Don't initialize navbar on index.html
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        return;
    }
    
    // Get navbar elements
    const menuToggle = document.getElementById('menuToggle');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownOverlay = document.getElementById('dropdownOverlay');
    const userIcon = document.getElementById('userIcon');
    const loginLink = document.querySelector('.login-link');
    const logoutLink = document.querySelector('.logout-link');
    
    // Check if user is logged in and get user data
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const isLoggedIn = currentUser.isLoggedIn === true;
    
    // Update navbar based on login status
    updateNavbarForAuthState(isLoggedIn, currentUser);
    
    // Update dropdown links based on user role
    if (isLoggedIn && currentUser.role) {
        updateDropdownLinksForRole(currentUser.role);
    }
    
    // Also update links in any existing dropdown menus
    updateAllDropdownLinks();
    
    // Setup dropdown menu toggle
    if (menuToggle && dropdownMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleDropdown();
        });
    }
    
    // Setup user icon click behavior
    if (userIcon) {
        userIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (!isLoggedIn) {
                // Redirect to login if not logged in
                window.location.href = 'login.html';
            } else {
                // Redirect to appropriate edit page based on role
                if (currentUser.role === 'prestador-de-servicos') {
                    window.location.href = 'prestador-edit.html';
                } else {
                    window.location.href = 'account-edit.html';
                }
            }
        });
    }
    
    // Setup overlay click to close dropdown
    if (dropdownOverlay) {
        dropdownOverlay.addEventListener('click', function() {
            closeDropdown();
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (dropdownMenu && !dropdownMenu.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            closeDropdown();
        }
    });
    
    // Close dropdown on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeDropdown();
        }
    });
    
    // Setup login/logout functionality
    if (loginLink) {
        if (isLoggedIn) {
            loginLink.textContent = 'Logout';
            loginLink.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        }
    }
    
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

// Update navbar UI based on authentication state
function updateNavbarForAuthState(isLoggedIn, currentUser) {
    const menuToggle = document.getElementById('menuToggle');
    
    if (!isLoggedIn) {
        // Hide menu icon for non-logged in users
        if (menuToggle) {
            menuToggle.style.display = 'none';
        }
    } else {
        // Show menu icon for logged in users
        if (menuToggle) {
            menuToggle.style.display = 'block';
        }
        
        // Update user profile image if available
        updateUserProfileImage(currentUser);
    }
}

// Update dropdown links based on user role
function updateDropdownLinksForRole(role) {
    const dropdownMenu = document.getElementById('dropdownMenu');
    if (!dropdownMenu) return;
    
    // Determine if user is prestador
    const isPrestador = role === 'prestador-de-servicos';
    
    // Update main navigation links based on role
    const navigationLinks = {
        'messages.html': isPrestador ? 'messages_prestador.html' : 'messages.html',
        'messages_prestador.html': isPrestador ? 'messages_prestador.html' : 'messages.html',
        'notifications.html': isPrestador ? 'notifications_prestador.html' : 'notifications.html',
        'notifications_prestador.html': isPrestador ? 'notifications_prestador.html' : 'notifications.html',
        'reservations.html': isPrestador ? 'reservations_prestador.html' : 'reservations.html',
        'reservations_prestador.html': isPrestador ? 'reservations_prestador.html' : 'reservations.html',
        'wishlists.html': isPrestador ? 'wishlists_prestador.html' : 'wishlists.html',
        'wishlists_prestador.html': isPrestador ? 'wishlists_prestador.html' : 'wishlists.html'
    };
    
    // Update all links in the dropdown
    const allLinks = dropdownMenu.querySelectorAll('a');
    allLinks.forEach(link => {
        const currentHref = link.getAttribute('href');
        
        // Check if this link needs to be updated
        if (navigationLinks[currentHref]) {
            link.href = navigationLinks[currentHref];
        }
        
        // Update account/prestador panel link
        if (currentHref === 'account-edit.html' || currentHref === 'prestador-edit.html') {
            if (isPrestador) {
                link.href = 'prestador-edit.html';
                if (link.textContent.trim() === 'Account') {
                    link.textContent = 'Painel Prestador';
                }
            } else {
                link.href = 'account-edit.html';
                link.textContent = 'Account';
            }
        }
    });
    
    // Add prestador-specific menu items if needed
    if (isPrestador) {
        addPrestadorMenuItems(dropdownMenu);
    }
}

// Helper function to update links on page load
function updateAllDropdownLinks() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    if (currentUser.isLoggedIn && currentUser.role) {
        updateDropdownLinksForRole(currentUser.role);
    }
}

// Add prestador-specific menu items
function addPrestadorMenuItems(dropdownMenu) {
    const firstSection = dropdownMenu.querySelector('.dropdown-section');
    if (!firstSection) return;
    
    // Check if items already exist
    if (dropdownMenu.querySelector('a[href*="criar_servico"]')) return;
    
    // Create prestador-specific links
    const prestadorItems = [
        { href: 'criar_servico.html', text: 'Criar Serviço' },
        { href: 'edit-services.html', text: 'Meus Serviços' },
        { href: 'prestador-dashboard.html', text: 'Dashboard' }
    ];
    
    // Find the position after "Account" link
    const accountLink = firstSection.querySelector('a[href*="prestador-edit"], a[href*="account-edit"]');
    
    prestadorItems.forEach(item => {
        const link = document.createElement('a');
        link.href = item.href;
        link.className = 'dropdown-item';
        link.textContent = item.text;
        
        // Insert after account link
        if (accountLink && accountLink.nextSibling) {
            firstSection.insertBefore(link, accountLink.nextSibling);
        } else {
            firstSection.appendChild(link);
        }
    });
}

// Toggle dropdown menu
function toggleDropdown() {
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownOverlay = document.getElementById('dropdownOverlay');
    
    if (dropdownMenu && dropdownOverlay) {
        const isOpen = dropdownMenu.classList.contains('show');
        
        if (isOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    }
}

// Open dropdown menu
function openDropdown() {
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownOverlay = document.getElementById('dropdownOverlay');
    
    if (dropdownMenu && dropdownOverlay) {
        dropdownMenu.classList.add('show');
        dropdownOverlay.classList.add('show');
        document.body.classList.add('menu-open');
    }
}

// Close dropdown menu
function closeDropdown() {
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownOverlay = document.getElementById('dropdownOverlay');
    
    if (dropdownMenu && dropdownOverlay) {
        dropdownMenu.classList.remove('show');
        dropdownOverlay.classList.remove('show');
        document.body.classList.remove('menu-open');
    }
}

// Logout function
function logout() {
    // Clear session
    sessionStorage.removeItem('currentUser');
    
    // Redirect to homepage
    window.location.href = 'index.html';
}

// Update user profile image based on user data
function updateUserProfileImage(currentUser) {
    const userIcon = document.getElementById('userIcon');
    
    if (userIcon && currentUser.isLoggedIn) {
        // Get user profile from auth profiles
        const userProfiles = {
            "user@petotel.com": {
                avatar: "assets/people/RyanMatos.png"
            },
            "prestador@petotel.com": {
                avatar: "assets/people/tiago.png"
            }
        };
        
        const profile = userProfiles[currentUser.email];
        if (profile && profile.avatar) {
            userIcon.src = profile.avatar;
            userIcon.style.borderRadius = '50%';
            userIcon.style.width = '32px';
            userIcon.style.height = '32px';
            userIcon.style.objectFit = 'cover';
        }
    }
}