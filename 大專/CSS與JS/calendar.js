document.addEventListener('DOMContentLoaded', function() {
let currentDate = new Date();
let events = [];

const baseUrl = document.querySelector('meta[name="base-url"]').getAttribute('content');

// 固定的事件類型
const EVENT_TYPE = "數學課";

// 獲取今天的日期字符串（格式：YYYY-MM-DD）
function getTodayString() {
    const today = new Date();
    return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
}

// 獲取當前時間加2小時後的時間
function getMinTime() {
    const now = new Date();
    now.setHours(now.getHours() + 2);
    return {
        hour: now.getHours(),
        minute: Math.ceil(now.getMinutes() / 5) * 5
    };
}

// 從資料庫獲取事件類型
function fetchEventType() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(EVENT_TYPE);
        }, 100); // 模擬網絡延遲
    });
}

// 初始化事件類型顯示
async function initializeEventTypeDisplay() {
    const eventTypeElement = document.getElementById('eventType');
    const type = await fetchEventType();
    eventTypeElement.textContent = ` ${type}`;
}

// 獲取縣市和地區數據
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
// 城市選擇變更時獲取地區
document.getElementById('citySelect').addEventListener('change', function () {
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
                        option.textContent = district.district_name; // 注意这里使用 district_name
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
            dayElement.style.color = '#ccc'; // 過去的日期顯示為灰色
            dayElement.style.cursor = 'not-allowed';
        } else {
            dayElement.addEventListener('click', () => openEventModal(i));
            
            if (events.some(event => event.date === dateString)) {
                dayElement.style.backgroundColor = '#FFCCCB'; // 淺紅色
            } else if (i === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()) {
                dayElement.style.backgroundColor = '#4CAF50';
                dayElement.style.color = 'white';
            }
        }
        
        daysContainer.appendChild(dayElement);
    }
}

function populateTimeSelects(minHour = 0, minMinute = 0) {
    const hourSelect = document.getElementById('eventHour');
    const minuteSelect = document.getElementById('eventMinute');
    
    hourSelect.innerHTML = '<option value="">小時</option>';
    minuteSelect.innerHTML = '<option value="">分鐘</option>';
    
    for (let hour = 0; hour < 24; hour++) {
        if (hour >= minHour) {
            const option = document.createElement('option');
            option.value = hour.toString().padStart(2, '0');
            option.textContent = hour.toString().padStart(2, '0');
            hourSelect.appendChild(option);
        }
    }
    
    for (let minute = 0; minute < 60; minute += 5) {
        const option = document.createElement('option');
        option.value = minute.toString().padStart(2, '0');
        option.textContent = minute.toString().padStart(2, '0');
        minuteSelect.appendChild(option);
    }

    // 如果是今天，限制分鐘選項
    if (minHour === hourSelect.value) {
        Array.from(minuteSelect.options).forEach(option => {
            if (parseInt(option.value) < minMinute) {
                option.disabled = true;
            }
        });
    }
}

function openEventModal(day) {
    const modal = document.getElementById('eventModal');
    const eventDate = document.getElementById('eventDate');
    
    const dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    eventDate.value = dateString;
    eventDate.min = getTodayString();
    
    if (dateString === getTodayString()) {
        const minTime = getMinTime();
        populateTimeSelects(minTime.hour, minTime.minute);
    } else {
        populateTimeSelects();
    }
    
    // 重置其他輸入欄位
    document.getElementById('eventHour').value = '';
    document.getElementById('eventMinute').value = '';
    document.getElementById('citySelect').value = '';
    document.getElementById('districtSelect').innerHTML = '<option value="">選擇地區</option>';
    document.getElementById('detailAddress').value = '';
    document.getElementById('hourlyRate').value = '';
    
    modal.style.display = 'block';
}

function addEvent() {
    const eventDate = document.getElementById('eventDate').value;
    const eventHour = document.getElementById('eventHour').value;
    const eventMinute = document.getElementById('eventMinute').value;
    const city = document.getElementById('citySelect').options[document.getElementById('citySelect').selectedIndex].text;
    const district = document.getElementById('districtSelect').options[document.getElementById('districtSelect').selectedIndex].text;
    const detailAddress = document.getElementById('detailAddress').value;
    const hourlyRate = document.getElementById('hourlyRate').value;

    if (!eventHour || !eventMinute || !city || !district || !detailAddress || !hourlyRate) {
        alert('請填寫所有必要的信息');
        return;
    }

    const eventTime = `${eventHour}:${eventMinute}`;
    const selectedDateTime = new Date(`${eventDate}T${eventTime}`);
    const minDateTime = new Date();
    minDateTime.setHours(minDateTime.getHours() + 2);
    
    if (selectedDateTime < minDateTime) {
        alert('請選擇至少2小時後的時間');
        return;
    }

    const newEvent = {
        id: Date.now(), // 使用临时ID，最终ID将由服务器分配
        date: eventDate,
        time: eventTime,
        text: EVENT_TYPE,
        city: city,
        district: district,
        detail_address: detailAddress,
        hourly_rate: hourlyRate
    };

    // 添加新事件到本地数组
    events.push(newEvent);

    // 更新显示
    renderCalendar();
    renderEventList();

    // 关闭模态框
    document.getElementById('eventModal').style.display = 'none';

    // 可选：显示成功消息
    alert('事件已添加到列表，請點擊"提交到資料庫"按鈕保存所有事件');
}

// function fetchEvents() {
//     fetch(`${baseUrl}/get-events`)
//     .then(response => response.json())
//     .then(data => {
//         events = data;
//         renderCalendar();
//         renderEventList();
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         alert('獲取事件列表時發生錯誤');
//     });
// }

function renderEventList() {
    const eventList = document.getElementById('events');
    eventList.innerHTML = '';
    
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

    // 為所有刪除按鈕添加事件監聽器
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            deleteEvent(this.getAttribute('data-id'));
        });
    });
}

function deleteEvent(id) {
    if (confirm('確定要刪除這個事件嗎？')) {
        fetch(`${baseUrl}/delete-event/${id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        })
        .then(response => {
            if (response.ok) {
                fetchEvents(); // 重新獲取事件列表
            } else {
                throw new Error('刪除失敗');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('刪除事件時發生錯誤');
        });
    }
}

document.getElementById('prevMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('eventModal').style.display = 'none';
});

document.getElementById('addEvent').addEventListener('click', addEvent);

// 動態更新時間限制
document.getElementById('eventDate').addEventListener('change', function() {
    const eventDate = this.value;
    if (eventDate === getTodayString()) {
        const minTime = getMinTime();
        populateTimeSelects(minTime.hour, minTime.minute);
    } else {
        populateTimeSelects();
    }
});

document.getElementById('eventHour').addEventListener('change', function() {
    const eventDate = document.getElementById('eventDate').value;
    const selectedHour = this.value;
    
    if (eventDate === getTodayString()) {
        const minTime = getMinTime();
        if (parseInt(selectedHour) === minTime.hour) {
            Array.from(document.getElementById('eventMinute').options).forEach(option => {
                option.disabled = parseInt(option.value) < minTime.minute;
            });
        } else {
            Array.from(document.getElementById('eventMinute').options).forEach(option => {
                option.disabled = false;
            });
        }
    }
});

// 初始化
(async function() {
    await initializeEventTypeDisplay();
    
})();


document.getElementById('submitEvents').addEventListener('click', submitEventsToDatabase);

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
        body: JSON.stringify({ events: events })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('所有事件已成功提交到資料庫');
            events = []; // 清空本地事件列表
            renderEventList(); // 重新渲染空的事件列表
            renderCalendar(); // 重新渲染日曆
        } else {
            alert('提交事件時發生錯誤: ' + (data.error || '未知錯誤'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('提交事件時發生錯誤');
    });
}
renderCalendar();
});