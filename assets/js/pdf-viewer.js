// pdf-viewer.js
(function () {
  // 1. Inject CSS Styles for PDF Viewer Modal
  const style = document.createElement('style');
  style.innerHTML = `
    .pdf-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.75);
      z-index: 9000; /* Lower than brochure modal form (9999) */
      display: none;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(4px);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .pdf-modal-overlay.open {
      opacity: 1;
    }
    
    .pdf-modal-container {
      background: #f9fafb; /* Neutral background */
      width: 100%;
      height: 100%;
      max-width: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }

    @media (min-width: 1024px) {
      .pdf-modal-container {
        width: 90%;
        max-width: 1000px; /* A4-ish proportions / max width */
        height: 90vh;
        border-radius: 8px; /* Subtle rounded corners */
        overflow: hidden;
      }
    }

    .pdf-modal-header {
      background: #ffffff;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #e5e7eb; /* Thin bottom divider */
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }

    .pdf-modal-title {
      font-weight: 600;
      color: #111827;
      font-size: 1rem;
    }

    .pdf-modal-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .pdf-icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: #4b5563;
      padding: 0.5rem;
      border-radius: 0.375rem;
      transition: background 0.2s, color 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pdf-icon-btn:hover {
      background: #f3f4f6;
      color: #111827;
    }

    .pdf-modal-body {
      flex: 1;
      overflow: hidden;
      background: #525659; /* Standard PDF viewer bg color */
      position: relative;
    }

    .pdf-iframe {
      width: 100%;
      height: 100%;
      border: none;
      display: block;
    }
  `;
  document.head.appendChild(style);

  // 2. Inject HTML Structure
  const modalHTML = `
    <div id="pdfViewerModal" class="pdf-modal-overlay">
      <div class="pdf-modal-container">
        
        <div class="pdf-modal-header">
          <span class="pdf-modal-title">Brochure Viewer</span>
          <div class="pdf-modal-actions">
            <button id="pdfDownloadTrigger" class="pdf-icon-btn" title="Download Brochure">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
            </button>
            <button id="pdfCloseBtn" class="pdf-icon-btn" title="Close Viewer">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="pdf-modal-body">
          <iframe id="pdfIframe" class="pdf-iframe" src=""></iframe>
        </div>

      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // 3. Logic & Event Listeners
  const modal = document.getElementById('pdfViewerModal');
  const iframe = document.getElementById('pdfIframe');
  const closeBtn = document.getElementById('pdfCloseBtn');
  const downloadBtn = document.getElementById('pdfDownloadTrigger');
  let currentPdfUrl = '';

  // Open Viewer Function
  window.openPdfViewer = function (url) {
    if (!url) return;
    currentPdfUrl = url;

    // Mobile Handling: Iframe PDF viewing often forces download on mobile, bypassing lead gen.
    // We enforce the form first on mobile devices.
    if (window.innerWidth < 768) {
      if (typeof window.openBrochureModal === 'function') {
        window.openBrochureModal(url);
      } else {
        const link = document.createElement('a');
        link.href = url;
        link.click();
      }
      return;
    }

    // Set iframe src with parameters to hide native toolbar
    iframe.src = url + '#toolbar=0&navpanes=0&scrollbar=0';

    // Show modal
    modal.style.display = 'flex';
    // Small delay for fade in
    setTimeout(() => {
      modal.classList.add('open');
    }, 10);

    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
  };

  const closeViewer = () => {
    modal.classList.remove('open');
    setTimeout(() => {
      modal.style.display = 'none';
      iframe.src = ''; // Clear source to stop processing
      document.body.style.overflow = ''; // Restore scrolling
    }, 300);
  };

  closeBtn.onclick = closeViewer;

  // Close on outside click (if clicking the overlay part)
  modal.onclick = (e) => {
    if (e.target === modal) closeViewer();
  };

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeViewer();
    }
  });

  // Handle Download Trigger
  downloadBtn.onclick = () => {
    // If openBrochureModal exists (from brochure-modal.js), use it
    if (typeof window.openBrochureModal === 'function') {
      // Trigger the existing lead generation form
      window.openBrochureModal(currentPdfUrl);
    } else {
      // Fallback if script missing
      const link = document.createElement('a');
      link.href = currentPdfUrl;
      link.download = '';
      link.click();
    }
  };

})();
