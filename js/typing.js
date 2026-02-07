/**
 * Typing Effect for Hero Title
 * Simulates typing and deleting text
 */

document.addEventListener('DOMContentLoaded', () => {
    const titleElement = document.getElementById('hero-title');
    if (!titleElement) return;

    const originalText = titleElement.innerText;
    const phrases = ["Your Dream Events", "Unforgettable Memories", "Perfect Celebrations", "Corporate Excellence"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;

    // Use a span for the changing part if possible, but here we replace the whole text or part of it?
    // The original text is "Partner with Storied International for Your Dream Events"
    // Let's type only the end part: "Your Dream Events"

    // We need to restructure the HTML slightly to make this work well, 
    // or just type the whole second line if it was broken.
    // Let's assume we want to cycle the last part.

    // Split text to find the static part and dynamic part
    const staticPart = "Partner with Storied International for ";

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            titleElement.innerHTML = staticPart + currentPhrase.substring(0, charIndex - 1) + '<span class="typing-cursor"></span>';
            charIndex--;
        } else {
            titleElement.innerHTML = staticPart + currentPhrase.substring(0, charIndex + 1) + '<span class="typing-cursor"></span>';
            charIndex++;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isWaiting = true;
            isDeleting = true;
            setTimeout(type, 2000); // Wait before deleting
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(type, 500); // Wait before typing next
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }

    // Start typing loop
    // type(); 
    // Actually, messing with the H1 innerHTML might break SEO or layout shift.
    // Let's just add a class for the cursor and maybe simple fade for now if typing is too risky without DOM restructuring.
    // But the user asked for "high animations". Typing is high end.
    // Let's do it safely by targetting a span if we can inject it.

    titleElement.innerHTML = staticPart + '<span id="dynamic-text">Your Dream Events</span><span class="typing-cursor"></span>';
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

    // Initialize
    charIndex = phrases[0].length;
    isDeleting = true; // Start by deleting the default text after a delay
    setTimeout(typeSafe, 2000);

});
