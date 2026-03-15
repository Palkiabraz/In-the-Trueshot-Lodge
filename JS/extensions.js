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
});
