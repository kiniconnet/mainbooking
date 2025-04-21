 
document.getElementById("check-availability-button").addEventListener("click", function () {
    let html = `
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card shadow-sm border-0">
                    <div class="card-body p-4 p-md-5">
                        <form id="check-availability-form" action="/search-availability" method="post" novalidate class="needs-validation">
                            <input type="hidden" name="csrf_token" value="{{.CSRFToken}}">
                            
                            <div class="row g-3 mb-4">
                                <div class="col-md-6">
                                    <div class="form-floating">
                                        <input required class="form-control" type="text" name="start" id="start-date" placeholder="Arrival" autocomplete="off">
                                        <label for="start-date" class="form-label">
                                            <i class="fas fa-calendar-alt me-2"></i>Arrival Date
                                        </label>
                                        <div class="invalid-feedback">Please select an arrival date</div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-floating">
                                        <input required class="form-control" type="text" name="end" id="end-date" placeholder="Departure" autocomplete="off">
                                        <label for="end-date" class="form-label">
                                            <i class="fas fa-calendar-alt me-2"></i>Departure Date
                                        </label>
                                        <div class="invalid-feedback">Please select a departure date</div>
                                    </div>
                                </div>
                            </div>
                              <div class="text-center">
                                <button type="submit" class="btn btn-secondary">Check Availability</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    attention.custom({
        title: 'Choose your dates',
        msg: html,
        willOpen: () => {
                       // Initialize date pickers with improved configuration
                       const startDatePicker = new Datepicker(document.getElementById('start-date'), {
                        format: "yyyy-mm-dd",
                        minDate: new Date(),
                        autohide: true,
                        orientation: "bottom", // Keep default orientation
                        todayHighlight: true,
                        clearBtn: true,
                        container: 'body', // Append to body to avoid overflow issues
                        beforeShowDay: date => ({ enabled: date >= new Date() })
                    });
        
                    const endDatePicker = new Datepicker(document.getElementById('end-date'), {
                        format: "yyyy-mm-dd",
                        minDate: new Date(),
                        autohide: true,
                        orientation: "bottom",
                        todayHighlight: true,
                        clearBtn: true,
                        container: 'body', // Ensure proper positioning
                        beforeShowDay: date => ({ enabled: date >= new Date() })
                    });

            // Add form submission handler
            document.getElementById('check-availability-form').addEventListener('submit', function(e) {
                e.preventDefault();
                attention.close();
                
                const formData = new FormData(this);
                
                fetch('/search-availability-json', {
                    method: "POST",
                    body: formData,
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    // Handle response here
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            });
        },
        didOpen: () => {
            // Remove disabled attributes if needed
            document.getElementById("start-date")?.removeAttribute("disabled");
            document.getElementById("end-date")?.removeAttribute("disabled");
        }
    });
});
