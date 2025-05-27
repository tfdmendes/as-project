// Prestador Edit Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializePrestadorEdit();
});

function initializePrestadorEdit() {
    // Check if user is logged in as prestador
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    
    if (!currentUser.isLoggedIn || currentUser.role !== 'prestador-de-servicos') {
        // Redirect to login if not logged in as prestador
        window.location.href = 'login.html';
        return;
    }
    
    // Update user info from session
    updateUserInfo(currentUser);
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize notifications
    setupNotifications();
}

// Update user information on the page
function updateUserInfo(user) {
    // Update profile name if available
    const profileName = document.querySelector('.profile-name');
    if (profileName && user.name) {
        profileName.textContent = user.name;
    }
    
    // Update greeting
    const greeting = document.querySelector('.info-section h3');
    if (greeting && user.name) {
        greeting.textContent = `Olá, ${user.name}`;
    }
    
    // Update profile photo if available
    const profilePhoto = document.querySelector('.profile-photo');
    if (profilePhoto && user.profileImage) {
        profilePhoto.src = user.profileImage;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Change photo button
    const changePhotoBtn = document.querySelector('.change-photo-btn');
    if (changePhotoBtn) {
        changePhotoBtn.addEventListener('click', handlePhotoChange);
    }
    
    // Edit profile button
    const editProfileBtn = document.querySelector('.btn-primary');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            // Redirect to profile editing page or open modal
            console.log('Edit profile clicked');
            // You can implement a modal or redirect here
        });
    }
    
    // Messages button
    const messagesBtn = document.querySelectorAll('.btn-secondary')[0];
    if (messagesBtn) {
        messagesBtn.addEventListener('click', function() {
            window.location.href = 'messages.html';
        });
    }
    
    // Edit services button
    const editServicesBtn = document.querySelectorAll('.btn-secondary')[1];
    if (editServicesBtn) {
        editServicesBtn.addEventListener('click', function() {
            window.location.href = 'edit-services.html';
        });
    }
}

// Handle photo change
function handlePhotoChange() {
    // Create file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const profilePhoto = document.querySelector('.profile-photo');
                if (profilePhoto) {
                    profilePhoto.src = e.target.result;
                    
                    // Update session storage
                    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
                    currentUser.profileImage = e.target.result;
                    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
                }
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Trigger file selection
    fileInput.click();
}

// Setup notifications
function setupNotifications() {
    const closeButtons = document.querySelectorAll('.close-btn');
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const notification = this.closest('.notification-item');
            if (notification) {
                // Animate removal
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                notification.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    notification.remove();
                    
                    // Check if there are no more notifications
                    const remainingNotifications = document.querySelectorAll('.notification-item');
                    if (remainingNotifications.length === 0) {
                        const notificationsSection = document.querySelector('.notifications-section');
                        if (notificationsSection) {
                            notificationsSection.innerHTML = `
                                <h2 class="section-title">Todas as Notificações</h2>
                                <p style="text-align: center; color: #666; padding: 2rem;">
                                    Não há notificações pendentes
                                </p>
                            `;
                        }
                    }
                }, 300);
            }
        });
    });
}

// Mock calendar initialization (you can replace with actual calendar library)
function initializeCalendar() {
    const calendarPlaceholder = document.querySelector('.calendar-placeholder');
    if (calendarPlaceholder) {
        // Here you would initialize a real calendar component
        // For now, just adding some mock content
        calendarPlaceholder.innerHTML = `
            <div style="text-align: center;">
                <p>Calendário de disponibilidade e reservas</p>
                <p style="font-size: 0.9rem; color: #999; margin-top: 1rem;">
                    Integração com calendário em desenvolvimento
                </p>
            </div>
        `;
    }
}

// Initialize calendar on load
initializeCalendar();