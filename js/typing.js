/**
 * Typing Effect for Hero Title
 * Simulates typing and deleting text
 */

document.addEventListener('DOMContentLoaded', () => {
    // Expose init function to window so content.js can call it
    window.initTypingEffect = function () {
        const titleElement = document.getElementById('hero-title');
        const dynamicElement = document.getElementById('dynamic-text');

        if (!titleElement || !dynamicElement) return;

        // Premium Phrases meant to follow "Partner with Storied International for "
        const phrases = [
            "Your Dream Events",
            "Unforgettable Memories",
            "Perfect Celebrations",
            "Corporate Excellence"
        ];

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        // This time, we do NOT overwrite innerHTML of titleElement.
        // We solely manipulate dynamicElement.textContent

        // Safety cleanup if re-initialized
        dynamicElement.textContent = "";

        // Re-declare internal run function to close over new vars
        function typeSafe() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                dynamicElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                dynamicElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = 100;

            if (!isDeleting && charIndex === currentPhrase.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500;
            } else if (isDeleting) {
                typeSpeed = 50;
            }

            setTimeout(typeSafe, typeSpeed);
        }

        typeSafe();
    };

    // Attempt to init on load
    window.initTypingEffect();
});
