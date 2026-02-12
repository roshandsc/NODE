
// Mock API Data for Service Options
const SERVICE_OPTIONS = {
    'plumbing': [
        { id: 'leak', label: 'Leak Repair' },
        { id: 'tap', label: 'Tap / Pipe Replacement' },
        { id: 'blockage', label: 'Drain Blockage' },
        { id: 'fittings', label: 'Bathroom Fittings' },
        { id: 'other', label: 'Other Issue' }
    ],
    'electrical': [
        { id: 'wiring', label: 'Wiring Check / Repair' },
        { id: 'switch', label: 'Switch / Socket Replacement' },
        { id: 'appliance', label: 'Appliance Installation' },
        { id: 'fan', label: 'Fan Repair' },
        { id: 'other', label: 'Other Issue' }
    ],
    'repairs': [
        { id: 'furniture', label: 'Furniture Assembly' },
        { id: 'door', label: 'Door / Lock Repair' },
        { id: 'wall', label: 'Wall Drilling / Mounting' },
        { id: 'other', label: 'General Handyman' }
    ],
    'construction': [
        { id: 'tiling', label: 'Tile Replacement' },
        { id: 'painting', label: 'Touch-up Painting' },
        { id: 'plaster', label: 'Plaster Repair' }
    ],
    'cleaning': [
        { id: 'deep_clean', label: 'Deep Home Cleaning' },
        { id: 'kitchen', label: 'Kitchen Deep Clean' },
        { id: 'bathroom', label: 'Bathroom Cleaning' },
        { id: 'sofa', label: 'Sofa / Carpet Cleaning' }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    
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
    const options = SERVICE_OPTIONS[serviceType] || SERVICE_OPTIONS['plumbing']; // Fallback
    
    options.forEach(opt => {
        const label = document.createElement('label');
        label.className = 'checkbox-item';
        label.innerHTML = `
            <input type="checkbox" name="task" value="${opt.id}">
            <span>${opt.label}</span>
        `;
        dynamicTasksContainer.appendChild(label);
        
        // Add click listener for styling
        label.addEventListener('click', (e) => {
            // e.stopPropagation(); // Don't stop propagation, let input handle it
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

});
