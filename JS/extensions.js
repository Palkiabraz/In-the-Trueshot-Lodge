document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('extensions-btn');
    const dropdown = document.getElementById('extensions-dropdown');

    if (!btn || !dropdown) return;

    btn.addEventListener('click', function (e) {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        dropdown.classList.toggle('open', !expanded);
    });

    // Support souris 
    document.addEventListener('click', function (e) {
        const target = e.target;
        if (!btn.contains(target) && !dropdown.contains(target)) {
            btn.setAttribute('aria-expanded', 'false');
            dropdown.classList.remove('open');
        }
    });

    // Support clavier
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            btn.setAttribute('aria-expanded', 'false');
            dropdown.classList.remove('open');
        }
    });
    
    // Applique une grille classiquesi le nombre d'images n'est pas égal à 1 modulo 3
    function updateClassicGrid() {
        const cols = document.querySelectorAll('.emineure-column, .emajeure-column');
        cols.forEach(container => {
            const count = Array.from(container.children).filter(c => c.nodeType === 1).length;
            if (count % 3 !== 1) {
                container.classList.add('classic-grid');
            } else {
                container.classList.remove('classic-grid');
            }
        });
    }

    updateClassicGrid();

    const observer = new MutationObserver(updateClassicGrid);
    document.querySelectorAll('.emineure-column, .emajeure-column').forEach(c => {
        observer.observe(c, { childList: true });
    });
});
