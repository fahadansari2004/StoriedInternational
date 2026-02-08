/**
 * Main JavaScript for Event Management Website
 * Handles interactivity, form validation, and user experience enhancements
 */

(function () {
    'use strict';

    // DOM Elements
    const navbar = document.getElementById('mainNav');
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const contactForm = document.getElementById('contactForm');

    // Initialize on DOM load
    document.addEventListener('DOMContentLoaded', function () {
        initNavbar();
        initScrollToTop();
        initContactForm();
        initGallery();
        initSmoothScroll();
        initAnimations();
        initDropdowns();
    });

    /**
     * Navbar scroll effect
     */
    function initNavbar() {
        if (!navbar) return;

        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    /**
     * Scroll to top button
     */
    function initScrollToTop() {
        if (!scrollToTopBtn) return;

        window.addEventListener('scroll', function () {
            if (window.scrollY > 300) {
                scrollToTopBtn.style.display = 'block';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });

        scrollToTopBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * Smooth scroll for anchor links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');

                // Skip empty hash or just #
                if (href === '#' || href === '') {
                    return;
                }

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 76; // Account for fixed navbar

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                        if (bsCollapse) {
                            bsCollapse.hide();
                        }
                    }
                }
            });
        });
    }

    /**
     * Contact form validation and submission
     */
    function initContactForm() {
        if (!contactForm) return;

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function () {
                validateField(this);
            });

            input.addEventListener('input', function () {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });

        // Form submission
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!validateForm()) {
                // Scroll to first error
                const firstError = contactForm.querySelector('.is-invalid');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
                return false;
            }

            // If validation passes, submit the form
            submitForm();
        });

        // Rate limiting check
        const formIdentifier = 'contact-form-submission';
        if (!SecurityUtils.rateLimit.check(formIdentifier, 3, 60000)) {
            showAlert('Please wait before submitting again. Too many requests.', 'warning');
            return;
        }


    }

    /**
     * Validate individual form field
     */
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove previous validation classes
        field.classList.remove('is-valid', 'is-invalid');
        const feedback = field.parentElement.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.textContent = '';
        }

        // Skip validation for optional empty fields
        if (!field.hasAttribute('required') && value === '') {
            return true;
        }

        // Required field check
        if (field.hasAttribute('required') && value === '') {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Type-specific validation
        if (isValid && value !== '') {
            switch (field.type) {
                case 'email':
                    if (!SecurityUtils.validateEmail(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address';
                    }
                    break;

                case 'tel':
                    if (!SecurityUtils.validatePhone(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid phone number (10 digits)';
                    }
                    break;

                case 'number':
                    if (field.id === 'numberOfGuests') {
                        if (!SecurityUtils.validateNumber(value, 1, 50000)) {
                            isValid = false;
                            errorMessage = 'Please enter a valid number of guests (1-50000)';
                        }
                    }
                    break;

                case 'date':
                    if (!SecurityUtils.validateDate(value)) {
                        isValid = false;
                        errorMessage = 'Please select today or a future date';
                    }
                    break;
            }

            // Name field validation
            if (field.id === 'fullName') {
                if (!SecurityUtils.validateName(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid name (2-100 characters, letters only)';
                }
            }

            // Message field validation
            if (field.id === 'message') {
                if (!SecurityUtils.validateMessage(value)) {
                    isValid = false;
                    errorMessage = 'Message is too long or contains invalid characters (max 5000 characters)';
                }
            }
        }

        // Apply validation classes
        if (isValid) {
            field.classList.add('is-valid');
        } else {
            field.classList.add('is-invalid');
            if (feedback) {
                feedback.textContent = errorMessage;
            }
        }

        return isValid;
    }

    /**
     * Validate entire form
     */
    function validateForm() {
        const requiredFields = contactForm.querySelectorAll('[required]');
        let isFormValid = true;

        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isFormValid = false;
            }
        });

        // Validate optional fields that have values
        const optionalFields = contactForm.querySelectorAll('input:not([required]), textarea:not([required])');
        optionalFields.forEach(field => {
            if (field.value.trim() !== '' && !validateField(field)) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    /**
     * Submit form - Google Forms via hidden iframe
     */
    function submitForm() {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;

        // Disable submit button
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';

        // Show processing message
        // showAlert('Submitting your message...', 'info'); // Optional: Google forms is usually fast enough we might not need this double alert if we just wait for load

        // The form will submit naturally to the iframe target because we continue execution
        // We just need to listen for the iframe load to know when it's done
        const hiddenIframe = document.getElementById('hidden_iframe');
        let submitted = false;

        // Define the handler so we can remove it (in case of timeouts etc, though unlikely for simple form)
        const activeHandler = function () {
            if (submitted) return; // Prevent double firing if possible
            submitted = true;

            // Reset button
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;

            // Show success
            showAlert('Message sent successfully! We will contact you shortly.', 'success');

            // Reset form
            contactForm.reset();

            // Remove validation classes
            contactForm.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
                el.classList.remove('is-valid', 'is-invalid');
            });

            // Remove this listener
            hiddenIframe.removeEventListener('load', activeHandler);
        };

        // Safety timeout in case iframe load event doesn't fire (e.g., network issues or cross-origin blocking)
        setTimeout(() => {
            if (!submitted) {
                console.warn('Iframe load timeout - assuming submission or network issue');
                activeHandler();
            }
        }, 8000); // 8 seconds timeout

        hiddenIframe.addEventListener('load', activeHandler);

        // Verify submit happens - we need to actually let the submit event finish
        // The original code was preventing default and calling this. 
        // We need to manually submit because the initContactForm prevented default.
        contactForm.submit();
    }

    /**
     * Show alert message
     */
    function showAlert(message, type = 'info') {
        // Remove existing alerts
        const existingAlert = document.querySelector('.custom-alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show custom-alert position-fixed top-0 start-50 translate-middle-x mt-3`;
        alert.style.zIndex = '9999';
        alert.style.minWidth = '300px';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        document.body.appendChild(alert);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, 5000);
    }

    /**
     * Initialize gallery lightbox functionality (uses event delegation for dynamic content)
     */
    function initGallery() {
        const galleryContainer = document.getElementById('gallery-container');
        const container = galleryContainer || document.body;
        container.addEventListener('click', function (e) {
            const item = e.target.closest('.gallery-item');
            if (item) {
                const img = item.querySelector('img');
                if (img) {
                    showImageModal(img.src, img.alt);
                }
            }
        });
    }

    /**
     * Show image in modal
     */
    function showImageModal(src, alt) {
        // Remove existing modal
        const existingModal = document.getElementById('imageModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal
        const modal = document.createElement('div');
        modal.id = 'imageModal';
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content bg-dark">
                    <div class="modal-header border-0">
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-0">
                        <img src="${SecurityUtils.sanitizeInput(src)}" alt="${SecurityUtils.sanitizeInput(alt)}" class="img-fluid w-100">
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        // Remove modal from DOM after hiding
        modal.addEventListener('hidden.bs.modal', function () {
            modal.remove();
        });
    }

    /**
     * Initialize scroll animations
     */
    function initAnimations() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal', 'active');
                    // Add subtle tilt on scroll for mobile resonance
                    if (entry.target.classList.contains('card') || entry.target.classList.contains('service-card')) {
                        entry.target.style.transition = 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe ALL key elements for high-end feel
        const targets = document.querySelectorAll(`
            .card, .service-card, .stats-card, .gallery-item, .contact-info-card,
            section h2, section h3, section h5, section h6, section p.lead,
            .btn:not(.navbar-toggler), img:not(.navbar-brand img)
        `);

        targets.forEach((el, index) => {
            el.classList.add('reveal'); // Set initial hidden state
            observer.observe(el);
        });
    }

    /**
     * Initialize dropdown menus
     */
    function initDropdowns() {
        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                    const dropdown = bootstrap.Dropdown.getInstance(menu.previousElementSibling);
                    if (dropdown) {
                        dropdown.hide();
                    }
                });
            }
        });
    }

    // Prevent form resubmission on page refresh
    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href);
    }

    /**
     * Enhance tel: and mailto: links for better visibility and mobile support
     * Note: tel: and mailto: links work natively - we just enhance their appearance
     */
    function enhanceClickableLinks() {
        // Add visual feedback for tel links
        document.querySelectorAll('a[href^="tel:"]').forEach(link => {
            // Add aria-label for accessibility
            if (!link.getAttribute('aria-label')) {
                const phoneNum = link.textContent.trim();
                link.setAttribute('aria-label', `Call ${phoneNum}`);
            }
            // Ensure tap highlight on mobile
            link.style.webkitTapHighlightColor = 'rgba(13, 110, 253, 0.3)';
        });

        // Add visual feedback for mailto links
        document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
            // Add aria-label for accessibility
            if (!link.getAttribute('aria-label')) {
                const email = link.textContent.trim();
                link.setAttribute('aria-label', `Send email to ${email}`);
            }
            // Ensure tap highlight on mobile
            link.style.webkitTapHighlightColor = 'rgba(13, 110, 253, 0.3)';
        });
    }

    // Initialize enhanced links
    enhanceClickableLinks();

    // Console security message
    console.log('%cStop!', 'color: red; font-size: 50px; font-weight: bold;');
    console.log('%cThis is a browser feature intended for developers. If someone told you to copy-paste something here, it is a scam.', 'font-size: 16px;');

})();
