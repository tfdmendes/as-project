let currentDate = new Date();
let events = {};

const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

function formatDateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function initializeEvents() {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    events[formatDateKey(today)] = [{ text: 'Dia Ocupado', protected: true }];
    events[formatDateKey(nextWeek)] = [{ text: 'Dia Ocupado', protected: true }];
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
        if (dayOfWeek === 0 || dayOfWeek === 6) {
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
        if (events[dateKey]) {
            events[dateKey].forEach((eventObj, index) => {
                const eventElement = document.createElement('div');
                eventElement.className = 'event';
                eventElement.textContent = eventObj.text;

                if (!eventObj.protected) {
                    eventElement.onclick = (e) => {
                        e.stopPropagation();
                        const confirmDelete = confirm(`Remover evento: "${eventObj.text}"?`);
                        if (confirmDelete) {
                            events[dateKey].splice(index, 1);
                            if (events[dateKey].length === 0) {
                                delete events[dateKey];
                            }
                            renderCalendar();
                        }
                    };
                }

                dayElement.appendChild(eventElement);
            });
        }
    }

    dayElement.onclick = () => {
        if (!isOtherMonth) {
            const dateKey = formatDateKey(new Date(year, month, day));

            if (events[dateKey]?.some(ev => ev.protected)) {
                alert("Não é possível adicionar eventos a este dia.");
                return;
            }

            const eventText = prompt(`Adicionar evento para ${months[month]} ${day}:`);
            if (eventText) {
                if (!events[dateKey]) {
                    events[dateKey] = [];
                }

                if (getEventCount() >= 1) {
                    alert("Só é permitido um evento. Remova o anterior para adicionar outro.");
                    return;
                }

                events[dateKey].push({ text: eventText, protected: false });
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
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    if (view !== 'month') {
        alert(`Vista de ${view} será implementada em breve.`);
    }
}

function toggleConfirmButton() {
    const existing = document.querySelector('.add-event-btn');
    if (existing) existing.remove();

    const button = document.createElement('button');
    button.className = 'add-event-btn';
    button.textContent = 'Confirmar e prosseguir';

    button.onclick = () => {
        const count = getEventCount();
        if (count === 1) {
            window.location.href = 'reserva-form.html';
        } else {
            alert('Por favor, selecione exatamente 1 evento para continuar.');
        }
    };

    document.body.appendChild(button);
}

function addEvent() {
    const today = new Date();
    const dateKey = formatDateKey(today);

    if (events[dateKey]?.some(ev => ev.protected)) {
        alert("Não é possível adicionar eventos a este dia.");
        return;
    }

    const eventText = prompt('Adicionar novo evento:');
    if (eventText) {
        if (getEventCount() >= 1) {
            alert("Só é permitido um evento. Remova o anterior para adicionar outro.");
            return;
        }

        if (!events[dateKey]) {
            events[dateKey] = [];
        }

        events[dateKey].push({ text: eventText, protected: false });
        renderCalendar();
    }
}

function getEventCount() {
    return Object.values(events).reduce(
        (sum, list) => sum + list.filter(ev => !ev.protected).length,
        0
    );
}

// Inicialização
initializeEvents();
renderCalendar();
