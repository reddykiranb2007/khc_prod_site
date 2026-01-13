// brochure-modal.js
(function () {
  // 1. Inject CSS Styles for Modal
  const style = document.createElement('style');
  style.innerHTML = `
    .brochure-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      z-index: 9999;
      display: none;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(5px);
    }
    
    .brochure-modal-content {
      background: #ffffff;
      padding: 2rem;
      border-radius: 12px;
      width: 90%;
      max-width: 420px;
      position: relative;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      animation: modalPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes modalPop {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    .brochure-form-header {
      margin-bottom: 1.5rem;
    }
    
    .brochure-form-group {
      margin-bottom: 1rem;
    }

    .brochure-form-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.25rem;
    }

    .brochure-form-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .brochure-form-input:focus {
      border-color: #008ED6;
      box-shadow: 0 0 0 3px rgba(0, 142, 214, 0.1);
    }

    .brochure-btn-submit {
      width: 100%;
      padding: 0.875rem;
      background: #008ED6;
      color: white;
      font-weight: 600;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.2s, transform 0.1s;
      margin-top: 0.5rem;
    }

    .brochure-btn-submit:hover {
      background: #0B3C68;
    }
    
    .brochure-btn-submit:active {
      transform: scale(0.98);
    }

    .brochure-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      cursor: pointer;
      color: #9ca3af;
      padding: 4px;
      border-radius: 4px;
      transition: background 0.2s, color 0.2s;
    }

    .brochure-close:hover {
      color: #111827;
      background: #f3f4f6;
    }
  `;
  document.head.appendChild(style);

  // 2. Inject HTML Structure
  const modalHTML = `
    <div id="brochureModal" class="brochure-modal-overlay">
      <div class="brochure-modal-content">
        <button id="closeModalBtn" class="brochure-close" title="Close">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        
        <div class="brochure-form-header">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #0B3C68; margin: 0;">Please Fill Details</h2>
          <p style="color: #6b7280; font-size: 0.9rem; margin-top: 0.25rem;">To continue your brochure download</p>
        </div>

        <form id="brochureForm">
          <div class="brochure-form-group">
            <label class="brochure-form-label">Name</label>
            <input type="text" id="bmName" class="brochure-form-input" required placeholder="Enter your full name">
          </div>
          <div class="brochure-form-group">
            <label class="brochure-form-label">Company</label>
            <input type="text" id="bmCompany" class="brochure-form-input" required placeholder="Hospital / Organization">
          </div>
          <div class="brochure-form-group">
            <label class="brochure-form-label">Email ID</label>
            <input type="email" id="bmEmail" class="brochure-form-input" required placeholder="name@example.com">
          </div>
          <div class="brochure-form-group">
            <label class="brochure-form-label">Mobile Number</label>
            <input type="tel" id="bmMobile" class="brochure-form-input" required placeholder="+91 98765 43210" pattern="[0-9+\\s-]{10,20}">
          </div>
          <button type="submit" class="brochure-btn-submit">Continue to Download</button>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // 3. Logic & Event Listeners
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxoW8fkdZYxKYMPjTtfpvG7C_8AE7jI0NcT5rAOAWecTE-TglNd3YJ6bVhzGn5FNRQ7HQ/exec';
  let targetUrl = '';
  const modal = document.getElementById('brochureModal');
  const form = document.getElementById('brochureForm');
  const closeBtn = document.getElementById('closeModalBtn');
  const inputs = form.querySelectorAll('input');
  const submitBtn = form.querySelector('button[type="submit"]');

  // Define global function
  window.openBrochureModal = function (url) {
    targetUrl = url;

    // Check if previously submitted
    // Check if previously submitted (DISABLED FOR TESTING to ensure form always appears)
    /* 
    if (localStorage.getItem('khc_brochure_submitted') === 'true') {
      const link = document.createElement('a');
      link.href = targetUrl;
      link.setAttribute('download', '');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    */

    modal.style.display = 'flex';
    // Focus first input
    setTimeout(() => document.getElementById('bmName').focus(), 100);
  };

  const closeModal = () => {
    modal.style.display = 'none';
    form.reset();
  };

  closeBtn.onclick = closeModal;

  // Close on outside click
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeModal();
    }
  });

  // Mobile validation
  const mobileInput = document.getElementById('bmMobile');
  mobileInput.addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9]/g, '');
  });

  form.onsubmit = (e) => {
    e.preventDefault();

    // Check validity
    let isValid = true;
    inputs.forEach(input => {
      if (!input.value.trim()) isValid = false;
    });

    // Strict Mobile Validation
    if (mobileInput.value.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      isValid = false;
      mobileInput.focus();
    }

    if (isValid) {
      // Show loading state
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'Processing...';
      submitBtn.disabled = true;

      // Prepare data
      const formData = new FormData();
      formData.append('timestamp', new Date());
      formData.append('name', document.getElementById('bmName').value);
      formData.append('company', document.getElementById('bmCompany').value);
      formData.append('email', document.getElementById('bmEmail').value);
      formData.append('mobile', document.getElementById('bmMobile').value);
      formData.append('source', 'Brochure Popup');

      fetch(SCRIPT_URL, { parent: 200, method: 'POST', body: formData })
        .then(response => {
          // Mark as submitted locally
          localStorage.setItem('khc_brochure_submitted', 'true');

          // Simulate download regardless of backend response to not block user
          const link = document.createElement('a');
          link.href = targetUrl;
          link.setAttribute('download', '');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          alert("Thank you! Your brochure is downloading.");
          closeModal();
        })
        .catch(error => {
          console.error('Error!', error.message);
          // Fallback download even on error
          const link = document.createElement('a');
          link.href = targetUrl;
          link.setAttribute('download', '');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          closeModal();
        })
        .finally(() => {
          submitBtn.innerText = originalText;
          submitBtn.disabled = false;
        });
    }
  };
})();
