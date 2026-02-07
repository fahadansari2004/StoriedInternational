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
        const albumsContainer = document.getElementById('gallery-container');
        const recentContainer = document.getElementById('recent-gallery-container');

        const content = await window.EventProContent.getContent();

        // Render Albums
        if (albumsContainer) {
            const albums = content.gallery?.albums || [];
            albumsContainer.innerHTML = albums.map((album, index) => `
                <div class="col-md-4 col-lg-3">
                    <div class="gallery-item position-relative overflow-hidden rounded shadow-sm mb-4" onclick="openAlbum('${album.id}')">
                        <img src="${album.coverUrl}" alt="${sanitize(album.title)}" class="img-fluid w-100" loading="lazy">
                        <div class="gallery-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center text-white p-3 text-center">
                            <h5 class="mb-1">${sanitize(album.title)}</h5>
                            <p class="small mb-0">${album.images?.length || 0} Photos</p>
                            <i class="bi bi-zoom-in fs-2 mt-2"></i>
                        </div>
                    </div>
                </div>
            `).join('') || '<div class="col-12 text-center text-muted"><p>No gallery albums found.</p></div>';
        }

        // Render Recent Highlights (Flat Gallery)
        if (recentContainer) {
            const recent = content.gallery?.recent || [];
            recentContainer.innerHTML = recent.map((img, index) => `
                <div class="col-md-4 col-sm-6 col-highlight">
                    <div class="gallery-item-alt position-relative overflow-hidden rounded shadow-sm mb-4" onclick="window.openLightbox('${img.url}', '${sanitize(img.title || 'Event Highlight')}')" style="cursor: pointer;">
                        <img src="${img.url}" alt="${sanitize(img.title || 'Event Highlight')}" class="img-fluid w-100" loading="lazy" style="height: 250px; object-fit: cover;">
                        <div class="gallery-overlay-alt position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center text-white">
                            <div class="overlay-content text-center p-3">
                                <i class="bi bi-zoom-in fs-2 mb-2"></i>
                                <h6 class="mb-0 fw-bold">${sanitize(img.title || 'Event Highlight')}</h6>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('') || '<div class="col-12 text-center text-muted"><p>No recent highlights found.</p></div>';
        }
    }

    async function openAlbum(albumId) {
        const content = await window.EventProContent.getContent();
        const album = content.gallery.albums.find(a => a.id === albumId);
        if (!album) return;

        const row = document.getElementById('album-images-row');
        const title = document.getElementById('albumModalLabel');
        if (title) title.textContent = album.title;

        if (row) {
            row.innerHTML = (album.images || []).map(img => `
                <div class="col-6 col-md-4 col-lg-3 mb-3">
                    <div class="album-img-wrapper rounded overflow-hidden shadow-sm h-100" style="height: 200px;">
                        <img src="${img.url}" class="img-fluid w-100 h-100" style="object-fit: cover; cursor: pointer;" onclick="window.openLightbox('${img.url}', '${sanitize(img.title || album.title)}')">
                    </div>
                </div>
            `).join('') || '<div class="col-12 text-center py-5">No images in this album yet.</div>';
        }

        const modal = new bootstrap.Modal(document.getElementById('albumModal'));
        modal.show();
    }

    // Global Lightbox Functions
    window.openLightbox = function (url, caption = '') {
        const lightbox = document.getElementById('customLightbox');
        const img = document.getElementById('lightboxImg');
        const captionEl = document.getElementById('lightboxCaption');

        if (lightbox && img) {
            img.src = url;
            if (captionEl) captionEl.textContent = caption;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        }
    };

    window.closeLightbox = function () {
        const lightbox = document.getElementById('customLightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Restore scroll
        }
    };

    // Toggle gallery view for mobile
    window.toggleGalleryView = function () {
        const container = document.getElementById('recent-gallery-container');
        const btn = document.getElementById('viewMoreGalleryBtn');

        if (container && btn) {
            const isExpanded = container.classList.contains('show-all');

            if (isExpanded) {
                // Collapse: Show Less
                container.classList.remove('show-all');
                btn.textContent = 'View More Images';

                // Scroll to gallery section smoothly
                setTimeout(() => {
                    const gallerySection = document.getElementById('gallery');
                    if (gallerySection) {
                        gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            } else {
                // Expand: Show All
                container.classList.add('show-all');
                btn.textContent = 'Show Less';
            }
        }
    };

    // Expose for click handlers
    window.openAlbum = openAlbum;
    window.renderGallery = renderGallery;

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
        renderGallery();

        // Setup escape key to close lightbox
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') window.closeLightbox();
        });
    });
})();
