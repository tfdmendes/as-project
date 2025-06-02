function selectChat(chatId) {
    // Remove active class from all message items
    document.querySelectorAll('.message-item').forEach(item => {
        item.classList.remove('active');
    });

    // Add active class to selected item
    event.currentTarget.classList.add('active');

    // Update chat content based on selection
    updateChatContent(chatId);
}

function updateChatContent(chatId) {
    const messagesContainer = document.getElementById('messagesContainer');

    // Sample different chat content
    const chatContent = {
        'tiago': `
            <div class="message-bubble">
                <div class="message-sender">
                    <div class="avatar tiago">TF</div>
                    <div>
                        <div style="font-size: 12px; color: #666; margin-bottom: 4px;">Tiago Fernandes</div>
                        <div class="message-text">
                            Bom dia Rhyan, só para te dizer que a Sasha portou-se muito bem no seu primeiro dia! Aqui vão algumas fotos dela!
                        </div>
                        <div class="message-images">
                            <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop&crop=face" alt="Pet photo" class="message-image">
                            <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop&crop=face" alt="Pet photo" class="message-image">
                        </div>
                        <div class="message-images" style="margin-left: 0;">
                            <img src="https://images.unsplash.com/photo-1517849845537-4d257902454a?w=200&h=200&fit=crop&crop=face" alt="Pet photo" class="message-image">
                        </div>
                    </div>
                </div>
            </div>

            <div class="message-bubble" style="display: flex; justify-content: flex-end;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="status-badge">Muito obrigado!</span>
                    <div class="avatar" style="background: #4CAF50;">RM</div>
                </div>
            </div>
        `,
        'petnanny': `
            <div class="message-bubble">
                <div class="message-sender">
                    <div class="avatar pet-nanny">🐾</div>
                    <div>
                        <div style="font-size: 12px; color: #666; margin-bottom: 4px;">Pet Nanny</div>
                        <div class="message-text">
                            Olá! Nós temos disponibilidade para amanhã de manhã. Queres marcar uma sessão de pet-walking?
                        </div>
                    </div>
                </div>
            </div>
        `,
        'petcentro': `
            <div class="message-bubble">
                <div class="message-sender">
                    <div class="avatar pet-centro">PC</div>
                    <div>
                        <div style="font-size: 12px; color: #666; margin-bottom: 4px;">PetCentro</div>
                        <div class="message-text">
                            Estamos com uma promoção na ração preferida da Sasha! Aproveite 30% de desconto em toda a marca Doglicious!
                        </div>
                    </div>
                </div>
            </div>
        `
    };

    messagesContainer.innerHTML = chatContent[chatId] || chatContent['tiago'];
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();

    if (message) {
        const messagesContainer = document.getElementById('messagesContainer');
        const messageHTML = `
            <div class="message-bubble" style="display: flex; justify-content: flex-end;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="status-badge">${message}</span>
                    <div class="avatar" style="background: #4CAF50;">RM</div>
                </div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);

        // Rolagem suave para o final
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        input.value = '';
    }
}


// Handle Enter key in message input
document.getElementById('messageInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
