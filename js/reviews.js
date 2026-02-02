/**
 * Client Review Submission
 * Submits reviews to localStorage - admin approves before they appear on site
 */

(function () {
    'use strict';

    const CONTENT_STORAGE_KEY = 'eventpro_site_content';

    function deepMerge(target, source) {
        const result = { ...target };
        if (!source) return result;
        Object.keys(source).forEach(key => {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = deepMerge(target[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        });
        return result;
    }

    async function getSiteContent() {
        try {
            if (typeof supabaseClient !== 'undefined' && supabaseClient) {
                const { data, error } = await supabaseClient.from('site_content').select('content').single();
                if (data && data.content) return data.content;
            }
            const stored = localStorage.getItem(CONTENT_STORAGE_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch (e) { return {}; }
    }

    async function saveSiteContent(content) {
        localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
        if (typeof supabaseClient !== 'undefined' && supabaseClient) {
            await supabaseClient.from('site_content').upsert({ id: 1, content: content });
        }
        if (window.EventProContent?.renderContent) {
            EventProContent.renderContent();
        }
    }

    async function init() {
        const form = document.getElementById('clientReviewForm');
        const successMsg = document.getElementById('reviewSuccessMsg');

        if (!form) return;

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const name = document.getElementById('reviewName').value.trim();
            const email = document.getElementById('reviewEmail').value.trim();
            const rating = parseInt(document.getElementById('reviewRating').value, 10);
            const reviewText = document.getElementById('reviewText').value.trim();

            if (!name || !reviewText) {
                alert('Please fill in your name and review.');
                return;
            }

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

            const content = await getSiteContent();
            content.testimonials = content.testimonials || [];
            content.testimonials.unshift(newReview);
            await saveSiteContent(content);

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
