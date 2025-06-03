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
    
    // Find and update the account link
    const accountLinks = dropdownMenu.querySelectorAll('a[href*="account-edit"], a[href*="prestador-edit"]');
    accountLinks.forEach(link => {
        if (role === 'prestador-de-servicos') {
            link.href = 'prestador-edit.html';
            if (link.textContent.trim() === 'Account') {
                link.textContent = 'Painel Prestador';
            }
        } else {
            link.href = 'account-edit.html';
            link.textContent = 'Account';
        }
    });
    
    // Add prestador-specific menu items if needed
    if (role === 'prestador-de-servicos') {
        addPrestadorMenuItems(dropdownMenu);
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
        { href: 'edit-services.html', text: 'Meus Serviços' }
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