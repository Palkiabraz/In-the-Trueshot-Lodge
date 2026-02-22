// Variable globale indiquant si un son est en cours de lecture
let soundPlaying = false;

// IIFE pour configurer le comportement sur le lien du logo
(function(){
    const link = document.querySelector('.logo-index-link');
    const img = document.querySelector('.logo-index');
    const audio = document.getElementById('quete-son');
    // Si un des éléments manquent, on ne fait rien
    if (!link || !audio || !img) return;

    // Au clic sur le lien : empêcher la navigation immédiate, jouer l'audio,
    // puis rediriger lorsque l'audio est terminé (ou en cas d'erreur/time-out)
    link.addEventListener('click', function(e){
        e.preventDefault();
        if (soundPlaying) return; // empêche double clic
        const href = link.getAttribute('href');
        audio.currentTime = 0; // revenir au début du son
        img.classList.add('playing'); // ajouter classe visuelle
        const p = audio.play(); // tentative de lecture (retourne promesse dans certains navigateurs)

        // Quand l'audio se termine : retirer la classe et marquer fini
        audio.addEventListener('ended', function onEnd(){
            img.classList.remove('playing');
            soundPlaying = false;
        }, { once: true });

        soundPlaying = true;
        // si la promesse de play rejette (autoplay bloqué), on redirige immédiatement
        if (p !== undefined) {
            p.catch(() => { img.classList.remove('playing'); window.location.href = href; });
        }

        // Aussi, lorsqu'il se termine, on redirige vers la cible
        audio.addEventListener('ended', function onEnd(){
            img.classList.remove('playing');
            window.location.href = href;
        }, { once: true });

        // Sécurité : après ~2s, forcer la redirection si elle n'a pas eu lieu
        setTimeout(() => { img.classList.remove('playing'); if (document.location.href !== href) window.location.href = href; }, 2012);
    });
})();