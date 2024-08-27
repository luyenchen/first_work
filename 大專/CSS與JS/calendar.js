document.addEventListener('DOMContentLoaded', function() {
    let currentDate = new Date();
    let events = [];
    let selectedDates = [];

    const baseUrl = document.querySelector('meta[name="base-url"]').getAttribute('content');
    const teacherUserId = document.querySelector('meta[name="teacher-user-id"]').getAttribute('content');
    const EVENT_TYPE = document.querySelector('meta[name="event-title"]')?.getAttribute('content');
    const teacherRequestId = document.querySelector('meta[name="teacher-request-id"]')?.getAttribute('content');

    console.log('Using simulated teacher ID:', teacherUserId);
    console.log('Using teacher request ID:', teacherRequestId);

    function getTodayString() {
        const today = new Date();
        return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    }

    function getMinTime() {
        const now = new Date();
        now.setHours(now.getHours() + 2);
        return {
            hour: now.getHours(),
            minute: Math.ceil(now.getMinutes() / 5) * 5
        };
    }

    async function initializeEventTypeDisplay() {
        const eventTypeElement = document.getElementById('eventType');
        if (eventTypeElement) {
            eventTypeElement.textContent = EVENT_TYPE || '未指定事件類型';
        }
    }

    fetch(`${baseUrl}/cities`)
        .then(response => response.json())
        .then(cities => {
            console.log('Received cities:', cities);
            if (cities.length === 0) {
                console.log('No cities received from the server.');
                return;
            }
            const citySelect = document.getElementById('citySelect');
            if (!citySelect) {
                console.error('citySelect element not found');
                return;
            }
            let optionsHtml = '<option value="">選擇縣市</option>';
            cities.forEach(city => {
                optionsHtml += `<option value="${city.id}">${city.city}</option>`;
            });
            citySelect.innerHTML = optionsHtml;
        })
        .catch(e => {
            console.error('獲取城市列表時出錯:', e);
            alert('無法獲取城市列表，請稍後再試。');
        });

    function renderCalendar() {
        const monthYear = document.getElementById('monthYear');
        const daysContainer = document.getElementById('days');
        
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        monthYear.textContent = `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月`;
        
        daysContainer.innerHTML = '';
        
        for (let i = 0; i < firstDay.getDay(); i++) {
            const emptyDay = document.createElement('div');
            daysContainer.appendChild(emptyDay);
        }
        
        const today = new Date();
        
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = i;
            
            const dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
            const currentDateObj = new Date(dateString);
            
            if (currentDateObj < today) {
                dayElement.style.color = '#ccc';
                dayElement.style.cursor = 'not-allowed';
            } else {
                dayElement.addEventListener('click', () => toggleDateSelection(dateString, dayElement));
                
                if (events.some(event => event.date === dateString)) {
                    dayElement.style.backgroundColor = '#FFCCCB';
                } else if (i === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()) {
                    dayElement.style.backgroundColor = '#4CAF50';
                    dayElement.style.color = 'white';
                }

                if (selectedDates.includes(dateString)) {
                    dayElement.classList.add('selected-date');
                }
            }
            
            daysContainer.appendChild(dayElement);
        }
    }

    function toggleDateSelection(dateString, dayElement) {
        const index = selectedDates.indexOf(dateString);
        if (index > -1) {
            selectedDates.splice(index, 1);
            dayElement?.classList.remove('selected-date');
        } else {
            selectedDates.push(dateString);
            dayElement?.classList.add('selected-date');
        }
        updateSelectedDatesDisplay();
    }

    function updateSelectedDatesDisplay() {
        const selectedDatesContainer = document.getElementById('selectedDates');
        selectedDatesContainer.innerHTML = '選擇的日期：';
        selectedDates.sort().forEach(date => {
            const dateSpan = document.createElement('span');
            dateSpan.textContent = date;
            dateSpan.style.marginRight = '10px';
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'x';
            deleteButton.onclick = () => {
                toggleDateSelection(date);
                renderCalendar();
            };
            dateSpan.appendChild(deleteButton);
            selectedDatesContainer.appendChild(dateSpan);
        });
    }

    function populateTimeSelects() {
        const hourSelect = document.getElementById('eventHour');
        const minuteSelect = document.getElementById('eventMinute');
        
        hourSelect.innerHTML = '<option value="">幾點</option>';
        minuteSelect.innerHTML = '<option value="">幾分</option>';
        
        for (let hour = 0; hour < 24; hour++) {
            const option = document.createElement('option');
            option.value = hour.toString().padStart(2, '0');
            option.textContent = hour.toString().padStart(2, '0');
            hourSelect.appendChild(option);
        }
        
        for (let minute = 0; minute < 60; minute += 5) {
            const option = document.createElement('option');
            option.value = minute.toString().padStart(2, '0');
            option.textContent = minute.toString().padStart(2, '0');
            minuteSelect.appendChild(option);
        }

        updateMinuteOptions();
    }

    function updateMinuteOptions() {
        const hourSelect = document.getElementById('eventHour');
        const minuteSelect = document.getElementById('eventMinute');
        const selectedHour = hourSelect.value;

        const today = getTodayString();
        if (selectedDates.includes(today) && parseInt(selectedHour) === getMinTime().hour) {
            Array.from(minuteSelect.options).forEach(option => {
                option.disabled = parseInt(option.value) < getMinTime().minute;
            });
        } else {
            Array.from(minuteSelect.options).forEach(option => {
                option.disabled = false;
            });
        }
    }

    function validateTimeSelection() {
        const hourSelect = document.getElementById('eventHour');
        const minuteSelect = document.getElementById('eventMinute');
        const selectedHour = hourSelect.value;
        const selectedMinute = minuteSelect.value;

        const today = getTodayString();
        if (selectedDates.includes(today)) {
            const minTime = getMinTime();
            if (parseInt(selectedHour) < minTime.hour || 
                (parseInt(selectedHour) === minTime.hour && parseInt(selectedMinute) < minTime.minute)) {
                alert('請選擇至少2小時後的時間');
                hourSelect.value = '';
                minuteSelect.value = '';
            }
        }
    }

    function addEvent() {
        const eventHour = document.getElementById('eventHour').value;
        const eventMinute = document.getElementById('eventMinute').value;
        const citySelect = document.getElementById('citySelect');
        const districtSelect = document.getElementById('districtSelect');
        const city = citySelect.options[citySelect.selectedIndex]?.text;
        const district = districtSelect.options[districtSelect.selectedIndex]?.text;
        const detailAddress = document.getElementById('detailAddress').value;
        const hourlyRate = document.getElementById('hourlyRate').value;

        if (selectedDates.length === 0 || !eventHour || !eventMinute || !city || !district || !detailAddress || !hourlyRate) {
            alert('請填寫所有必要的信息並選擇至少一個日期');
            return;
        }

        const eventTime = `${eventHour}:${eventMinute}`;

        for (const date of selectedDates) {
            const newEvent = {
                id: Date.now() + Math.random(),
                date: date,
                time: eventTime,
                text: EVENT_TYPE,
                city: city,
                district: district,
                detail_address: detailAddress,
                hourly_rate: hourlyRate
            };

            events.push(newEvent);
        }

        renderCalendar();
        renderEventList();
        selectedDates = [];
        updateSelectedDatesDisplay();
        clearInputFields();
    }

    function clearInputFields() {
        document.getElementById('dateInput').value = '';
        document.getElementById('eventHour').value = '';
        document.getElementById('eventMinute').value = '';
        document.getElementById('citySelect').value = '';
        document.getElementById('districtSelect').innerHTML = '<option value="">選擇地區</option>';
        document.getElementById('detailAddress').value = '';
        document.getElementById('hourlyRate').value = '';
    }

    function renderEventList() {
        const eventList = document.getElementById('events');
        eventList.innerHTML = '';
        
        events.sort((a, b) => new Date(a.date) - new Date(b.date));

        events.forEach((event) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div>${event.date} ${event.time}: ${event.text}</div>
                <div>${event.city}${event.district}</div>
                <div>${event.detail_address}</div>
                <div>時薪: ${event.hourly_rate}</div>
                <button class="delete-btn" data-id="${event.id}">刪除</button>
            `;
            eventList.appendChild(li);
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                deleteEvent(this.getAttribute('data-id'));
            });
        });

        const submitButton = document.getElementById('submitEvents');
        if (submitButton) {
            submitButton.disabled = events.length === 0;
        }
    }

    function deleteEvent(id) {
        if (confirm('確定要刪除這個事件嗎？')) {
            events = events.filter(event => event.id != id);
            renderEventList();
            renderCalendar();
        }
    }

    function submitEventsToDatabase() {
        if (events.length === 0) {
            alert('沒有事件可以提交');
            return;
        }
    
        fetch(`${baseUrl}/submit-events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({ 
                events: events,
                teacher_id: teacherUserId, 
                teacher_request_id: teacherRequestId
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert(data.message || '所有事件已成功提交到資料庫');
                events = [];
                renderEventList();
                renderCalendar();
                if (data.shouldClose) {
                    window.close();
                } 
            } else {
                throw new Error(data.error || '提交失敗');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('提交事件時發生錯誤: ' + error.message);
        });
    }

    function initializeEventListeners() {
        document.getElementById('prevMonth')?.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });

        document.getElementById('nextMonth')?.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });

        document.getElementById('addEvent')?.addEventListener('click', addEvent);

        document.getElementById('eventHour')?.addEventListener('change', updateMinuteOptions);
        document.getElementById('eventMinute')?.addEventListener('change', validateTimeSelection);

        document.getElementById('submitEvents')?.addEventListener('click', submitEventsToDatabase);

        document.getElementById('citySelect')?.addEventListener('change', function () {
            const selectedCityId = this.value;
            const districtSelect = document.getElementById('districtSelect');
            
            if (selectedCityId) {
                console.log('Selected city ID:', selectedCityId);
                fetch(`${baseUrl}/districts/${selectedCityId}`)
                    .then(response => response.json())
                    .then(districts => {
                        console.log('Received districts:', districts);
                        setTimeout(() => {
                            districtSelect.innerHTML = '<option value="">選擇地區</option>';
                            districts.forEach(district => {
                                const option = document.createElement('option');
                                option.value = district.id;
                                option.textContent = district.district_name;
                                districtSelect.appendChild(option);
                            });
                            console.log('Districts added to select');
                            console.log('District select innerHTML:', districtSelect.innerHTML);
                        }, 0);
                    })
                    .catch(e => {
                        console.error('獲取地區列表時出錯:', e);
                        alert('無法獲取地區列表，請稍後再試。');
                    });
            } else {
                districtSelect.innerHTML = '<option value="">選擇地區</option>';
            }
        });

        document.getElementById('addDate')?.addEventListener('click', function() {
            const dateInput = document.getElementById('dateInput');
            const selectedDate = dateInput.value;
            if (selectedDate) {
                toggleDateSelection(selectedDate);
                dateInput.value = '';
                renderCalendar();
            } else {
                alert('請先選擇一個日期');
            }
        });

        document.getElementById('dateInput')?.addEventListener('change', function() {
            const selectedDate = this.value;
            if (selectedDate) {
                toggleDateSelection(selectedDate);
                this.value = '';
                renderCalendar();
            }
        });
    }

    // 初始化
    (async function() {
        await initializeEventTypeDisplay();
        renderCalendar();
        renderEventList();
        populateTimeSelects();
        initializeEventListeners();
    })();
});