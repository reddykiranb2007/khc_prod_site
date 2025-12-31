// scroll-top.js
(function () {
    // 1. Inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
    .scroll-top-btn {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 3.5rem;
      height: 3.5rem;
      background: #008ED6;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 142, 214, 0.4);
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 49; /* Below modal (9999) but above content */
      border: none;
    }

    .scroll-top-btn.visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .scroll-top-btn:hover {
      background: #0B3C68;
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 142, 214, 0.5);
    }

    /* Adjust position if "Back to Products" button exists (only on product pages) */
    .back-to-products + .scroll-top-btn {
      bottom: 6rem; /* Stack above the back button */
    }
  `;
    document.head.appendChild(style);

    // 2. Inject HTML
    const btn = document.createElement('button');
    btn.className = 'scroll-top-btn';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 15l-6-6-6 6"/>
    </svg>
  `;
    document.body.appendChild(btn);

    // 3. Logic
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    window.addEventListener('scroll', toggleVisibility);
    btn.addEventListener('click', scrollToTop);
})();
