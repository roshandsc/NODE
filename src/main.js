import './styles/style.css'
import { translations } from './utils/translations.js';
// Loader Logic
const loader = document.getElementById('loader');
const greetingElement = document.getElementById('greeting-text');
    
// session storage check
if (sessionStorage.getItem('node_loader_shown')) {
    if (loader) loader.style.display = 'none';
} else {
    const greetings = [
        "Hi", "Hello","Namaste", "Vanakkam", "Namaskara", "Sat Sri Akal", "Nomoshkar", 
        "Kem Cho", "Kasa Kay", "Salaam", "Adaab", "Pranam", 
        "Ram Ram", "Jai Jinendra", "Tashi Delek", "Juley", "Hola", "Bonjour", "Ciao"
    ];

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
}

// Main Content Area Logic - removed to prevent clearing static HTML

// Header Utilities Logic


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
        
        // Dispatch custom event for other scripts (like service-loader.js)
        const event = new CustomEvent('languageChanged', { detail: { lang: lang } });
        window.dispatchEvent(event);
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

if (hamburger && drawer && overlay) {
    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
}

// -----------------------------------------------------
// 3. Global Geolocation API (Nominatim)
// -----------------------------------------------------
const locationBtn = document.getElementById('globalLocationBtn');
const locationText = document.getElementById('globalLocationText');

function fetchLocationStr(lat, lon) {
    // Show loading state gracefully
    if (locationText) locationText.textContent = "Locating...";

    // Free OpenStreetMap Reverse Geocoding API
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`;
    
    fetch(url, { headers: { 'Accept-Language': 'en' } }) // Request English results
        .then(response => response.json())
        .then(data => {
            if (data && data.address) {
                // Try to extract the neighborhood/suburb/area and the city/state
                const area = data.address.suburb || data.address.neighbourhood || data.address.village || data.address.town || "";
                const city = data.address.city || data.address.state_district || data.address.state || "India";
                
                // Format appropriately
                let displayStr = "";
                if (area && city && area !== city) {
                    displayStr = `${area}, ${city}`;
                } else if (city) {
                    displayStr = city;
                } else {
                    displayStr = "Unknown Location";
                }
                
                // Truncate if too long (max 25 chars) to prevent header breakage
                if (displayStr.length > 25) {
                    displayStr = displayStr.substring(0, 22) + '...';
                }
                
                if (locationText) {
                    // Temporarily remove i18n attribute so translations don't overwrite the live location
                    locationText.removeAttribute('data-i18n'); 
                    locationText.textContent = displayStr;
                }
            } else {
                throw new Error("No address data");
            }
        })
        .catch(error => {
            console.error("Geocoding failed:", error);
            if (locationText) locationText.textContent = "Bengaluru, KA"; // Ultimate fallback
        });
}

function requestUserLocation(isAuto = false) {
    if ("geolocation" in navigator) {
        // Only show "Requesting..." text if the user manually clicked the button to avoid jumping UI on auto-load
        if (!isAuto && locationText) locationText.textContent = "Requesting...";
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Success - Mark that we've prompted them (even though this was a success, we don't need to force prompt again)
                localStorage.setItem('node_location_prompted', 'true');
                fetchLocationStr(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                // Denied or timeout
                console.warn("Geolocation denied or failed:", error.message);
                localStorage.setItem('node_location_prompted', 'true'); // Don't prompt again if they denied
                
                // Fallback to default
                if (locationText && locationText.textContent === "Requesting...") {
                     locationText.textContent = "Bengaluru, KA";
                }
            },
            { timeout: 10000, maximumAge: 60000 }
        );
    } else {
        localStorage.setItem('node_location_prompted', 'true');
        if (locationText) locationText.textContent = "Bengaluru, KA";
    }
}

// Attach click listener to location button to manually trigger/refresh location
if (locationBtn) {
    locationBtn.addEventListener('click', () => requestUserLocation(false));
}

// Auto-request or silently load location on page load
window.addEventListener('load', () => {
    // Delay slightly to ensure UI is visible and not blocked during initial render
    setTimeout(() => {
        const hasPrompted = localStorage.getItem('node_location_prompted');
        
        if (!hasPrompted) {
            // First time visitor: Trigger the prompt non-intrusively
            requestUserLocation(true);
        } else {
            // Returning visitor: Check if permission is already granted to load silently without prompting
            if (navigator.permissions) {
                navigator.permissions.query({ name: 'geolocation' }).then(result => {
                    if (result.state === 'granted') {
                        requestUserLocation(true); // Silently fetch since we have permission
                    }
                });
            }
        }
    }, 2000); // 2-second delay gives the loader time to finish and the user to process the page
});

// -----------------------------------------------------
// 4. Animated Search Bar Placeholder
// -----------------------------------------------------
const searchInput = document.getElementById('globalSearchInput');

const placeholderTexts = [
    "Search 'AC Repair'...",
    "Search 'Home Deep Cleaning'...",
    "Search 'Plumbing Services'...",
    "Search 'Electrical Wiring'...",
    "Find trusted professionals..."
];

let phIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;
let emptyDelay = 500;
let fullDelay = 2000;

function typePlaceholder() {
    if (!searchInput) return; // Exit if not found

    const currentText = placeholderTexts[phIndex];
    let displayText = currentText.substring(0, charIndex);

    // Only animate if the field is empty and not focused (optional preference, here we just animate if empty)
    if (searchInput.value === "") {
        searchInput.setAttribute('placeholder', displayText + '|');
    }

    if (!isDeleting && charIndex < currentText.length) {
        // Typing
        charIndex++;
        setTimeout(typePlaceholder, typingDelay);
    } else if (isDeleting && charIndex > 0) {
        // Deleting
        charIndex--;
        setTimeout(typePlaceholder, typingDelay / 2); // Delete faster
    } else if (!isDeleting && charIndex === currentText.length) {
        // Full word written, wait
        isDeleting = true;
        
        // Remove blinker temporarily when full
        if(searchInput.value === "") searchInput.setAttribute('placeholder', displayText);
        
        setTimeout(typePlaceholder, fullDelay);
    } else if (isDeleting && charIndex === 0) {
        // Deleted completely, move to next word
        isDeleting = false;
        phIndex = (phIndex + 1) % placeholderTexts.length;
        setTimeout(typePlaceholder, emptyDelay);
    }
}

// Initialize typing effect
if (searchInput) {
    setTimeout(typePlaceholder, 1000);
}

// -----------------------------------------------------
// 5. Intelligent Autocomplete Search
// -----------------------------------------------------
const searchDropdown = document.getElementById('globalSearchDropdown');

// Our internal Search Knowledge Base.
// 'tags' handles typos, short-names, and synonyms without heavy Levenshtein algorithms
const searchDictionary = [
    { id: 'srv-plumb', title: 'Plumbing Services', url: '/src/pages/services.html#plumbing', 
      tags: ['plumber', 'pipe', 'leak', 'water', 'plumb', 'pluming', 'plumbng'], popularity: 95 },
      
    { id: 'srv-elec', title: 'Electrical Repairs', url: '/src/pages/services.html#electrical', 
      tags: ['electrician', 'wire', 'short', 'light', 'elec', 'electric', 'electical', 'fan', 'switch'], popularity: 90 },
      
    { id: 'srv-clean', title: 'Deep Home Cleaning', url: '/src/pages/services.html#cleaning', 
      tags: ['clean', 'maid', 'dust', 'sweep', 'mop', 'housekeeping', 'clen', 'cleaning'], popularity: 85 },
      
    { id: 'srv-paint', title: 'Painting & Decor', url: '/src/pages/services.html#painting', 
      tags: ['paint', 'color', 'wall', 'painter', 'panting'], popularity: 70 },
      
    { id: 'srv-carp', title: 'Carpentry & Woodwork', url: '/src/pages/services.html#carpentry', 
      tags: ['carpenter', 'wood', 'furniture', 'door', 'table', 'carpe', 'woodwork'], popularity: 75 },
      
    { id: 'srv-ac', title: 'AC Repair & Service', url: '/src/pages/services.html#appliance', 
      tags: ['ac', 'air', 'conditioner', 'cooling', 'service', 'appliance'], popularity: 88 },
];

function closeSearchDropdown() {
    if (searchDropdown) {
        searchDropdown.classList.remove('active');
        searchDropdown.innerHTML = '';
    }
}

// Debounce helper to prevent excessive calculations during rapid typing
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

// The core search function
function handleSearchInput(e) {
    const query = e.target.value.toLowerCase().trim();
    
    // Stop typing animation if user starts typing
    if (query.length > 0) {
        searchInput.removeAttribute('placeholder');
    }

    if (query.length < 2) {
        closeSearchDropdown();
        return;
    }

    // 1. Scoring Logic
    let results = searchDictionary.map(item => {
        let score = 0;
        let matchStr = ""; // Keep track of what we matched for highlighting
        
        const titleLower = item.title.toLowerCase();

        // Exact Title Match (Highest Priority)
        if (titleLower === query) {
            score += 100;
            matchStr = query;
        } 
        // Title Prefix Match (High Priority)
        else if (titleLower.startsWith(query)) {
            score += 50;
            matchStr = query;
        }
        // Title Contains Match (Medium Priority)
        else if (titleLower.includes(query)) {
            score += 25;
            matchStr = query;
        } 
        // Tag Match (Handles typos and synonyms)
        else {
            const matchedTag = item.tags.find(tag => tag.startsWith(query) || tag.includes(query));
            if (matchedTag) {
                score += 15;
                // If we matched a tag, we can't easily highlight the title, so we just highlight the query if it exists, or don't highlight
                matchStr = query; 
            }
        }

        return { ...item, score, matchStr };
    });

    // 2. Filter out zero scores
    results = results.filter(item => item.score > 0);

    // 3. Sort by Score (Primary) and Popularity (Secondary)
    results.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.popularity - a.popularity;
    });

    // 4. Render
    searchDropdown.innerHTML = '';
    
    if (results.length === 0) {
        searchDropdown.innerHTML = `<div class="search-no-results">No services found for "${e.target.value}"</div>`;
    } else {
        // Limit to top 5 results
        results.slice(0, 5).forEach(result => {
            const a = document.createElement('a');
            a.className = 'search-suggestion';
            a.href = result.url;
            
            // Basic Highlighting: wrap the matched substring in a span
            // Note: This relies on a case-insensitive regex replace
            let displayTitle = result.title;
            if (result.matchStr) {
                const regex = new RegExp(`(${result.matchStr})`, "gi");
                displayTitle = result.title.replace(regex, '<span class="search-highlight">$1</span>');
            }

            a.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-placeholder)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"/>
                    <path d="M21 21L16.65 16.65"/>
                </svg>
                ${displayTitle}
            `;
            searchDropdown.appendChild(a);
        });
    }

    searchDropdown.classList.add('active');
}

// Attach listeners
if (searchInput && searchDropdown) {
    // Input listener with debounce
    searchInput.addEventListener('input', debounce(handleSearchInput, 150));
    
    // Clicking outside closes the dropdown
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
            closeSearchDropdown();
        }
    });

    // Focus re-opens if there's text
    searchInput.addEventListener('focus', (e) => {
        if (e.target.value.trim().length >= 2) {
            handleSearchInput(e);
        }
    });
}
