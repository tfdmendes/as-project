// Index page specific header functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeIndexHeader();
});

function initializeIndexHeader() {
    // Check if user is logged in
    const isLoggedIn = checkUserSession();
    
    // Add body class for CSS targeting
    if (isLoggedIn) {
        document.body.classList.add('user-logged-in');
    }
    
    // Get header elements
    const menuIcon = document.querySelector('.cabecalho .icon-menu');
    const userIcon = document.querySelector('.cabecalho .icon-user');
    const loginLink = document.querySelector('.cabecalho .user-menu > a[href*="login"]');
    
    // Update menu icon visibility
    if (menuIcon) {
        if (!isLoggedIn) {
            menuIcon.style.display = 'none';
        } else {
            menuIcon.style.display = 'block';
            // Note: For index page, menu icon doesn't open a dropdown
            // It could redirect to a dashboard or do nothing
            menuIcon.addEventListener('click', function(e) {
                e.preventDefault();
                // You can add custom behavior here if needed
                console.log('Menu clicked on index page');
            });
        }
    }
    
    // Setup user icon click behavior
    if (userIcon) {
        // Remove any existing href wrapper
        const userIconLink = userIcon.closest('a');
        if (userIconLink) {
            userIconLink.addEventListener('click', function(e) {
                e.preventDefault();
            });
        }
        
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
    
    // Update login/logout link
    if (loginLink) {
        if (isLoggedIn) {
            loginLink.textContent = 'Logout';
            loginLink.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        }
    }
}

// Check if user is logged in
function checkUserSession() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    return currentUser.isLoggedIn === true;
}

// Logout function
function logout() {
    // Clear session
    sessionStorage.removeItem('currentUser');
    
    // Reload page to update UI
    window.location.reload();
}