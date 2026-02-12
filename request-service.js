
import { translations } from './translations.js';

// Mock API Data for Service Options
const SERVICE_OPTIONS = {
    'plumbing': [
        { id: 'leak', label: { en: 'Leak Repair', hi: 'लीक मरम्मत', kn: 'ಸೋರಿಕೆ ದುರಸ್ತಿ' } },
        { id: 'tap', label: { en: 'Tap / Pipe Replacement', hi: 'नल / पाइप प्रतिस्थापन', kn: 'ನಲ್ಲಿ / ಪೈಪ್ ಬದಲಿ' } },
        { id: 'blockage', label: { en: 'Drain Blockage', hi: 'नाली रुकावट', kn: 'ಚರಂಡಿ ನಿರ್ಬಂಧ' } },
        { id: 'fittings', label: { en: 'Bathroom Fittings', hi: 'बाथरूम फिटिंग', kn: 'ಬಾತ್ ರೂಮ್ ಫಿಟ್ಟಿಂಗ್' } },
        { id: 'other', label: { en: 'Other Issue', hi: 'अन्य समस्या', kn: 'ಇತರೆ ಸಮಸ್ಯೆ' } }
    ],
    'electrical': [
        { id: 'wiring', label: { en: 'Wiring Check / Repair', hi: 'वायरिंग जाँच / मरम्मत', kn: 'ವೈರಿಂಗ್ ಪರಿಶೀಲನೆ / ದುರಸ್ತಿ' } },
        { id: 'switch', label: { en: 'Switch / Socket Replacement', hi: 'स्विच / सॉकेट प्रतिस्थापन', kn: 'ಸ್ವಿಚ್ / ಸಾಕೆಟ್ ಬದಲಿ' } },
        { id: 'appliance', label: { en: 'Appliance Installation', hi: 'उपकरण स्थापना', kn: 'ಉಪಕರಣ ಸ್ಥಾಪನೆ' } },
        { id: 'fan', label: { en: 'Fan Repair', hi: 'पंखा मरम्मत', kn: 'ಫ್ಯಾನ್ ದುರಸ್ತಿ' } },
        { id: 'other', label: { en: 'Other Issue', hi: 'अन्य समस्या', kn: 'ಇತರೆ ಸಮಸ್ಯೆ' } }
    ],
    'repairs': [
        { id: 'furniture', label: { en: 'Furniture Assembly', hi: 'फर्नीचर असेंबली', kn: 'ಪೀಠೋಪಕರಣ ಜೋಡಣೆ' } },
        { id: 'door', label: { en: 'Door / Lock Repair', hi: 'दरवाजा / लॉक मरम्मत', kn: 'ಬಾಗಿಲು / ಲಾಕ್ ದುರಸ್ತಿ' } },
        { id: 'wall', label: { en: 'Wall Drilling / Mounting', hi: 'दीवार ड्रिलिंग / माउंटिंग', kn: 'ಗೋಡೆ ಕೊರೆಯುವಿಕೆ / ಮೌಂಟಿಂಗ್' } },
        { id: 'other', label: { en: 'General Handyman', hi: 'सामान्य अप्रेंटिस', kn: 'ಸಾಮಾನ್ಯ ಕೆಲಸಗಾರ' } }
    ],
    'construction': [
        { id: 'tiling', label: { en: 'Tile Replacement', hi: 'टाइल्स प्रतिस्थापन', kn: 'ಟೈಲ್ ಬದಲಿ' } },
        { id: 'painting', label: { en: 'Touch-up Painting', hi: 'टच-अप पेंटिंग', kn: 'ಟಚ್-ಅಪ್ ಪೇಂಟಿಂಗ್' } },
        { id: 'plaster', label: { en: 'Plaster Repair', hi: 'प्लास्टर मरम्मत', kn: 'ಪ್ಲಾಸ್ಟರ್ ದುರಸ್ತಿ' } }
    ],
    'cleaning': [
        { id: 'deep_clean', label: { en: 'Deep Home Cleaning', hi: 'गहरी घर की सफाई', kn: 'ಮನೆ ಆಳವಾದ ಶುಚಿಗೊಳಿಸುವಿಕೆ' } },
        { id: 'kitchen', label: { en: 'Kitchen Deep Clean', hi: 'रसोई की गहरी सफाई', kn: 'ಅಡುಗೆಮನೆ ಆಳವಾದ ಶುಚಿಗೊಳಿಸುವಿಕೆ' } },
        { id: 'bathroom', label: { en: 'Bathroom Cleaning', hi: 'बाथरूम की सफाई', kn: 'ಬಾತ್ ರೂಮ್ ಶುಚಿಗೊಳಿಸುವಿಕೆ' } },
        { id: 'sofa', label: { en: 'Sofa / Carpet Cleaning', hi: 'सोफा / कालीन सफाई', kn: 'ಸೋಫಾ / ಕಾರ್ಪೆಟ್ ಶುಚಿಗೊಳಿಸುವಿಕೆ' } }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    console.log("Service Request Form Loaded");
    
    // --- 1. SETUP & SERVICE DETECTION ---
    const urlParams = new URLSearchParams(window.location.search);
    let serviceType = urlParams.get('type') || 'general';
    
    // Normalize service type
    const validServices = Object.keys(SERVICE_OPTIONS);
    if (!validServices.includes(serviceType)) {
        // Default fallback or 'general' handling could go here
        // For now, let's default to plumbing if invalid, or show a generic list
        if (serviceType === 'general') {
             // Handle generic case if needed, or redirect
        }
    }

    // Update Display
    const displayService = document.getElementById('display-service-type');
    displayService.textContent = serviceType.charAt(0).toUpperCase() + serviceType.slice(1); // Capitalize

    // Populate Dynamic Options
    const dynamicTasksContainer = document.getElementById('dynamic-tasks');
    
    function renderOptions(lang) {
        // Clear existing
        dynamicTasksContainer.innerHTML = '';
        const options = SERVICE_OPTIONS[serviceType] || SERVICE_OPTIONS['plumbing']; // Fallback
        
        options.forEach(opt => {
            const label = document.createElement('label');
            label.className = 'checkbox-item';
            
            // Get text for current language, fallback to en
            const labelText = opt.label[lang] || opt.label['en'];

            label.innerHTML = `
                <input type="checkbox" name="task" value="${opt.id}">
                <span>${labelText}</span>
            `;
            dynamicTasksContainer.appendChild(label);
            
            // Add click listener for styling
            label.addEventListener('click', (e) => {
                // Small delay to let check state update
                setTimeout(() => {
                    const checkbox = label.querySelector('input');
                    if (checkbox.checked) {
                        label.classList.add('checked');
                    } else {
                        label.classList.remove('checked');
                    }
                    
                    // Handle "Other" visibility
                    if (opt.id === 'other') {
                        toggleOtherInput(checkbox.checked);
                    }
                }, 0);
            });
        });
    }

    // Toggle Other Input
    const otherWrapper = document.getElementById('other-task-wrapper');
    function toggleOtherInput(show) {
        if (show) {
            otherWrapper.classList.remove('hidden');
        } else {
            otherWrapper.classList.add('hidden');
        }
    }

    // --- 2. MULTI-STEP NAVIGATION ---
    let currentStep = 1;
    const totalSteps = 4;
    
    // Force show first step on load
    setTimeout(() => updateProgress(1), 100);
    
    const sections = {
        1: document.getElementById('section-1'),
        2: document.getElementById('section-2'),
        3: document.getElementById('section-3'),
        4: document.getElementById('section-4')
    };
    
    const progressFill = document.getElementById('progress-fill');
    const stepIndicators = document.querySelectorAll('.steps-indicator .step');

    function updateProgress(step) {
        // Update Bar
        const percentage = (step / totalSteps) * 100;
        progressFill.style.width = `${percentage}%`;
        
        // Update Indicators
        stepIndicators.forEach(ind => {
            if (parseInt(ind.dataset.step) <= step) {
                ind.classList.add('active');
            } else {
                ind.classList.remove('active');
            }
        });
        
        // Show/Hide Sections
        Object.values(sections).forEach(sec => sec.classList.remove('active'));
        sections[step].classList.add('active');
        
        // Scroll to top of form
        document.querySelector('.form-header').scrollIntoView({ behavior: 'smooth' });
    }

    // Next Buttons
    document.querySelectorAll('.next-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                currentStep++;
                updateProgress(currentStep);
            }
        });
    });

    // Back Buttons
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentStep--;
            updateProgress(currentStep);
        });
    });

    // --- 3. VALIDATION ---
    function validateStep(step) {
        let isValid = true;
        const currentSection = sections[step];
        
        // Clear previous errors
        currentSection.querySelectorAll('.error-msg').forEach(e => e.remove());
        currentSection.querySelectorAll('.error').forEach(e => e.classList.remove('error'));

        if (step === 1) {
            // Check Property Type
            const propType = currentSection.querySelector('input[name="propertyType"]:checked');
            if (!propType) {
                showError(currentSection.querySelector('.radio-group-cards'), "Please select a property type.");
                isValid = false;
            }
        }
        
        if (step === 2) {
            // Check at least one task selected
            const tasks = currentSection.querySelectorAll('input[name="task"]:checked');
            if (tasks.length === 0) {
                showError(currentSection.querySelector('.checkbox-group'), "Please select at least one issue.");
                isValid = false;
            }
        }
        
        if (step === 3) {
            // Address
            const address = currentSection.querySelector('input[name="address"]');
            if (!address.value.trim()) {
                showError(address, "Please enter the location.");
                isValid = false;
            }
            // Date
            const date = currentSection.querySelector('input[name="preferredDate"]');
            if (!date.value) {
                showError(date, "Please select a preferred date.");
                isValid = false;
            }
            // Time
            const time = currentSection.querySelector('select[name="preferredTime"]');
            if (!time.value) {
                showError(time.parentElement, "Please select a time slot.");
                isValid = false;
            }
        }

        // Step 4 is validated on submit only
        
        return isValid;
    }

    function showError(element, message) {
        element.classList.add('error');
        // Create error message element if simpler alert isn't used
        const msg = document.createElement('div');
        msg.className = 'error-msg';
        msg.innerText = message;
        element.parentElement.appendChild(msg);
    }
    
    // --- 4. FORM SUBMISSION ---
    const form = document.getElementById('service-request-form');
    const submitBtn = document.querySelector('.submit-btn');
    const formError = document.getElementById('form-error-message');
    const successState = document.getElementById('success-state');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate Final Step
        let isValid = true;
        
        // Name
        const name = form.querySelector('input[name="fullName"]');
        if (!name.value.trim()) { showError(name, "Please enter your name."); isValid = false; }
        
        // Phone
        const phone = form.querySelector('input[name="phone"]');
        if (!phone.value.trim() || phone.value.length < 10) { showError(phone.parentElement, "Please enter a valid 10-digit number."); isValid = false; }
        
        // Agreements
        const agreements = ['confirmDetails', 'understandPricing', 'agreeTerms'];
        agreements.forEach(name => {
            const el = form.querySelector(`input[name="${name}"]`);
            if (!el.checked) {
                el.parentElement.style.color = 'var(--error-color)';
                isValid = false;
            } else {
                el.parentElement.style.color = '';
            }
        });

        if (!isValid) return;

        // Proceed to Submit
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'Submitting...';
        submitBtn.querySelector('.btn-loader').classList.remove('hidden');
        
        // Collect Data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.serviceType = serviceType;
        data.tasks = Array.from(document.querySelectorAll('input[name="task"]:checked')).map(cb => cb.value);

        console.log("Submitting Data:", data);

        // Simulate API Call
        setTimeout(() => {
            // Success
            form.style.display = 'none'; // Hide form text
            // Or rather, hide just the form content wrapper if we want to keep header? 
            // The logic says hide form, show success state.
            
            // Actually, let's hide the form sections and show success.
            sections[4].style.display = 'none';
            document.querySelector('.progress-container').style.display = 'none';
            
            successState.classList.remove('hidden');
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });

        }, 1500);
    });
    
    // Set Min Date to Today
    const dateInput = document.getElementById('date-picker');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // --- LANGUAGE LOGIC (Replicated from main.js for persistence) ---
    // import { translations } from './translations.js'; // Moved to top
    
    // 1. Language Switcher Logic
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
                    element.innerHTML = translations[key][lang]; // innerHTML allows HTML in translation (like spans)
                }
            }
        });
        
        // RE-RENDER DYNAMIC OPTIONS
        renderOptions(lang);

        // Update html lang attribute
        document.documentElement.lang = lang;

        // Update Button Text
        if (langCurrent) langCurrent.textContent = lang.toUpperCase();

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

    // --- THEME TOGGLE LOGIC (Replicated from main.js) ---
    const themeToggle = document.querySelector('.theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    // Check local storage or preference
    const savedTheme = localStorage.getItem('node-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeIcon(true);
    } else {
        updateThemeIcon(false); // Ensure correct icon on load
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
            if(sunIcon) sunIcon.style.display = 'none';
            if(moonIcon) moonIcon.style.display = 'block';
        } else {
            if(sunIcon) sunIcon.style.display = 'block';
            if(moonIcon) moonIcon.style.display = 'none';
        }
    }

});
