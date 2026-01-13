// gallery-loader.js

document.addEventListener('DOMContentLoaded', () => {
    if (!window.galleryData) {
        console.warn('Gallery Data not loaded.');
        return;
    }

    const { logos, conference, hospital } = window.galleryData;

    // Base Paths
    const logoPath = 'assets/img/';
    const confPath = 'assets/conference/';
    const hospPath = 'assets/hospital/';

    /* --- 1. RENDER LOGOS --- */
    const logoContainer = document.getElementById('logos-grid');
    if (logoContainer && logos && logos.length > 0) {
        logos.forEach(file => {
            const div = document.createElement('div');
            div.className = 'flex items-center justify-center p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-32';

            const img = document.createElement('img');
            img.src = logoPath + file;
            img.alt = 'Client Logo';
            img.className = 'max-h-20 max-w-full object-contain client-logo';

            div.appendChild(img);
            logoContainer.appendChild(div);
        });
    }

    /* --- 2. RENDER CONFERENCE IMAGES --- */
    const confContainer = document.getElementById('conference-grid');
    if (confContainer && conference && conference.length > 0) {
        conference.forEach(file => {
            const card = createGalleryCard(confPath + file, 'Conference Highlight');
            confContainer.appendChild(card);
        });
    }

    /* --- 3. RENDER HOSPITAL IMAGES --- */
    const hospContainer = document.getElementById('hospital-grid');
    if (hospContainer && hospital && hospital.length > 0) {
        hospital.forEach(file => {
            const card = createGalleryCard(hospPath + file, 'Hospital Installation');
            hospContainer.appendChild(card);
        });
    }

    /* --- HELPER: Create Gallery Card --- */
    function createGalleryCard(src, alt) {
        const div = document.createElement('div');
        div.className = 'group relative overflow-hidden rounded-xl shadow-lg aspect-video bg-gray-200 cursor-pointer';

        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.className = 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 gallery-img';
        img.loading = 'lazy'; // Performance

        // Overlay Icon
        const overlay = document.createElement('div');
        overlay.className = 'absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center';
        overlay.innerHTML = `<svg class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m4-3H6"></path></svg>`;

        div.appendChild(img);
        div.appendChild(overlay);

        // Lightbox Trigger
        div.addEventListener('click', () => openLightbox(src));

        return div;
    }

    /* --- LIGHTBOX LOGIC --- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        setTimeout(() => {
            lightboxImg.src = '';
        }, 300);
        document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    // Close on background click
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('open')) {
            closeLightbox();
        }
    });
});
