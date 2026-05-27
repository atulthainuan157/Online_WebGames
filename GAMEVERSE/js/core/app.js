document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    if (typeof renderNavbar === 'function') renderNavbar();
    if (typeof renderSidebar === 'function') renderSidebar();
});
