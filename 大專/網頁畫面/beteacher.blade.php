<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <meta name="base-url" content="{{ url('/') }}">
    <title>Document</title>
    <link rel="stylesheet" href="{{ asset('luyen/findteacher.css')}}">
</head>
<body>
<div>
        <form id="jobForm" method="POST"  >
            @csrf
            <h2>成為老師</h2>

            <div class="form-group">
                <label for="title">標題:</label>
                <input type="text" id="title" name="title" required>
            </div>

            <div class="form-group w-45 fl mr-5">
             <label for="subject">科目:</label>
         <select id="subject" name="subject_id" required>
        <option value="">請選擇科目</option>
        <!-- 科目選項將通過 JavaScript 動態添加 -->
        </select>
         </div>
            
        <div class="form-group w-45 fl">
            <label>可上課時段(可複選):</label>
            <div class="fl mr-5">
                <input type="checkbox" id="time_morning" name="available_time[]" value="早上">
                <label for="time_morning">早上</label>
            </div>
            <div class="fl mr-5">
                <input type="checkbox" id="time_afternoon" name="available_time[]" value="下午">
                <label for="time_afternoon">下午</label>
            </div>
            <div class="fl ">
                <input type="checkbox" id="time_evening" name="available_time[]" value="晚上">
                <label for="time_evening">晚上</label>
            </div>
        </div>
            
        <div class="w-100 fl mr-5">
            <div class="form-group fl w-45 mr-5">
                <label for="hourly_rate">時薪</label>
                <div class="hourly-rate-inputs">
                    <input type="number" id="hourly_rate" name="hourly_rate" min="0" step="1" required
                        placeholder="最低">
                    
                </div>
            </div>
        </div>
            <div class="form-group fl w-100 ">
            <div class="form-group fl w-45 mr-5">
                <label for="city">縣市:</label>
                <select id="city" name="city_id" required>
                    <option value="">請選擇縣市</option>
                    
                </select>
            </div>
            </div>   
            <div class="form-group fl w-100">
            <label>地區 (可複選):</label>
            <div id="districts-container">
                <!-- JS處理地區 -->
            </div>
        </div>



            <div class="form-group w-100 fl">
                <label for="details">詳細內容:</label>
                <textarea id="details" name="details" rows="4" required></textarea>
            </div>
            
           
            <!-- <div class="form-group fl w-100">
    <button type="button" id="selectResumeBtn">選擇要使用的履歷</button>
    <div id="selectedResume" style="display: none; margin-top: 10px;">
        <p>已選擇的履歷: <span id="resumeName"></span></p>
    </div>
</div> -->



            <button type="submit">提交</button>
        </form>
    </div>
            <script src="{{ asset('luyen/beteacher.js') }}"></script>
</body>
</html>