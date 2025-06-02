let currentDate = new Date();
let events = {};
let selectedDate = null;
let selectedTime = null;
let currentView = 'month';

const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const weekdays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

function formatDateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function initializeEvents() {
    const savedEvents = localStorage.getItem('userEvents');
    if (savedEvents) {
        events = JSON.parse(savedEvents);
    } else {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        const nextMonth = new Date();
        nextMonth.setDate(today.getDate() + 15);
        const example1 = new Date();
        example1.setDate(today.getDate() + 3);
        const example2 = new Date();
        example2.setDate(today.getDate() + 10);

        events = {};

        // Dias completamente ocupados (não permitem nenhum agendamento)
        events[formatDateKey(today)] = [{ text: 'Dia Ocupado', protected: true }];
        events[formatDateKey(nextWeek)] = [{ text: 'Dia Ocupado', protected: true }];

        // Agendamentos de exemplo em horários específicos
        events[formatDateKey(example1)] = [
            { text: 'João Silva - 10:00', time: '10:00', protected: true },
            { text: 'Maria Santos - 14:00', time: '14:00', protected: true },
            { text: 'Pedro Costa - 16:00', time: '16:00', protected: true }
        ];

        events[formatDateKey(example2)] = [
            { text: 'Ana Ferreira - 9:00', time: '9:00', protected: true },
            { text: 'Carlos Lopes - 11:00', time: '11:00', protected: true },
            { text: 'Sofia Oliveira - 15:00', time: '15:00', protected: true }
        ];

        events[formatDateKey(nextMonth)] = [
            { text: 'Rui Mendes - 13:00', time: '13:00', protected: true }
        ];
    }
}


function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    document.getElementById('monthYear').textContent = `${months[month]} ${year}`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();

    const calendar = document.getElementById('calendar');
    calendar.querySelectorAll('.calendar-day').forEach(day => day.remove());

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const dayElement = createDayElement(day, true, year, month - 1);
        calendar.appendChild(dayElement);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = createDayElement(day, false, year, month);

        const today = new Date();
        if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
            dayElement.classList.add('today');
        }

        const dayOfWeek = new Date(year, month, day).getDay();
        if (dayOfWeek === 0) {
            dayElement.classList.add('sunday-closed');
        } else if (dayOfWeek === 6) {
            dayElement.classList.add('weekend');
        }

        calendar.appendChild(dayElement);
    }

    const totalCells = Math.ceil((startingDayOfWeek + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (startingDayOfWeek + daysInMonth);
    for (let day = 1; day <= remainingCells; day++) {
        const dayElement = createDayElement(day, true, year, month + 1);
        calendar.appendChild(dayElement);
    }

    toggleConfirmButton();
}

function createDayElement(day, isOtherMonth, year, month) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';

    const dayNumber = document.createElement('div');
    dayNumber.className = `day-number ${isOtherMonth ? 'other-month' : ''}`;
    dayNumber.textContent = day;
    dayElement.appendChild(dayNumber);

    if (!isOtherMonth) {
        const dateKey = formatDateKey(new Date(year, month, day));
        const dayOfWeek = new Date(year, month, day).getDay();
        
        if (events[dateKey]) {
            events[dateKey].forEach((eventObj, index) => {
                const eventElement = document.createElement('div');
                eventElement.className = 'event';
                eventElement.textContent = eventObj.text;

                if (!eventObj.protected) {
                    eventElement.onclick = (e) => {
                        e.stopPropagation();
                        const confirmDelete = confirm(`Remover o seu agendamento: "${eventObj.text}"?`);
                        if (confirmDelete) {
                            events[dateKey].splice(index, 1);
                            if (events[dateKey].length === 0) {
                                delete events[dateKey];
                            }
                            renderCalendar();
                        }
                    };
                } else {
                    eventElement.style.cursor = 'default';
                    eventElement.style.opacity = '0.8';
                }

                dayElement.appendChild(eventElement);
            });
        }

        dayElement.onclick = () => {
            if (dayOfWeek === 0) {
                alert("A loja está fechada aos domingos.");
                return;
            }

            // Verificar se já tem um agendamento não protegido
            const userBookingCount = getUserBookingCount();
            if (userBookingCount >= 1) {
                alert("Já tem um agendamento marcado. Remova o anterior para criar um novo.");
                return;
            }

            // Verificar se é um dia completamente ocupado (apenas eventos protegidos de dia inteiro)
            if (events[dateKey]?.some(ev => ev.protected && !ev.time)) {
                alert("Não é possível adicionar eventos a este dia - dia completamente ocupado.");
                return;
            }

            selectedDate = new Date(year, month, day);
            showDayView(selectedDate);
        };
    }

    return dayElement;
}

function showDayView(date) {
    currentView = 'day';
    const dayTitle = document.getElementById('dayTitle');
    const dayOfWeek = weekdays[date.getDay()];
    dayTitle.textContent = `${dayOfWeek}, ${date.getDate()} de ${months[date.getMonth()]} ${date.getFullYear()}`;

    document.getElementById('monthView').style.display = 'none';
    document.getElementById('dayView').classList.add('active');

    renderTimeSlots(date);
    updateViewButtons();
}

function renderTimeSlots(date) {
    const timeSlots = document.getElementById('timeSlots');
    timeSlots.innerHTML = '';

    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) {
        timeSlots.innerHTML = '<p style="text-align: center; color: #d32f2f; font-weight: bold;">Loja fechada aos domingos</p>';
        return;
    }

    const dateKey = formatDateKey(date);
    const occupiedTimes = events[dateKey] ? events[dateKey].map(e => e.time).filter(t => t) : [];

    for (let hour = 9; hour < 19; hour++) {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot.textContent = `${hour}:00 - ${hour + 1}:00`;

        const timeKey = `${hour}:00`;
        if (occupiedTimes.includes(timeKey)) {
            timeSlot.classList.add('occupied');
        } else {
            timeSlot.onclick = () => selectTimeSlot(timeSlot, timeKey);
        }

        timeSlots.appendChild(timeSlot);
    }
}

function selectTimeSlot(element, time) {
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });

    element.classList.add('selected');
    selectedTime = time;
    
    const confirmBtn = document.getElementById('confirmTimeBtn');
    confirmBtn.classList.add('show');
}

function confirmTimeSelection() {
    if (!selectedDate || !selectedTime) {
        alert('Por favor, selecione um horário.');
        return;
    }

    // Verificar se já tem um agendamento
    const userBookingCount = getUserBookingCount();
    if (userBookingCount >= 1) {
        alert("Já tem um agendamento marcado. Remova o anterior para criar um novo.");
        return;
    }

    const dateKey = formatDateKey(selectedDate);
    const dayName = weekdays[selectedDate.getDay()];
    const eventText = `Seu Agendamento - ${selectedTime}`;

    if (!events[dateKey]) {
        events[dateKey] = [];
    }

    events[dateKey].push({ 
        text: eventText, 
        time: selectedTime, 
        protected: false 
    });

    // Salvar os eventos atualizados no localStorage para persistência
    localStorage.setItem('userEvents', JSON.stringify(events));

    alert(`Horário para ${dayName}, ${selectedDate.getDate()} de ${months[selectedDate.getMonth()]} às ${selectedTime}`);
    localStorage.setItem('agendamentoFeito', '1');

    backToMonth();
    renderCalendar();
}


function backToMonth() {
    currentView = 'month';
    document.getElementById('monthView').style.display = 'block';
    document.getElementById('dayView').classList.remove('active');
    
    const confirmBtn = document.getElementById('confirmTimeBtn');
    confirmBtn.classList.remove('show');
    
    selectedDate = null;
    selectedTime = null;
    updateViewButtons();
}

function updateViewButtons() {
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const addEventBtn = document.getElementById('addEventBtn');
    
    if (currentView === 'month') {
        document.querySelector('.view-btn[onclick="changeView(\'month\')"]').classList.add('active');
        addEventBtn.style.display = 'block';
    } else if (currentView === 'day') {
        document.querySelector('.view-btn[onclick="changeView(\'day\')"]').classList.add('active');
        addEventBtn.style.display = 'none';
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

function goToToday() {
    currentDate = new Date();
    renderCalendar();
}

function changeView(view) {
    if (view === 'day' && currentView === 'month') {
        const userBookingCount = getUserBookingCount();
        if (userBookingCount >= 1) {
            alert("Já tem um agendamento marcado. Remova o anterior para criar um novo.");
            return;
        }
        
        const today = new Date();
        if (today.getDay() === 0) {
            alert("A loja está fechada aos domingos. Por favor, selecione outro dia.");
            return;
        }
        selectedDate = today;
        showDayView(today);
    } else if (view === 'month') {
        backToMonth();
    } else if (view === 'week') {
        alert('Vista de semana será implementada em breve.');
    }
}

function toggleConfirmButton() {
    const existing = document.querySelector('#addEventBtn');
    const count = getUserBookingCount();
    
    // Botão sempre visível
    existing.style.display = 'block';
    
    if (count === 1) {
        existing.textContent = 'Prosseguir para Reserva';
        existing.style.background = '#85C6B2';
    } else {
        existing.textContent = 'Faça um Agendamento';
        existing.style.background = '#ccc';
    }
}

function proceedWithSelection() {
    const count = getUserBookingCount();
    if (count === 1) {
        window.location.href = 'reserva-form.html';
    } else {
        alert('Por favor, faça um agendamento primeiro para prosseguir.');
    }
}

function getUserBookingCount() {
    return Object.values(events).reduce(
        (sum, list) => sum + list.filter(ev => !ev.protected).length,
        0
    );
}

function getEventCount() {
    return getUserBookingCount();
}

// Inicialização
initializeEvents();
renderCalendar();