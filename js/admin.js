/**
 * Admin Content & Gallery Management
 * Default password: admin123 (change in GALLERY_CONFIG below)
 */

const CONTENT_STORAGE_KEY = 'eventpro_site_content';

const DEFAULT_CONTENT = {
    hero: {
        slides: [
            {
                image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&fit=crop",
                tagline: "Kerala's #1 Exclusive Event Company",
                title: "Partner with Storied International for Your Dream Events",
                subtitle: "We make everything from corporate event planning and personal celebrations to customized event packages absolutely memorable!"
            }
        ],
        stats: {
            rating: "4.8/5",
            yearsExp: "15+",
            eventsCount: "5000+",
            clientsCount: "3000+"
        }
    },
    certification: { line1: "ISO 9001:2015 CERTIFIED", line2: "Professional Event Management Company" },
    about: {
        heading: "About Us",
        title: "Storied International",
        paragraph1: "Have you ever dreamed of planning the perfect event that will be remembered forever? Look no further than Storied International, the top-notch event management company that has everything you need to make your occasion an unforgettable experience.",
        paragraph2: "We make everything from corporate event planning and personal celebrations to even small customized event packages absolutely memorable! Contact us today to learn more about our services and how we can help you organize the top event management.",
        imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop",
        badgeText: "Trusted & Reliable"
    },
    testimonials: [
        { quote: "Excellent…everyone was surprised by seeing their performances….. definitely will invite for next function…….highly recommended!!!!!! It's the highlight of our marriage!!!!", name: "Ashok Kumar", date: "June 2023", initials: "AK", status: "approved", rating: 5 },
        { quote: "This is best event management company. Our wedding event was amazing with this company. We are very happy with this group.", name: "Ashik Ch", date: "May 2023", initials: "AC", status: "approved", rating: 5 },
        { quote: "In my point of view best event management and very good wedding planner. Excellent team management and coordination.", name: "Pindiyan Antony", date: "April 2023", initials: "PA", status: "approved", rating: 5 }
    ],
    contact: {
        address: "123 Event Street, City, State 12345",
        phone: "7356044637",
        phoneRaw: "7356044637",
        email: "Storiedeventplanners@gmail.com"
    },
    footer: {
        companyName: "Storied International",
        description: "Planning a full event has never been easier! Storied International offers a wide range of services to make your events stress-free and memorable.",
        copyright: "© 2024 Storied International. All Rights Reserved."
    },
    gallery: {
        albums: [
            {
                id: 'album-1',
                title: 'Wedding Events',
                coverUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop',
                images: [
                    { url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&fit=crop', title: 'Wedding Day 1' },
                    { url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&fit=crop', title: 'Wedding Day 2' }
                ]
            }
        ],
        recent: [
            { url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=400&fit=crop', title: 'Event 1' },
            { url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop', title: 'Event 2' }
        ]
    }
};

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

function migrateContent(c) {
    if (!c) return c;

    // Migrate Hero
    if (c.hero && !c.hero.slides && (c.hero.tagline || c.hero.title)) {
        const old = c.hero;
        c.hero = {
            slides: [{
                image: old.imageUrl || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&fit=crop",
                tagline: old.tagline || "",
                title: old.title || "",
                subtitle: old.subtitle || ""
            }],
            stats: {
                rating: old.rating || "4.8/5",
                yearsExp: old.yearsExp || "15+",
                eventsCount: old.eventsCount || "5000+",
                clientsCount: old.clientsCount || "3000+"
            }
        };
    }

    // Migrate Gallery
    if (c.gallery && Array.isArray(c.gallery)) {
        c.gallery = {
            albums: [],
            recent: c.gallery
        };
    }

    return c;
}

async function getSiteContent() {
    try {
        // Try Supabase first
        if (typeof supabaseClient !== 'undefined' && supabaseClient && SUPABASE_CONFIG.URL !== 'https://your-project-url.supabase.co') {
            const { data, error } = await supabaseClient
                .from('site_content')
                .select('content')
                .single();

            if (data && data.content) {
                const migrated = migrateContent(data.content);
                return deepMerge(DEFAULT_CONTENT, migrated);
            }
            if (error) console.warn('Supabase fetch error, falling back to localStorage:', error);
        }

        const stored = localStorage.getItem(CONTENT_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            const migrated = migrateContent(parsed);
            return deepMerge(DEFAULT_CONTENT, migrated);
        }
        return JSON.parse(JSON.stringify(DEFAULT_CONTENT));
    } catch (e) {
        console.error('Content load error:', e);
        return JSON.parse(JSON.stringify(DEFAULT_CONTENT));
    }
}

async function saveSiteContent(content) {
    try {
        // Save to localStorage (local backup)
        localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
    } catch (e) {
        console.warn('LocalStorage save failed (likely quota exceeded):', e);
    }

    // Save to Supabase (global)
    if (typeof supabaseClient !== 'undefined' && supabaseClient && SUPABASE_CONFIG.URL !== 'https://your-project-url.supabase.co') {
        const { error } = await supabaseClient
            .from('site_content')
            .upsert({ id: 1, content: content });

        if (error) {
            console.error('Supabase save error:', error);
            alert('Error saving to Cloud Database: ' + error.message + '\n\nData saved LOCALLY only.');
        } else {
            console.log('Successfully saved to Supabase');
        }
    } else {
        console.warn('Supabase not configured, saving locally only');
    }

    if (window.EventProContent?.renderContent) {
        await window.EventProContent.renderContent();
    }
}

async function checkSupabaseConnection() {
    const statusEl = document.getElementById('db-status');
    if (!statusEl) return;

    if (typeof supabaseClient === 'undefined' || !supabaseClient || SUPABASE_CONFIG.URL.includes('your-project-url')) {
        statusEl.innerHTML = '<span class="badge bg-danger">Database Not Configured</span>';
        return;
    }

    try {
        const { data, error } = await supabaseClient.from('site_content').select('id').limit(1);
        if (error) throw error;
        statusEl.innerHTML = '<span class="badge bg-success">Cloud Database Connected</span>';
    } catch (e) {
        console.error('Connection check failed:', e);
        statusEl.innerHTML = `<span class="badge bg-warning text-dark">DB Error: ${e.message}</span>`;
    }
}

const GALLERY_CONFIG = {
    STORAGE_KEY: 'eventpro_gallery_images',
    ADMIN_SESSION_KEY: 'eventpro_admin_session',
    ADMIN_PASSWORD: 'admin123', // Change this to your secure password
    DEFAULT_IMAGES: [
        { url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=400&fit=crop', title: 'Event 1' },
        { url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop', title: 'Event 2' },
        { url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop', title: 'Event 3' },
        { url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=400&fit=crop', title: 'Event 4' },
        { url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop', title: 'Event 5' },
        { url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop', title: 'Event 6' }
    ]
};

/**
 * Compress an image before uploading to stay within Supabase size limits
 */
function compressImage(base64Str, maxWidth = 1200, quality = 0.7) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height = (maxWidth / width) * height;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(base64Str); // Fallback to original
    });
}

// DOM Elements
let loginSection, adminSection, loginForm, logoutBtn;
let addImageForm, galleryList, imageCountBadge;
let sourceUrl, sourceUpload, urlInputGroup, uploadInputGroup, imageFile, imagePreview;
let aboutSourceUrl, aboutSourceUpload, aboutUrlGroup, aboutUploadGroup, aboutImageFile, aboutImagePreview, aboutBrowseBtn;

async function init() {
    loginSection = document.getElementById('loginSection');
    adminSection = document.getElementById('adminSection');
    loginForm = document.getElementById('loginForm');
    logoutBtn = document.getElementById('logoutBtn');
    addImageForm = document.getElementById('addImageForm');
    galleryList = document.getElementById('galleryList');
    imageCountBadge = document.getElementById('imageCount');
    sourceUrl = document.getElementById('sourceUrl');
    sourceUpload = document.getElementById('sourceUpload');
    urlInputGroup = document.getElementById('urlInputGroup');
    uploadInputGroup = document.getElementById('uploadInputGroup');
    imageFile = document.getElementById('imageFile');
    imagePreview = document.getElementById('imagePreview');

    // About section elements
    aboutSourceUrl = document.getElementById('aboutSourceUrl');
    aboutSourceUpload = document.getElementById('aboutSourceUpload');
    aboutUrlGroup = document.getElementById('aboutUrlGroup');
    aboutUploadGroup = document.getElementById('aboutUploadGroup');
    aboutImageFile = document.getElementById('aboutImageFile');
    aboutImagePreview = document.getElementById('aboutImagePreview');
    aboutBrowseBtn = document.getElementById('aboutBrowseBtn');

    // Always attach logout handler (needed when reloading while logged in)
    logoutBtn?.addEventListener('click', handleLogout);

    // Login form
    loginForm?.addEventListener('submit', handleLogin);

    // Check if already logged in
    if (sessionStorage.getItem(GALLERY_CONFIG.ADMIN_SESSION_KEY) === 'true') {
        await showAdminDashboard();
    }

    // Force sync button
    document.getElementById('forceSyncBtn')?.addEventListener('click', async () => {
        if (!confirm('This will overwrite your local changes with data from the Cloud. Continue?')) return;
        localStorage.removeItem(CONTENT_STORAGE_KEY);
        location.reload();
    });

    // Source type toggle
    sourceUrl?.addEventListener('change', () => {
        urlInputGroup.style.display = 'block';
        uploadInputGroup.style.display = 'none';
    });
    sourceUpload?.addEventListener('change', () => {
        urlInputGroup.style.display = 'none';
        uploadInputGroup.style.display = 'block';
        imageFile?.focus();
    });

    // Browse button
    document.getElementById('browseImageBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        imageFile?.click();
    });

    // File preview
    imageFile?.addEventListener('change', handleFilePreview);

    // Add image form
    addImageForm?.addEventListener('submit', handleAddImage);

    // Reset gallery
    document.getElementById('resetGalleryBtn')?.addEventListener('click', handleResetGallery);

    // About toggle
    aboutSourceUrl?.addEventListener('change', () => {
        if (aboutUrlGroup) aboutUrlGroup.style.display = 'block';
        if (aboutUploadGroup) aboutUploadGroup.style.display = 'none';
        document.getElementById('aboutImageUrl')?.focus();
    });
    aboutSourceUpload?.addEventListener('change', () => {
        if (aboutUrlGroup) aboutUrlGroup.style.display = 'none';
        if (aboutUploadGroup) aboutUploadGroup.style.display = 'block';
        aboutImageFile?.focus();
    });
    aboutBrowseBtn?.addEventListener('click', () => aboutImageFile?.click());
    // aboutImageFile listener is handled by setupImagePreview

    // Content forms
    await initContentForms();
}

function handleResetGallery() {
    if (!confirm('Reset gallery to default images? This will remove all your custom images.')) return;
    saveGalleryImages([...GALLERY_CONFIG.DEFAULT_IMAGES]);
    alert('Gallery reset to defaults!');
}

function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('adminPassword').value;
    const errorEl = document.getElementById('loginError');

    if (password === GALLERY_CONFIG.ADMIN_PASSWORD) {
        sessionStorage.setItem(GALLERY_CONFIG.ADMIN_SESSION_KEY, 'true');
        showAdminDashboard();
    } else {
        document.getElementById('adminPassword').classList.add('is-invalid');
        errorEl.textContent = 'Invalid password';
    }
}

function handleLogout() {
    sessionStorage.removeItem(GALLERY_CONFIG.ADMIN_SESSION_KEY);
    loginSection.style.display = 'block';
    adminSection.style.display = 'none';
    document.getElementById('adminPassword').value = '';
    document.getElementById('adminPassword').classList.remove('is-invalid');
}

async function showAdminDashboard() {
    loginSection.style.display = 'none';
    adminSection.style.display = 'block';
    await checkSupabaseConnection();
    await loadContentForms();
    await renderGalleryList();
    await renderTestimonialsList();

    // Warn if opened via file:// - localStorage won't sync with main page
    if (window.location.protocol === 'file:') {
        const warn = document.createElement('div');
        warn.className = 'alert alert-warning alert-dismissible fade show mx-3 mt-3';
        warn.innerHTML = `
            <strong><i class="bi bi-exclamation-triangle me-2"></i>Important:</strong> 
            You're viewing this page via file://. Changes will NOT appear on the main site. 
            <strong>Run start-server.bat</strong> and open <code>http://localhost:3000/admin.html</code> instead.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        const adminSec = document.getElementById('adminSection');
        adminSec.insertBefore(warn, adminSec.querySelector('.container'));
    }
}

async function loadContentForms() {
    const c = await getSiteContent();
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };

    // Hero Stats
    set('heroRating', c.hero.stats?.rating || '4.8/5');
    set('heroYears', c.hero.stats?.yearsExp || '15+');
    set('heroEvents', c.hero.stats?.eventsCount || '5000+');
    set('heroClients', c.hero.stats?.clientsCount || '3000+');

    set('certLine1', c.certification.line1);
    set('certLine2', c.certification.line2);
    set('aboutHeading', c.about.heading);
    set('aboutTitle', c.about.title);
    set('aboutP1', c.about.paragraph1);
    set('aboutP2', c.about.paragraph2);
    set('aboutImageUrl', c.about.imageUrl);
    set('aboutBadge', c.about.badgeText);
    set('contactAddress', c.contact.address);
    set('contactPhone', c.contact.phone);
    set('contactEmail', c.contact.email);
    set('footerName', c.footer.companyName);
    set('footerDesc', c.footer.description);
    set('footerCopyright', c.footer.copyright);

    await renderHeroSlidesList();
    await renderAlbumsList();
    await renderRecentHighlightsList();
}

async function renderRecentHighlightsList() {
    const c = await getSiteContent();
    const list = document.getElementById('recentHighlightsList');
    const badge = document.getElementById('recentImageCountBadge');
    if (!list) return;

    const recent = c.gallery.recent || [];
    if (badge) badge.textContent = `${recent.length} images`;

    list.innerHTML = recent.map((img, index) => `
        <div class="col-md-3">
            <div class="card">
                <img src="${img.url}" class="card-img-top" style="height: 80px; object-fit: cover;">
                <div class="card-body p-1">
                    <button type="button" class="btn btn-danger btn-sm w-100" onclick="removeRecentHighlight(${index})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('') || '<div class="col-12"><p class="text-muted text-center">No highlights yet.</p></div>';
}

window.removeRecentHighlight = async (index) => {
    if (!confirm('Remove this highlight?')) return;
    const c = await getSiteContent();
    c.gallery.recent.splice(index, 1);
    await saveSiteContent(c);
    await renderRecentHighlightsList();
};

async function renderHeroSlidesList() {
    const c = await getSiteContent();
    const list = document.getElementById('heroSlidesList');
    if (!list) return;

    const slides = c.hero.slides || [];
    list.innerHTML = slides.map((slide, index) => `
        <div class="card mb-2">
            <div class="card-body py-2 d-flex align-items-center">
                <img src="${slide.image}" style="width: 50px; height: 50px; object-fit: cover;" class="rounded me-3">
                <div class="flex-grow-1">
                    <h6 class="mb-0">${slide.title || 'Untitled Slide'}</h6>
                    <small class="text-muted">${slide.tagline || ''}</small>
                </div>
                <button type="button" class="btn btn-danger btn-sm" onclick="removeHeroSlide(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `).join('') || '<p class="text-muted">No slides yet.</p>';
}

window.removeHeroSlide = async (index) => {
    if (!confirm('Remove this slide?')) return;
    const c = await getSiteContent();
    c.hero.slides.splice(index, 1);
    await saveSiteContent(c);
    await renderHeroSlidesList();
};

async function renderAlbumsList() {
    const c = await getSiteContent();
    const list = document.getElementById('albumsList');
    if (!list) return;

    const albums = c.gallery.albums || [];
    list.innerHTML = albums.map((album, index) => `
        <div class="col-md-4">
            <div class="card h-100">
                <img src="${album.coverUrl}" class="card-img-top" style="height: 120px; object-fit: cover;">
                <div class="card-body p-2">
                    <h6 class="mb-1">${album.title}</h6>
                    <p class="small text-muted mb-2">${album.images?.length || 0} images</p>
                    <div class="btn-group w-100">
                        <button type="button" class="btn btn-primary btn-sm" onclick="openManageAlbum('${album.id}')">
                            <i class="bi bi-images me-1"></i>Manage
                        </button>
                        <button type="button" class="btn btn-danger btn-sm" onclick="removeAlbum(${index})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('') || '<div class="col-12"><p class="text-muted text-center">No albums created yet.</p></div>';
}

window.removeAlbum = async (index) => {
    if (!confirm('Remove this entire album and all its images?')) return;
    const c = await getSiteContent();
    c.gallery.albums.splice(index, 1);
    await saveSiteContent(c);
    await renderAlbumsList();
};

window.openManageAlbum = async (albumId) => {
    const c = await getSiteContent();
    const album = c.gallery.albums.find(a => a.id === albumId);
    if (!album) return;

    document.getElementById('currentAlbumId').value = albumId;
    document.getElementById('manageAlbumTitle').textContent = `Manage Album: ${album.title}`;
    await renderAlbumImagesList();

    const modal = new bootstrap.Modal(document.getElementById('manageAlbumModal'));
    modal.show();
};

async function renderAlbumImagesList() {
    const c = await getSiteContent();
    const albumId = document.getElementById('currentAlbumId').value;
    const album = c.gallery.albums.find(a => a.id === albumId);
    const list = document.getElementById('albumImagesList');
    if (!album || !list) return;

    list.innerHTML = (album.images || []).map((img, index) => `
        <div class="col-4">
            <div class="position-relative">
                <img src="${img.url}" class="img-fluid rounded" style="height: 80px; width: 100%; object-fit: cover;">
                <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0" onclick="removeImageFromAlbum(${index})">
                    <i class="bi bi-x"></i>
                </button>
            </div>
        </div>
    `).join('');
}

window.removeImageFromAlbum = async (index) => {
    const c = await getSiteContent();
    const albumId = document.getElementById('currentAlbumId').value;
    const album = c.gallery.albums.find(a => a.id === albumId);
    if (album) {
        album.images.splice(index, 1);
        await saveSiteContent(c);
        await renderAlbumImagesList();
        await renderAlbumsList();
    }
};

async function initContentForms() {
    document.getElementById('addHeroSlideForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const c = await getSiteContent();

        const imageUrl = await getFileData('slideFile', 'slideImage');
        if (!imageUrl) return alert('Please provide an image URL or upload a file.');

        c.hero.slides = c.hero.slides || [];
        c.hero.slides.push({
            image: imageUrl,
            tagline: document.getElementById('slideTagline').value,
            title: document.getElementById('slideTitle').value,
            subtitle: document.getElementById('slideSubtitle').value
        });
        await saveSiteContent(c);
        e.target.reset();
        document.getElementById('slidePreview').style.display = 'none';
        await renderHeroSlidesList();
        alert('Slide added!');
    });

    document.getElementById('heroStatsForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const c = await getSiteContent();
        c.hero.stats = {
            rating: document.getElementById('heroRating').value,
            yearsExp: document.getElementById('heroYears').value,
            eventsCount: document.getElementById('heroEvents').value,
            clientsCount: document.getElementById('heroClients').value
        };
        await saveSiteContent(c);
        alert('Stats saved!');
    });

    document.getElementById('createAlbumForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const c = await getSiteContent();

        const coverUrl = await getFileData('albumCoverFile', 'albumCoverUrl');
        if (!coverUrl) return alert('Please provide a cover image URL or upload a file.');

        c.gallery.albums = c.gallery.albums || [];
        c.gallery.albums.push({
            id: 'album-' + Date.now(),
            title: document.getElementById('albumTitle').value,
            coverUrl: coverUrl,
            images: []
        });
        await saveSiteContent(c);
        e.target.reset();
        document.getElementById('albumCoverPreview').style.display = 'none';
        await renderAlbumsList();
        alert('Album created!');
    });

    document.getElementById('addImageToAlbumForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const c = await getSiteContent();
        const albumId = document.getElementById('currentAlbumId').value;
        const album = c.gallery.albums.find(a => a.id === albumId);

        const imageUrl = await getFileData('newAlbumImageFile', 'newAlbumImageUrl');
        if (!imageUrl) return alert('Please provide an image URL or upload a file.');

        if (album) {
            album.images = album.images || [];
            album.images.push({
                url: imageUrl,
                title: album.title
            });
            await saveSiteContent(c);
            e.target.reset();
            document.getElementById('newAlbumImagePreview').style.display = 'none';
            await renderAlbumImagesList();
            await renderAlbumsList();
        }
    });

    document.getElementById('addRecentHighlightForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const btn = e.target.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Adding...';

            const c = await getSiteContent();
            const imageUrl = await getFileData('recentHighlightFile', 'recentImageUrl');

            if (!imageUrl) {
                alert('Please provide an image URL or choose a file.');
                btn.disabled = false;
                btn.innerHTML = 'Add Image';
                return;
            }

            c.gallery.recent = c.gallery.recent || [];
            c.gallery.recent.unshift({
                url: imageUrl,
                title: 'Highlight'
            });

            await saveSiteContent(c);
            e.target.reset();
            document.getElementById('recentHighlightPreview').style.display = 'none';
            await renderRecentHighlightsList();
            alert('Highlight added successfully!');

            // Clear file input manually
            document.getElementById('recentHighlightFile').value = '';
        } catch (err) {
            console.error('Error adding highlight:', err);
            alert('Failed to add highlight: ' + err.message);
        } finally {
            const btn = e.target.querySelector('button[type="submit"]');
            btn.disabled = false;
            btn.innerHTML = 'Add Image';
        }
    });

    document.getElementById('aboutForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const c = await getSiteContent();

        const imageUrl = await getFileData('aboutImageFile', 'aboutImageUrl');
        if (!imageUrl) return alert('Please provide an image URL or upload a file.');

        c.about = {
            ...c.about,
            heading: document.getElementById('aboutHeading').value,
            title: document.getElementById('aboutTitle').value,
            paragraph1: document.getElementById('aboutP1').value,
            paragraph2: document.getElementById('aboutP2').value,
            imageUrl: imageUrl,
            badgeText: document.getElementById('aboutBadge').value
        };
        await saveSiteContent(c);
        alert('About section saved!');

        // Clear preview and file input
        const preview = document.getElementById('aboutImagePreview');
        if (preview) {
            preview.style.display = 'none';
            const fileInput = document.getElementById('aboutImageFile');
            if (fileInput) fileInput.value = '';
        }
    });

    // Testimonial and other forms...
    // Note: I'm keeping the original logic for other forms but they need to be re-attached
    // because I might have replaced their parent HTML or added new ones.

    document.getElementById('addTestimonialForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const c = await getSiteContent();
        const name = document.getElementById('testimonialName').value;
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        c.testimonials = c.testimonials || [];
        c.testimonials.unshift({
            quote: document.getElementById('testimonialQuote').value,
            name,
            date: document.getElementById('testimonialDate').value || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            initials,
            status: 'approved',
            rating: 5
        });
        await saveSiteContent(c);
        document.getElementById('addTestimonialForm').reset();
        await renderTestimonialsList();
        alert('Testimonial added!');
    });

    document.getElementById('adminContactForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const c = await getSiteContent();
        const phone = document.getElementById('contactPhone').value;
        c.contact = {
            ...c.contact,
            address: document.getElementById('contactAddress').value,
            phone,
            phoneRaw: phone.replace(/\D/g, ''),
            email: document.getElementById('contactEmail').value
        };
        await saveSiteContent(c);
        alert('Contact info saved!');
    });

    document.getElementById('footerForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const c = await getSiteContent();
        c.footer = {
            ...c.footer,
            companyName: document.getElementById('footerName').value,
            description: document.getElementById('footerDesc').value,
            copyright: document.getElementById('footerCopyright').value
        };
        await saveSiteContent(c);
        alert('Footer saved!');
    });

    // Setup all previews
    setupImagePreview('aboutImageFile', 'aboutImagePreview');
    setupImagePreview('slideFile', 'slidePreview');
    setupImagePreview('albumCoverFile', 'albumCoverPreview');
    setupImagePreview('newAlbumImageFile', 'newAlbumImagePreview');
    setupImagePreview('recentHighlightFile', 'recentHighlightPreview');
}

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

async function renderTestimonialsList() {
    const siteContent = await getSiteContent();
    const testimonials = siteContent.testimonials || [];
    const pending = testimonials.filter(t => t.status === 'pending');
    const approved = testimonials.filter(t => t.status !== 'pending');

    const pendingList = document.getElementById('pendingTestimonialsList');
    const pendingCount = document.getElementById('pendingCount');
    if (pendingCount) pendingCount.textContent = pending.length;
    if (pendingList) {
        pendingList.innerHTML = pending.map((t, i) => {
            const idx = testimonials.indexOf(t);
            const quotePreview = (t.quote || '').substring(0, 150) + ((t.quote || '').length > 150 ? '...' : '');
            return `<div class="card mb-2 border-warning">
                <div class="card-body py-3">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <strong>${escapeHtml(t.name)}</strong>
                        <span class="badge bg-warning text-dark">Pending</span>
                    </div>
                    <p class="small mb-2">"${escapeHtml(quotePreview)}"</p>
                    <small class="text-muted d-block mb-2">${escapeHtml(t.email || '')} • ${escapeHtml(t.date || 'Submitted')}</small>
                    <div class="btn-group btn-group-sm">
                        <button type="button" class="btn btn-success" onclick="approveTestimonial(${idx})">Approve</button>
                        <button type="button" class="btn btn-outline-danger" onclick="rejectTestimonial(${idx})">Reject</button>
                    </div>
                </div>
            </div>`;
        }).join('') || '<p class="text-muted mb-0">No pending reviews.</p>';
    }

    const list = document.getElementById('testimonialsList');
    if (list) {
        list.innerHTML = approved.map((t, i) => {
            const idx = testimonials.indexOf(t);
            const quotePreview = (t.quote || '').substring(0, 60) + ((t.quote || '').length > 60 ? '...' : '');
            return `<div class="card mb-2">
                <div class="card-body py-2 d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${escapeHtml(t.name)}</strong> - ${escapeHtml(t.date)}<br>
                        <small class="text-muted text-truncate d-block" style="max-width:400px">"${escapeHtml(quotePreview)}"</small>
                    </div>
                    <button type="button" class="btn btn-danger btn-sm" onclick="removeTestimonial(${idx})"><i class="bi bi-trash"></i></button>
                </div>
            </div>`;
        }).join('') || '<p class="text-muted mb-0">No published testimonials yet.</p>';
    }
}

window.approveTestimonial = async (index) => {
    const c = await getSiteContent();
    if (c.testimonials && c.testimonials[index]) {
        c.testimonials[index].status = 'approved';
        await saveSiteContent(c);
        await renderTestimonialsList();
    }
};

window.rejectTestimonial = async (index) => {
    if (!confirm('Reject and delete this review?')) return;
    const c = await getSiteContent();
    c.testimonials.splice(index, 1);
    await saveSiteContent(c);
    await renderTestimonialsList();
};

window.removeTestimonial = async (index) => {
    if (!confirm('Remove this memorial?')) return;
    const c = await getSiteContent();
    c.testimonials.splice(index, 1);
    await saveSiteContent(c);
    await renderTestimonialsList();
};

function handleFilePreview() {
    const file = imageFile?.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (imagePreview) imagePreview.innerHTML = `<img src="${e.target.result}" class="img-fluid rounded" style="max-height: 140px; object-fit: contain;">`;
        };
        reader.readAsDataURL(file);
    }
}

/**
 * Helper to get image data from either a URL input or a File input
 * Returns the URL (as string) or Base64 (after compression)
 */
async function getFileData(fileInputId, urlInputId) {
    const fileInput = document.getElementById(fileInputId);
    const urlInput = document.getElementById(urlInputId);

    // Prioritize file upload if provided
    if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const reader = new Promise((resolve, reject) => {
            const r = new FileReader();
            r.onload = (e) => resolve(e.target.result);
            r.onerror = (e) => reject(e);
            r.readAsDataURL(file);
        });
        const base64 = await reader;
        return await compressImage(base64);
    }

    // Fallback to URL input
    return urlInput ? urlInput.value.trim() : null;
}

/**
 * Setup real-time preview for image file inputs
 */
function setupImagePreview(fileInputId, previewContainerId) {
    const fileInput = document.getElementById(fileInputId);
    const previewContainer = document.getElementById(previewContainerId);
    if (!fileInput || !previewContainer) return;

    fileInput.addEventListener('change', async function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewContainer.innerHTML = `<img src="${e.target.result}" class="img-fluid rounded shadow-sm" style="max-height: 120px; border: 2px solid #ddd;">`;
                previewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            previewContainer.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', init);
