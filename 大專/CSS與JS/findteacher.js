document.addEventListener('DOMContentLoaded', function() {
    const citySelect = document.getElementById('city');
    const districtsContainer = document.getElementById('districts-container');
    const jobForm = document.getElementById('jobForm');
    const hourlyRateMin = document.getElementById('hourly_rate_min');
    const hourlyRateMax = document.getElementById('hourly_rate_max');
    const subjectSelect = document.getElementById('subject');
    const expectedDateInput = document.getElementById('expected_date');
    // 獲取基礎URL
    const baseUrl = document.querySelector('meta[name="base-url"]').getAttribute('content');

    // 設置日期輸入的最小值為明天
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = tomorrow.toISOString().split('T')[0];
    expectedDateInput.setAttribute('min', tomorrowFormatted);

    // 獲取城市列表
    fetch(`${baseUrl}/cities`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(cities => {
            if (cities.length === 0) {
                console.log('No cities received from the server.');
                return;
            }
            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city.id;
                option.textContent = city.city;
                citySelect.appendChild(option);
            });
        })
        .catch(e => {
            console.error('獲取城市列表時出錯:', e);
            alert('無法獲取城市列表，請稍後再試。');
        });

    // 城市選擇變更時獲取地區
    citySelect.addEventListener('change', function () {
        const selectedCityId = this.value;
        if (selectedCityId) {
            fetch(`${baseUrl}/districts/${selectedCityId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(districts => {
                    districtsContainer.innerHTML = ''; // 清空現有選項
                    districts.forEach(district => {
                        const checkboxDiv = document.createElement('div');
                        checkboxDiv.className = 'district-checkbox';

                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.name = 'districts[]';
                        checkbox.value = district.id;
                        checkbox.id = `district-${district.id}`;

                        const label = document.createElement('label');
                        label.htmlFor = `district-${district.id}`;
                        label.textContent = district.district_name;

                        checkboxDiv.appendChild(checkbox);
                        checkboxDiv.appendChild(label);
                        districtsContainer.appendChild(checkboxDiv);
                    });
                })
                .catch(e => {
                    console.error('獲取地區列表時出錯:', e);
                    alert('無法獲取地區列表,請稍後再試。');
                });
        } else {
            districtsContainer.innerHTML = '';
        }
    });

    fetch(`${baseUrl}/subjects`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(subjects => {
            if (subjects.length === 0) {
                console.log('No subjects received from the server.');
                return;
            }
            subjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject.id;
                option.textContent = subject.name;
                subjectSelect.appendChild(option);
            });
        })
        .catch(e => {
            console.error('獲取科目列表時出錯:', e);
            alert('無法獲取科目列表，請稍後再試。');
        });

    // 表單提交處理
    if (jobForm) {
        jobForm.addEventListener('submit', function (event) {
            event.preventDefault();

            // 獲取表單字段值
            let formData = new FormData(this);

            // 檢查 subject_id
            if (!formData.get('subject_id')) {
                alert('請選擇科目');
                return;
            }

            // 調試用：輸出所有表單數據
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }

            // 驗證所有必填字段
            if (!validateForm(formData)) {
                return;
            }

            // 發送 AJAX 請求
            fetch(`${baseUrl}/findteacher`, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw err; });
                }
                return response.json();
            })
            .then(data => {
                alert(data.message);
                jobForm.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                if (error.error) {
                    alert('錯誤: ' + JSON.stringify(error.error));
                } else {
                    alert('提交失敗，請稍後再試。');
                }
            });
        });
    }

    // 驗證數字輸入
    function validateNumberInput(event) {
        event.target.value = event.target.value.replace(/[^\d]/g, '');
    }

    if (hourlyRateMin) {
        hourlyRateMin.addEventListener('input', validateNumberInput);
    }
    if (hourlyRateMax) {
        hourlyRateMax.addEventListener('input', validateNumberInput);
    }

    // 表單驗證函數
    function validateForm(formData) {
        let isValid = true;

        // 檢查必填字段
        const requiredFields = ['title', 'subject_id', 'expected_date', 'hourly_rate_min', 'hourly_rate_max', 'city_id', 'details'];
        for (let field of requiredFields) {
            if (!formData.get(field)) {
                console.log(`Missing field: ${field}`);  // 調試用
                isValid = false;
            }
        }

        // 檢查可上課時段（複選框）
        const availableTimes = formData.getAll('available_time[]');
        if (availableTimes.length === 0) {
            console.log('No available time selected');  // 調試用
            isValid = false;
        }

        // 檢查地區（複選框）
        const districts = formData.getAll('districts[]');
        if (districts.length === 0) {
            console.log('No district selected');  // 調試用
            isValid = false;
        }

        // 檢查時薪範圍
        let hourlyRateMin = parseInt(formData.get('hourly_rate_min'));
        let hourlyRateMax = parseInt(formData.get('hourly_rate_max'));
        if (isNaN(hourlyRateMin) || isNaN(hourlyRateMax) || hourlyRateMin > hourlyRateMax) {
            console.log('Invalid hourly rate range');  // 調試用
            isValid = false;
        }

        // 檢查日期是否在允許的範圍內
        const selectedDate = new Date(formData.get('expected_date'));
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate <= today) {
            console.log('Invalid date selected');  // 調試用
            isValid = false;
        }

        if (!isValid) {
            alert('請填寫所有必填欄位，並確保信息正確。');
        }

        return isValid;
    }
});