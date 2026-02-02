/**
 * Dynamic Gallery Loader
 * Loads gallery images from localStorage (admin-added) or uses defaults
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'eventpro_gallery_images';
    const DEFAULT_IMAGES = [
        { url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=400&fit=crop', title: 'Event 1' },
        { url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop', title: 'Event 2' },
        { url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop', title: 'Event 3' },
        { url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=400&fit=crop', title: 'Event 4' },
        { url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop', title: 'Event 5' },
        { url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop', title: 'Event 6' }
    ];

    async function getGalleryImages() {
        try {
            // Use the same global content engine if available
            if (window.EventProContent?.getContent) {
                const c = await window.EventProContent.getContent();
                if (Array.isArray(c.gallery) && c.gallery.length > 0) return c.gallery;
            }

            // Fallback for standalone loading
            if (typeof supabaseClient !== 'undefined' && supabaseClient) {
                const { data } = await supabaseClient.from('site_content').select('content').single();
                if (data?.content?.gallery) return data.content.gallery;
            }

            const stored = localStorage.getItem('eventpro_site_content');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.gallery) return parsed.gallery;
            }
        } catch (e) {
            console.error('Error loading gallery:', e);
        }
        return DEFAULT_IMAGES;
    }

    function sanitize(str) {
        if (typeof str !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    async function renderGallery() {
        const container = document.getElementById('gallery-container');
        if (!container) return;

        const images = await getGalleryImages();
        container.innerHTML = images.map((img, index) => `
            <div class="col-md-4">
                <div class="gallery-item position-relative overflow-hidden rounded shadow-sm">
                    <img src="${img.url}" alt="${sanitize(img.title || 'Event ' + (index + 1))}" class="img-fluid w-100" loading="lazy"
                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22400%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22600%22 height=%22400%22/%3E%3Ctext fill=%22%23999%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2224%22%3EImage unavailable%3C/text%3E%3C/svg%3E'">
                    <div class="gallery-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                        <i class="bi bi-zoom-in text-white fs-1"></i>
                    </div>
        `).join('');
    }

    // Expose for reactive updates
    window.renderGallery = renderGallery;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderGallery);
    } else {
        renderGallery();
    }
})();
