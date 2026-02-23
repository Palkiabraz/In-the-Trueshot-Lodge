(function(){
	var btn = document.getElementById('flag-btn');
	if(!btn) return;
	var url = btn.getAttribute('data-url') || btn.dataset.url || btn.href;
	function navigate(e){
		if(e && e.preventDefault) e.preventDefault();
		if(!url) return;
		try { location.replace(url); } catch(err) { window.location = url; }
	}
	btn.addEventListener('click', navigate);
	btn.addEventListener('keydown', function(e){ if(e.key === 'Enter') navigate(e); });
})();