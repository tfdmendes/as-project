  let currentDate = new Date();
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        // Sample appointments data
        const appointments = {
            '2025-06-01': true,
            '2025-06-02': true,
            '2025-06-15': true
        };

        function formatDateKey(date) {
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        }

        function renderCalendar() {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            
            document.getElementById('monthYear').textContent = `${months[month]} ${year}`;
            
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startingDayOfWeek = firstDay.getDay();
            
            const calendarGrid = document.getElementById('calendarGrid');
            
            // Clear existing days (keep weekday headers)
            const existingDays = calendarGrid.querySelectorAll('.calendar-day');
            existingDays.forEach(day => day.remove());
            
            // Add empty cells for days before month starts
            for (let i = 0; i < startingDayOfWeek; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.className = 'calendar-day';
                calendarGrid.appendChild(emptyDay);
            }
            
            // Add days of the month
            for (let day = 1; day <= daysInMonth; day++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day';
                dayElement.textContent = day;
                
                const today = new Date();
                if (year === today.getFullYear() && 
                    month === today.getMonth() && 
                    day === today.getDate()) {
                    dayElement.classList.add('today');
                }
                
                const dateKey = formatDateKey(new Date(year, month, day));
                if (appointments[dateKey]) {
                    dayElement.classList.add('has-appointment');
                }
                
                dayElement.onclick = () => selectDate(year, month, day);
                calendarGrid.appendChild(dayElement);
            }
        }

        function previousMonth() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        }

        function nextMonth() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        }

        function selectDate(year, month, day) {
            const selectedDate = new Date(year, month, day);
            const dateKey = formatDateKey(selectedDate);
            
            if (appointments[dateKey]) {
                alert(`Appointment scheduled for ${months[month]} ${day}, ${year}`);
            } else {
                const confirm = window.confirm(`Schedule appointment for ${months[month]} ${day}, ${year}?`);
                if (confirm) {
                    appointments[dateKey] = true;
                    renderCalendar();
                }
            }
        }

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
                                    Hello! We have availability for tomorrow morning. Would you like to schedule a dog walking session?
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
                                    Your pet's vaccination appointment is scheduled for next week. Please bring the vaccination card.
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
                
                messagesContainer.innerHTML += messageHTML;
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

        // Initialize calendar
        renderCalendar();