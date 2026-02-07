/**
 * Album Details Page Logic
 * Loads album data based on ID in URL parameters
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

    // Global lightbox functions (copied from gallery.js for consistency)
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

        if (!albumId) {
            document.getElementById('album-title').textContent = 'Album Not Found';
            document.getElementById('album-images-grid').innerHTML = '<div class="col-12 text-center text-danger">No album ID provided.</div>';
            return;
        }

        try {
            // Wait for content content to be ready if needed, or just call getContent
            // getContent is async and in js/content.js
            let content;
            if (window.EventProContent && window.EventProContent.getContent) {
                content = await window.EventProContent.getContent();
            } else {
                // Fallback attempt to read from local storage directly if global not ready
                const stored = localStorage.getItem('eventpro_site_content');
                if (stored) content = JSON.parse(stored);
            }

            if (!content || !content.gallery || !content.gallery.albums) {
                throw new Error('No gallery content found.');
            }

            const album = content.gallery.albums.find(a => a.id === albumId);

            if (!album) {
                document.getElementById('album-title').textContent = 'Album Not Found';
                document.getElementById('album-images-grid').innerHTML = '<div class="col-12 text-center text-danger">The requested album does not exist.</div>';
                return;
            }

            // Populate Hero
            document.getElementById('album-hero').style.backgroundImage = `url('${album.coverUrl}')`;
            document.getElementById('album-title').textContent = album.title || 'Untitled Album';
            document.getElementById('album-subtitle').textContent = album.subtitle || '';

            // Populate Description
            document.getElementById('album-desc-title').textContent = album.descriptionTitle || album.title;
            document.getElementById('album-desc-text').textContent = album.description || '';

            // Populate Gallery
            const grid = document.getElementById('album-images-grid');
            const images = album.images || [];

            if (images.length > 0) {
                grid.innerHTML = images.map((img, index) => `
                    <div class="col-sm-6 col-md-4 col-lg-3">
                        <div class="gallery-item ratio ratio-1x1 position-relative overflow-hidden rounded shadow-sm"
                             onclick="window.openLightbox('${img.url}', '${sanitize(img.title || album.title)}')">
                            <img src="${img.url}" class="w-100 h-100 object-fit-cover" 
                                 loading="${index < 8 ? 'eager' : 'lazy'}" 
                                 alt="${sanitize(img.title || 'Gallery Image')}">
                            <div class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-25 opacity-0 hover-opacity-100 transition-opacity">
                                <i class="bi bi-zoom-in text-white fs-2 text-shadow-sm"></i>
                            </div>
                        </div>
                    </div>
                `).join('');
            } else {
                grid.innerHTML = '<div class="col-12 text-center text-muted py-5">No images added to this album yet.</div>';
            }

        } catch (e) {
            console.error('Error loading album:', e);
            document.getElementById('album-title').textContent = 'Error Loading Album';
            document.getElementById('album-images-grid').innerHTML = `<div class="col-12 text-center text-danger">Failed to load album data: ${e.message}</div>`;
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
