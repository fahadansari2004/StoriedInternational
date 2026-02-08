/**
 * 3D Tilt Effect for Cards
 * Adds a subtle localized parallax tilt to elements
 */

document.addEventListener('DOMContentLoaded', () => {
    // Target cards AND buttons for premium feel
    const cards = document.querySelectorAll('.service-card, .album-card, .gallery-item, .contact-info-card, .btn-lg, .btn-premium');

    cards.forEach(card => {
        card.addEventListener('mousemove', handleHover);
        card.addEventListener('mouseleave', resetCard);
    });

    function handleHover(e) {
        const card = this;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate rotation (max 10 degrees)
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5; // Invert Y for tilt
        const rotateY = ((x - centerX) / centerX) * 5;

        // Apply Transform
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        card.style.zIndex = '10';

        // Add specific transition behavior only when leaving to snap back smoothly
        // During hover, we want instant feedback so no transition lag
        card.style.transition = 'transform 0.1s ease-out';
    }

    function resetCard() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        this.style.zIndex = '1';
        this.style.transition = 'transform 0.5s ease';
    }
});
