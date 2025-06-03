// Variáveis globais
let uploadedImages = [];
let selectedAmenities = ['🚿 Banho completo', '✂️ Tosquia profissional', '🏠 Serviço ao domicílio'];
let isPreviewMode = false;
let editingServiceId = null; // Para rastrear se estamos editando

// Inicialização - verificar se estamos editando um serviço
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se há um ID de serviço na URL (modo edição)
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('edit');
    
    if (serviceId) {
        loadServiceForEditing(serviceId);
    }
    
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
});

// Função para carregar serviço para edição
function loadServiceForEditing(serviceId) {
    const services = JSON.parse(localStorage.getItem('userServices') || '[]');
    const service = services.find(s => s.id === serviceId);
    
    if (service) {
        editingServiceId = serviceId;
        
        // Preencher o formulário com os dados do serviço
        document.getElementById('serviceName').value = service.name;
        document.getElementById('serviceDescription').value = service.description;
        document.getElementById('servicePrice').value = service.price;
        document.getElementById('locationInput').value = service.location;
        document.getElementById('serviceStatus').value = service.status || 'active';
        document.getElementById('instantBooking').checked = service.instantBooking || false;
        document.getElementById('emailNotifications').checked = service.emailNotifications || false;
        document.getElementById('availability').value = service.availability || 'always';
        document.getElementById('startTime').value = service.startTime || '09:00';
        document.getElementById('endTime').value = service.endTime || '18:00';
        
        // Carregar imagens
        if (service.images && service.images.length > 0) {
            const imageGrid = document.getElementById('imageGrid');
            imageGrid.innerHTML = ''; // Limpar grid existente
            service.images.forEach(img => {
                addImageToGrid(img.src, img.name || 'Imagem do serviço');
            });
        }
        
        // Carregar comodidades
        selectedAmenities = service.amenities || [];
        document.querySelectorAll('.amenity-item').forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            const amenityText = item.querySelector('span').textContent;
            
            if (selectedAmenities.includes(amenityText)) {
                checkbox.checked = true;
                item.classList.add('selected');
            } else {
                checkbox.checked = false;
                item.classList.remove('selected');
            }
        });
        
        // Atualizar título da página e botões
        document.querySelector('.page-title').textContent = 'Editar Serviço';
        const publishBtn = document.querySelector('.btn-primary');
        publishBtn.textContent = '💾 Atualizar Serviço';
        
        showMessage('📝 Serviço carregado para edição', 'info');
    }
}

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
    serviceData.status = 'draft';
    
    // Salvar no localStorage
    saveServiceToLocalStorage(serviceData);
    
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
    serviceData.status = 'active';
    
    // Salvar no localStorage
    saveServiceToLocalStorage(serviceData);
    
    if (editingServiceId) {
        showMessage('✅ Serviço atualizado com sucesso!');
    } else {
        showMessage('🚀 Serviço publicado com sucesso! Agora está visível para os clientes.');
    }
    
    // Atualizar estado
    document.getElementById('serviceStatus').value = 'active';
    
    // Redirecionar após 2 segundos
    setTimeout(() => {
        window.location.href = 'edit-services.html';
    }, 2000);
}

function collectFormData() {
    // Coletar todas as imagens do grid (incluindo as já carregadas)
    const currentImages = [];
    document.querySelectorAll('#imageGrid .image-preview img').forEach(img => {
        currentImages.push({
            src: img.src,
            name: img.alt || 'Imagem do serviço'
        });
    });
    
    return {
        id: editingServiceId || generateServiceId(),
        name: document.getElementById('serviceName').value,
        description: document.getElementById('serviceDescription').value,
        price: parseFloat(document.getElementById('servicePrice').value),
        location: document.getElementById('locationInput').value,
        images: currentImages, // Usar as imagens atuais do grid
        amenities: selectedAmenities,
        status: document.getElementById('serviceStatus').value,
        instantBooking: document.getElementById('instantBooking').checked,
        emailNotifications: document.getElementById('emailNotifications').checked,
        availability: document.getElementById('availability').value,
        startTime: document.getElementById('startTime').value,
        endTime: document.getElementById('endTime').value,
        customDays: getSelectedDays(),
        rating: editingServiceId ? getExistingRating() : 0,
        reviews: editingServiceId ? getExistingReviews() : 0,
        createdAt: editingServiceId ? getExistingCreatedAt() : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
}

function generateServiceId() {
    return 'service_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function getSelectedDays() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return days.filter(day => document.getElementById(day).checked);
}

function saveServiceToLocalStorage(serviceData) {
    // Obter serviços existentes
    let services = JSON.parse(localStorage.getItem('userServices') || '[]');
    
    if (editingServiceId) {
        // Atualizar serviço existente
        const index = services.findIndex(s => s.id === editingServiceId);
        if (index !== -1) {
            // Preservar rating e reviews existentes
            serviceData.rating = services[index].rating || 0;
            serviceData.reviews = services[index].reviews || 0;
            serviceData.createdAt = services[index].createdAt;
            services[index] = serviceData;
        }
    } else {
        // Adicionar novo serviço
        serviceData.rating = 0;
        serviceData.reviews = 0;
        services.push(serviceData);
    }
    
    // Salvar no localStorage
    localStorage.setItem('userServices', JSON.stringify(services));
}

// Funções auxiliares para preservar dados existentes durante edição
function getExistingRating() {
    const services = JSON.parse(localStorage.getItem('userServices') || '[]');
    const service = services.find(s => s.id === editingServiceId);
    return service ? (service.rating || 0) : 0;
}

function getExistingReviews() {
    const services = JSON.parse(localStorage.getItem('userServices') || '[]');
    const service = services.find(s => s.id === editingServiceId);
    return service ? (service.reviews || 0) : 0;
}

function getExistingCreatedAt() {
    const services = JSON.parse(localStorage.getItem('userServices') || '[]');
    const service = services.find(s => s.id === editingServiceId);
    return service ? service.createdAt : new Date().toISOString();
}

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