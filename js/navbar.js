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
    
    // Check if user is logged in
    const isLoggedIn = checkUserSession();
    
    // Update navbar based on login status
    updateNavbarForAuthState(isLoggedIn);
    
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
                // Check user role and redirect accordingly
                const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
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

// Check if user is logged in
function checkUserSession() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    return currentUser.isLoggedIn === true;
}

// Update navbar UI based on authentication state
function updateNavbarForAuthState(isLoggedIn) {
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
    }
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

// Utility function to update user profile image if needed
function updateUserProfileImage() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const userIcon = document.getElementById('userIcon');
    
    if (userIcon && currentUser.isLoggedIn && currentUser.profileImage) {
        userIcon.src = currentUser.profileImage;
    }
}