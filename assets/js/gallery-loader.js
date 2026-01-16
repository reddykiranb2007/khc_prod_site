// gallery-loader.js

document.addEventListener('DOMContentLoaded', () => {
    // Strategy: Try to fetch dynamic data from PHP (Server-side)
    // If that fails (e.g. local file system or no PHP), fallback to static JS file

    fetch('assets/get_gallery_images.php')
        .then(response => {
            if (!response.ok) throw new Error('PHP script not found or error');
            return response.json();
        })
        .then(data => {
            console.log('Gallery loaded via PHP Auto-Discovery');
            initGallery(data);
        })
        .catch(err => {
            console.warn('PHP Auto-Discovery failed (likely local env), falling back to static data.', err);
            loadStaticFallback();
        });

    function loadStaticFallback() {
        const script = document.createElement('script');
        script.src = 'assets/js/gallery-data.js?v=' + new Date().getTime();
        script.onload = () => {
            if (window.galleryData) {
                initGallery(window.galleryData);
            } else {
                console.warn('Gallery Data loaded but window.galleryData is undefined.');
            }
        };
        script.onerror = () => {
            console.error('Failed to load gallery-data.js');
        };
        document.body.appendChild(script);
    }

    function initGallery(data) {
        const { logos, conference, hospital } = data;

        // Base Paths
        const logoPath = 'assets/logo/';
        const confPath = 'assets/conference/';
        const hospPath = 'assets/hospital/';

        /* --- 1. RENDER LOGOS --- */
        const logoContainer = document.getElementById('logos-grid');
        if (logoContainer && logos && logos.length > 0) {
            // Clear existing content just in case
            logoContainer.innerHTML = '';
            logos.forEach(file => {
                const card = createGalleryCard(logoPath + file, 'Client Logo', true);
                logoContainer.appendChild(card);
            });
        }

        /* --- 2. RENDER CONFERENCE IMAGES --- */
        const confContainer = document.getElementById('conference-grid');
        if (confContainer && conference && conference.length > 0) {
            confContainer.innerHTML = '';
            conference.forEach(file => {
                const card = createGalleryCard(confPath + file, 'Conference Highlight');
                confContainer.appendChild(card);
            });
        }

        /* --- 3. RENDER HOSPITAL IMAGES --- */
        const hospContainer = document.getElementById('hospital-grid');
        if (hospContainer && hospital && hospital.length > 0) {
            hospContainer.innerHTML = '';
            hospital.forEach(file => {
                const card = createGalleryCard(hospPath + file, 'Hospital Installation');
                hospContainer.appendChild(card);
            });
        }

        /* --- HELPER: Create Gallery Card --- */
        function createGalleryCard(src, alt, isLogo = false) {
            const div = document.createElement('div');

            // Style adjustments for logos vs standard photos
            // Logos: White background, contained image with padding
            // Photos: Gray background, cover image
            const bgClass = isLogo ? 'bg-white' : 'bg-gray-200';

            div.className = `group relative overflow-hidden rounded-xl shadow-lg aspect-video ${bgClass} cursor-pointer`;

            const img = document.createElement('img');
            img.src = src;
            img.alt = alt;

            // Logos use object-contain to prevent cropping, others use object-cover
            const fitClass = isLogo ? 'object-contain p-4' : 'object-cover';
            img.className = `w-full h-full ${fitClass} transition-transform duration-500 group-hover:scale-110 gallery-img`;

            img.loading = 'lazy'; // Performance

            // Hide card if image fails to load
            img.onerror = () => {
                div.style.display = 'none';
                console.warn(`Image failed to load: ${src}`);
            };

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

    /* --- CSS for Lightbox --- */
    // Ensure the 'open' class is handled or add styles if not present in CSS
    // Assuming CSS handles .open class on #lightbox for visibility (e.g. display:flex or opacity:1)
});
