(function () {
    const link = document.querySelector('.logo-index-link');
    const img = document.querySelector('.logo-index');
    const audio = document.getElementById('quete-son');

    if (!link || !img || !audio) return;

    let isRedirecting = false;
    let redirectTimer = null;

    const redirectToTarget = () => {
        if (isRedirecting) return;

        isRedirecting = true;
        const href = link.getAttribute('href');

        if (href) {
            window.location.href = href;
        }
    };

    link.addEventListener('click', (event) => {
        event.preventDefault();

        if (isRedirecting) return;

        img.classList.add('playing');
        audio.currentTime = 0;

        const playPromise = audio.play();

        const finish = () => {
            clearTimeout(redirectTimer);
            img.classList.remove('playing');
            redirectToTarget();
        };

        audio.addEventListener('ended', finish, { once: true });

        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {
                finish();
            });
        }

        redirectTimer = window.setTimeout(() => {
            finish();
        }, 2200);
    });
})();