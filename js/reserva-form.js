document.addEventListener('DOMContentLoaded', function () {
    // Default placeholder image for pets (same as in account-edit.js)
    const DEFAULT_PET_IMAGE = 'data:image/svg+xml;base64,' + btoa(`
    <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="120" rx="60" fill="#f0f0f0"/>
      <g transform="translate(60, 50)">
        <!-- Paw print -->
        <ellipse cx="0" cy="0" rx="15" ry="20" fill="#d0d0d0"/>
        <ellipse cx="-15" cy="-18" rx="10" ry="12" fill="#d0d0d0"/>
        <ellipse cx="15" cy="-18" rx="10" ry="12" fill="#d0d0d0"/>
        <ellipse cx="-8" cy="-28" rx="7" ry="8" fill="#d0d0d0"/>
        <ellipse cx="8" cy="-28" rx="7" ry="8" fill="#d0d0d0"/>
      </g>
      <text x="60" y="85" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#999">Adicionar Foto</text>
    </svg>
    `);

    // CRITICAL FIX: Ensure pets section is always visible
    const petsSelection = document.querySelector('.pets-selection');
    if (petsSelection) {
        petsSelection.style.cssText = 'opacity: 1 !important; transform: none !important; visibility: visible !important;';
    }

    // Load pets from localStorage
    function loadPetsFromStorage() {
        try {
            const storedPets = localStorage.getItem('userPets');
            return storedPets ? JSON.parse(storedPets) : [];
        } catch (error) {
            console.error('Error loading pets from localStorage:', error);
            return [];
        }
    }

    // Add dynamic pets to the reservation form
    function addDynamicPets() {
        const petsGrid = document.querySelector('.pets-grid');
        if (!petsGrid) return;

        // Ensure grid is visible
        petsGrid.style.cssText = 'opacity: 1 !important; visibility: visible !important;';

        // Find the position to insert new pets (before any existing add button)
        const existingAddButton = petsGrid.querySelector('.add-pet-option');
        
        // Load pets from localStorage
        const pets = loadPetsFromStorage();

        // Add each pet to the grid
        pets.forEach(pet => {
            const petOption = document.createElement('div');
            petOption.className = 'pet-option dynamic-pet';
            petOption.setAttribute('data-pet', pet.id);
            petOption.setAttribute('data-pet-name', pet.name);
            
            // Force visibility
            petOption.style.cssText = 'opacity: 1 !important; visibility: visible !important; transform: none !important;';

            // Determine the display breed/species text
            const breedText = pet.breed || pet.species || 'Pet';

            petOption.innerHTML = `
                <div class="pet-avatar">
                    <a href="agenda.html">
                        <img src="${pet.photo || DEFAULT_PET_IMAGE}" alt="${pet.name}" loading="lazy">
                    </a>
                </div>
                <div class="pet-name">${pet.name}</div>
                <div class="pet-breed">${breedText}</div>
            `;

            // Insert before the add button if it exists, otherwise append
            if (existingAddButton) {
                petsGrid.insertBefore(petOption, existingAddButton);
            } else {
                petsGrid.appendChild(petOption);
            }

            // Handle image loading errors
            const petImg = petOption.querySelector('img');
            petImg.addEventListener('error', function() {
                this.src = DEFAULT_PET_IMAGE;
            });
        });

        // Add the "Add Pet" button if it doesn't exist
        if (!existingAddButton) {
            const addPetButton = document.createElement('div');
            addPetButton.className = 'pet-option add-pet-option';
            addPetButton.style.cursor = 'pointer';
            addPetButton.style.cssText += 'opacity: 1 !important; visibility: visible !important;';
            addPetButton.innerHTML = `
                <div class="pet-avatar" style="background: #f5f5f5; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 48px; color: #196085;">+</span>
                </div>
                <div class="pet-name">Adicionar Pet</div>
                <div class="pet-breed">Novo registro</div>
            `;
            addPetButton.addEventListener('click', function() {
                window.location.href = 'account-edit.html';
            });
            petsGrid.appendChild(addPetButton);
        }
    }

    // Ensure all pets are visible
    function ensureAllPetsVisible() {
        document.querySelectorAll('.pet-option').forEach(pet => {
            pet.style.cssText += 'opacity: 1 !important; transform: none !important; visibility: visible !important;';
        });
        document.querySelectorAll('.pet-avatar, .pet-name, .pet-breed').forEach(el => {
            el.style.cssText += 'opacity: 1 !important; visibility: visible !important;';
        });
    }

    // Initialize pet selection handlers
    function initializePetSelection() {
        document.querySelectorAll('.pet-option:not(.add-pet-option)').forEach(option => {
            option.addEventListener('click', function () {
                document.querySelectorAll('.pet-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
    }

    // Initialize everything
    addDynamicPets();
    ensureAllPetsVisible();
    
    // Multiple calls to ensure visibility (catches any delayed rendering)
    setTimeout(() => {
        ensureAllPetsVisible();
        initializePetSelection();
    }, 100);
    
    setTimeout(ensureAllPetsVisible, 300);
    setTimeout(ensureAllPetsVisible, 500);
    setTimeout(ensureAllPetsVisible, 1000);

    // Form submission
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const selectedPet = document.querySelector('.pet-option.selected');
            if (!selectedPet) {
                alert('Por favor, selecione um pet');
                return;
            }

            const formData = new FormData(this);
            const petName = selectedPet.querySelector('.pet-name').textContent;
            const petId = selectedPet.dataset.pet || petName.toLowerCase();
            
            const bookingData = {
                petId: petId,
                petName: petName,
                startDate: formData.get('startDate'),
                endDate: formData.get('endDate'),
                startTime: formData.get('startTime'),
                endTime: formData.get('endTime'),
                service: formData.get('service'),
                notes: formData.get('notes')
            };

            console.log('Booking Data:', bookingData);
            alert(`Reserva para ${bookingData.petName} enviada com sucesso! Entraremos em contacto brevemente.`);

            // Reset do formulário
            this.reset();
            document.querySelectorAll('.pet-option').forEach(opt => opt.classList.remove('selected'));
        });
    }

    // Mostrar detalhes do serviço
    window.showServiceDetails = function () {
        alert('Detalhes do serviço:\n\nBanho & Tosquia Profissional\n- Banho completo com produtos premium\n- Tosquia profissional\n- Corte de unhas\n- Limpeza de ouvidos\n- Escovagem dos dentes\n\nDuração: 2-3 horas\nPreço: €35-50 (dependendo do tamanho do pet)');
    };

    // Definir data mínima (apenas se os campos existirem)
    const today = new Date().toISOString().split('T')[0];
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    if (startDateInput) {
        startDateInput.min = today;
        startDateInput.addEventListener('change', function () {
            if (endDateInput) {
                endDateInput.min = this.value;
            }
        });
    }
    
    if (endDateInput) {
        endDateInput.min = today;
    }

    // Animações ao scroll - EXCLUINDO a seção de pets
    const animatedElements = document.querySelectorAll('.service-details');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Animate only non-pet elements on scroll
    let animationTriggered = false;
    window.addEventListener('scroll', function () {
        if (!animationTriggered) {
            animatedElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;

                if (elementTop < window.innerHeight - elementVisible) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        }
    });

    // Listen for storage changes (when pets are added/removed in another tab)
    window.addEventListener('storage', function(e) {
        if (e.key === 'userPets') {
            // Remove existing dynamic pets
            document.querySelectorAll('.dynamic-pet').forEach(pet => pet.remove());
            // Re-add updated pets
            addDynamicPets();
            ensureAllPetsVisible();
            initializePetSelection();
        }
    });

    // Final visibility check on window load
    window.addEventListener('load', function() {
        ensureAllPetsVisible();
    });

    // Debug info in console
    console.log('Pets loaded:', loadPetsFromStorage());
    console.log('Pet options found:', document.querySelectorAll('.pet-option').length);
});