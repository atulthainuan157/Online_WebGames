// ===== Navbar scroll effect =====
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

// ===== Fade-in animation on scroll =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.game-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(card);
});
