/* ===================================================
   NAVBAR.JS — Scroll shadow & active link management
   =================================================== */

const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.borderBottomColor = 'rgba(124, 77, 255, 0.25)';
            navbar.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.borderBottomColor = 'rgba(124, 77, 255, 0.1)';
            navbar.style.boxShadow = 'none';
        }
    });
}
