function renderNavbar() {
    const navbar = document.getElementById('main-header');
    if (!navbar) return;

    navbar.innerHTML = `
        <nav class="navbar">
            <div class="nav-brand">
                <a href="../index.html">GAME<span>VERSE</span></a>
            </div>
            <ul class="nav-links">
                <li><a href="../index.html" class="active">Home</a></li>
                <li><a href="#">Categories</a></li>
                <li><a href="#">Leaderboard</a></li>
            </ul>
            <div class="nav-profile">
                <button id="toggle-sidebar" class="hover-glow" style="color: var(--primary-color); padding: 8px 15px; border: 1px solid var(--primary-color); border-radius: 5px;">☰ Menu</button>
            </div>
        </nav>
    `;

    document.getElementById('toggle-sidebar')?.addEventListener('click', () => {
        document.getElementById('main-sidebar')?.classList.toggle('open');
    });
}
