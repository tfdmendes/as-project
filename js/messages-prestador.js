function selectChat(chatId) {
    const allChats = document.querySelectorAll('.chat-box');
    allChats.forEach(chat => {
        chat.style.display = 'none'; // esconde todos os chats
    });

    const selectedChat = document.getElementById(`chat-${chatId}`);
    if (selectedChat) {
        selectedChat.style.display = 'block'; // mostra o chat selecionado
    }

    // (Opcional) destaca a conversa selecionada na sidebar
    const allItems = document.querySelectorAll('.message-item');
    allItems.forEach(item => item.classList.remove('active'));
    const activeItem = document.querySelector(`.message-item[onclick="selectChat('${chatId}')"]`);
    if (activeItem) activeItem.classList.add('active');
}


function updateChatContent(chatId) {
    const messagesContainer = document.getElementById('messagesContainer');

    // Hide all existing chat containers
    const allChats = messagesContainer.querySelectorAll('[class^="chat-"]');
    allChats.forEach(chat => {
        chat.style.display = 'none';
    });

    // Show the selected chat
    const selectedChat = messagesContainer.querySelector(`.chat-${chatId}`);
    if (selectedChat) {
        selectedChat.style.display = 'block';
    }

    // Update chat title
    const chatTitle = document.querySelector('.chat-title');
    const activeItem = document.querySelector('.message-item.active');
    if (activeItem) {
        const senderName = activeItem.querySelector('.sender-name').textContent;
        chatTitle.textContent = `Conversa com ${senderName}`;
    }

    // Scroll to bottom of messages
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();

    if (message) {
        // Get the currently active chat
        const activeChat = document.querySelector('[class^="chat-"]:not([style*="display: none"])');
        
        if (activeChat) {
            // Create new message bubble (sent by prestador)
            const messageHTML = `
                <div class="message-bubble sent">
                    <div class="message-content sent">
                        ${message}
                        <div class="message-time">${getCurrentTime()}</div>
                    </div>
                </div>
            `;

            activeChat.insertAdjacentHTML('beforeend', messageHTML);

            // Scroll to bottom of the active chat
            activeChat.scrollTop = activeChat.scrollHeight;
        }

        input.value = '';
    }
}

function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Handle Enter key in message input
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        // Bloqueia escrita
        messageInput.readOnly = true;

        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Initialize with first chat selected
    const firstChatItem = document.querySelector('.message-item');
    if (firstChatItem) {
        const onclickAttr = firstChatItem.getAttribute('onclick');
        const chatId = onclickAttr.match(/selectChat\('(.+?)'\)/)?.[1];
        
        if (chatId) {
            firstChatItem.classList.add('active');
            updateChatContent(chatId);
        }
    }
});

// Alternative function for compatibility with existing onclick attributes
function selectChatById(chatId) {
    selectChat(chatId);
}
