<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="base-url" content="{{ url('/') }}">
    <title>Calendar</title>
    <link rel="stylesheet" href="{{ asset('luyen/calendar.css') }}">
    <link rel="icon" href="data:,">
</head>
<body>
<div class="calendar">
        <div class="header">
            <button id="prevMonth">&lt;</button>
            <h2 id="monthYear"></h2>
            <button id="nextMonth">&gt;</button>
        </div>
        <div class="weekdays">
            <div>日</div>
            <div>一</div>
            <div>二</div>
            <div>三</div>
            <div>四</div>
            <div>五</div>
            <div>六</div>
        </div>
        <div id="days"></div>
    </div>
    <div id="eventModal" class="modal">
        <div class="modal-content">
            <h3>確認上課日期和地點</h3>
            <input type="date" id="eventDate">
            <div class="time-select-container">
                <select id="eventHour" required>
                    <option value="">小時</option>
                </select>
                <select id="eventMinute" required>
                    <option value="">分鐘</option>
                </select>
            </div>
            <select id="citySelect">
                <option value="">選擇縣市</option>
            </select>
            <select id="districtSelect">
                <option value="">選擇地區</option>
            </select>
            <input type="text" id="detailAddress" placeholder="詳細地址">
            <input type="number" id="hourlyRate" placeholder="時薪">
            <p id="eventType"></p>
            <button id="addEvent">加入</button>
            <button id="closeModal">關閉</button>
        </div>
    </div>
    <div id="eventList" class="event-list">
        <h3>上課時間和地點</h3>
        <ul id="events"></ul>
        <button id="submitEvents">提交到資料庫</button>
    </div>

    <script src="{{ asset('luyen/calendar.js') }}"></script>
</body>
</html>