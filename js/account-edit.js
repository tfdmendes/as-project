// Aguardar o carregamento do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos do DOM
    const uploadButton = document.getElementById('uploadButton');
    const photoInput = document.getElementById('photoInput');
    const profilePhoto = document.getElementById('profilePhoto');
    const addPetButton = document.getElementById('addPetButton');
    const cancelButton = document.getElementById('cancelButton');
    const saveButton = document.getElementById('saveButton');
    const toggleSwitch = document.querySelector('.toggle input[type="checkbox"]');
    
    // Upload de foto do perfil
    if (uploadButton && photoInput) {
        uploadButton.addEventListener('click', function() {
            photoInput.click();
        });
        
        photoInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profilePhoto.src = e.target.result;
                    // Atualizar também o ícone do header
                    const headerProfileImg = document.getElementById('headerProfileImg');
                    if (headerProfileImg) {
                        headerProfileImg.src = e.target.result;
                    }
                };
                reader.readAsDataURL(file);
            } else {
                alert('Por favor, selecione um arquivo de imagem válido.');
            }
        });
    }
    
    // Adicionar novo pet
    if (addPetButton) {
        addPetButton.addEventListener('click', function() {
            // Criar modal ou redirecionar para página de adicionar pet
            const petName = prompt('Nome do pet:');
            if (petName) {
                const petBreed = prompt('Raça do pet:');
                if (petBreed) {
                    addNewPet(petName, petBreed);
                }
            }
        });
    }
    
    // Botão Cancelar
    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            if (confirm('Tem certeza que deseja cancelar as alterações?')) {
                // Recarregar a página ou voltar para a página anterior
                window.location.reload();
            }
        });
    }
    
    // Botão Salvar
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            saveProfile();
        });
    }
    
    // Toggle de compartilhar número
    if (toggleSwitch) {
        toggleSwitch.addEventListener('change', function() {
            const isChecked = this.checked;
            console.log('Compartilhar número:', isChecked);
            // Aqui você pode adicionar lógica para salvar a preferência
        });
    }
    
    // Função para adicionar novo pet
    function addNewPet(name, breed) {
        const petsGrid = document.querySelector('.pets-grid');
        const addButton = document.querySelector('.add-pet-button');
        
        // Criar novo card de pet
        const petCard = document.createElement('div');
        petCard.className = 'pet-card';
        petCard.innerHTML = `
            <img src="assets/images/default-pet.jpg" alt="${name}" class="pet-photo">
            <h4 class="pet-name">${name}</h4>
            <p class="pet-breed">${breed}</p>
        `;
        
        // Inserir antes do botão de adicionar
        petsGrid.insertBefore(petCard, addButton);
        
        // Adicionar evento de clique para upload de foto do pet
        const petPhoto = petCard.querySelector('.pet-photo');
        petPhoto.style.cursor = 'pointer';
        petPhoto.addEventListener('click', function() {
            uploadPetPhoto(this);
        });
    }
    
    // Função para upload de foto do pet
    function uploadPetPhoto(imgElement) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imgElement.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
        
        input.click();
    }
    
    // Função para salvar o perfil
    function saveProfile() {
        // Coletar dados do formulário
        const profileData = {
            sharePhone: toggleSwitch.checked,
            // Adicionar outros campos conforme necessário
        };
        
        // Simular salvamento
        console.log('Salvando perfil:', profileData);
        
        // Mostrar mensagem de sucesso
        showSuccessMessage('Perfil atualizado com sucesso!');
    }
    
    // Função para mostrar mensagem de sucesso
    function showSuccessMessage(message) {
        // Criar elemento de mensagem
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
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(messageDiv);
        
        // Remover após 3 segundos
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 300);
        }, 3000);
    }
    
    // Adicionar animações CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Eventos para os cards de pets existentes
    const petCards = document.querySelectorAll('.pet-card .pet-photo');
    petCards.forEach(photo => {
        photo.style.cursor = 'pointer';
        photo.addEventListener('click', function() {
            uploadPetPhoto(this);
        });
    });
});

// Validação de formulário (se necessário no futuro)
function validateForm() {
    // Adicionar validações conforme necessário
    return true;
}

// Função auxiliar para formatar dados
function formatData(data) {
    // Formatar dados conforme necessário
    return data;
}