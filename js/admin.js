/**
 * Admin Content & Gallery Management
 * Default password: admin123 (change in GALLERY_CONFIG below)
 */

const CONTENT_STORAGE_KEY = 'eventpro_site_content';

const DEFAULT_CONTENT = {
    hero: {
        tagline: "Kerala's #1 Exclusive Event Company",
        title: "Partner with Storied International for Your Dream Events",
        subtitle: "We make everything from corporate event planning and personal celebrations to customized event packages absolutely memorable!",
        rating: "4.8/5",
        yearsExp: "15+",
        yearsLabel: "Years of Experience",
        eventsCount: "5000+",
        eventsLabel: "Events Covered",
        clientsCount: "3000+",
        clientsLabel: "Satisfied Clients"
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
        phone: "+91 73560 44637",
        phoneRaw: "+917356044637",
        email: "Storiedeventplanners@gmail.com"
    },
    footer: {
        companyName: "Storied International",
        description: "Planning a full event has never been easier! Storied International offers a wide range of services to make your events stress-free and memorable.",
        copyright: "© 2024 Storied International. All Rights Reserved."
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

function getSiteContent() {
    try {
        const stored = localStorage.getItem(CONTENT_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return deepMerge(DEFAULT_CONTENT, parsed);
        }
        return JSON.parse(JSON.stringify(DEFAULT_CONTENT));
    } catch (e) {
        return JSON.parse(JSON.stringify(DEFAULT_CONTENT));
    }
}

function saveSiteContent(content) {
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
    if (window.EventProContent?.renderContent) EventProContent.renderContent();
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

// DOM Elements
let loginSection, adminSection, loginForm, logoutBtn;
let addImageForm, galleryList, imageCountBadge;
let sourceUrl, sourceUpload, urlInputGroup, uploadInputGroup, imageFile, imagePreview;

function init() {
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

    // Always attach logout handler (needed when reloading while logged in)
    logoutBtn?.addEventListener('click', handleLogout);

    // Login form
    loginForm?.addEventListener('submit', handleLogin);

    // Check if already logged in (must attach handlers first - logout won't work after reload otherwise)
    if (sessionStorage.getItem(GALLERY_CONFIG.ADMIN_SESSION_KEY) === 'true') {
        showAdminDashboard();
        return;
    }

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

    // Browse button - triggers file input (fixes file manager not opening)
    document.getElementById('browseImageBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (imageFile) {
            imageFile.click();
        }
    });

    // File preview
    imageFile?.addEventListener('change', handleFilePreview);

    // Add image form
    addImageForm?.addEventListener('submit', handleAddImage);

    // Reset gallery
    document.getElementById('resetGalleryBtn')?.addEventListener('click', handleResetGallery);

    // Content forms
    initContentForms();
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

function showAdminDashboard() {
    loginSection.style.display = 'none';
    adminSection.style.display = 'block';
    loadContentForms();
    renderGalleryList();
    renderTestimonialsList();

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

function loadContentForms() {
    const c = getSiteContent();
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    set('heroTagline', c.hero.tagline);
    set('heroTitle', c.hero.title);
    set('heroSubtitle', c.hero.subtitle);
    set('heroRating', c.hero.rating);
    set('heroYears', c.hero.yearsExp);
    set('heroEvents', c.hero.eventsCount);
    set('heroClients', c.hero.clientsCount);
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
}

function initContentForms() {
    const content = getSiteContent();

    document.getElementById('heroForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const c = getSiteContent();
        c.hero = {
            ...c.hero,
            tagline: document.getElementById('heroTagline').value,
            title: document.getElementById('heroTitle').value,
            subtitle: document.getElementById('heroSubtitle').value,
            rating: document.getElementById('heroRating').value,
            yearsExp: document.getElementById('heroYears').value,
            eventsCount: document.getElementById('heroEvents').value,
            clientsCount: document.getElementById('heroClients').value
        };
        saveSiteContent(c);
        alert('Hero section saved!');
    });

    document.getElementById('certForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const c = getSiteContent();
        c.certification = {
            ...c.certification,
            line1: document.getElementById('certLine1').value,
            line2: document.getElementById('certLine2').value
        };
        saveSiteContent(c);
        alert('Certification saved!');
    });

    document.getElementById('aboutForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const c = getSiteContent();
        c.about = {
            ...c.about,
            heading: document.getElementById('aboutHeading').value,
            title: document.getElementById('aboutTitle').value,
            paragraph1: document.getElementById('aboutP1').value,
            paragraph2: document.getElementById('aboutP2').value,
            imageUrl: document.getElementById('aboutImageUrl').value,
            badgeText: document.getElementById('aboutBadge').value
        };
        saveSiteContent(c);
        alert('About section saved!');
    });

    document.getElementById('addTestimonialForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const c = getSiteContent();
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
        saveSiteContent(c);
        document.getElementById('addTestimonialForm').reset();
        renderTestimonialsList();
        alert('Testimonial added and published!');
    });

    document.getElementById('adminContactForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const c = getSiteContent();
        const phone = document.getElementById('contactPhone').value;
        c.contact = {
            ...c.contact,
            address: document.getElementById('contactAddress').value,
            phone,
            phoneRaw: phone.replace(/\D/g, ''),
            email: document.getElementById('contactEmail').value
        };
        saveSiteContent(c);
        alert('Contact info saved!');
    });

    document.getElementById('footerForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const c = getSiteContent();
        c.footer = {
            ...c.footer,
            companyName: document.getElementById('footerName').value,
            description: document.getElementById('footerDesc').value,
            copyright: document.getElementById('footerCopyright').value
        };
        saveSiteContent(c);
        alert('Footer saved!');
    });
}

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function renderTestimonialsList() {
    const testimonials = getSiteContent().testimonials || [];
    const pending = testimonials.filter(t => t.status === 'pending');
    const approved = testimonials.filter(t => t.status !== 'pending');

    // Pending list
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
                        <button type="button" class="btn btn-success" onclick="approveTestimonial(${idx})"><i class="bi bi-check-lg me-1"></i>Approve</button>
                        <button type="button" class="btn btn-outline-danger" onclick="rejectTestimonial(${idx})"><i class="bi bi-x-lg me-1"></i>Reject</button>
                    </div>
                </div>
            </div>`;
        }).join('') || '<p class="text-muted mb-0">No pending reviews.</p>';
    }

    // Approved list
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

function approveTestimonial(index) {
    const c = getSiteContent();
    if (c.testimonials && c.testimonials[index]) {
        c.testimonials[index].status = 'approved';
        c.testimonials[index].rating = c.testimonials[index].rating || 5;
        saveSiteContent(c);
        renderTestimonialsList();
        alert('Review approved and published!');
    }
}

function rejectTestimonial(index) {
    if (!confirm('Reject this review? It will be removed permanently.')) return;
    const c = getSiteContent();
    c.testimonials.splice(index, 1);
    saveSiteContent(c);
    renderTestimonialsList();
    alert('Review rejected and removed.');
}

function removeTestimonial(index) {
    if (!confirm('Remove this testimonial from the website?')) return;
    const c = getSiteContent();
    c.testimonials.splice(index, 1);
    saveSiteContent(c);
    renderTestimonialsList();
}

window.removeTestimonial = removeTestimonial;
window.approveTestimonial = approveTestimonial;
window.rejectTestimonial = rejectTestimonial;

function getGalleryImages() {
    try {
        const stored = localStorage.getItem(GALLERY_CONFIG.STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...GALLERY_CONFIG.DEFAULT_IMAGES];
        }
    } catch (e) {
        console.error('Error loading gallery:', e);
    }
    return [...GALLERY_CONFIG.DEFAULT_IMAGES];
}

function saveGalleryImages(images) {
    localStorage.setItem(GALLERY_CONFIG.STORAGE_KEY, JSON.stringify(images));
    renderGalleryList();
}

function handleFilePreview() {
    const file = imageFile.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.innerHTML = `
            <img src="${e.target.result}" class="img-fluid rounded" style="max-height: 140px; object-fit: contain;">
        `;
    };
    reader.readAsDataURL(file);
}

function handleAddImage(e) {
    e.preventDefault();

    const title = document.getElementById('imageTitle').value.trim() || 'Gallery Image';
    let imageData = null;

    if (sourceUrl.checked) {
        const url = document.getElementById('imageUrl').value.trim();
        if (!url) {
            alert('Please enter an image URL');
            return;
        }
        imageData = { url, title };
    } else {
        const file = imageFile.files[0];
        if (!file) {
            alert('Please select an image file');
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            imageData = { url: event.target.result, title };
            addImageAndSave(imageData);
        };
        reader.readAsDataURL(file);
        return;
    }

    addImageAndSave(imageData);
}

function addImageAndSave(imageData) {
    const images = getGalleryImages();
    images.unshift(imageData);
    saveGalleryImages(images);

    // Reset form
    addImageForm.reset();
    document.getElementById('imageUrl').value = '';
    document.getElementById('imageTitle').value = '';
    imagePreview.innerHTML = `
        <i class="bi bi-cloud-upload fs-1"></i>
        <p class="mb-0 mt-2 small">Preview will appear here</p>
    `;

    alert('Image added successfully!');
}

function removeImage(index) {
    if (!confirm('Remove this image from the gallery?')) return;

    const images = getGalleryImages();
    images.splice(index, 1);
    saveGalleryImages(images);
}

function renderGalleryList() {
    const images = getGalleryImages();
    imageCountBadge.textContent = `${images.length} image${images.length !== 1 ? 's' : ''}`;

    galleryList.innerHTML = images.map((img, index) => `
        <div class="col-md-4 col-lg-3">
            <div class="card h-100">
                <img src="${img.url}" class="card-img-top gallery-preview w-100" alt="${img.title}" 
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22150%22%3E%3Crect fill=%22%23ddd%22 width=%22200%22 height=%22150%22/%3E%3Ctext fill=%22%23999%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3EFailed to load%3C/text%3E%3C/svg%3E'">
                <div class="card-body p-2">
                    <p class="card-text small mb-0 text-truncate" title="${img.title}">${img.title}</p>
                    <button type="button" class="btn btn-danger btn-sm mt-1 w-100" onclick="removeImage(${index})">
                        <i class="bi bi-trash me-1"></i>Remove
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Make removeImage available globally for onclick
window.removeImage = removeImage;

// Initialize
document.addEventListener('DOMContentLoaded', init);
