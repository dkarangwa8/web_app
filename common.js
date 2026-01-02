// Common JavaScript functions for all pages

// Get base URL for navigation
function getBaseUrl() {
    return window.location.href.split('?')[0];
}

// Navigate to a page
function navigateTo(pageName) {
    window.location.href = getBaseUrl() + '?page=' + pageName;
}

// Logout function
function logout() {
    sessionStorage.clear();
    localStorage.clear();
    navigateTo('login');
}

// Check authentication
function checkAuth() {
    const user = sessionStorage.getItem('user') || localStorage.getItem('user');
    if (!user) {
        navigateTo('login');
        return null;
    }
    return JSON.parse(user);
}

// Update all navigation links on page load
function initializeNavigation() {
    const baseUrl = getBaseUrl();
    const links = document.querySelectorAll('.navbar-link');

    links.forEach(link => {
        const href = link.getAttribute('href');

        // Skip logout link
        if (href === '#' || href.includes('logout')) {
            return;
        }

        // Convert .html links to use page parameter
        if (href && href.endsWith('.html')) {
            const pageName = href.replace('.html', '');
            link.setAttribute('href', baseUrl + '?page=' + pageName);
        }
    });
}

// Initialize on page load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', initializeNavigation);
}
