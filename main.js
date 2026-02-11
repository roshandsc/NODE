import './style.css'

// Loader Logic
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const greetingElement = document.getElementById('greeting-text');
    
    // session storage check
    if (sessionStorage.getItem('node_loader_shown')) {
        if (loader) loader.style.display = 'none';
        return;
    }

    const greetings = [
        "Hi", "Hello", "Namaste", "Hola", "Bonjour", 
        "Ciao", "Konnichiwa", "Salaam"
    ]; // Add more if needed

    let currentIndex = 0;
    
    // Revised transition timing
    // Cycle through greetings while loading, but ensure at least a few are shown
    
    let isPageLoaded = false;
    window.addEventListener('load', () => {
        isPageLoaded = true;
    });

    const showGreeting = (index) => {
        if (!loader) return;
        
        if (index >= greetings.length) {
            index = 0; // Loop back
        }
        
        greetingElement.textContent = greetings[index];
        greetingElement.classList.add('visible');

        // Wait for reading time
        setTimeout(() => {
            // Check if we should exit
            // Exit if page is loaded AND we've shown at least 3 greetings (approx 2.5s)
            // This prevents the loader from disappearing too instantly on fast connections, giving a smoother feel
            if (isPageLoaded && index >= 2) { 
                finishLoader();
            } else {
                // Fade out current word
                greetingElement.classList.remove('visible');
                
                // Wait for fade out transition (CSS 0.4s)
                setTimeout(() => {
                    showGreeting(index + 1);
                }, 400); 
            }
        }, 800); // 800ms visible time
    };

    function finishLoader() {
        // Mark as shown for this session
        sessionStorage.setItem('node_loader_shown', 'true');

        greetingElement.classList.remove('visible');
        
        setTimeout(() => {
             loader.classList.add('hidden');
             setTimeout(() => {
                 loader.style.display = 'none';
             }, 800); // Match CSS transition
        }, 400); 
    }

    // Start the loop
    setTimeout(() => {
        showGreeting(0);
    }, 100);
});

// Main Content Area Logic - removed to prevent clearing static HTML

// Header Utilities Logic
import { translations } from './translations.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Language Switcher
    const langBtn = document.querySelector('.lang-btn');
    const langDropdown = document.querySelector('.lang-dropdown');
    const langOptions = document.querySelectorAll('.lang-option');
    const langCurrent = document.querySelector('.lang-current');

    // Function to update page content based on language
    function updateLanguage(lang) {
        // validate lang
        if (!['en', 'hi', 'kn'].includes(lang)) return;

        // Update DOM elements
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key] && translations[key][lang]) {
                if (element.tagName === 'INPUT' && element.getAttribute('placeholder')) {
                    element.placeholder = translations[key][lang];
                } else {
                    element.innerHTML = translations[key][lang];
                }
            }
        });

        // Update html lang attribute
        document.documentElement.lang = lang;

        // Update Button Text
        langCurrent.textContent = lang.toUpperCase();

        // Update Active State in Dropdown
        langOptions.forEach(opt => {
            if (opt.getAttribute('data-lang') === lang) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });

        // Persist to local storage
        localStorage.setItem('node-lang', lang);
        
        console.log(`Language updated to: ${lang}`);
    }

    // Initialize Language
    const savedLang = localStorage.getItem('node-lang') || 'en';
    updateLanguage(savedLang);

    if (langBtn && langDropdown) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
                langDropdown.classList.remove('show');
            }
        });

        langOptions.forEach(option => {
            option.addEventListener('click', () => {
                const langCode = option.getAttribute('data-lang');
                updateLanguage(langCode);
                langDropdown.classList.remove('show');
            });
        });
    }

    // 2. Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    // Check local storage or preference
    const savedTheme = localStorage.getItem('node-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeIcon(true);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            
            updateThemeIcon(isDark);
            localStorage.setItem('node-theme', isDark ? 'dark' : 'light');
        });
    }

    function updateThemeIcon(isDark) {
        if (isDark) {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }
});

// Mobile Menu Logic
const hamburger = document.querySelector('.hamburger-menu');
const drawer = document.querySelector('.mobile-nav-drawer');
const overlay = document.querySelector('.mobile-nav-overlay');

function toggleMenu() {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
    } else {
        drawer.classList.add('open');
        overlay.classList.add('open');
    }
}

if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
}
