document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.stat-number');
    const duration = 2000; // 2 seconds

    const runCounter = (counter) => {
        const target = +counter.getAttribute('data-count');
        const startTime = performance.now();

        const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuad = (t) => t * (2 - t);

            const current = Math.floor(easeOutQuad(progress) * target);
            counter.innerText = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target.toLocaleString();
            }
        };

        requestAnimationFrame(updateCount);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const sectionCounters = entry.target.querySelectorAll('.stat-number');
            if (entry.isIntersecting) {
                sectionCounters.forEach(counter => {
                    if (counter.innerText === '0') runCounter(counter);
                });
            } else {
                sectionCounters.forEach(counter => counter.innerText = '0');
            }
        });
    }, { threshold: 0.4 });

    const statsSection = document.getElementById('statistics-section');
    if (statsSection) {
        observer.observe(statsSection);
    }
});
