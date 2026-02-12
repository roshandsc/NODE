import { servicesData } from './services-data.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Get Service Type from URL
    const params = new URLSearchParams(window.location.search);
    const serviceType = params.get('type'); // e.g., 'plumbing'

    // 2. Validate Service Type
    if (!serviceType || !servicesData[serviceType]) {
        // Redirect to home or show error if invalid
        // For now, simpler: just default to plumbing or show alert
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

    // 3. Update Page Title
    document.title = `${data.title} - NODE`;

    // 4. Inject Content
    
    // Hero Section
    setText('service-title', data.title);
    setText('service-subtitle', data.heroSubtext);
    
    // Update Buttons
    const heroBtn = document.getElementById('request-btn');
    const ctaBtn = document.getElementById('cta-request-btn');
    
    [heroBtn, ctaBtn].forEach(btn => {
        if (btn) {
            btn.textContent = `Request ${capitalize(serviceType)} Service`;
            btn.onclick = () => {
                window.location.href = `/request-service.html?type=${serviceType}`;
            };
        }
    });

    setText('cta-headline', `Need Reliable ${capitalize(serviceType)} Support?`);

    // Coverages
    const coverageList = document.getElementById('coverage-list');
    if (coverageList) {
        coverageList.innerHTML = data.coverages.map(item => `
            <div class="coverage-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="coverage-icon">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>${item}</span>
            </div>
        `).join('');
    }

    // Pricing
    setText('price-start', `₹${data.pricing.startPrice}`);
    setText('price-note', data.pricing.notes);

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
                <h4>${item.title}</h4>
                <p>${item.desc}</p>
            </div>
        `).join('');
    }

    // FAQs
    const faqContainer = document.getElementById('faq-list');
    if (faqContainer) {
        faqContainer.innerHTML = data.faqs.map((faq, index) => `
            <div class="faq-item">
                <button class="faq-question" aria-expanded="false" onclick="toggleFaq(this)">
                    <span>${faq.question}</span>
                    <svg class="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
                <div class="faq-answer">
                    <p>${faq.answer}</p>
                </div>
            </div>
        `).join('');
    }
    
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
