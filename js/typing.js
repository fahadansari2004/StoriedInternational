/**
 * Typing Effect for Hero Title
 * Simulates typing and deleting text
 */

document.addEventListener('DOMContentLoaded', () => {
    // Expose init function to window so content.js can call it
    window.initTypingEffect = function () {
        const titleElement = document.getElementById('hero-title');
        if (!titleElement) return;

        // Clean up any existing intervals/timeouts if we were tracking them (optional optimization)

        const phrases = ["Your Dream Events", "Unforgettable Memories", "Perfect Celebrations", "Corporate Excellence"];
        let phraseIndex = 0;
        let charIndex = phrases[0].length;
        let isDeleting = true;

        // Use current text as base
        // content.js will have already set the full title.
        const currentText = titleElement.innerText;
        titleElement.innerHTML = currentText + ' <span id="dynamic-text"></span><span class="typing-cursor"></span>';
        const dynamicElement = document.getElementById('dynamic-text');

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

    // Attempt to init on load, mainly for non-dynamic initial load or fallback
    window.initTypingEffect();
});
