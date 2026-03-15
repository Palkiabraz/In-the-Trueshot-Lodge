// Indique si un son est en cours de lecture
let soundPlaying = false;

(function(){
    const link = document.querySelector('.logo-index-link');
    const img = document.querySelector('.logo-index');
    const audio = document.getElementById('quete-son');

    if (!link || !audio || !img) return;

    // Joue le son au clic, puis redirige lorsque le son est terminé
    link.addEventListener('click', function(e){
        e.preventDefault();
        if (soundPlaying) return; 
        const href = link.getAttribute('href');
        audio.currentTime = 0; 
        img.classList.add('playing'); 
        const p = audio.play(); 

        audio.addEventListener('ended', function onEnd(){
            img.classList.remove('playing');
            soundPlaying = false;
        }, { once: true });

        // Si le son bug, redirige 
        soundPlaying = true;
        if (p !== undefined) {
            p.catch(() => { img.classList.remove('playing'); window.location.href = href; });
        }

        // Si le son se termine, redirige 
        audio.addEventListener('ended', function onEnd(){
            img.classList.remove('playing');
            window.location.href = href;
        }, { once: true });
        
        setTimeout(() => { img.classList.remove('playing'); if (document.location.href !== href) window.location.href = href; }, 2012);
    });
})();