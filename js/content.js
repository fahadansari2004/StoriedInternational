/**
 * Site Content Loader - Loads dynamic content from localStorage
 * Content is managed via admin panel
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'eventpro_site_content';

    window.EventProContent = {
        getContent,
        renderContent
    };

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
        certification: {
            line1: "ISO 9001:2015 CERTIFIED",
            line2: "Professional Event Management Company"
        },
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
            addressLine1: "123 Event Street",
            addressLine2: "City, State 12345",
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

    async function getContent() {
        try {
            // Try Supabase first
            if (typeof supabaseClient !== 'undefined' && supabaseClient && typeof SUPABASE_CONFIG !== 'undefined' && SUPABASE_CONFIG.URL !== 'https://your-project-url.supabase.co') {
                const { data, error } = await supabaseClient
                    .from('site_content')
                    .select('content')
                    .single();

                if (data && data.content) {
                    const migrated = migrateContent(data.content);
                    return deepMerge(DEFAULT_CONTENT, migrated);
                }
            }

            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                const migrated = migrateContent(parsed);
                return deepMerge(DEFAULT_CONTENT, migrated);
            }
        } catch (e) {
            console.error('Error loading content:', e);
        }
        return JSON.parse(JSON.stringify(DEFAULT_CONTENT));
    }

    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    async function renderContent() {
        const content = await getContent();

        // Hero Carousel & Static Text
        const carouselInner = document.getElementById('hero-carousel-inner');
        const heroTagline = document.getElementById('hero-tagline');
        const heroTitle = document.getElementById('hero-title');
        const heroSubtitle = document.getElementById('hero-subtitle');

        if (content.hero.slides?.length) {
            // Render images only
            if (carouselInner) {
                carouselInner.innerHTML = content.hero.slides.map((slide, index) => `
                    <div class="carousel-item ${index === 0 ? 'active' : ''}">
                        <div class="hero-slide-bg" style="background-image: url('${slide.image}')"></div>
                    </div>
                `).join('');
            }

            // Render static text from first slide
            const firstSlide = content.hero.slides[0];
            if (heroTagline) heroTagline.textContent = firstSlide.tagline || '';
            if (heroTitle) heroTitle.textContent = firstSlide.title || '';
            if (heroSubtitle) heroSubtitle.textContent = firstSlide.subtitle || '';
        }

        // Hero Stats
        const stats = content.hero.stats || {};
        const heroRating = document.getElementById('hero-rating');
        const heroYears = document.getElementById('hero-years');
        const heroEvents = document.getElementById('hero-events');
        const heroClients = document.getElementById('hero-clients');
        if (heroRating) heroRating.textContent = stats.rating || '4.8/5';
        if (heroYears) heroYears.textContent = stats.yearsExp || '15+';
        if (heroEvents) heroEvents.textContent = stats.eventsCount || '5000+';
        if (heroClients) heroClients.textContent = stats.clientsCount || '3000+';

        // Certification
        const cert1 = document.getElementById('cert-line1');
        const cert2 = document.getElementById('cert-line2');
        if (cert1) cert1.textContent = content.certification.line1;
        if (cert2) cert2.textContent = content.certification.line2;

        // About
        const aboutHeading = document.getElementById('about-heading');
        const aboutTitle = document.getElementById('about-title');
        const aboutP1 = document.getElementById('about-p1');
        const aboutP2 = document.getElementById('about-p2');
        const aboutImg = document.getElementById('about-img');
        const aboutBadge = document.getElementById('about-badge');
        if (aboutHeading) aboutHeading.textContent = content.about.heading;
        if (aboutTitle) aboutTitle.textContent = content.about.title;
        if (aboutP1) aboutP1.textContent = content.about.paragraph1;
        if (aboutP2) aboutP2.textContent = content.about.paragraph2;
        if (aboutImg) aboutImg.src = content.about.imageUrl;
        if (aboutBadge) aboutBadge.textContent = content.about.badgeText;

        // Testimonials - only show approved (status 'approved' or undefined for backwards compat)
        const testimonialsContainer = document.getElementById('testimonials-container');
        if (testimonialsContainer && content.testimonials?.length) {
            const approved = content.testimonials.filter(t => t.status !== 'pending');
            const starHtml = (rating) => {
                const r = rating || 5;
                let html = '';
                for (let i = 0; i < 5; i++) {
                    html += i < r ? '<i class="bi bi-star-fill"></i>' : '<i class="bi bi-star"></i>';
                }
                return html;
            };
            testimonialsContainer.innerHTML = approved.map((t) => `
                <div class="col-md-6 col-lg-4">
                    <div class="card h-100 shadow-sm border-0 testimonial-card">
                        <div class="card-body p-4">
                            <div class="mb-3">
                                <span class="text-warning">${starHtml(t.rating)}</span>
                            </div>
                            <p class="card-text mb-4">"${escapeHtml(t.quote)}"</p>
                            <div class="d-flex align-items-center">
                                <div class="flex-shrink-0">
                                    <div class="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">${escapeHtml(t.initials || (t.name || '').substring(0, 2).toUpperCase())}</div>
                                </div>
                                <div class="flex-grow-1 ms-3">
                                    <h6 class="mb-0">${escapeHtml(t.name)}</h6>
                                    <small class="text-muted">${escapeHtml(t.date)}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Contact - update all phone/email/address elements
        const phoneRaw = content.contact.phoneRaw || content.contact.phone.replace(/\D/g, '');
        const phoneDisplay = content.contact.phone;
        document.querySelectorAll('[data-contact-phone]').forEach(el => {
            el.href = `tel:${phoneRaw}`;
            el.textContent = phoneDisplay;
        });
        document.querySelectorAll('[data-contact-email]').forEach(el => {
            el.href = `mailto:${content.contact.email}?subject=Event Management Inquiry&body=Hello, I am interested in your event management services.`;
            el.textContent = content.contact.email;
        });
        document.querySelectorAll('[data-contact-address]').forEach(el => {
            el.textContent = content.contact.address;
        });
        const contactAddress1 = document.getElementById('contact-address');
        const contactPhone1 = document.getElementById('contact-phone');
        const contactEmail1 = document.getElementById('contact-email');
        if (contactAddress1) contactAddress1.innerHTML = (content.contact.address || '').replace(/\n/g, '<br>');
        if (contactPhone1) { contactPhone1.href = `tel:${phoneRaw}`; contactPhone1.textContent = phoneDisplay; }
        if (contactEmail1) { contactEmail1.href = `mailto:${content.contact.email}`; contactEmail1.textContent = content.contact.email; }

        // REMOVED: Overwriting contactForm action to allow Google Form submission
        /*
        const contactForm = document.getElementById('contactForm');
        if (contactForm && content.contact.email) {
            contactForm.action = `https://formsubmit.co/${content.contact.email}`;
        }
        */

        // Footer contact
        const footerAddress = document.getElementById('footer-address');
        const footerPhone = document.getElementById('footer-phone');
        const footerEmail = document.getElementById('footer-email');
        const footerName = document.getElementById('footer-name');
        const footerDesc = document.getElementById('footer-desc');
        const footerCopyright = document.getElementById('footer-copyright');
        if (footerAddress) footerAddress.textContent = content.contact.address;
        if (footerPhone) { footerPhone.href = `tel:${phoneRaw}`; footerPhone.textContent = phoneDisplay; }
        if (footerEmail) { footerEmail.href = `mailto:${content.contact.email}`; footerEmail.textContent = content.contact.email; }
        if (footerName) {
            const logo = footerName.querySelector('img');
            if (logo) logo.alt = content.footer.companyName;
            else footerName.textContent = content.footer.companyName;
        }
        if (footerDesc) footerDesc.textContent = content.footer.description;
        if (footerCopyright) footerCopyright.textContent = content.footer.copyright;
    }

    function init() {
        renderContent();

        // Update content live if changed in another tab (admin panel local)
        window.addEventListener('storage', (e) => {
            if (e.key === STORAGE_KEY) {
                renderContent();
            }
        });

        // Supabase Realtime Updates (Global)
        if (typeof supabaseClient !== 'undefined' && supabaseClient && typeof SUPABASE_CONFIG !== 'undefined' && SUPABASE_CONFIG.URL !== 'https://your-project-url.supabase.co') {
            supabaseClient
                .channel('public:site_content')
                .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'site_content' }, payload => {
                    if (payload.new && payload.new.content) {
                        renderContent();
                        if (window.renderGallery) window.renderGallery(); // Added: refresh gallery too
                    }
                })
                .subscribe();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.EventProContent = { getContent, renderContent };
})();
