import { servicesData } from './services-data.js';
import { translations } from './translations.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Get Service Type from URL
    const params = new URLSearchParams(window.location.search);
    const serviceType = params.get('type'); // e.g., 'plumbing'

    // 2. Validate Service Type
    if (!serviceType || !servicesData[serviceType]) {
        console.error('Invalid or missing service type');
        document.querySelector('main').innerHTML = `
            <div class="container" style="padding: 100px 0; text-align: center;">
                <h1>Service Not Found</h1>
                <p>The requested service could not be found.</p>
                <a href="/" class="btn btn-primary" style="margin-top: 20px;">Go Home</a>
            </div>
        `;
        return;
    }

    const data = servicesData[serviceType];
    const currentLang = localStorage.getItem('node-lang') || 'en';

    // Function to render content based on language
    function renderServiceContent(lang) {
        // Validation check for lang
        if (!['en', 'hi', 'kn'].includes(lang)) lang = 'en';

        // 3. Update Page Title
        document.title = `${data.title[lang]} - NODE`;

        // 4. Inject Content
        
        // Hero Section
        setText('service-title', data.title[lang]);
        setText('service-subtitle', data.heroSubtext[lang]);
        
        // Update Buttons
        const heroBtn = document.getElementById('request-btn');
        const ctaBtn = document.getElementById('cta-request-btn');
        
        // Helper to translate "Request {Service}"
        // Since we don't have a template for this specific combination, we construct it:
        // En: Request Plumbing Service
        // Hi: प्लंबिंग सेवा का अनुरोध करें
        // Kn: ಕೊಳಾಯಿ ಸೇವೆಯನ್ನು ವಿನಂತಿಸಿ
        // A simple way is to use the generic "Request Service" button text or construct strings.
        // Let's use the generic "btn_request_service" from translations for consistency, 
        // OR construct it if we want to be specific. The user wants it translated.
        // Let's use the specific generic "Request Service" for buttons to ensure accuracy from translations.js
        
        const btnText = translations['btn_request_service'][lang];

        [heroBtn, ctaBtn].forEach(btn => {
            if (btn) {
                btn.textContent = btnText;
                btn.onclick = () => {
                    window.location.href = `/request-service.html?type=${serviceType}`;
                };
            }
        });

         // CTA Headline
        // "Need Reliable {Service} Support?"
        // Constructing dynamic sentences in multiple languages is tricky with grammar.
        // Easier approach: "Need Reliable Support?" (Generic CTA) + Service Context inferred.
        // Or simple string concatenation if grammar allows.
        // Let's use the generic "sec_cta" key I added: "Need Reliable Support?"
        setText('cta-headline', translations['sec_cta'][lang]);

        // Coverages
        const coverageList = document.getElementById('coverage-list');
        if (coverageList) {
            coverageList.innerHTML = data.coverages.map(item => `
                <div class="coverage-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="coverage-icon">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>${item[lang]}</span>
                </div>
            `).join('');
        }

        // Pricing
        // START PRICE needs manual handling if it has text (like "Consultation")
        let priceVal = data.pricing.startPrice;
        if (typeof priceVal === 'object') {
            priceVal = priceVal[lang];
        } else {
             // If numeric string "350", prepend symbol
             if (!isNaN(priceVal)) priceVal = `₹${priceVal}`;
        }
        
        setText('price-start', priceVal);
        setText('price-note', data.pricing.notes[lang]);

        // Why Choose NODE
        const whyContainer = document.getElementById('why-grid');
        if (whyContainer) {
            whyContainer.innerHTML = data.whyChoose.map(item => `
                <div class="why-item">
                    <div class="why-icon-wrapper">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>
                    <h4>${item.title[lang]}</h4>
                    <p>${item.desc[lang]}</p>
                </div>
            `).join('');
        }

        // FAQs
        const faqContainer = document.getElementById('faq-list');
        if (faqContainer) {
            faqContainer.innerHTML = data.faqs.map((faq, index) => `
                <div class="faq-item">
                    <button class="faq-question" aria-expanded="false" onclick="toggleFaq(this)">
                        <span>${faq.question[lang]}</span>
                        <svg class="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    <div class="faq-answer">
                        <p>${faq.answer[lang]}</p>
                    </div>
                </div>
            `).join('');
        }
    }

    // Initial Render
    renderServiceContent(currentLang);

    // Expoose render function to window so main.js (or custom event) can trigger it?
    // main.js handles language switching but it iterates over [data-i18n]. 
    // It DOES NOT know about this dynamic content.
    // OPTION 1: Listen for a custom event 'languageChanged'
    // OPTION 2: Polling? 
    // OPTION 3: Overwrite the standard language switcher in main.js? No, bad idea.
    
    // BETTER APPROACH: Add a custom event listener to the window/document.
    window.addEventListener('languageChanged', (e) => {
        renderServiceContent(e.detail.lang);
    });
    
    // Initial Animation Trigger
    setTimeout(() => {
        document.querySelectorAll('.fade-in-up').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);

});

// Helper Functions
function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Global FAQ Toggle function
window.toggleFaq = function(btn) {
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    
    // Close others (optional, but cleaner)
    document.querySelectorAll('.faq-question').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.style.maxHeight = null;
    });

    if (!isExpanded) {
        btn.setAttribute('aria-expanded', 'true');
        const answer = btn.nextElementSibling;
        answer.style.maxHeight = answer.scrollHeight + "px";
    }
};
