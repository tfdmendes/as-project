// Variáveis globais
let uploadedImages = [];
let selectedAmenities = ['🚿 Banho completo', '✂️ Tosquia profissional', '🏠 Serviço ao domicílio'];
let isPreviewMode = false;

// Upload de imagens
function triggerFileInput() {
    document.getElementById('imageInput').click();
}

function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    processFiles(files);
}

function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('dragover');
}

function handleDragLeave(event) {
    event.currentTarget.classList.remove('dragover');
}

function handleDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
    const files = Array.from(event.dataTransfer.files);
    processFiles(files);
}

function processFiles(files) {
    files.forEach(file => {
        if (file.type.startsWith('image/') && uploadedImages.length < 6) {
            const reader = new FileReader();
            reader.onload = function(e) {
                addImageToGrid(e.target.result, file.name);
            };
            reader.readAsDataURL(file);
        }
    });
}

function addImageToGrid(src, name) {
    const imageGrid = document.getElementById('imageGrid');
    const imagePreview = document.createElement('div');
    imagePreview.className = 'image-preview';
    imagePreview.innerHTML = `
        <img src="${src}" alt="${name}">
        <button class="remove-btn" onclick="removeImage(this)">×</button>
    `;
    imageGrid.appendChild(imagePreview);
    uploadedImages.push({src, name});
}

function removeImage(button) {
    const imagePreview = button.parentElement;
    const img = imagePreview.querySelector('img');
    const index = uploadedImages.findIndex(item => item.src === img.src);
    if (index > -1) {
        uploadedImages.splice(index, 1);
    }
    imagePreview.remove();
}

// Comodidades
function toggleAmenity(element) {
    const checkbox = element.querySelector('input[type="checkbox"]');
    const text = element.querySelector('span').textContent;
    
    checkbox.checked = !checkbox.checked;
    element.classList.toggle('selected', checkbox.checked);
    
    if (checkbox.checked) {
        if (!selectedAmenities.includes(text)) {
            selectedAmenities.push(text);
        }
    } else {
        const index = selectedAmenities.indexOf(text);
        if (index > -1) {
            selectedAmenities.splice(index, 1);
        }
    }
}

function addCustomAmenity() {
    const input = document.getElementById('customAmenity');
    const value = input.value.trim();
    
    if (value) {
        const amenitiesGrid = document.getElementById('amenitiesGrid');
        const amenityItem = document.createElement('div');
        amenityItem.className = 'amenity-item selected';
        amenityItem.onclick = () => toggleAmenity(amenityItem);
        amenityItem.innerHTML = `
            <input type="checkbox" checked>
            <span>✨ ${value}</span>
        `;
        amenitiesGrid.appendChild(amenityItem);
        selectedAmenities.push(`✨ ${value}`);
        input.value = '';
    }
}

// Localização
function searchLocation(query) {
    const suggestions = document.getElementById('locationSuggestions');
    
    if (query.length < 3) {
        suggestions.style.display = 'none';
        return;
    }

    // Simulação de sugestões (em produção, usaria uma API real)
    const mockSuggestions = [
        'Aveiro, Distrito de Aveiro, Portugal',
        'Aveiro Centro, Aveiro, Portugal',
        'Avenida Dr. Lourenço Peixinho, Aveiro, Portugal',
        'Universidade de Aveiro, Aveiro, Portugal'
    ].filter(suggestion => 
        suggestion.toLowerCase().includes(query.toLowerCase())
    );

    if (mockSuggestions.length > 0) {
        suggestions.innerHTML = mockSuggestions.map(suggestion => 
            `<div class="location-suggestion" onclick="selectLocation('${suggestion}')">${suggestion}</div>`
        ).join('');
        suggestions.style.display = 'block';
    } else {
        suggestions.style.display = 'none';
    }
}

function selectLocation(location) {
    document.getElementById('locationInput').value = location;
    document.getElementById('locationSuggestions').style.display = 'none';
    
    // Simular atualização do mapa
    const mapContainer = document.getElementById('mapContainer');
    mapContainer.innerHTML = `
        <div style="text-align: center;">
            <p>📍 ${location}</p>
            <small style="color: #28a745;">✅ Localização confirmada</small>
        </div>
    `;
}

// Validação do formulário
function validateForm() {
    let isValid = true;
    const errors = [];

    // Nome do serviço
    const serviceName = document.getElementById('serviceName');
    if (!serviceName.value.trim()) {
        serviceName.classList.add('input-error');
        serviceName.nextElementSibling.style.display = 'block';
        errors.push('Nome do serviço é obrigatório');
        isValid = false;
    } else {
        serviceName.classList.remove('input-error');
        serviceName.nextElementSibling.style.display = 'none';
    }

    // Descrição
    const serviceDescription = document.getElementById('serviceDescription');
    if (!serviceDescription.value.trim()) {
        serviceDescription.classList.add('input-error');
        serviceDescription.nextElementSibling.style.display = 'block';
        errors.push('Descrição é obrigatória');
        isValid = false;
    } else {
        serviceDescription.classList.remove('input-error');
        serviceDescription.nextElementSibling.style.display = 'none';
    }

    // Preço
    const priceFrom = document.getElementById('priceFrom');
    if (!priceFrom.value || parseFloat(priceFrom.value) <= 0) {
        priceFrom.classList.add('input-error');
        errors.push('Preço inicial deve ser maior que 0');
        isValid = false;
    } else {
        priceFrom.classList.remove('input-error');
    }

    // Localização
    const locationInput = document.getElementById('locationInput');
    if (!locationInput.value.trim()) {
        locationInput.classList.add('input-error');
        locationInput.nextElementSibling.nextElementSibling.style.display = 'block';
        errors.push('Localização é obrigatória');
        isValid = false;
    } else {
        locationInput.classList.remove('input-error');
        locationInput.nextElementSibling.nextElementSibling.style.display = 'none';
    }

    return { isValid, errors };
}

// Função para mostrar mensagem de sucesso
function showSuccessMessage(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Esconder após 5 segundos
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 5000);
}

// Função para alternar pré-visualização
function togglePreview() {
    isPreviewMode = !isPreviewMode;
    const cards = document.querySelectorAll('.card');
    const button = document.querySelector('.btn-outline');
    
    if (isPreviewMode) {
        cards.forEach(card => {
            card.classList.add('preview-mode');
            const title = card.querySelector('.section-title');
            if (title && !card.querySelector('.preview-header')) {
                const previewHeader = document.createElement('div');
                previewHeader.className = 'preview-header';
                previewHeader.textContent = '👁️ Pré-visualização - Como os clientes veem';
                card.insertBefore(previewHeader, card.firstChild);
            }
        });
        button.textContent = '✏️ Modo Edição';
        button.style.background = '#28a745';
        button.style.color = 'white';
        
        // Desabilitar inputs
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => input.disabled = true);
    } else {
        cards.forEach(card => {
            card.classList.remove('preview-mode');
            const previewHeader = card.querySelector('.preview-header');
            if (previewHeader) {
                previewHeader.remove();
            }
        });
        button.textContent = '👁️ Pré-visualizar';
        button.style.background = 'transparent';
        button.style.color = '#6c757d';
        
        // Reabilitar inputs
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => input.disabled = false);
    }
}

// Função para guardar rascunho
function saveDraft() {
    const formData = collectFormData();
    
    // Simular salvamento (em produção, seria uma chamada à API)
    console.log('Salvando rascunho:', formData);
    
    // Mudar status para rascunho
    document.getElementById('serviceStatus').value = 'draft';
    
    showSuccessMessage('✅ Rascunho guardado com sucesso! Pode continuar a editar mais tarde.');
    
    // Simular carregamento
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '💾 A guardar...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 1500);
}

// Função para publicar serviço
function publishService() {
    const validation = validateForm();
    
    if (!validation.isValid) {
        alert('Por favor, corrija os seguintes erros:\n\n' + validation.errors.join('\n'));
        return;
    }

    const formData = collectFormData();
    
    // Simular publicação (em produção, seria uma chamada à API)
    console.log('Publicando serviço:', formData);
    
    // Mudar status para ativo
    document.getElementById('serviceStatus').value = 'active';
    
    showSuccessMessage('🚀 Serviço publicado com sucesso! Já está visível para os clientes.');
    
    // Simular carregamento
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '🚀 A publicar...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        
        // Simular atualização das estatísticas
        updateStats();
    }, 2000);
}

// Função para coletar dados do formulário
function collectFormData() {
    return {
        serviceName: document.getElementById('serviceName').value,
        serviceDescription: document.getElementById('serviceDescription').value,
        priceFrom: parseFloat(document.getElementById('priceFrom').value),
        priceTo: parseFloat(document.getElementById('priceTo').value) || null,
        location: document.getElementById('locationInput').value,
        amenities: selectedAmenities,
        images: uploadedImages,
        status: document.getElementById('serviceStatus').value,
        instantBooking: document.getElementById('instantBooking').checked,
        emailNotifications: document.getElementById('emailNotifications').checked,
        availability: document.getElementById('availability').value,
        timestamp: new Date().toISOString()
    };
}

// Função para atualizar estatísticas
function updateStats() {
    const stats = document.querySelectorAll('.stat-number');
    stats[0].textContent = parseInt(stats[0].textContent) + Math.floor(Math.random() * 10) + 1; // Visualizações
    stats[1].textContent = parseInt(stats[1].textContent) + Math.floor(Math.random() * 3) + 1; // Contactos
}

// Função para auto-save (salvar automaticamente a cada 30 segundos)
let autoSaveInterval = setInterval(() => {
    if (!isPreviewMode) {
        const formData = collectFormData();
        // Simular auto-save silencioso
        console.log('Auto-save:', new Date().toLocaleTimeString());
        localStorage.setItem('serviceProviderDraft', JSON.stringify(formData));
    }
}, 30000);

// Carregar dados salvos ao inicializar a página
function loadSavedData() {
    const savedData = localStorage.getItem('serviceProviderDraft');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            
            // Carregar dados básicos
            if (data.serviceName) document.getElementById('serviceName').value = data.serviceName;
            if (data.serviceDescription) document.getElementById('serviceDescription').value = data.serviceDescription;
            if (data.priceFrom) document.getElementById('priceFrom').value = data.priceFrom;
            if (data.priceTo) document.getElementById('priceTo').value = data.priceTo;
            if (data.location) document.getElementById('locationInput').value = data.location;
            if (data.status) document.getElementById('serviceStatus').value = data.status;
            if (data.availability) document.getElementById('availability').value = data.availability;
            
            // Carregar checkboxes
            document.getElementById('instantBooking').checked = data.instantBooking !== false;
            document.getElementById('emailNotifications').checked = data.emailNotifications !== false;
            
            console.log('Dados carregados automaticamente');
        } catch (e) {
            console.log('Erro ao carregar dados salvos:', e);
        }
    }
}

// Event listeners para validação em tempo real
document.addEventListener('DOMContentLoaded', function() {
    loadSavedData();
    
    // Validação em tempo real
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') || this.id === 'serviceName' || this.id === 'serviceDescription' || this.id === 'locationInput') {
                if (!this.value.trim()) {
                    this.classList.add('input-error');
                    const errorMsg = this.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('error-message')) {
                        errorMsg.style.display = 'block';
                    }
                } else {
                    this.classList.remove('input-error');
                    const errorMsg = this.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('error-message')) {
                        errorMsg.style.display = 'none';
                    }
                }
            }
        });
    });

    // Fechar sugestões quando clicar fora
    document.addEventListener('click', function(event) {
        const locationSuggestions = document.getElementById('locationSuggestions');
        const locationInput = document.getElementById('locationInput');
        
        if (!locationInput.contains(event.target) && !locationSuggestions.contains(event.target)) {
            locationSuggestions.style.display = 'none';
        }
    });

    // Atalhos de teclado
    document.addEventListener('keydown', function(event) {
        // Ctrl+S para salvar rascunho
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            saveDraft();
        }
        
        // Ctrl+Enter para publicar
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            publishService();
        }
        
        // Ctrl+P para pré-visualizar
        if (event.ctrlKey && event.key === 'p') {
            event.preventDefault();
            togglePreview();
        }
    });
});

// Limpeza ao sair da página
window.addEventListener('beforeunload', function(event) {
    if (!isPreviewMode) {
        const formData = collectFormData();
        localStorage.setItem('serviceProviderDraft', JSON.stringify(formData));
    }
    clearInterval(autoSaveInterval);
});

// Função para resetar formulário
function resetForm() {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
        document.getElementById('serviceName').value = '';
        document.getElementById('serviceDescription').value = '';
        document.getElementById('priceFrom').value = '';
        document.getElementById('priceTo').value = '';
        document.getElementById('locationInput').value = '';
        document.getElementById('serviceStatus').value = 'draft';
        document.getElementById('availability').value = 'always';
        document.getElementById('instantBooking').checked = true;
        document.getElementById('emailNotifications').checked = true;
        
        // Limpar imagens
        uploadedImages = [];
        const imageGrid = document.getElementById('imageGrid');
        imageGrid.innerHTML = '';
        
        // Limpar comodidades selecionadas
        selectedAmenities = [];
        const amenities = document.querySelectorAll('.amenity-item');
        amenities.forEach(amenity => {
            amenity.classList.remove('selected');
            amenity.querySelector('input[type="checkbox"]').checked = false;
        });
        
        // Limpar localStorage
        localStorage.removeItem('serviceProviderDraft');
        
        showSuccessMessage('✅ Formulário limpo com sucesso!');
    }
}