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
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Initialize with first chat selected
    const firstChatItem = document.querySelector('.message-item');
    if (firstChatItem) {
        // Get the onclick parameter to determine which chat to show
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