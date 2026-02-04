/**
 * Form Validation.js
 * Handles validation for contact forms, registration forms, and admin forms
 */

class FormValidator {
    constructor() {
        this.forms = [];
        this.init();
    }

    init() {
        // Initialize all forms on the page
        document.querySelectorAll('form').forEach(form => {
            this.setupForm(form);
        });
    }

    setupForm(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateForm(form)) {
                this.handleFormSubmit(form);
            }
        });

        // Real-time validation
        form.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });

            field.addEventListener('input', () => {
                this.clearError(field);
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const fields = form.querySelectorAll('input[required], textarea[required], select[required]');

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const name = field.name || field.id;

        // Clear previous errors
        this.clearError(field);

        // Required field check
        if (field.hasAttribute('required') && !value) {
            this.showError(field, 'This field is required');
            return false;
        }

        // Type-specific validation
        switch(type) {
            case 'email':
                return this.validateEmail(field);
            case 'tel':
                return this.validatePhone(field);
            case 'url':
                return this.validateURL(field);
            case 'number':
                return this.validateNumber(field);
            default:
                // Text validation based on name
                if (name && name.includes('name')) {
                    return this.validateName(field);
                }
                if (name && name.includes('password')) {
                    return this.validatePassword(field);
                }
        }

        return true;
    }

    validateEmail(field) {
        const value = field.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (value && !emailRegex.test(value)) {
            this.showError(field, 'Please enter a valid email address');
            return false;
        }

        return true;
    }

    validatePhone(field) {
        const value = field.value.trim();
        // Nigerian phone number format
        const phoneRegex = /^(\+234|234|0)[7-9][0-1]\d{8}$/;

        if (value && !phoneRegex.test(value.replace(/\s/g, ''))) {
            this.showError(field, 'Please enter a valid Nigerian phone number');
            return false;
        }

        return true;
    }

    validateURL(field) {
        const value = field.value.trim();
        const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

        if (value && !urlRegex.test(value)) {
            this.showError(field, 'Please enter a valid URL');
            return false;
        }

        return true;
    }

    validateNumber(field) {
        const value = field.value.trim();
        const min = field.getAttribute('min');
        const max = field.getAttribute('max');

        if (value && isNaN(value)) {
            this.showError(field, 'Please enter a valid number');
            return false;
        }

        if (min && parseFloat(value) < parseFloat(min)) {
            this.showError(field, `Value must be at least ${min}`);
            return false;
        }

        if (max && parseFloat(value) > parseFloat(max)) {
            this.showError(field, `Value must not exceed ${max}`);
            return false;
        }

        return true;
    }

    validateName(field) {
        const value = field.value.trim();
        const nameRegex = /^[a-zA-Z\s'-]{2,50}$/;

        if (value && !nameRegex.test(value)) {
            this.showError(field, 'Please enter a valid name (2-50 characters, letters only)');
            return false;
        }

        return true;
    }

    validatePassword(field) {
        const value = field.value.trim();

        if (value && value.length < 8) {
            this.showError(field, 'Password must be at least 8 characters long');
            return false;
        }

        // Check for at least one number and one letter
        if (value && !/(?=.*[a-zA-Z])(?=.*\d)/.test(value)) {
            this.showError(field, 'Password must contain at least one letter and one number');
            return false;
        }

        // Check for password confirmation
        const confirmField = document.querySelector('input[name="confirm_password"], input[name="password_confirm"]');
        if (confirmField && confirmField.value && value !== confirmField.value) {
            this.showError(confirmField, 'Passwords do not match');
            return false;
        }

        return true;
    }

    showError(field, message) {
        // Add error class to field
        field.classList.add('border-red-500');
        field.classList.remove('border-gray-300', 'border-green-500');

        // Create or update error message
        let errorElement = field.parentElement.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('p');
            errorElement.className = 'error-message text-red-500 text-sm mt-1';
            field.parentElement.appendChild(errorElement);
        }

        errorElement.textContent = message;
    }

    clearError(field) {
        field.classList.remove('border-red-500');
        field.classList.add('border-gray-300');

        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    handleFormSubmit(form) {
        const formId = form.id;
        const formData = new FormData(form);

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';

        // In production, this would send data to the backend
        // For now, we'll simulate an API call
        setTimeout(() => {
            this.handleFormResponse(form, formData, submitButton, originalButtonText);
        }, 1500);
    }

    handleFormResponse(form, formData, submitButton, originalButtonText) {
        // Success handling
        if (form.id === 'contact-form') {
            this.showSuccessMessage(form, 'Thank you for your message! We will get back to you soon.');
            form.reset();
        } else if (form.id === 'login-form') {
            // Redirect to admin dashboard
            window.location.href = 'admin/dashboard.html';
        } else if (form.id === 'training-form') {
            this.showSuccessMessage(form, 'Training saved successfully!');
        } else {
            this.showSuccessMessage(form, 'Form submitted successfully!');
        }

        // Reset button
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }

    showSuccessMessage(form, message) {
        // Create success message element
        const successDiv = document.createElement('div');
        successDiv.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4';
        successDiv.innerHTML = `
            <strong class="font-bold">Success!</strong>
            <span class="block sm:inline"> ${message}</span>
        `;

        // Insert before form
        form.parentElement.insertBefore(successDiv, form);

        // Remove after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    showErrorMessage(form, message) {
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4';
        errorDiv.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline"> ${message}</span>
        `;

        // Insert before form
        form.parentElement.insertBefore(errorDiv, form);

        // Remove after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Utility function for custom validation rules
function addCustomValidation(fieldId, validationFunction, errorMessage) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.addEventListener('blur', function() {
        const validator = new FormValidator();
        
        if (!validationFunction(this.value)) {
            validator.showError(this, errorMessage);
        } else {
            validator.clearError(this);
        }
    });
}

// Initialize form validation when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    new FormValidator();

    // Custom validation examples
    
    // Price validation (must be positive number)
    addCustomValidation('price', 
        (value) => !value || (!isNaN(value) && parseFloat(value) >= 0),
        'Price must be a positive number'
    );

    // Duration validation
    addCustomValidation('duration',
        (value) => !value || /^\d+\s*(day|week|month|year)s?$/i.test(value),
        'Duration format: e.g., "3 months", "6 weeks"'
    );

    // Category validation (at least one must be selected for multi-select)
    const categoryCheckboxes = document.querySelectorAll('input[name="categories[]"]');
    if (categoryCheckboxes.length > 0) {
        categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const checked = document.querySelectorAll('input[name="categories[]"]:checked');
                const container = this.closest('.category-checkboxes');
                
                if (checked.length === 0) {
                    // Show error
                    if (container && !container.querySelector('.error-message')) {
                        const errorMsg = document.createElement('p');
                        errorMsg.className = 'error-message text-red-500 text-sm mt-2';
                        errorMsg.textContent = 'Please select at least one category';
                        container.appendChild(errorMsg);
                    }
                } else {
                    // Clear error
                    const errorMsg = container?.querySelector('.error-message');
                    if (errorMsg) errorMsg.remove();
                }
            });
        });
    }
});

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormValidator;
}