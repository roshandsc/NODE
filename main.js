import './style.css'

// Loader Logic
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const greetingElement = document.getElementById('greeting-text');
    const greetings = [
        "Hi", "Hello", "Namaste", "Hola", "Bonjour", 
        "Ciao", "Konnichiwa", "Salaam"
    ]; // Add more if needed

    let currentIndex = 0;
    const greetingDuration = 250; // Ms per word visible (fast to get through list)
    const fadeDuration = 100; // Ms for fade transition
    // Adjust timing: The user wants "smooth, elegant transitions". 
    // Too fast is chaotic. Let's do ~800ms total per word? 
    // Actually, "Greetings loop only while the website is loading" implies it could be infinite.
    // But we want to show a few. Let's cycle at a readable pace.
    
    // Revised timing for elegance:
    // Fade in: 400ms (CSS)
    // Stay: 1200ms
    // Fade out: 400ms (CSS)
    // But we want to likely finish the loop or at least show 'Hi' 'Hello' 'Namaste' etc.
    // If the site loads instantly, we should arguably show the animation for a minimum time 
    // so it doesn't look like a glitch.

    // Let's implement a queue-based approach. 
    // We'll show one word, wait, hide, show next. 
    // We check if the page is loaded. If loaded AND we've shown at least X words (or just 1 full cycle is too long?), 
    // we exit.
    // The prompt says: "Greetings loop only while the website is loading".
    // This implies if it takes 10s, we loop 10s. If 0.1s, we stop? 
    // Instant stop is jarring. 
    // Strategy: Ensure at least the first 2-3 greetings are shown, then if loaded, fade out. 
    // Or simpler: Just run the loop. If loaded, wait for current greeting to finish, then exit.

    let isPageLoaded = false;
    window.addEventListener('load', () => {
        isPageLoaded = true;
    });

    const showGreeting = (index) => {
        if (index >= greetings.length) {
            index = 0; // Loop back
        }
        
        // If page is loaded, we can stop the loop and hide the loader
        // UNLESS we want to force a minimum experience. 
        // Let's minimally ensure we don't cut off a word mid-transition.
        // And maybe show at least 1-2 words? 
        // For a local site, it will be instant. Let's force a small delay effectively 
        // by the nature of the timeout.
        
        // However, if the user sees "Hi" -> "Hello" -> "Namaste" and that's it, that's fine.
        // If `isPageLoaded` is true, we should probably transition out *after* the current word.
        
        greetingElement.textContent = greetings[index];
        greetingElement.classList.add('visible');

        // Wait for reading time
        setTimeout(() => {
            // Check if we should exit
            if (isPageLoaded && index >= 2) { // Ensure at least 3 words are shown (approx 2-3 sec) for effect
                // Start exit sequence
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
        // Fade out text first? Or just the whole loader?
        // Let's fade out the text
        greetingElement.classList.remove('visible');
        
        setTimeout(() => {
             loader.classList.add('hidden');
             // optional: remove from DOM after transition
             setTimeout(() => {
                 loader.style.display = 'none';
             }, 800); // Match CSS transition
        }, 400); 
    }

    // Start the loop
    // Initial delay to let CSS load/render
    setTimeout(() => {
        showGreeting(0);
    }, 100);
});

// Main Content Area Logic - removed to prevent clearing static HTML

// Header Utilities Logic
document.addEventListener('DOMContentLoaded', () => {
    // 1. Language Switcher
    const langBtn = document.querySelector('.lang-btn');
    const langDropdown = document.querySelector('.lang-dropdown');
    const langOptions = document.querySelectorAll('.lang-option');
    const langCurrent = document.querySelector('.lang-current');

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
                // Update active state
                langOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                // Update label
                const langCode = option.getAttribute('data-lang').toUpperCase();
                langCurrent.textContent = langCode;
                
                // Close dropdown
                langDropdown.classList.remove('show');

                // Simulate text update (Optional visual feedback)
                // In a real app, this would trigger i18n
                console.log(`Language switched to: ${langCode}`);
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
