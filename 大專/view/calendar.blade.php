<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="base-url" content="{{ url('/') }}">
    <meta name="teacher-user-id" content="{{ $teacherUserId }}">
    @if(isset($teacherRequest))
    <meta name="event-title" content="{{ $teacherRequest->title }}">
    <meta name="teacher-request-id" content="{{ $teacherRequest->id }}">
    @endif
    <title>日曆選擇器</title>
    <link rel="stylesheet" href="{{ asset('luyen/calendar.css') }}">
    <link rel="icon" href="data:,">
</head>
<body>
    <div class="container">
        <div class="input-container">
            <h2>選擇日期和時間</h2>
            <div class="input-group">
                <label for="dateInput">選擇日期：</label>
                <input type="date" id="dateInput">
                <button id="addDate">添加日期</button>
            </div>
            <div id="selectedDates" class="selected-dates"></div>
            <div class="input-group">
                <label>選擇時間：</label>
                <div class="time-select-container">
                    <select id="eventHour" required>
                        <option value="">幾點</option>
                    </select>
                    <select id="eventMinute" required>
                        <option value="">幾分</option>
                    </select>
                </div>
            </div>
            <div class="input-group">
                <label for="citySelect">選擇縣市：</label>
                <select id="citySelect">
                    <option value="">選擇縣市</option>
                </select>
            </div>
            <div class="input-group">
                <label for="districtSelect">選擇地區：</label>
                <select id="districtSelect">
                    <option value="">選擇地區</option>
                </select>
            </div>
            <div class="input-group">
                <label for="detailAddress">詳細地址：</label>
                <input type="text" id="detailAddress" placeholder="請輸入詳細地址">
            </div>
            <div class="input-group">
                <label for="hourlyRate">時薪：</label>
                <input type="number" id="hourlyRate" placeholder="請輸入時薪">
            </div>
            <p id="eventType" class="event-type"></p>
            <button id="addEvent" class="btn-primary">加入事件</button>
        </div>
        <div class="right-container">
            <div class="calendar-container">
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
            </div>
            <div class="event-list">
                <h3>上課時間和地點</h3>
                <ul id="events"></ul>
                <button id="submitEvents" class="btn-primary">送出</button>
            </div>
        </div>
    </div>

    <script src="{{ asset('luyen/calendar.js') }}"></script>
</body>
</html>