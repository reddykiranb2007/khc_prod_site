document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    // Safety check if elements exist
    if (!menuToggle || !mobileMenu) return;

    const spans = menuToggle.querySelectorAll('span');

    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');

        // Hamburger animation
        if (mobileMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            document.body.style.overflow = 'hidden';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Close menu when clicking a link
    const links = mobileMenu.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
            document.body.style.overflow = 'auto';
        });
    });
});

// Global function for Mobile Submenu Accordion
window.toggleMobileSubmenu = function(button) {
    const content = button.nextElementSibling;
    if (!content) return;
    
    // Toggle hidden/flex classes
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        content.classList.add('flex');
    } else {
        content.classList.add('hidden');
        content.classList.remove('flex');
    }
};
