const FORM_ID = "1FAIpQLSdXwcM8cOims2vNHzXqNmp7PqinrsjK9PZX37VNZY0EGYtTOg";
const NOM = "entry.2005620554";
const MAIL = "entry.120579310";
const MESSAGE = "entry.908947694";

function submitForm() {
    const nom = document.getElementById("name").value;
    const mail = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    const url = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse?${NOM}=${encodeURIComponent(nom)}&${MAIL}=${encodeURIComponent(mail)}&${MESSAGE}=${encodeURIComponent(message)}`;

    fetch(url, {
        method: "POST",
        mode: "no-cors"
    }).then(() => {
        document.getElementById("contact").reset();
    }).catch(() => {
        console.error("Erreur lors de l'envoi du formulaire.");
    });
};
    
document.addEventListener('DOMContentLoaded', function(){
	var btn = document.getElementById('contact-btn');
	var box = document.getElementById('contact');
	setTimeout(function(){
		btn.classList.add('show');
		setTimeout(function(){
			btn.style.transform = 'scale(1)';
			box.classList.add('visible');
			box.setAttribute('aria-hidden','false');
		}, 420);
	}, 200);

	btn.addEventListener('click', function(){
		if(box.classList.contains('visible')){
			box.classList.remove('visible');
			box.setAttribute('aria-hidden','true');
		}else{
			box.classList.add('visible');
			box.setAttribute('aria-hidden','false');
		}
	});
})