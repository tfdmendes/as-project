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
    uploadedImages.push({ src, name });
}

function removeImage(button) {
    const preview = button.parentElement;
    const imgSrc = preview.querySelector('img').src;
    
    // Remove da array
    uploadedImages = uploadedImages.filter(img => img.src !== imgSrc);
    
    // Remove do DOM
    preview.remove();
}

// Comodidades
function toggleAmenityCheck(checkbox) {
    const amenityItem = checkbox.parentElement;
    const amenityText = amenityItem.querySelector('span').textContent;
    
    if (checkbox.checked) {
        amenityItem.classList.add('selected');
        if (!selectedAmenities.includes(amenityText)) {
            selectedAmenities.push(amenityText);
        }
    } else {
        amenityItem.classList.remove('selected');
        selectedAmenities = selectedAmenities.filter(item => item !== amenityText);
    }
}

function addCustomAmenity() {
    const input = document.getElementById('customAmenity');
    const amenityText = input.value.trim();
    
    if (amenityText) {
        const amenitiesGrid = document.getElementById('amenitiesGrid');
        const amenityItem = document.createElement('div');
        amenityItem.className = 'amenity-item selected';
        amenityItem.innerHTML = `
            <input type="checkbox" checked onchange="toggleAmenityCheck(this)">
            <span>⭐ ${amenityText}</span>
        `;
        amenitiesGrid.appendChild(amenityItem);
        
        selectedAmenities.push(`⭐ ${amenityText}`);
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
    
    // Simulação de sugestões (em produção, usar API de geocoding)
    const mockSuggestions = [
        'Aveiro, Portugal',
        'Aveiro Centro, Portugal',
        'Universidade de Aveiro, Portugal',
        'Gafanha da Nazaré, Aveiro',
        'Ílhavo, Aveiro'
    ];
    
    const filteredSuggestions = mockSuggestions.filter(location => 
        location.toLowerCase().includes(query.toLowerCase())
    );
    
    if (filteredSuggestions.length > 0) {
        suggestions.innerHTML = filteredSuggestions.map(location => 
            `<div class="location-suggestion" onclick="selectLocation('${location}')">${location}</div>`
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
        <div style="text-align: center; color: #196085;">
            <p>📍 ${location}</p>
            <small>Localização selecionada</small>
        </div>
    `;
}

// Configurações de horário
function toggleCustomSchedule() {
    const availability = document.getElementById('availability').value;
    const customSchedule = document.getElementById('customSchedule');
    
    if (availability === 'custom') {
        customSchedule.classList.add('show');
    } else {
        customSchedule.classList.remove('show');
    }
}

function toggleDay(dayElement) {
    const checkbox = dayElement.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
    
    if (checkbox.checked) {
        dayElement.classList.add('selected');
    } else {
        dayElement.classList.remove('selected');
    }
}

// Pré-visualização
function togglePreview() {
    const cards = document.querySelectorAll('.card');
    isPreviewMode = !isPreviewMode;
    
    cards.forEach(card => {
        if (isPreviewMode) {
            card.classList.add('preview-mode');
            // Adicionar header de pré-visualização apenas nos cards principais
            if (!card.querySelector('.preview-header')) {
                const previewHeader = document.createElement('div');
                previewHeader.className = 'preview-header';
                previewHeader.textContent = '👁️ Modo Pré-visualização - Como os clientes verão';
                card.insertBefore(previewHeader, card.firstChild);
            }
        } else {
            card.classList.remove('preview-mode');
            const previewHeader = card.querySelector('.preview-header');
            if (previewHeader) {
                previewHeader.remove();
            }
        }
    });
    
    // Atualizar botão
    const previewBtn = document.querySelector('.btn-outline');
    previewBtn.textContent = isPreviewMode ? '✏️ Modo Edição' : '👁️ Pré-visualizar';
}

// Validação e salvamento
function validateForm() {
    let isValid = true;
    const errors = [];
    
    // Validar nome do serviço
    const serviceName = document.getElementById('serviceName').value.trim();
    if (!serviceName) {
        isValid = false;
        errors.push('Nome do serviço é obrigatório');
        document.getElementById('serviceName').classList.add('input-error');
    } else {
        document.getElementById('serviceName').classList.remove('input-error');
    }
    
    // Validar descrição
    const description = document.getElementById('serviceDescription').value.trim();
    if (!description || description.length < 50) {
        isValid = false;
        errors.push('Descrição deve ter pelo menos 50 caracteres');
        document.getElementById('serviceDescription').classList.add('input-error');
    } else {
        document.getElementById('serviceDescription').classList.remove('input-error');
    }
    
    // Validar preço
    const price = parseFloat(document.getElementById('servicePrice').value);
    if (!price || price <= 0) {
        isValid = false;
        errors.push('Preço deve ser maior que zero');
        document.getElementById('servicePrice').classList.add('input-error');
    } else {
        document.getElementById('servicePrice').classList.remove('input-error');
    }
    
    // Validar localização
    const location = document.getElementById('locationInput').value.trim();
    if (!location) {
        isValid = false;
        errors.push('Localização é obrigatória');
        document.getElementById('locationInput').classList.add('input-error');
    } else {
        document.getElementById('locationInput').classList.remove('input-error');
    }
    
    return { isValid, errors };
}

function showMessage(message, type = 'success') {
    const messageDiv = document.getElementById('successMessage');
    messageDiv.textContent = message;
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.style.display = 'block';
    
    // Auto-hide após 5 segundos
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function saveDraft() {
    const serviceData = collectFormData();
    
    // Simular salvamento (em produção, enviar para API)
    console.log('Salvando rascunho:', serviceData);
    
    showMessage('✅ Rascunho salvo com sucesso!');
    
    // Atualizar estado
    document.getElementById('serviceStatus').value = 'draft';
}

function publishService() {
    const validation = validateForm();
    
    if (!validation.isValid) {
        showMessage('❌ Corrija os erros antes de publicar: ' + validation.errors.join(', '), 'error');
        return;
    }
    
    const serviceData = collectFormData();
    
    // Simular publicação (em produção, enviar para API)
    console.log('Publicando serviço:', serviceData);
    
    showMessage('🚀 Serviço publicado com sucesso! Agora está visível para os clientes.');
    
    // Atualizar estado
    document.getElementById('serviceStatus').value = 'active';
    
    // Simular atualização de estatísticas
    updateStats();
}

function collectFormData() {
    return {
        name: document.getElementById('serviceName').value,
        description: document.getElementById('serviceDescription').value,
        price: parseFloat(document.getElementById('servicePrice').value),
        location: document.getElementById('locationInput').value,
        images: uploadedImages,
        amenities: selectedAmenities,
        status: document.getElementById('serviceStatus').value,
        instantBooking: document.getElementById('instantBooking').checked,
        emailNotifications: document.getElementById('emailNotifications').checked,
        availability: document.getElementById('availability').value,
        startTime: document.getElementById('startTime').value,
        endTime: document.getElementById('endTime').value,
        customDays: getSelectedDays()
    };
}

function getSelectedDays() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return days.filter(day => document.getElementById(day).checked);
}

function updateStats() {
    // Simular incremento das estatísticas
    const stats = document.querySelectorAll('.stat-number');
    stats[0].textContent = parseInt(stats[0].textContent) + Math.floor(Math.random() * 10) + 1; // Visualizações
    stats[1].textContent = parseInt(stats[1].textContent) + Math.floor(Math.random() * 3) + 1; // Contactos
}

// Event listeners para inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar comodidades selecionadas
    document.querySelectorAll('.amenity-item input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked) {
            checkbox.parentElement.classList.add('selected');
        }
    });
    
    // Prevenir submit do formulário ao pressionar Enter
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    });
    
    // Auto-save a cada 2 minutos (opcional)
    setInterval(function() {
        if (document.getElementById('serviceStatus').value === 'draft') {
            saveDraft();
        }
    }, 120000); // 2 minutos
});

// Função para limpar formulário
function clearForm() {
    if (confirm('Tem certeza que deseja limpar todos os dados?')) {
        document.getElementById('serviceName').value = '';
        document.getElementById('serviceDescription').value = '';
        document.getElementById('servicePrice').value = '';
        document.getElementById('locationInput').value = '';
        
        // Limpar imagens
        document.getElementById('imageGrid').innerHTML = '';
        uploadedImages = [];
        
        // Desmarcar comodidades
        document.querySelectorAll('.amenity-item').forEach(item => {
            item.classList.remove('selected');
            item.querySelector('input[type="checkbox"]').checked = false;
        });
        selectedAmenities = [];
        
        showMessage('📝 Formulário limpo com sucesso!');
    }
}

// Função para duplicar serviço
function duplicateService() {
    const currentData = collectFormData();
    currentData.name = currentData.name + ' (Cópia)';
    
    // Simular criação de novo serviço
    console.log('Duplicando serviço:', currentData);
    
    showMessage('📋 Serviço duplicado! Edite as informações conforme necessário.');
}