function renderSidebar() {
    const sidebar = document.getElementById('main-sidebar');
    if (!sidebar) return;

    sidebar.className = 'sidebar'; // Starts closed
    sidebar.innerHTML = `
        <h3>Categories</h3>
        <ul class="sidebar-menu">
            <li><a href="#">🕹️ Arcade</a></li>
            <li><a href="#">🧩 Puzzle</a></li>
            <li><a href="#">⚔️ Action</a></li>
            <li><a href="#">🌐 Multiplayer</a></li>
            <li><a href="#">⚽ Sports</a></li>
            <li><a href="#">🎲 Board</a></li>
        </ul>
        <h3 style="margin-top: 30px;">User</h3>
        <ul class="sidebar-menu">
            <li><a href="#">👤 Profile</a></li>
            <li><a href="#">⚙️ Settings</a></li>
        </ul>
    `;
}
