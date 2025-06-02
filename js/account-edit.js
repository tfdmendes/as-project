// Enhanced pet management system with localStorage
// Add this to your account-edit.js file or create a separate module

// Default placeholder image for pets - a simple paw print SVG
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

class PetManager {
    constructor() {
        this.storageKey = 'userPets';
        this.pets = this.loadPets();
    }

    // Load pets from localStorage
    loadPets() {
        try {
            const storedPets = localStorage.getItem(this.storageKey);
            return storedPets ? JSON.parse(storedPets) : [];
        } catch (error) {
            console.error('Error loading pets from localStorage:', error);
            return [];
        }
    }

    // Save pets to localStorage
    savePets() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.pets));
            return true;
        } catch (error) {
            console.error('Error saving pets to localStorage:', error);
            return false;
        }
    }

    // Add a new pet
    addPet(petData) {
        const pet = {
            id: Date.now().toString(),
            name: petData.name,
            breed: petData.breed,
            species: petData.species || 'dog',
            age: petData.age || '',
            description: petData.description || '',
            photo: petData.photo || DEFAULT_PET_IMAGE,
            createdAt: new Date().toISOString()
        };
        
        this.pets.push(pet);
        this.savePets();
        return pet;
    }

    // Update pet photo
    updatePetPhoto(petId, photoUrl) {
        const pet = this.pets.find(p => p.id === petId);
        if (pet) {
            pet.photo = photoUrl;
            this.savePets();
            return true;
        }
        return false;
    }

    // Delete a pet
    deletePet(petId) {
        const index = this.pets.findIndex(p => p.id === petId);
        if (index > -1) {
            this.pets.splice(index, 1);
            this.savePets();
            return true;
        }
        return false;
    }

    // Get all pets
    getAllPets() {
        return [...this.pets];
    }
}

// Initialize pet manager
const petManager = new PetManager();

// Create pet form modal HTML
function createPetFormModal() {
    const modal = document.createElement('div');
    modal.className = 'pet-modal';
    modal.innerHTML = `
        <div class="pet-modal-content">
            <div class="pet-modal-header">
                <h2>Adicionar Novo Pet</h2>
                <button class="close-modal">&times;</button>
            </div>
            <form id="petForm" class="pet-form">
                <div class="form-group">
                    <label for="petName">Nome do Pet *</label>
                    <input type="text" id="petName" name="name" required>
                </div>
                
                <div class="form-group">
                    <label for="petSpecies">Espécie *</label>
                    <select id="petSpecies" name="species" required>
                        <option value="">Selecione...</option>
                        <option value="dog">Cão</option>
                        <option value="cat">Gato</option>
                        <option value="bird">Pássaro</option>
                        <option value="rabbit">Coelho</option>
                        <option value="other">Outro</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="petBreed">Raça</label>
                    <input type="text" id="petBreed" name="breed" placeholder="Ex: Golden Retriever">
                </div>
                
                <div class="form-group">
                    <label for="petAge">Idade</label>
                    <input type="text" id="petAge" name="age" placeholder="Ex: 2 anos">
                </div>
                
                <div class="form-group">
                    <label for="petDescription">Descrição</label>
                    <textarea id="petDescription" name="description" rows="3" placeholder="Doenças, Vacinas, Alergias"></textarea>
                </div>
                
                <div class="form-group">
                    <label for="petPhoto">Foto do Pet</label>
                    <input type="file" id="petPhoto" name="photo" accept="image/*">
                    <div class="photo-preview" id="photoPreview">
                        <img src="${DEFAULT_PET_IMAGE}" alt="Pet placeholder">
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn-cancel-modal">Cancelar</button>
                    <button type="submit" class="btn-submit">Adicionar Pet</button>
                </div>
            </form>
        </div>
    `;
    
    return modal;
}

// Add CSS for the modal
function addModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .pet-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            animation: fadeIn 0.3s ease-out;
        }
        
        .pet-modal.active {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .pet-modal-content {
            background: white;
            border-radius: 15px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            animation: slideIn 0.3s ease-out;
        }
        
        .pet-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
        }
        
        .pet-modal-header h2 {
            margin: 0;
            color: #333;
        }
        
        .close-modal {
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 30px;
            height: 30px;
        }
        
        .close-modal:hover {
            color: #333;
        }
        
        .pet-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .form-group label {
            font-weight: 500;
            color: #333;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s;
            font-family: inherit;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #196085;
        }
        
        .form-group textarea {
            resize: vertical;
            min-height: 60px;
        }
        
        .photo-preview {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            margin-top: 10px;
            display: block;
            overflow: hidden;
            border: 2px dashed #ddd;
            cursor: pointer;
            transition: all 0.3s;
            position: relative;
        }
        
        .photo-preview:hover {
            border-color: #196085;
            transform: scale(1.05);
        }
        
        .photo-preview::after {
            content: "📷";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 24px;
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .photo-preview:hover::after {
            opacity: 0.7;
        }
        
        .photo-preview img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .form-actions {
            display: flex;
            gap: 15px;
            justify-content: flex-end;
            margin-top: 20px;
        }
        
        .btn-cancel-modal,
        .btn-submit {
            padding: 10px 25px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s;
            border: none;
        }
        
        .btn-cancel-modal {
            background: #f5f5f5;
            color: #666;
        }
        
        .btn-cancel-modal:hover {
            background: #e0e0e0;
        }
        
        .btn-submit {
            background: #196085;
            color: white;
        }
        
        .btn-submit:hover {
            background: #145070;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from {
                transform: translateY(-20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        /* Pet photo styling */
        .pet-card .pet-photo {
            background: #f5f5f5;
            border: 2px solid #e0e0e0;
            transition: all 0.3s;
        }
        
        .pet-card .pet-photo:hover {
            border-color: #196085;
            transform: scale(1.05);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        /* Pet card styling enhancements */
        .pet-card {
            padding: 10px;
            border-radius: 10px;
            transition: all 0.3s;
        }
        
        .pet-card:hover {
            background: rgba(212, 228, 212, 0.1);
        }
        
        /* Info icon positioning */
        .pet-info-icon {
            position: absolute;
            top: 15px;
            left: 15px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            cursor: help;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        /* Add pet button text styling */
        .add-pet-button span {
            font-size: 12px;
            color: #196085;
            margin-top: 5px;
        }
        
        /* Delete pet button styling */
        .delete-pet {
            position: absolute;
            top: 5px;
            right: 5px;
            background: white;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .pet-card:hover .delete-pet {
            opacity: 1;
        }
        
        .delete-pet:hover {
            background: #ffeeee;
        }
        
        /* File input styling */
        input[type="file"] {
            cursor: pointer;
        }
        
        input[type="file"]::file-selector-button {
            background: #196085;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            margin-right: 10px;
            transition: background 0.3s;
        }
        
        input[type="file"]::file-selector-button:hover {
            background: #145070;
        }
    `;
    document.head.appendChild(style);
}

// Enhanced initialization function
document.addEventListener('DOMContentLoaded', function() {
    // Add modal styles
    addModalStyles();
    
    // Create and append modal
    const modal = createPetFormModal();
    document.body.appendChild(modal);
    
    // Set placeholder images for existing pets without photos
    document.querySelectorAll('.pet-photo').forEach(img => {
        img.addEventListener('error', function() {
            this.src = DEFAULT_PET_IMAGE;
        });
    });
    
    // Load and display existing pets
    displayPets();
    
    // Add pet button click handler
    const addPetButton = document.getElementById('addPetButton');
    if (addPetButton) {
        addPetButton.addEventListener('click', function() {
            modal.classList.add('active');
        });
    }
    
    // Modal close handlers
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.classList.remove('active');
        document.getElementById('petForm').reset();
        document.getElementById('photoPreview').innerHTML = `<img src="${DEFAULT_PET_IMAGE}" alt="Pet placeholder">`;
    });
    
    modal.querySelector('.btn-cancel-modal').addEventListener('click', () => {
        modal.classList.remove('active');
        document.getElementById('petForm').reset();
        document.getElementById('photoPreview').innerHTML = `<img src="${DEFAULT_PET_IMAGE}" alt="Pet placeholder">`;
    });
    
    // Photo preview handler
    document.getElementById('petPhoto').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const preview = document.getElementById('photoPreview');
                preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Make photo preview clickable to trigger file input
    document.getElementById('photoPreview').addEventListener('click', function() {
        document.getElementById('petPhoto').click();
    });
    
    // Form submit handler
    document.getElementById('petForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const petData = {
            name: formData.get('name'),
            species: formData.get('species'),
            breed: formData.get('breed'),
            age: formData.get('age'),
            description: formData.get('description')
        };
        
        // Handle photo
        const photoFile = formData.get('photo');
        if (photoFile && photoFile.size > 0) {
            const reader = new FileReader();
            reader.onload = function(event) {
                petData.photo = event.target.result;
                const newPet = petManager.addPet(petData);
                addPetToDOM(newPet);
                modal.classList.remove('active');
                document.getElementById('petForm').reset();
                document.getElementById('photoPreview').innerHTML = `<img src="${DEFAULT_PET_IMAGE}" alt="Pet placeholder">`;
                showSuccessMessage('Pet adicionado com sucesso!');
            };
            reader.readAsDataURL(photoFile);
        } else {
            const newPet = petManager.addPet(petData);
            addPetToDOM(newPet);
            modal.classList.remove('active');
            this.reset();
            document.getElementById('photoPreview').innerHTML = `<img src="${DEFAULT_PET_IMAGE}" alt="Pet placeholder">`;
            showSuccessMessage('Pet adicionado com sucesso!');
        }
    });
});

// Display all pets from localStorage
function displayPets() {
    const pets = petManager.getAllPets();
    pets.forEach(pet => {
        addPetToDOM(pet);
    });
}

// Add pet to DOM
function addPetToDOM(pet) {
    const petsGrid = document.querySelector('.pets-grid');
    const addButton = document.querySelector('.add-pet-button');
    
    const petCard = document.createElement('div');
    petCard.className = 'pet-card';
    petCard.setAttribute('data-pet-id', pet.id);
    
    // Add description as title if it exists
    const titleText = pet.description ? `${pet.name}\n${pet.description}` : pet.name;
    
    petCard.innerHTML = `
        <img src="${pet.photo}" alt="${pet.name}" class="pet-photo" title="${titleText}">
        <h4 class="pet-name">${pet.name}</h4>
        <p class="pet-breed">${pet.breed || pet.species}</p>
        ${pet.description ? '<span class="pet-info-icon" title="' + pet.description + '">ℹ️</span>' : ''}
        <button class="delete-pet" data-pet-id="${pet.id}" title="Remover pet">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="#ff4444">
                <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8l1-10"/>
            </svg>
        </button>
    `;
    
    petsGrid.insertBefore(petCard, addButton);
    
    // Handle image loading errors
    const petPhoto = petCard.querySelector('.pet-photo');
    petPhoto.addEventListener('error', function() {
        this.src = DEFAULT_PET_IMAGE;
    });
    
    // Add click handler for photo update
    petPhoto.style.cursor = 'pointer';
    petPhoto.addEventListener('click', function() {
        updatePetPhoto(pet.id, this);
    });
    
    // Add delete handler
    petCard.querySelector('.delete-pet').addEventListener('click', function(e) {
        e.stopPropagation();
        if (confirm(`Tem certeza que deseja remover ${pet.name}?`)) {
            petManager.deletePet(pet.id);
            petCard.remove();
            showSuccessMessage('Pet removido com sucesso!');
        }
    });
}

// Update pet photo
function updatePetPhoto(petId, imgElement) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imgElement.src = e.target.result;
                petManager.updatePetPhoto(petId, e.target.result);
                showSuccessMessage('Foto atualizada com sucesso!');
            };
            reader.readAsDataURL(file);
        }
    });
    
    input.click();
}

// Success message function (reuse existing)
function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 1100;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 300);
    }, 3000);
}