(function(){
	const DAY = './Images/Fond_day.png';
	const NIGHT = './Images/Fond_night.png';
	const KEY = 'bg-mode';

	function applyMode(mode){
		const body = document.body;
		if(!body) return;
		if(mode === 'day') body.style.backgroundImage = `url('${DAY}')`;
		else if(mode === 'night') body.style.backgroundImage = `url('${NIGHT}')`;
		else body.style.backgroundImage = "url('./Images/Fond.jpg')";
	}

	// Applique le mode stocké
	function initDayNight(){
		const stored = localStorage.getItem(KEY) || 'default';
		applyMode(stored);

		// Support souris 
		document.addEventListener('click', function (e) {
			const btn = e.target.closest && e.target.closest('#bg-toggle');
			if (!btn) return;
			try { btn.tabIndex = btn.tabIndex || 0; btn.style.pointerEvents = 'auto'; } catch (err) {}
			const current = btn.dataset.mode === 'day' ? 'day' : (btn.dataset.mode === 'night' ? 'night' : stored);
			const next = current === 'day' ? 'night' : 'day';
			localStorage.setItem(KEY, next);
			btn.dataset.mode = next;
			applyMode(next);
		});

		// Support clavier
		document.addEventListener('keydown', function (e) {
			if (e.key !== 'Enter' && e.key !== ' ') return;
			const active = document.activeElement;
			if (!active || active.id !== 'bg-toggle') return;
			e.preventDefault();
			active.click();
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initDayNight);
	} else {
		initDayNight();
	}
})();
