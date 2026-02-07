/**
 * Album Details Page Logic
 * Loads album data based on ID in URL parameters
 * Optimized with Skeleton Loading and Animations
 */

(function () {
    'use strict';

    function getAlbumIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    function sanitize(str) {
        if (typeof str !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Global lightbox functions
    window.openLightbox = function (url, caption = '') {
        const lightbox = document.getElementById('customLightbox');
        const img = document.getElementById('lightboxImg');
        const captionEl = document.getElementById('lightboxCaption');

        if (lightbox && img) {
            img.src = url;
            if (captionEl) captionEl.textContent = caption || '';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeLightbox = function () {
        const lightbox = document.getElementById('customLightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    async function loadAlbumDetails() {
        const albumId = getAlbumIdFromUrl();
        const heroSection = document.getElementById('album-hero');
        const titleEl = document.getElementById('album-title');
        const subtitleEl = document.getElementById('album-subtitle');
        const grid = document.getElementById('album-images-grid');

        if (!albumId) {
            titleEl.textContent = 'Album Not Found';
            titleEl.classList.remove('skeleton', 'skeleton-text');
            grid.innerHTML = '<div class="col-12 text-center text-danger">No album ID provided.</div>';
            return;
        }

        try {
            // Wait for content content to be ready
            let content;
            // Short delay to show off the skeleton (optional, for UX feel of 'fetching')
            // await new Promise(r => setTimeout(r, 500)); 

            if (window.EventProContent && window.EventProContent.getContent) {
                content = await window.EventProContent.getContent();
            } else {
                const stored = localStorage.getItem('eventpro_site_content');
                if (stored) content = JSON.parse(stored);
            }

            if (!content || !content.gallery || !content.gallery.albums) {
                throw new Error('No gallery content found.');
            }

            const album = content.gallery.albums.find(a => a.id === albumId);

            if (!album) {
                titleEl.textContent = 'Album Not Found';
                titleEl.classList.remove('skeleton', 'skeleton-text');
                subtitleEl.classList.remove('skeleton', 'skeleton-text');
                heroSection.classList.remove('skeleton');
                grid.innerHTML = '<div class="col-12 text-center text-danger">The requested album does not exist.</div>';
                return;
            }

            // --- Populate Data & Remove Skeletons ---

            // Hero
            // Using a high-res image loader callback to remove skeleton only when image is ready
            const bgImg = new Image();
            bgImg.src = album.coverUrl;
            bgImg.onload = () => {
                heroSection.style.backgroundImage = `url('${album.coverUrl}')`;
                heroSection.classList.remove('skeleton');
                heroSection.classList.add('reveal-scale', 'active'); // Animate in
            };

            titleEl.textContent = album.title || 'Untitled Album';
            titleEl.classList.remove('skeleton-text');
            titleEl.classList.add('reveal-left', 'active');
            titleEl.style.minWidth = '0'; // reset skeleton styles
            titleEl.style.minHeight = '0';

            subtitleEl.textContent = album.subtitle || '';
            subtitleEl.classList.remove('skeleton-text');
            subtitleEl.classList.add('reveal-right', 'active');
            subtitleEl.style.minWidth = '0';
            subtitleEl.style.minHeight = '0';

            // Description
            const descTitle = document.getElementById('album-desc-title');
            const descText = document.getElementById('album-desc-text');
            descTitle.textContent = album.descriptionTitle || album.title;
            descText.textContent = album.description || '';

            // Re-trigger reveal animations for description if they are in viewport
            if (window.EventProContent?.setupScrollReveal) {
                window.EventProContent.setupScrollReveal();
            }

            // Gallery Grid
            const images = album.images || [];

            if (images.length > 0) {
                // Clear skeletons
                grid.innerHTML = '';

                // Add images with staggered animation class
                grid.innerHTML = images.map((img, index) => `
                    <div class="col-sm-6 col-md-4 col-lg-3">
                        <div class="gallery-item ratio ratio-1x1 position-relative overflow-hidden rounded shadow-sm"
                             onclick="window.openLightbox('${img.url}', '')">
                            <img src="${img.url}" class="w-100 h-100 object-fit-cover" 
                                 loading="${index < 8 ? 'eager' : 'lazy'}" 
                                 alt="${sanitize(img.title || 'Gallery Image')}">
                            <div class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-25 opacity-0 hover-opacity-100 transition-opacity">
                                <i class="bi bi-zoom-in text-white fs-2 text-shadow-sm"></i>
                            </div>
                        </div>
                    </div>
                `).join('');

                // Add stagger class to grid container
                grid.classList.add('stagger-fade-in');

            } else {
                grid.innerHTML = '<div class="col-12 text-center text-muted py-5">No images added to this album yet.</div>';
            }

        } catch (e) {
            console.error('Error loading album:', e);
            titleEl.textContent = 'Error Loading Album';
            grid.innerHTML = `<div class="col-12 text-center text-danger">Failed to load album data: ${e.message}</div>`;
        }
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
        loadAlbumDetails();

        // Setup escape key to close lightbox
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') window.closeLightbox();
        });
    });

})();
