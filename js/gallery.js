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
        const featuredContainer = document.getElementById('featured-album-container');
        const recentContainer = document.getElementById('recent-gallery-container');

        const content = await window.EventProContent.getContent();

        // Render Featured Album (First album or most recent)
        if (featuredContainer) {
            const albums = content.gallery?.albums || [];
            const featuredAlbum = albums[0]; // Get first album as featured

            if (featuredAlbum) {
                featuredContainer.innerHTML = `
                    <div class="featured-album-cover" onclick="openAlbum('${featuredAlbum.id}')">
                        <img src="${featuredAlbum.coverUrl}" alt="${sanitize(featuredAlbum.title)}" loading="lazy">
                        <div class="featured-album-overlay">
                            <h2 class="featured-album-title">${sanitize(featuredAlbum.title)}</h2>
                            <p class="featured-album-subtitle">${sanitize(featuredAlbum.subtitle || 'A Beautiful Event Collection')}</p>
                            <div class="featured-album-cta">
                                <span>View Album</span>
                                <i class="bi bi-arrow-right"></i>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                featuredContainer.innerHTML = '<div class="text-center py-5"><p class="text-muted">No albums available yet.</p></div>';
            }
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

    // Open Album in Modal (Fixed)
    async function openAlbum(albumId) {
        try {
            const content = await window.EventProContent.getContent();
            const album = content.gallery?.albums?.find(a => a.id === albumId);

            if (!album) {
                console.error('Album not found:', albumId);
                return;
            }

            // Populate Hero
            const coverImg = document.getElementById('albumCoverImage');
            if (coverImg) coverImg.src = album.coverUrl || '';

            const titleEl = document.getElementById('albumModalLabel');
            if (titleEl) titleEl.textContent = album.title || 'Untitled Album';

            const subtitleEl = document.getElementById('albumSubtitle');
            if (subtitleEl) subtitleEl.textContent = album.subtitle || '';

            // Populate Description
            const descTitleEl = document.getElementById('albumDescriptionTitle');
            if (descTitleEl) descTitleEl.textContent = album.descriptionTitle || album.title || 'Event Details';

            const descTextEl = document.getElementById('albumDescriptionText');
            if (descTextEl) descTextEl.textContent = album.description || 'No description available for this event.';

            // Populate Gallery
            const galleryRow = document.getElementById('albumImagesRow');
            if (galleryRow) {
                const images = album.images || [];
                if (images.length > 0) {
                    galleryRow.innerHTML = images.map(img => `
                        <div class="col-sm-6 col-md-4 col-lg-3">
                            <div class="ratio ratio-1x1 position-relative overflow-hidden rounded shadow-sm gallery-item-hover" 
                                 onclick="window.openLightbox('${img.url}', '${sanitize(img.title || album.title)}')"
                                 style="cursor: pointer;">
                                <img src="${img.url}" class="w-100 h-100 object-fit-cover" loading="lazy" alt="Gallery Image">
                                <div class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-25 opacity-0 hover-opacity-100 transition-opacity">
                                    <i class="bi bi-zoom-in text-white fs-2"></i>
                                </div>
                            </div>
                        </div>
                    `).join('');
                } else {
                    galleryRow.innerHTML = '<div class="col-12 text-center text-muted py-5">No images added to this album yet.</div>';
                }
            }

            // Show Modal
            const modalEl = document.getElementById('albumModal');
            if (modalEl) {
                const modal = new bootstrap.Modal(modalEl);
                modal.show();
            }
        } catch (e) {
            console.error('Error opening album:', e);
        }
    }

    // Global Lightbox Functions
    window.openLightbox = function (url, caption = '') {
        const lightbox = document.getElementById('customLightbox');
        const img = document.getElementById('lightboxImg');
        const captionEl = document.getElementById('lightboxCaption');

        if (lightbox && img) {
            img.src = url;
            if (captionEl) captionEl.textContent = caption || '';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    };

    window.closeLightbox = function () {
        const lightbox = document.getElementById('customLightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
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
