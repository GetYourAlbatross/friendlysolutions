/**
 * CloudSync Solutions - Salesforce Partner Website
 * Main JavaScript File
 * Version: 1.0.0
 */

// ==========================================
// PAGE NAVIGATION
// ==========================================

/**
 * Show specific page and hide others
 * @param {string} pageName - The ID of the page to display
 */
function showPage(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageName).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// FORM SUBMISSION HANDLER
// ==========================================

/**
 * Handle contact form submission
 * @param {Event} event - Form submit event
 */
function handleSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        company: document.getElementById('company').value,
        industry: document.getElementById('industry').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };

    // Validate form
    if (!validateForm(formData)) {
        return;
    }

    // Disable submit button and show loading state
    const submitBtn = event.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    submitBtn.style.opacity = '0.6';

    // Simulate API call (replace with actual endpoint)
    setTimeout(() => {
        // PRODUCTION: Replace this with actual API call
        // Example:
        // fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 
        //         'Content-Type': 'application/json',
        //         'Authorization': 'Bearer YOUR_TOKEN'
        //     },
        //     body: JSON.stringify(formData)
        // })
        // .then(response => {
        //     if (!response.ok) throw new Error('Network response was not ok');
        //     return response.json();
        // })
        // .then(data => {
        //     showSuccessMessage(formData.firstName);
        //     event.target.reset();
        //     // Optional: Send to CRM or email service
        //     sendToSalesforce(formData);
        // })
        // .catch(error => {
        //     console.error('Error:', error);
        //     showErrorMessage('Something went wrong. Please try again later.');
        // })
        // .finally(() => {
        //     submitBtn.disabled = false;
        //     submitBtn.textContent = originalText;
        //     submitBtn.style.opacity = '1';
        // });

        // Store submission in localStorage for demo
        storeSubmission(formData);
        
        // Show success message
        showSuccessMessage(formData.firstName);
        
        // Reset form
        event.target.reset();
        
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.style.opacity = '1';

        // Log submission (for demo purposes)
        console.log('Form submitted:', formData);
    }, 1500);
}

// ==========================================
// FORM VALIDATION
// ==========================================

/**
 * Validate form data
 * @param {Object} data - Form data object
 * @returns {boolean} - Returns true if valid, false otherwise
 */
function validateForm(data) {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showErrorMessage('Please enter a valid email address.');
        return false;
    }

    // Phone validation (if provided)
    if (data.phone) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(data.phone) || data.phone.length < 10) {
            showErrorMessage('Please enter a valid phone number.');
            return false;
        }
    }

    // Message length validation
    if (data.message.length < 10) {
        showErrorMessage('Please provide a more detailed message (at least 10 characters).');
        return false;
    }

    // Name validation
    if (data.firstName.length < 2 || data.lastName.length < 2) {
        showErrorMessage('Please enter your full name.');
        return false;
    }

    // Company validation
    if (data.company.length < 2) {
        showErrorMessage('Please enter a valid company name.');
        return false;
    }

    return true;
}

// ==========================================
// SUCCESS MESSAGE MODAL
// ==========================================

/**
 * Display success message after form submission
 * @param {string} firstName - User's first name for personalization
 */
function showSuccessMessage(firstName) {
    // Create success modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;

    modal.innerHTML = `
        <div style="
            background: white;
            padding: 3rem;
            border-radius: 15px;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: slideUp 0.4s ease;
        ">
            <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
            <h2 style="color: #0070d2; margin-bottom: 1rem; font-size: 2rem;">Thank You${firstName ? ', ' + firstName : ''}!</h2>
            <p style="color: #666; margin-bottom: 1.5rem; font-size: 1.1rem; line-height: 1.6;">
                Your message has been received. Our Salesforce experts will review your inquiry and contact you within 24 hours.
            </p>
            <p style="color: #999; font-size: 0.95rem; margin-bottom: 2rem;">
                Check your email for a confirmation message.
            </p>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: #0070d2;
                color: white;
                border: none;
                padding: 1rem 2.5rem;
                border-radius: 50px;
                font-size: 1.1rem;
                font-weight: bold;
                cursor: pointer;
                transition: transform 0.3s;
            " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                Close
            </button>
        </div>
    `;

    document.body.appendChild(modal);

    // Auto-close after 5 seconds
    setTimeout(() => {
        if (modal.parentElement) {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => modal.remove(), 300);
        }
    }, 5000);

    // Close on clicking background
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ==========================================
// ERROR MESSAGE NOTIFICATION
// ==========================================

/**
 * Display error notification
 * @param {string} message - Error message to display
 */
function showErrorMessage(message) {
    // Create error notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #ff4444;
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(255, 68, 68, 0.3);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.4s ease;
    `;

    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="font-size: 1.5rem;">⚠️</div>
            <div>
                <strong style="display: block; margin-bottom: 0.3rem;">Validation Error</strong>
                <span style="font-size: 0.95rem;">${message}</span>
            </div>
        </div>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

// ==========================================
// LOCAL STORAGE FUNCTIONS
// ==========================================

/**
 * Store form submission in localStorage (for demo purposes)
 * @param {Object} data - Form data to store
 */
function storeSubmission(data) {
    let submissions = [];
    try {
        const stored = localStorage.getItem('contactSubmissions');
        if (stored) {
            submissions = JSON.parse(stored);
        }
    } catch (e) {
        console.error('Error reading submissions:', e);
    }

    submissions.push(data);

    // Keep only last 50 submissions
    if (submissions.length > 50) {
        submissions = submissions.slice(-50);
    }

    try {
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
    } catch (e) {
        console.error('Error storing submission:', e);
    }
}

/**
 * View all stored submissions (for demo/admin purposes)
 * @returns {Array} - Array of submission objects
 */
function viewSubmissions() {
    try {
        const stored = localStorage.getItem('contactSubmissions');
        if (stored) {
            const submissions = JSON.parse(stored);
            console.table(submissions);
            return submissions;
        } else {
            console.log('No submissions found.');
            return [];
        }
    } catch (e) {
        console.error('Error viewing submissions:', e);
        return [];
    }
}

/**
 * Clear all stored submissions
 */
function clearSubmissions() {
    try {
        localStorage.removeItem('contactSubmissions');
        console.log('All submissions cleared.');
    } catch (e) {
        console.error('Error clearing submissions:', e);
    }
}

// ==========================================
// SALESFORCE INTEGRATION (Optional)
// ==========================================

/**
 * Send form data to Salesforce
 * Uncomment and configure when ready to integrate with Salesforce
 * @param {Object} formData - Form data to send to Salesforce
 */
function sendToSalesforce(formData) {
    // Example Salesforce Web-to-Lead integration
    // const salesforceData = {
    //     oid: 'YOUR_SALESFORCE_ORG_ID',
    //     first_name: formData.firstName,
    //     last_name: formData.lastName,
    //     email: formData.email,
    //     phone: formData.phone,
    //     company: formData.company,
    //     description: formData.message,
    //     lead_source: 'Website Contact Form',
    //     industry: formData.industry
    // };
    
    // fetch('https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8', {
    //     method: 'POST',
    //     body: new URLSearchParams(salesforceData)
    // })
    // .then(response => console.log('Sent to Salesforce:', response))
    // .catch(error => console.error('Salesforce error:', error));
}

// ==========================================
// CSS ANIMATIONS
// ==========================================

/**
 * Add CSS animations to the page
 */
function initializeAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideInRight {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================

/**
 * Initialize intersection observer for scroll animations
 */
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.service-card, .cert-badge, .industry-card, .cloud-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ==========================================
// ANALYTICS TRACKING (Optional)
// ==========================================

/**
 * Track page views (integrate with Google Analytics, etc.)
 * @param {string} pageName - Name of the page being viewed
 */
function trackPageView(pageName) {
    // Example Google Analytics tracking
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', 'page_view', {
    //         page_title: pageName,
    //         page_location: window.location.href,
    //         page_path: '/' + pageName
    //     });
    // }
    
    console.log('Page view:', pageName);
}

/**
 * Track form submission events
 * @param {Object} data - Form data
 */
function trackFormSubmission(data) {
    // Example Google Analytics event tracking
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', 'form_submission', {
    //         event_category: 'Contact',
    //         event_label: data.service || 'General Inquiry',
    //         value: 1
    //     });
    // }
    
    console.log('Form submission tracked:', data.service || 'General');
}

// ==========================================
// INITIALIZATION
// ==========================================

/**
 * Initialize all features when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    initializeAnimations();
    initializeScrollAnimations();
    
    // Console helper messages
    console.log('%c🚀 CloudSync Solutions - Developer Console', 'color: #0070d2; font-size: 16px; font-weight: bold;');
    console.log('%cAvailable functions:', 'color: #666; font-size: 12px;');
    console.log('%c- viewSubmissions() : View all form submissions', 'color: #666; font-size: 11px;');
    console.log('%c- clearSubmissions() : Clear all stored submissions', 'color: #666; font-size: 11px;');
    console.log('%c- showPage(pageName) : Navigate to a specific page', 'color: #666; font-size: 11px;');
});

// ==========================================
// EXPORT FOR MODULE USAGE (Optional)
// ==========================================

// If using as a module, export functions
// export { 
//     showPage, 
//     handleSubmit, 
//     viewSubmissions, 
//     clearSubmissions,
//     sendToSalesforce 
// };