<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>顯示事件</title>
    <link rel="stylesheet" href="{{ asset('luyen/event.css') }}">
</head>
<body>
    <h1>事件列表</h1>
    
    <div class="content-wrapper">
        <!-- 日曆部分 -->
        <div class="calendar-section">
            <h2>日曆視圖</h2>
            <div class="month-navigation">
                <button onclick="changeMonth(-1)">上個月</button>
                <span id="currentMonthYear"></span>
                <button onclick="changeMonth(1)">下個月</button>
            </div>
            <div class="calendar-container" id="calendarContainer">
                <!-- 日曆內容將通過 JavaScript 動態生成 -->
            </div>
        </div>

        <!-- 事件列表部分 -->
        <div class="events-section">
            <h2>詳細事件列表</h2>
            <table>
                <thead>
                    <tr>
                        <th>日期</th>
                        <th>時間</th>
                        <th>事件</th>
                        <th>城市</th>
                        <th>地區</th>
                        <th>詳細地址</th>
                        <th>時薪</th>
                    </tr>
                </thead>
                <tbody id="eventsList">
                    <!-- 事件列表將通過 JavaScript 動態生成 -->
                </tbody>
            </table>
        </div>
    </div>

    <script>
        // 將 PHP 數據傳遞給 JavaScript
        const $calendarEvents = @json($calendarEvents);
    </script>
    <script src="{{ asset('luyen/event.js') }}"></script>
</body>
</html>