// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    initNavbarScroll();
    
    // Active link highlighting
    highlightActiveLinks();
    
    // Form validation
    initFormValidation();
    
    // Initialize notification system
    window.attention = new Prompt();
});

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Active link highlighting
function highlightActiveLinks() {
    const currentPath = window.location.pathname.replace(/\/$/, '');
    const navLinks = document.querySelectorAll('.navbar-nav a');
    
    navLinks.forEach(function(link) {
        const linkPath = link.getAttribute('href').replace(/\/$/, '');
        
        if (linkPath === currentPath) {
            link.classList.add('active');
            
            // Highlight parent dropdown if this is a dropdown item
            const dropdownToggle = link.closest('.dropdown-menu')?.previousElementSibling;
            if (dropdownToggle && dropdownToggle.classList.contains('dropdown-toggle')) {
                dropdownToggle.classList.add('active');
            }
        }
    });
}

// Form validation
function initFormValidation() {
    'use strict';
    window.addEventListener('load', function() {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        let forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        Array.prototype.filter.call(forms, function(form) {
            form.addEventListener('submit', function(event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
}

// Notification functions
function notify(msg, msgType) {
    notie.alert({
        type: msgType,
        text: msg,
    });
}

function notifyModal(title, text, icon, confirmationButtonText) {
    Swal.fire({
        title: title,
        html: text,
        icon: icon,
        confirmButtonText: confirmationButtonText
    });
}

// Prompt class for notifications
class Prompt {
    toast(c) {
        const {
            msg = '',
            icon = 'success',
            position = 'top-end',
        } = c;

        const Toast = Swal.mixin({
            toast: true,
            title: msg,
            position: position,
            icon: icon,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });

        Toast.fire({});
    }

    success(c) {
        const {
            msg = "",
            title = "",
            footer = "",
        } = c;

        Swal.fire({
            icon: 'success',
            title: title,
            text: msg,
            footer: footer,
        });
    }

    error(c) {
        const {
            msg = "",
            title = "",
            footer = "",
        } = c;

        Swal.fire({
            icon: 'error',
            title: title,
            text: msg,
            footer: footer,
        });
    }

    async custom(c) {
        const {
            msg = "",
            title = "",
        } = c;

        const { value: result } = await Swal.fire({
            title: title,
            html: msg,
            backdrop: false,
            focusConfirm: false,
            showCancelButton: true,
            willOpen: () => {
                if (c.willOpen !== undefined) {
                    c.willOpen();
                }
            },
            didOpen: () => {
                if (c.didOpen !== undefined) {
                    c.didOpen();
                }
            },
            preConfirm: () => {
                return [
                    document.getElementById('start').value,
                    document.getElementById('end').value
                ];
            }
        });

        if (result) {
            if (result.dismiss !== Swal.DismissReason.cancel) {
                if (result.value !== "") {
                    if (c.callback !== undefined) {
                        c.callback(result);
                    }
                } else {
                    c.callback(false);
                }
            } else {
                c.callback(false);
            }
        }
    }
}

// Make functions available globally if needed
window.notify = notify;
window.notifyModal = notifyModal;

attention.toast({msg: "Hello!"});
attention.success({title: "Success", msg: "It worked!"});