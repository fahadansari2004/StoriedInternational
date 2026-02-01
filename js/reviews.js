/**
 * Client Review Submission
 * Submits reviews to localStorage - admin approves before they appear on site
 */

(function() {
    'use strict';

    const CONTENT_STORAGE_KEY = 'eventpro_site_content';

    function getContent() {
        try {
            const stored = localStorage.getItem(CONTENT_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return parsed && typeof parsed === 'object' ? parsed : {};
            }
        } catch (e) {}
        return {};
    }

    function saveContent(content) {
        localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
        if (window.EventProContent?.renderContent) {
            EventProContent.renderContent();
        }
    }

    function init() {
        const form = document.getElementById('clientReviewForm');
        const successMsg = document.getElementById('reviewSuccessMsg');

        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('reviewName').value.trim();
            const email = document.getElementById('reviewEmail').value.trim();
            const rating = parseInt(document.getElementById('reviewRating').value, 10);
            const reviewText = document.getElementById('reviewText').value.trim();

            if (!name || !reviewText) {
                alert('Please fill in your name and review.');
                return;
            }

            // Basic validation
            if (reviewText.length < 20) {
                alert('Please write a more detailed review (at least 20 characters).');
                return;
            }

            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
            const date = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

            const newReview = {
                quote: reviewText,
                name,
                email,
                date,
                initials,
                rating,
                status: 'pending',
                submittedAt: Date.now()
            };

            const content = getContent();
            content.testimonials = content.testimonials || [];
            content.testimonials.unshift(newReview);
            saveContent(content);

            form.reset();
            if (successMsg) {
                successMsg.style.display = 'block';
                successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
