// Index page specific header functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeIndexHeader();
    initializeDropdownMenu();
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
    }
    
    // Get header elements
    const menuIcon = document.querySelector('.cabecalho .icon-menu');
    const userIcon = document.querySelector('.cabecalho .icon-user');
    const mobileAppLink = document.querySelector('.cabecalho .user-menu > a');
    
    console.log('Menu icon found:', !!menuIcon);
    console.log('User icon found:', !!userIcon);
    
    // Update menu icon visibility
    if (menuIcon) {
        if (!isLoggedIn) {
            menuIcon.style.display = 'none';
            console.log('Menu icon hidden - user not logged in');
        } else {
            menuIcon.style.display = 'block';
            menuIcon.style.cursor = 'pointer';
            console.log('Menu icon shown - user logged in');
        }
    }
    
    // Setup user icon click behavior (only redirect if not logged in)
    if (userIcon) {
        userIcon.style.cursor = 'pointer';
        
        userIcon.addEventListener('click', function(e) {
            if (!isLoggedIn) {
                e.preventDefault();
                e.stopPropagation();
                console.log('User icon clicked - redirecting to login');
                window.location.href = 'login.html';
            }
            // If logged in, let the dropdown menu handle the click
        });
    }
    
    // Setup logout functionality
    setupLogoutFunctionality(isLoggedIn, currentUser);
    
    // Update UI for logged in user
    updateUIForLoggedInUser(isLoggedIn, currentUser);
}

// Index page specific header functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeIndexHeader();
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
        initializeDropdownMenu(); // Only initialize dropdown if logged in
    }
    
    // Get header elements
    const menuIcon = document.querySelector('.cabecalho .icon-menu');
    const userIcon = document.querySelector('.cabecalho .icon-user');
    
    console.log('Menu icon found:', !!menuIcon);
    console.log('User icon found:', !!userIcon);
    
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
    
    // Setup user icon click behavior - SIMPLE VERSION
    if (userIcon) {
        userIcon.style.cursor = 'pointer';
        
        // Clear any existing event listeners
        const newUserIcon = userIcon.cloneNode(true);
        userIcon.parentNode.replaceChild(newUserIcon, userIcon);
        
        newUserIcon.addEventListener('click', function(e) {
            console.log('User icon clicked. Logged in:', isLoggedIn);
            
            if (!isLoggedIn) {
                // Simple redirect to login - no interference
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
    
    // ONLY menu icon opens dropdown - very specific
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Menu icon clicked - toggling dropdown');
        toggleDropdown();
    });
    
    // User icon also opens dropdown but ONLY when logged in
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
        // More specific check - only close if clicking completely outside
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
    
    // Update dropdown links based on user role
    updateDropdownLinks();
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

function updateDropdownLinks() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const accountLink = document.querySelector('.dropdown-item[href*="account-edit"]');
    
    // Update account link based on user role
    if (accountLink && currentUser.role === 'prestador-de-servicos') {
        accountLink.href = 'prestador-edit.html';
        accountLink.textContent = 'Prestador Panel';
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

function updateDropdownLinks() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const accountLink = document.querySelector('.dropdown-item[href*="account-edit"]');
    
    // Update account link based on user role
    if (accountLink && currentUser.role === 'prestador-de-servicos') {
        accountLink.href = 'prestador-edit.html';
        accountLink.textContent = 'Prestador Panel';
    }
}

// Check if user is logged in (improved version)
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
        // Add logout option to context menu or create a logout button
        // This could be implemented as a right-click context menu or a separate button
        console.log('Logout functionality available');
        
        // Example: Add keyboard shortcut for logout (Ctrl+L)
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
    
    // Clear any remember me data if needed
    // localStorage.removeItem('rememberedEmail'); // Uncomment if you want to clear remember me
    
    // Reload page to update UI
    window.location.reload();
}

// Optional: Add visual feedback for logged in state
function updateUIForLoggedInUser() {
    const isLoggedIn = checkUserSession();
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    
    if (isLoggedIn) {
        // You could add a welcome message or change some UI elements
        console.log(`Welcome back, ${currentUser.name}!`);
        
        // Example: Change the "Torna-te Prestador" button text if user is already a prestador
        const prestadorButton = document.querySelector('.botao-prestador');
        if (prestadorButton && currentUser.role === 'prestador-de-servicos') {
            prestadorButton.textContent = 'Meu Painel';
            prestadorButton.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'prestador-edit.html';
            });
        }
    }
}

// Call the UI update function
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updateUIForLoggedInUser, 100); // Small delay to ensure everything is loaded
});