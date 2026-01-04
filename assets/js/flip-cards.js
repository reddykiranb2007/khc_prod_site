// Auto-flip cards on mobile when they come into view
document.addEventListener('DOMContentLoaded', function () {
    // Only run on mobile devices (tablets and phones)
    const isMobile = window.innerWidth < 768;

    if (!isMobile) {
        console.log('Flip cards: Desktop mode - using hover');
        return;
    }

    console.log('Flip cards: Mobile mode - auto-flip enabled');

    // Get all flip cards
    const flipCards = document.querySelectorAll('.flip-card');

    if (flipCards.length === 0) {
        console.warn('Flip cards: No flip cards found on page');
        return;
    }

    console.log(`Flip cards: Found ${flipCards.length} cards`);

    // Create intersection observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // Trigger when 30% of card is visible (easier to trigger)
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add flipped class when card comes into view
                entry.target.classList.add('is-flipped');
                console.log('Flip cards: Card flipped', entry.target);
            } else {
                // Remove flipped class when card leaves view
                entry.target.classList.remove('is-flipped');
                console.log('Flip cards: Card unflipped', entry.target);
            }
        });
    }, observerOptions);

    // Observe all flip cards
    flipCards.forEach(card => {
        observer.observe(card);
    });

    console.log('Flip cards: Observer initialized successfully');
});
