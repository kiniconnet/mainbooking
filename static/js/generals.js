document.getElementById("check-availability-button").addEventListener("click", function () {
    let html = `
    <form id="check-availability-form" action="" method="post" novalidate class="needs-validation">
        <div class="container-fluid">
            <div class="row g-3">
                <div class="col-12 col-md-6">
                    <label for="start" class="form-label">Arrival</label>
                    <input required class="form-control date-picker" type="text" name="start" id="start" placeholder="Select date" autocomplete="off">
                </div>
                <div class="col-12 col-md-6">
                    <label for="end" class="form-label">Departure</label>
                    <input required class="form-control date-picker" type="text" name="end" id="end" placeholder="Select date" autocomplete="off">
                </div>
            </div>
        </div>
    </form>
    `;
    
    const modal = attention.custom({
        title: 'Choose your dates',
        msg: html,
        willOpen: () => {
            // Initialize date picker after modal is created but before it's shown
            const startDateEl = document.getElementById('start');
            const endDateEl = document.getElementById('end');
            
            // Clear any previous instances
            if (startDateEl._datepicker) {
                startDateEl._datepicker.destroy();
            }
            if (endDateEl._datepicker) {
                endDateEl._datepicker.destroy();
            }

            // Initialize date range picker
            const datepicker = new DateRangePicker(startDateEl, {
                format: 'yyyy-mm-dd',
                autohide: true,
                minDate: new Date(),
                orientation: 'auto',
            });
            
            // Store reference for cleanup
            startDateEl._datepicker = datepicker;
        },
        didOpen: () => {
            // Focus on arrival date for better UX
            document.getElementById("start").focus();
        },
        callback: function(result) {
            if (!result) return;
            
            const form = document.getElementById("check-availability-form");
            const formData = new FormData(form);
            formData.append("csrf_token", "{{.CSRFToken}}");
            
            // Show loading state
            const submitBtn = document.querySelector('.attention-btn.confirm');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Checking...';

            fetch('/search-availability-json', {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(handleResponse)
            .then(handleSuccess)
            .catch(handleError)
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Check Availability';
            });
        }
    });

    function handleResponse(response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    function handleSuccess(data) {
        if (data.ok) {
            attention.success({
                title: "Available!",
                msg: data.message,
                showConfirmButton: true,
                confirmButtonText: "Book Now",
                callback: function() {
                    window.location.href = `/book-room?id=${data.room_id}&s=${data.start_date}&e=${data.end_date}`;
                }
            });
        } else {
            attention.error({
                title: "Not Available",
                msg: data.message,
                showConfirmButton: true
            });
        }
    }

    function handleError(error) {
        console.error('Error:', error);
        attention.error({
            title: "Error",
            msg: "There was an error checking availability. Please try again.",
            showConfirmButton: true
        });
    }
});