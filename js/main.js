// Initialize fullPage.js
new fullpage('#fullpage', {
    navigation: true,
    sectionsColor: ['#f2f2f2', '#f2f2f2', '#f2f2f2', '#f2f2f2'],
    scrollingSpeed: 300,
});

// Dark mode toggle function
function toggleDarkMode() {
    const body = document.body;
    const darkModeBtn = document.getElementById('darkModeBtn');
    const accordion = document.querySelector('.accordion');
    const breadcrumbNav = document.querySelector('nav[aria-label="breadcrumb"]');
    
    body.classList.toggle('dark-mode');
    darkModeBtn.classList.toggle('active');
    
    // Update data-bs-theme attribute for accordion and breadcrumb
    if (accordion) accordion.setAttribute('data-bs-theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    if (breadcrumbNav) breadcrumbNav.setAttribute('data-bs-theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    
    // Update button icon
    const buttonIcon = body.classList.contains('dark-mode') ? 'fa-sun' : 'fa-moon';
    darkModeBtn.innerHTML = `<i class="fas ${buttonIcon}"></i>`;
    
    // Example Three.js update for dark mode (if applicable)
    if (typeof THREE !== 'undefined' && typeof line !== 'undefined') {
        const darkModeMaterial = new THREE.LineBasicMaterial({ color: body.classList.contains('dark-mode') ? 0xffffff : 0x000000 });
        line.material = darkModeMaterial;
    }
}

// Toggle content function
function toggleContent(showId, hideId) {
    event.preventDefault();
    const showContainer = document.getElementById(showId);
    const hideContainer = document.getElementById(hideId);
    hideContainer.classList.remove('visible');
    showContainer.classList.add('visible');
}

// Chrome-specific class addition
document.addEventListener('DOMContentLoaded', function() {
    if (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)) {
        document.querySelector(".blog-container").classList.add("chrome-specific");
    }
});

// Prevent scroll propagation for specific containers
const containers = ['.blog-container', '.projects-container', '.about-container'];
containers.forEach(container => {
    document.querySelector(container)?.addEventListener('wheel', event => event.stopPropagation());
});

// Dark mode button click event
document.getElementById('darkModeBtn').addEventListener('click', toggleDarkMode);

// Back to top functionality
window.onscroll = function() {
    const backToTopButton = document.getElementById("backToTop");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopButton.style.display = "block";
    } else {
        backToTopButton.style.display = "none";
    }
};

function scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('ServiceWorker registered'))
            .catch(err => console.log('ServiceWorker registration failed: ', err));
    });
}