/**
 * Typing Effect for Hero Title
 * Simulates typing and deleting text
 */

// Global timer to prevent race conditions
let typingTimer = null;

document.addEventListener('DOMContentLoaded', () => {
    // Expose init function to window so content.js can call it
    window.initTypingEffect = function () {
        const dynamicElement = document.getElementById('dynamic-text');

        if (!dynamicElement) return;

        // CRITICAL: Stop any existing loop before starting a new one
        if (typingTimer) {
            clearTimeout(typingTimer);
            typingTimer = null;
        }

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

        // Safety cleanup if re-initialized
        dynamicElement.textContent = "";

        function typeSafe() {
            const currentPhrase = phrases[phraseIndex];

            // Logic to determine text to show
            if (isDeleting) {
                charIndex--;
            } else {
                charIndex++;
            }

            // Clamp
            if (charIndex < 0) charIndex = 0;
            if (charIndex > currentPhrase.length) charIndex = currentPhrase.length;

            dynamicElement.textContent = currentPhrase.substring(0, charIndex);

            let typeSpeed = 100;

            if (!isDeleting && charIndex === currentPhrase.length) {
                // Finished typing phrase -> Wait before deleting
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                // Finished deleting phrase -> Move to next
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500;
            } else if (isDeleting) {
                typeSpeed = 50;
            }

            // Save the timer ID so we can clear it next time init is called
            typingTimer = setTimeout(typeSafe, typeSpeed);
        }

        typeSafe();
    };

    // Attempt to init on load
    window.initTypingEffect();
});
