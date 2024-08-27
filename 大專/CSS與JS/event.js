let currentDate = new Date();
const today = new Date().toISOString().split('T')[0];

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();

    let calendarHTML = `
        <table class="calendar">
            <thead>
                <tr>
                    <th>日</th>
                    <th>一</th>
                    <th>二</th>
                    <th>三</th>
                    <th>四</th>
                    <th>五</th>
                    <th>六</th>
                </tr>
            </thead>
            <tbody>
    `;

    let day = 1;
    for (let i = 0; i < 6; i++) {
        calendarHTML += '<tr>';
        for (let j = 0; j < 7; j++) {
            if ((i === 0 && j < firstDayOfWeek) || day > daysInMonth) {
                calendarHTML += '<td></td>';
            } else {
                const currentDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isPastDate = currentDate < today;
                const hasEvent = $calendarEvents.some(event => event.date === currentDate);
                const className = isPastDate ? 'past-date' : (hasEvent ? 'event-date' : '');

                calendarHTML += `<td class="${className}">
                    <div class="day-number">${day}</div>`;

                    if (!isPastDate && hasEvent) {
                        $calendarEvents.forEach(event => {
                            if (event.date === currentDate) {
                                calendarHTML += `<div class="event-text" onclick="highlightEvent('${event.date}', '${event.time}')">${event.text}</div>`;
                            }
                        });
                    }

                calendarHTML += '</td>';
                day++;
            }
        }
        calendarHTML += '</tr>';
        if (day > daysInMonth) break;
    }

    calendarHTML += '</tbody></table>';
    document.getElementById('calendarContainer').innerHTML = calendarHTML;
    document.getElementById('currentMonthYear').textContent = `${year}年${String(month + 1).padStart(2, '0')}月`;
}

function renderEventsList() {
    const sortedEvents = $calendarEvents
        .filter(event => event.date >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const eventsListHTML = sortedEvents.map(event => {
        const [hours, minutes] = event.time.split(':');
        const formattedTime = `${hours}:${minutes}`;
        return `
        <tr id="event-${event.date}-${event.time}">
            <td>${event.date}</td>
            <td>${formattedTime}</td>
            <td>${event.text}</td>
            <td>${event.city}</td>
            <td>${event.district}</td>
            <td>${event.detail_address}</td>
            <td>${event.hourly_rate}</td>
        </tr>
    `}).join('');
    document.getElementById('eventsList').innerHTML = eventsListHTML;
}
function highlightEvent(date, time) {
    // 移除之前的高亮
    const previousHighlight = document.querySelector('.highlighted-event');
    if (previousHighlight) {
        previousHighlight.classList.remove('highlighted-event');
    }

    // 找到對應的事件行並高亮
    const eventRow = document.getElementById(`event-${date}-${time}`);
    if (eventRow) {
        eventRow.classList.add('highlighted-event');
        eventRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    renderCalendar();
}

// 初始渲染
renderCalendar();
renderEventsList();