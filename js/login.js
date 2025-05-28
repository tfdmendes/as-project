// Dictionary with fixed login credentials
const users = {
    "user@petotel.com": {
        password: "user123",
        role: "user",
        name: "Rhyan Matos",
        redirectUrl: "account-edit.html"
    },
    "prestador@petotel.com": {
        password: "prestador123",
        role: "prestador-de-servicos",
        name: "Tiago Fernandes",
        redirectUrl: "prestador-edit.html" 
    }
};

// Get form elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('errorMessage');
const rememberMeCheckbox = document.getElementById('rememberMe');

// Check if user is already logged in
window.addEventListener('DOMContentLoaded', () => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberMeCheckbox.checked = true;
    }
});

// Handle form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Clear previous error messages
    errorMessage.textContent = '';
    
    // Validate credentials
    if (authenticateUser(email, password)) {
        // Success! Store user session
        const user = users[email];
        
        // Store session data (in a real app, this would be handled server-side)
        sessionStorage.setItem('currentUser', JSON.stringify({
            email: email,
            name: user.name,
            role: user.role,
            isLoggedIn: true
        }));
        
        // Handle remember me
        if (rememberMeCheckbox.checked) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }
        
        // Show success message
        errorMessage.style.color = '#4CAF50';
        errorMessage.textContent = 'Login bem-sucedido! Redirecionando...';
        
        // Add logged-in class to body for CSS
        document.body.classList.add('user-logged-in');
        
        // Redirect after a short delay
        setTimeout(() => {
            window.location.href = user.redirectUrl;
        }, 1000);
        
    } else {
        // Failed authentication
        errorMessage.style.color = '#e74c3c';
        errorMessage.textContent = 'Email ou password incorretos. Por favor, tente novamente.';
        
        // Shake the form
        loginForm.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            loginForm.style.animation = '';
        }, 500);
    }
});

// Authentication function
function authenticateUser(email, password) {
    // Check if email exists in our users dictionary
    if (users.hasOwnProperty(email)) {
        // Check if password matches
        return users[email].password === password;
    }
    return false;
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Update navbar user icon to link to login
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    
    if (!currentUser.isLoggedIn) {
        // Update user icon links to point to login page
        const userIcons = document.querySelectorAll('.icon-user');
        userIcons.forEach(icon => {
            icon.style.cursor = 'pointer';
            icon.addEventListener('click', () => {
                window.location.href = 'login.html';
            });
            
            // If the icon is inside a link, update the link
            const parentLink = icon.closest('a');
            if (parentLink) {
                parentLink.href = 'login.html';
            }
        });
    }
});
