document.addEventListener('DOMContentLoaded', () => {

    // Check if we are on the page with hotspots
    const container = document.querySelector('.hotspot-container');
    if (!container) return;

    // Elements
    // Note: We used .hotspot-point-wrapper in HTML, not just .hotspot-point
    const pointWrappers = document.querySelectorAll('.hotspot-point-wrapper');
    const cards = document.querySelectorAll('.hotspot-card');
    const lines = document.querySelectorAll('.hotspot-line'); // SVG lines
    const triggers = document.querySelectorAll('.scroll-trigger');

    let activeIndex = -1;

    // --- Core Activation Logic ---
    function activateFeature(index) {
        if (index === activeIndex) return;
        activeIndex = index;

        // 1. Deactivate All
        pointWrappers.forEach(el => el.classList.remove('active'));
        cards.forEach(el => el.classList.remove('active'));
        lines.forEach(el => el.classList.remove('active'));

        // 2. Activate Target (if valid)
        if (index >= 0) {
            // Robust selection by data-index
            const activePoint = document.querySelector(`.hotspot-point-wrapper[data-index="${index}"]`);
            const activeCard = document.querySelector(`.hotspot-card[data-index="${index}"]`);

            // For SVG lines, we assume they are in DOM order matching index (0, 1, 2...)
            // Ideally add data-index to lines too, but NodeList index works if structure is stable.
            const activeLine = lines[index];

            if (activePoint) activePoint.classList.add('active');
            if (activeCard) activeCard.classList.add('active');
            if (activeLine) activeLine.classList.add('active');
        }
    }

    // --- Interaction Handling ---

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (!isMobile) {
        // DESKTOP: Hover Interaction

        // Add listeners to dots
        pointWrappers.forEach(wrapper => {
            wrapper.addEventListener('mouseenter', (e) => {
                // Get index from wrapper
                const idx = parseInt(e.currentTarget.getAttribute('data-index'));
                activateFeature(idx);
            });
        });

        // Optional: Reset when leaving the entire container area?
        // Prompt says "Only one feature is active at a time; others fade out."
        // Often users like states to persist until they hover another, OR reset.
        // Let's reset for cleanliness if they leave the image area entirely.
        container.addEventListener('mouseleave', () => {
            activateFeature(-1);
        });

    } else {
        // MOBILE: Scroll Interaction (Scrollytelling)

        const observerOptions = {
            root: null, // viewport
            rootMargin: '-40% 0px -40% 0px', // Active in middle 20% of screen
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const idx = parseInt(entry.target.getAttribute('data-index'));
                    activateFeature(idx);
                }
            });
        }, observerOptions);

        triggers.forEach(trigger => observer.observe(trigger));
    }

});
