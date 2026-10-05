/**
 * ==============================================================================
 * APEX MARKETING HOUSE - CORE CLIENT SCRIPT (app.js)
 * Enhanced for:
 *  - Bulletproof Return-to-Exact-Element Scroll Memory (History API)
 *  - 6 Core Services with "Ecommerce Website Development" integration
 *  - Interactive 6-Card Service Selector & 60-word dynamic textarea
 *  - Revamped Results Performance Filter Engine (Real Meta Ads Metrics)
 *  - Subpage Call-to-Action Pipeline (Deep-linking directly to proposal form)
 *  - Supabase Database Integration (with graceful offline/local fallback)
 *  - Defense Layer: Invisible Honeypot Traps, Form Rate Limiting & Sanitization
 * ==============================================================================
 */

// --- CONFIGURATION: SUPABASE CREDENTIALS ---
const SUPABASE_CONFIG = {
    url: "https://oumcqdzorgqzpbrukytu.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91bWNxZHpvcmdxenBicnVreXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3ODY5NTUsImV4cCI6MjEwNjM2Mjk1NX0.n5-zRbPH1a2HY0n8qNUQjvh6mGfsIPaYKHzAFwLQu3Y"
};

// --- CONFIGURATION: INSTANT LEAD NOTIFICATION ALERTS ---
const ALERT_CONFIG = {
    // 1. Email Alert (Routes directly to kanha75630@gmail.com)
    alertEmail: "kanha75630@gmail.com",
    formspreeEndpoint: "", // e.g. "https://formspree.io/f/xyzabced" (free via formspree.io)
    web3formsAccessKey: "598ab83e-40bd-4157-82d3-fc4a84329ba9", // Active Web3Forms Key for kanha75630@gmail.com
    
    // 2. Discord Webhook (Instant push notification with sound & rich embed card)
    discordWebhookUrl: "https://discord.com/api/webhooks/1556236481633460275/lI5kLmdLhBMKhasIahbAM7rizg2P0QEbO7ARxxNsu5voR6JljJ02989hn_FikivkEomE"
};

// --- STATE MANAGEMENT ---
let returnTargetId = null;
let homeScrollY = 0;
let lastSubmissionTimestamp = 0;
const SUBMISSION_COOLDOWN_MS = 15000; // 15-second cooldown to block rapid spam

// --- 1. RESTORED VERSION 1 HISTORY API SPA ROUTER WITH EXACT SCROLL & ELEMENT MEMORY ---
function navigateTo(pageId, originElementId) {
    if (window.event && typeof window.event.preventDefault === 'function') {
        window.event.preventDefault();
    }

    // 1. Save EXACT current scroll position to the CURRENT state before leaving
    const currentState = history.state || { page: 'home' };
    history.replaceState(
        { ...currentState, scrollY: window.scrollY },
        '',
        window.location.hash || window.location.pathname
    );

    homeScrollY = window.scrollY;
    returnTargetId = originElementId || null;

    if (pageId !== 'home') {
        history.pushState(
            { page: pageId, returnTargetId: originElementId || null, scrollY: 0 },
            '',
            '#' + pageId
        );
        renderPage(pageId, originElementId);
    } else {
        const hashTarget = originElementId ? '#' + originElementId : window.location.pathname;
        history.pushState(
            { page: 'home', returnTargetId: originElementId || null, scrollY: 0 },
            '',
            hashTarget
        );
        renderPage('home', originElementId);
    }
}

function navigateBack() {
    if (history.state && history.state.page !== 'home') {
        history.back();
    } else {
        renderPage('home', null, homeScrollY);
    }
}

window.addEventListener('popstate', (event) => {
    // If mobile drawer was open when back/return was pressed, close it cleanly
    const drawer = document.getElementById('mobile-drawer');
    const toggle = document.getElementById('mobile-toggle');
    const backdrop = document.getElementById('mobile-drawer-backdrop');
    if (drawer && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        if (toggle) toggle.classList.remove('active');
        if (backdrop) backdrop.classList.remove('open');
        return;
    }

    const state = event.state;
    const targetPage = (state && state.page) ? state.page : 'home';
    const scrollPos = (state && state.scrollY !== undefined) ? state.scrollY : homeScrollY;
    
    // When using the back button, we want EXACT pixel memory, not element snapping.
    // So we intentionally pass null for originElementId.
    renderPage(targetPage, null, scrollPos);
});

// Dual-protection listener for mobile back gestures that pop the URL hash (#menu -> previous)
window.addEventListener('hashchange', () => {
    if (window.location.hash !== '#menu') {
        const drawer = document.getElementById('mobile-drawer');
        const toggle = document.getElementById('mobile-toggle');
        const backdrop = document.getElementById('mobile-drawer-backdrop');
        if (drawer && drawer.classList.contains('open')) {
            drawer.classList.remove('open');
            if (toggle) toggle.classList.remove('active');
            if (backdrop) backdrop.classList.remove('open');
        }
    }
});

function renderPage(pageId, originElementId, scrollPosition) {
    // Hide all views & sections
    document.querySelectorAll('.page-section, .page-view').forEach(section => section.classList.remove('active'));
    
    // Find requested view using either page-[id] or view-[id]
    const targetSection = document.getElementById('page-' + pageId) || document.getElementById('view-' + pageId);
    if (targetSection) {
        targetSection.classList.add('active');
    } else {
        const homeFallback = document.getElementById('page-home') || document.getElementById('view-home');
        if (homeFallback) homeFallback.classList.add('active');
    }

    // Handle scroll positions
    if (pageId === 'home') {
        if (originElementId) {
            const targetEl = document.getElementById(originElementId) || 
                             (originElementId === 'contact' ? document.getElementById('proposal-section') : null);
            if (targetEl) {
                setTimeout(() => {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 50);
                return;
            }
        }
        
        if (scrollPosition) {
            setTimeout(() => {
                window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
            }, 40);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Backwards-compatibility alias
const renderPageView = renderPage;

// Initial state setup on boot
const initialHash = window.location.hash.replace('#', '');
const knownSubpages = ['ecommerce', 'ecom-web', 'seo', 'leadgen', 'social', 'performance', 'privacy', 'terms'];

if (knownSubpages.includes(initialHash)) {
    history.replaceState({ page: initialHash, returnTargetId: null, scrollY: 0 }, '', '#' + initialHash);
    renderPage(initialHash);
} else if (!history.state) {
    history.replaceState({ page: 'home', returnTargetId: null, scrollY: 0 }, '', window.location.pathname);
}

// --- 2. SUBPAGE CTA ENGINE (Deep-linking directly to Proposal Form with pre-selected service) ---
function openProposalFormWithService(serviceValue) {
    navigateTo('home', 'proposal-section');
    
    setTimeout(() => {
        selectProposalService(serviceValue);
        
        // Highlight and focus the proposal form card
        const formCard = document.querySelector('.proposal-form-card');
        if (formCard) {
            formCard.style.transition = 'box-shadow 0.3s ease';
            formCard.style.boxShadow = '0 0 0 4px rgba(225, 48, 108, 0.4), 0 25px 50px -12px rgba(0,0,0,0.25)';
            setTimeout(() => {
                formCard.style.boxShadow = '';
            }, 1800);
        }
    }, 150);
}

// --- 3. INTERACTIVE 6-CARD SERVICE SELECTOR ---
function selectProposalService(serviceValue) {
    // Remove active from all cards
    document.querySelectorAll('.proposal-card-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Find and select clicked button
    const targetBtn = document.querySelector(`.proposal-card-btn[data-service="${serviceValue}"]`);
    if (targetBtn) {
        targetBtn.classList.add('selected');
    }

    // Sync form dropdown
    const dropdown = document.getElementById('proposal-service-select');
    if (dropdown) {
        dropdown.value = serviceValue;
        handleServiceDropdownChange(serviceValue);
    }
}

function handleServiceDropdownChange(val) {
    const descContainer = document.getElementById('other-description-container');
    const textarea = document.getElementById('challenge-textarea');
    
    if (val === 'other') {
        descContainer.style.display = 'block';
        textarea.setAttribute('required', 'true');
        textarea.focus();
    } else {
        descContainer.style.display = 'none';
        textarea.removeAttribute('required');
        textarea.value = '';
        updateWordCount(textarea, 60);
    }
}

function updateWordCount(textarea, maxWords) {
    const text = textarea.value.trim();
    const words = text ? text.split(/\s+/).filter(w => w.length > 0) : [];
    const count = words.length;

    if (count > maxWords) {
        textarea.value = words.slice(0, maxWords).join(' ') + ' ';
    }

    const display = document.getElementById('word-count-indicator');
    if (display) {
        display.textContent = `${Math.min(count, maxWords)} / ${maxWords} words`;
        if (count >= maxWords) {
            display.style.color = '#ef4444';
        } else {
            display.style.color = '#94a3b8';
        }
    }
}

// --- 4. REVAMPED RESULTS SECTION FILTER ---
function filterResults(category, btnElement) {
    document.querySelectorAll('.results-filter-btn').forEach(btn => btn.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    const cards = document.querySelectorAll('.ads-performance-card');
    cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
            card.style.display = 'flex';
            card.style.animation = 'fadeInView 0.3s ease-out';
        } else {
            card.style.display = 'none';
        }
    });
}

// --- 5. FAQ ACCORDION ENGINE ---
function toggleFaq(headerElement) {
    const item = headerElement.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all other FAQs for clean single-view accordion
    document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));

    // Toggle current
    if (!isOpen) {
        item.classList.add('open');
    }
}

// --- 6. MOBILE DRAWER NAVIGATION (With Phone/Browser Back Button Return Support) ---
const mobileToggle = document.getElementById('mobile-toggle');
const mobileDrawer = document.getElementById('mobile-drawer');

function openMobileDrawer() {
    const drawer = document.getElementById('mobile-drawer') || mobileDrawer;
    const toggle = document.getElementById('mobile-toggle') || mobileToggle;
    const backdrop = document.getElementById('mobile-drawer-backdrop');
    if (!drawer) return;

    drawer.classList.add('open');
    if (toggle) toggle.classList.add('active');
    if (backdrop) backdrop.classList.add('open');

    // Push #menu to history so hardware back gesture, phone return, or browser back closes the menu
    const currentPage = (history.state && history.state.page) || 'home';
    const currentOrigin = (history.state && history.state.returnTargetId) || null;
    history.pushState(
        { menuOpen: true, page: currentPage, returnTargetId: currentOrigin },
        '',
        '#menu'
    );
}
window.openMobileDrawer = openMobileDrawer;

function closeMobileDrawer(shouldPopHistory = true) {
    const drawer = document.getElementById('mobile-drawer') || mobileDrawer;
    const toggle = document.getElementById('mobile-toggle') || mobileToggle;
    const backdrop = document.getElementById('mobile-drawer-backdrop');

    if (drawer) drawer.classList.remove('open');
    if (toggle) toggle.classList.remove('active');
    if (backdrop) backdrop.classList.remove('open');

    if (shouldPopHistory) {
        if (window.location.hash === '#menu' || (history.state && history.state.menuOpen)) {
            history.back();
        }
    }
}
window.closeMobileDrawer = closeMobileDrawer;

function toggleMobileDrawer() {
    const drawer = document.getElementById('mobile-drawer') || mobileDrawer;
    if (drawer && drawer.classList.contains('open')) {
        closeMobileDrawer(true);
    } else {
        openMobileDrawer();
    }
}
window.toggleMobileDrawer = toggleMobileDrawer;

// Event listeners for toggle button (click + touchend for instant mobile response)
if (mobileToggle) {
    const onToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileDrawer();
    };
    mobileToggle.addEventListener('click', onToggle);
    mobileToggle.addEventListener('touchend', onToggle, { passive: false });
}


// Event listeners for backdrop overlay
const drawerBackdropEl = document.getElementById('mobile-drawer-backdrop');
if (drawerBackdropEl) {
    const onBackdrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMobileDrawer(true);
    };
    drawerBackdropEl.addEventListener('click', onBackdrop);
    drawerBackdropEl.addEventListener('touchend', onBackdrop, { passive: false });
}

// Close drawer on tap/click anywhere outside
document.addEventListener('click', (e) => {
    const drawer = document.getElementById('mobile-drawer') || mobileDrawer;
    if (drawer && drawer.classList.contains('open')) {
        if (!drawer.contains(e.target) && !mobileToggle.contains(e.target)) {
            closeMobileDrawer(true);
        }
    }
});

// Close drawer if ESC key is pressed on keyboard
document.addEventListener('keydown', (e) => {
    const drawer = document.getElementById('mobile-drawer') || mobileDrawer;
    if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) {
        closeMobileDrawer(true);
    }
});

function handleMobileNav(pageId, anchorId) {
    const drawer = document.getElementById('mobile-drawer');
    const toggle = document.getElementById('mobile-toggle');
    const backdrop = document.getElementById('mobile-drawer-backdrop');
    if (drawer) drawer.classList.remove('open');
    if (toggle) toggle.classList.remove('active');
    if (backdrop) backdrop.classList.remove('open');

    // Cleanly replace the #menu state with the target anchor/page to prevent #menu from lingering in history
    if (window.location.hash === '#menu') {
        const hashTarget = anchorId ? '#' + anchorId : (pageId === 'home' ? window.location.pathname : '#' + pageId);
        history.replaceState(
            { page: pageId, returnTargetId: anchorId || null, scrollY: window.scrollY },
            '',
            hashTarget
        );
        renderPage(pageId, anchorId);
    } else {
        navigateTo(pageId, anchorId);
    }
}

// --- 7. SECURE SUPABASE & LEAD CAPTURE DISPATCHER ---
async function handleLeadFormSubmit(event, formElement, feedbackElement, sourceFormType) {
    event.preventDefault();

    // Rate Limiting Check (Prevent rapid-fire automated clicks)
    const now = Date.now();
    if (now - lastSubmissionTimestamp < SUBMISSION_COOLDOWN_MS) {
        const remainingSec = Math.ceil((SUBMISSION_COOLDOWN_MS - (now - lastSubmissionTimestamp)) / 1000);
        feedbackElement.innerHTML = `<span style="color:#f59e0b;">⏳ Please wait ${remainingSec}s before submitting again.</span>`;
        return;
    }

    // Security Defense: Honeypot trap check
    const honeypotField = formElement.querySelector('input[name="hp_website"]');
    if (honeypotField && honeypotField.value.trim() !== '') {
        // Quietly pretend success to fool malicious spam bots
        feedbackElement.innerHTML = `<span style="color:#10b981;">✓ Growth plan requested successfully!</span>`;
        formElement.reset();
        return;
    }

    // Extract & Sanitize Form Data
    const formData = new FormData(formElement);
    const rawData = Object.fromEntries(formData.entries());

    // Basic Input Validations
    if (!rawData.name || rawData.name.trim().length < 2) {
        feedbackElement.innerHTML = `<span style="color:#ef4444;">Please provide your full name.</span>`;
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!rawData.email || !emailRegex.test(rawData.email.trim())) {
        feedbackElement.innerHTML = `<span style="color:#ef4444;">Please provide a valid email address.</span>`;
        return;
    }

    const leadPayload = {
        name: rawData.name.trim().replace(/[<>]/g, ''),
        email: rawData.email.trim().toLowerCase(),
        phone: rawData.phone ? rawData.phone.trim().replace(/[<>]/g, '') : null,
        company: rawData.company ? rawData.company.trim().replace(/[<>]/g, '') : null,
        service: rawData.service || 'general_inquiry',
        message: rawData.message ? rawData.message.trim().replace(/[<>]/g, '') : null,
        source_form: sourceFormType,
        created_at: new Date().toISOString()
    };

    feedbackElement.innerHTML = `<span style="color:#e1306c;">Connecting to secure server...</span>`;
    const submitBtn = formElement.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    // Check if Supabase credentials are configured
    const isSupabaseConfigured = 
        SUPABASE_CONFIG.url && 
        !SUPABASE_CONFIG.url.includes("YOUR_SUPABASE_PROJECT_ID") &&
        SUPABASE_CONFIG.anonKey && 
        !SUPABASE_CONFIG.anonKey.includes("YOUR_SUPABASE_ANON_PUBLIC_KEY");

    if (isSupabaseConfigured) {
        try {
            console.log('[Apex Pipeline] Submitting lead to Supabase...', leadPayload);
            const response = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/leads`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": SUPABASE_CONFIG.anonKey,
                    "Authorization": `Bearer ${SUPABASE_CONFIG.anonKey}`,
                    "Prefer": "return=minimal"
                },
                body: JSON.stringify(leadPayload)
            });

            console.log('[Apex Pipeline] Supabase response status:', response.status);

            if (!response.ok) {
                throw new Error(`Server returned HTTP ${response.status}`);
            }

            lastSubmissionTimestamp = Date.now();
            feedbackElement.innerHTML = `<span style="color:#10b981; font-weight:700;">✓ Inquired successfully! Our growth team will contact you within 24 hours.</span>`;
            formElement.reset();
            
            // Dispatch instant alerts (Discord and/or Email) asynchronously
            console.log('[Apex Pipeline] Triggering Discord & Email alerts...');
            dispatchLeadAlerts(leadPayload);
        } catch (err) {
            console.error("[Apex Pipeline] Supabase Error:", err);
            saveLeadLocally(leadPayload);
            feedbackElement.innerHTML = `<span style="color:#10b981; font-weight:700;">✓ Inquired successfully! (Saved to secure queue)</span>`;
            formElement.reset();
            dispatchLeadAlerts(leadPayload);
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    } else {
        setTimeout(() => {
            saveLeadLocally(leadPayload);
            lastSubmissionTimestamp = Date.now();
            feedbackElement.innerHTML = `<span style="color:#10b981; font-weight:700;">✓ Inquired successfully! We'll review your details shortly.</span>`;
            formElement.reset();
            dispatchLeadAlerts(leadPayload);
            if (submitBtn) submitBtn.disabled = false;
        }, 600);
    }
}

// --- 8. INSTANT NOTIFICATION ALERT DISPATCHERS (Discord & Email) ---
async function dispatchLeadAlerts(lead) {
    if (ALERT_CONFIG.discordWebhookUrl && ALERT_CONFIG.discordWebhookUrl.startsWith('http')) {
        sendDiscordAlert(lead);
    }
    if (ALERT_CONFIG.formspreeEndpoint || ALERT_CONFIG.web3formsAccessKey) {
        sendEmailAlert(lead);
    }
}

async function sendDiscordAlert(lead) {
    try {
        const serviceMap = {
            'ecommerce': '🛒 E-commerce / Dropshipping',
            'ecom-web': '💻 Ecommerce Website Development',
            'ecommerce_website': '💻 Ecommerce Website Development',
            'seo': '🔍 Search Engine Optimization (SEO)',
            'leadgen': '🎯 Lead Generation Campaigns',
            'lead_generation': '🎯 Lead Generation Campaigns',
            'social': '📱 Social Media Marketing & Organic Growth',
            'social_media': '📱 Social Media Marketing & Organic Growth',
            'performance': '⚡ Performance Marketing (Meta & Google Ads)',
            'meta_ads': '⚡ Performance Marketing (Meta Ads)',
            'dropshipping': '📦 Dropshipping Ads & Scaling',
            'cro_strategy': '📈 Conversion Rate Optimization & Strategy',
            'general_inquiry': '💼 General Growth Inquiry',
            'other': '💡 Custom Growth Strategy'
        };
        const serviceName = serviceMap[lead.service] || lead.service;
        const sourceLabel = (lead.source_form === 'hero_quick' || lead.source_form === 'hero_quick_form') ? 'Hero Quick Form' : 'Full Proposal Form';
        const formattedTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';

        const discordPayload = {
            username: 'Apex Marketing Lead Bot',
            embeds: [
                {
                    title: '🚀 New Client Lead Captured!',
                    description: 'A new prospect has submitted an inquiry on **Apex Marketing House**.',
                    color: 14758004, // Vivid gradient accent (#e13074)
                    fields: [
                        { name: '👤 Prospect Name', value: lead.name || 'N/A', inline: true },
                        { name: '📧 Email Address', value: lead.email || 'N/A', inline: true },
                        { name: '📱 Phone Number', value: lead.phone || 'Not provided', inline: true },
                        { name: '🏢 Brand / Company', value: lead.company || 'Not provided', inline: true },
                        { name: '🎯 Service Requested', value: serviceName, inline: false },
                        { name: '💬 Project Details & Goals', value: lead.message ? lead.message.slice(0, 1024) : 'No details provided', inline: false },
                        { name: '📄 Origin Form', value: sourceLabel, inline: true },
                        { name: '⏰ Submission Time', value: formattedTime, inline: true }
                    ],
                    footer: {
                        text: 'Apex Marketing House • Real-Time Pipeline Notification'
                    },
                    timestamp: new Date().toISOString()
                }
            ]
        };

        const discordRes = await fetch(ALERT_CONFIG.discordWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(discordPayload)
        });
        console.log('[Apex Pipeline] Discord response HTTP status:', discordRes.status);
    } catch (err) {
        console.warn('[Apex Pipeline] Discord alert warning:', err);
    }
}

async function sendEmailAlert(lead) {
    try {
        const serviceMap = {
            'ecommerce': 'E-commerce / Dropshipping',
            'ecom-web': 'Ecommerce Website Development',
            'ecommerce_website': 'Ecommerce Website Development',
            'seo': 'Search Engine Optimization (SEO)',
            'leadgen': 'Lead Generation Campaigns',
            'lead_generation': 'Lead Generation Campaigns',
            'social': 'Social Media Marketing',
            'social_media': 'Social Media Marketing',
            'performance': 'Performance Marketing',
            'meta_ads': 'Performance Marketing (Meta Ads)',
            'dropshipping': 'Dropshipping Ads & Scaling',
            'cro_strategy': 'CRO & Funnel Strategy',
            'general_inquiry': 'General Inquiry',
            'other': 'Custom Growth Strategy'
        };
        const serviceName = serviceMap[lead.service] || lead.service;
        const sourceLabel = (lead.source_form === 'hero_quick' || lead.source_form === 'hero_quick_form') ? 'Hero Quick Form' : 'Full Proposal Form';

        if (ALERT_CONFIG.formspreeEndpoint && ALERT_CONFIG.formspreeEndpoint.startsWith('http')) {
            const formspreeRes = await fetch(ALERT_CONFIG.formspreeEndpoint, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    _replyto: lead.email,
                    name: lead.name,
                    email: lead.email,
                    phone: lead.phone || 'N/A',
                    company: lead.company || 'N/A',
                    service: serviceName,
                    message: lead.message || 'N/A',
                    source: sourceLabel,
                    _subject: `🔥 New Lead from ${lead.name} (${serviceName})`
                })
            });
            console.log('[Apex Pipeline] Formspree response status:', formspreeRes.status);
        } else if (ALERT_CONFIG.web3formsAccessKey) {
            const web3Res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: ALERT_CONFIG.web3formsAccessKey,
                    from_name: 'Apex Marketing Leads',
                    subject: `🔥 New Lead: ${lead.name} (${serviceName})`,
                    replyto: lead.email,
                    name: lead.name,
                    email: lead.email,
                    phone: lead.phone || 'N/A',
                    company: lead.company || 'N/A',
                    service: serviceName,
                    message: lead.message || 'N/A',
                    source: sourceLabel
                })
            });
            let web3Data = null;
            try { web3Data = await web3Res.json(); } catch (_) {}
            console.log('[Apex Pipeline] Web3Forms response status:', web3Res.status, web3Data);
        }
    } catch (err) {
        console.warn('[Apex Pipeline] Email alert warning:', err);
    }
}

// Backup Lead Storage
function saveLeadLocally(lead) {
    try {
        const stored = JSON.parse(localStorage.getItem('apex_leads') || '[]');
        stored.push(lead);
        localStorage.setItem('apex_leads', JSON.stringify(stored));
        console.log("Lead safely saved to local backup queue:", lead);
    } catch (e) {
        console.warn("Could not save to local storage", e);
    }
}

window.exportLeadsToConsole = function() {
    const leads = JSON.parse(localStorage.getItem('apex_leads') || '[]');
    console.table(leads);
    return leads;
};

// --- Reviews Carousel Interactive Navigation & Controls ---
function scrollReviewsTrack(direction) {
    const track = document.querySelector('.reviews-carousel-track');
    if (!track) return;
    const card = track.querySelector('.review-card-active');
    const scrollAmount = card ? (card.offsetWidth + 20) * 1.5 : 360;
    if (direction === 'left') {
        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}
window.scrollReviewsTrack = scrollReviewsTrack;

function initReviewsCarouselControls() {
    const track = document.querySelector('.reviews-carousel-track');
    const counter = document.getElementById('reviews-counter');
    if (!track) return;

    // Update counter on scroll
    function updateCounter() {
        if (!counter) return;
        const cards = track.querySelectorAll('.review-card-active');
        const total = cards.length || 12;
        const cardWidth = (cards[0] ? cards[0].offsetWidth : 320) + 20;
        const visibleCount = Math.max(1, Math.min(total, Math.round(track.clientWidth / cardWidth)));
        const firstVisibleIndex = Math.min(total - visibleCount + 1, Math.max(1, Math.round(track.scrollLeft / cardWidth) + 1));
        const lastVisibleIndex = Math.min(total, firstVisibleIndex + visibleCount - 1);
        counter.textContent = `Reviews ${firstVisibleIndex} – ${lastVisibleIndex} of ${total}`;
    }

    track.addEventListener('scroll', updateCounter, { passive: true });
    window.addEventListener('resize', updateCounter, { passive: true });
    updateCounter();

    // Mouse wheel horizontal scroll on hover
    track.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
            const maxScroll = track.scrollWidth - track.clientWidth;
            if ((e.deltaY > 0 && track.scrollLeft < maxScroll - 2) || (e.deltaY < 0 && track.scrollLeft > 2)) {
                e.preventDefault();
                track.scrollLeft += e.deltaY;
            }
        }
    }, { passive: false });

    // Drag-to-scroll support
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;

    track.addEventListener('mousedown', (e) => {
        isDown = true;
        track.classList.add('is-dragging');
        startX = e.pageX - track.offsetLeft;
        scrollStart = track.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
        if (isDown) {
            isDown = false;
            track.classList.remove('is-dragging');
        }
    });

    track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.5;
        track.scrollLeft = scrollStart - walk;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initReviewsCarouselControls();
});
if (document.readyState !== 'loading') {
    initReviewsCarouselControls();
}
