let currentDate = new Date();
let events = {};

const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']; 

function formatDateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function initializeEvents() {
    // Adicionar alguns eventos de exemplo
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    events[formatDateKey(today)] = ['Dia Ocupado'];
    events[formatDateKey(nextWeek)] = ['Dia Ocupado'];
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Atualizar o cabeçalho com mês/ano
    document.getElementById('monthYear').textContent = `${months[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();
    
    const calendar = document.getElementById('calendar');
    const existingDays = calendar.querySelectorAll('.calendar-day');
    existingDays.forEach(day => day.remove());
    
    // Dias do mês anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const dayElement = createDayElement(day, true, year, month - 1);
        calendar.appendChild(dayElement);
    }
    
    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = createDayElement(day, false, year, month);
        
        const today = new Date();
        if (year === today.getFullYear() && 
            month === today.getMonth() && 
            day === today.getDate()) {
            dayElement.classList.add('today');
        }
        
        const dayOfWeek = new Date(year, month, day).getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            dayElement.classList.add('weekend');
        }
        
        calendar.appendChild(dayElement);
    }
    
    // Dias do mês seguinte
    const totalCells = Math.ceil((startingDayOfWeek + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (startingDayOfWeek + daysInMonth);
    
    for (let day = 1; day <= remainingCells; day++) {
        const dayElement = createDayElement(day, true, year, month + 1);
        calendar.appendChild(dayElement);
    }
}

function createDayElement(day, isOtherMonth, year, month) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    
    const dayNumber = document.createElement('div');
    dayNumber.className = `day-number ${isOtherMonth ? 'other-month' : ''}`;
    dayNumber.textContent = day;
    dayElement.appendChild(dayNumber);
    
    // Adicionar eventos se existirem
    if (!isOtherMonth) {
        const dateKey = formatDateKey(new Date(year, month, day));
        if (events[dateKey]) {
            events[dateKey].forEach(eventText => {
                const eventElement = document.createElement('div');
                eventElement.className = 'event';
                eventElement.textContent = eventText;
                eventElement.onclick = (e) => {
                    e.stopPropagation();
                    alert(`Evento: ${eventText}`); 
                };
                dayElement.appendChild(eventElement);
            });
        }
    }
    
    // Ao clicar, permitir adicionar evento
    dayElement.onclick = () => {
        if (!isOtherMonth) {
            const eventText = prompt(`Adicionar evento para ${months[month]} ${day}:`);
            if (eventText) {
                const dateKey = formatDateKey(new Date(year, month, day));
                if (!events[dateKey]) {
                    events[dateKey] = [];
                }
                events[dateKey].push(eventText);
                renderCalendar();
            }
        }
    };
    
    return dayElement;
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
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    event.target.classList.add('active');
    
    if (view !== 'month') {
        alert(`Vista de ${view.charAt(0).toUpperCase() + view.slice(1)} será implementada aqui`); 
    }
}

function addEvent() {
    const today = new Date();
    const eventText = prompt('Adicionar novo evento:');
    if (eventText) {
        const dateKey = formatDateKey(today);
        if (!events[dateKey]) {
            events[dateKey] = [];
        }
        events[dateKey].push(eventText);
        renderCalendar();
    }
}

// Inicializar calendário
initializeEvents();
renderCalendar();
