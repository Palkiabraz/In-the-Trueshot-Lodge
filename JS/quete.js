(function () {
    const link = document.querySelector('.logo-index-link');
    const img = document.querySelector('.logo-index');
    const audio = document.getElementById('quete-son');
    const fallbackDelaySeconds = 3;

    if (!link || !img || !audio) return;

    let hasStarted = false;
    let hasRedirected = false;
    let redirectTimer = null;

    const redirectToTarget = () => {
        if (hasRedirected) return;

        const href = link.getAttribute('href');

        if (href) {
            hasRedirected = true;
            window.location.href = href;
        }
    };

    link.addEventListener('click', (event) => {
        event.preventDefault();

        if (hasStarted) return;
        hasStarted = true;

        img.classList.add('playing');
        audio.currentTime = 0;

        let hasFinished = false;

        const finish = () => {
            if (hasFinished) return;

            hasFinished = true;
            clearTimeout(redirectTimer);
            audio.removeEventListener('ended', finish);
            img.classList.remove('playing');
            redirectToTarget();
        };

        audio.addEventListener('ended', finish, { once: true });
        redirectTimer = window.setTimeout(finish, fallbackDelaySeconds * 1000);

        try {
            const playPromise = audio.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch((error) => {
                    console.warn('La lecture du son a échoué ; la redirection attendra le délai de secours.', error);
                });
            }
        } catch (error) {
            console.warn('La lecture du son a échoué ; la redirection attendra le délai de secours.', error);
        }
    });
})();