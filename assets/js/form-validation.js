
// form-validation.js
// Handles real-time validation and submission for Kyron Healthcare contact forms

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxoW8fkdZYxKYMPjTtfpvG7C_8AE7jI0NcT5rAOAWecTE-TglNd3YJ6bVhzGn5FNRQ7HQ/exec';

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    // --- Validation Logic ---
    const inputs = contactForm.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        // Real-time validation on blur
        input.addEventListener('blur', () => validateField(input));

        // Remove error on input
        input.addEventListener('input', () => {
            clearError(input);
            if (input.tagName === 'TEXTAREA') updateCounter(input);
        });
    });

    // Mobile number restriction (digits only)
    const mobileInput = contactForm.querySelector('input[name="mobile"]');
    if (mobileInput) {
        mobileInput.addEventListener('input', function () {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length > 10) this.value = this.value.slice(0, 10);
            clearError(this);
        });
    }

    // --- Form Submission ---
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all fields
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) isValid = false;
        });

        if (!isValid) return;

        // Show Loading State
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = btn.innerHTML;

        btn.disabled = true;
        btn.innerHTML = `<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> Sending...`;

        try {
            const formData = new FormData(contactForm);
            formData.append('timestamp', new Date().toString());

            // Handle checkboxes for 'intent'
            const intents = [];
            contactForm.querySelectorAll('input[name="intent"]:checked').forEach(cb => {
                intents.push(cb.value);
            });
            formData.set('intent', intents.join(', '));

            await fetch(SCRIPT_URL, {
                method: 'POST',
                body: formData
            });

            // Show Success Message
            contactForm.style.display = 'none';

            const successMsg = document.createElement('div');
            successMsg.className = 'text-center py-12';
            successMsg.innerHTML = `
                <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                    <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                <p class="text-gray-500 max-w-sm mx-auto">Your message has been sent successfully. Our team will get back to you within 24 hours.</p>
                <button onclick="location.reload()" class="mt-8 text-[#008ED6] hover:text-[#0B3C68] font-medium">Send another message</button>
            `;
            contactForm.parentNode.insertBefore(successMsg, contactForm);

            // Clean up old success messages if any
            const oldSuccess = document.querySelector('.success-alert');
            if (oldSuccess) oldSuccess.remove();

        } catch (error) {
            console.error('Submission Error:', error);
            const errorAlert = document.createElement('div');
            errorAlert.className = 'bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r error-alert';
            errorAlert.innerHTML = `<div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                    </svg>
                </div>
                <div class="ml-3">
                    <p class="text-sm text-red-700">Unable to send message. Please check your connection and try again.</p>
                </div>
            </div>`;

            const existingError = contactForm.parentNode.querySelector('.error-alert');
            if (existingError) existingError.remove();

            contactForm.parentNode.insertBefore(errorAlert, contactForm);

            // Reset Button
            btn.innerHTML = originalBtnText;
            btn.disabled = false;
        }
    });

    // Helper Functions
    function validateField(input) {
        if (!input.required && !input.value) return true;

        let error = null;
        const val = input.value.trim();

        if (input.required && !val) {
            error = 'This field is required';
        } else if (input.type === 'email' && !validateEmail(val)) {
            error = 'Please enter a valid email address';
        } else if (input.name === 'mobile' && val.length < 10) {
            error = 'Please enter a valid 10-digit number';
        }

        if (error) {
            showError(input, error);
            return false;
        } else {
            clearError(input);
            return true;
        }
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(input, message) {
        clearError(input);
        const parent = input.parentElement; // Assuming structure <div><label><input></div>
        input.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-200');
        input.classList.remove('border-gray-300'); // Remove default if present

        const msg = document.createElement('p');
        msg.className = 'text-red-500 text-xs mt-1 error-msg flex items-center gap-1';
        msg.innerHTML = `<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> ${message}`;

        // Insert after input
        input.insertAdjacentElement('afterend', msg);
    }

    function clearError(input) {
        input.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-200');
        input.classList.add('border-gray-300'); // Add default

        const next = input.nextElementSibling;
        if (next && next.classList.contains('error-msg')) {
            next.remove();
        }
    }

    function updateCounter(textarea) {
        // Optional: Implement if counter element exists
    }
});
