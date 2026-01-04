// Auto-flip cards on mobile when they come into view
(function () {
    // Only run on mobile devices
    const isMobile = window.innerWidth < 768;

    if (!isMobile) return;

    // Get all flip cards
    const flipCards = document.querySelectorAll('.flip-card');

    // Create intersection observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of card is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add flipped class when card comes into view
                entry.target.classList.add('is-flipped');
            } else {
                // Remove flipped class when card leaves view
                entry.target.classList.remove('is-flipped');
            }
        });
    }, observerOptions);

    // Observe all flip cards
    flipCards.forEach(card => {
        observer.observe(card);
    });
})();
