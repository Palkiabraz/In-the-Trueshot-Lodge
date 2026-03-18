const FORM_ID = "1FAIpQLSdXwcM8cOims2vNHzXqNmp7PqinrsjK9PZX37VNZY0EGYtTOg";
const NOM = "entry.2005620554";
const MAIL = "entry.120579310";
const MESSAGE = "entry.908947694";
const audio = new Audio('../Sons/Envoi.mp3');


function submitForm() {
    const nom = document.getElementById("name").value;
    const mail = document.getElementById("email").value;
    const message = document.getElementById("message").value;
    const url = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse?${NOM}=${encodeURIComponent(nom)}&${MAIL}=${encodeURIComponent(mail)}&${MESSAGE}=${encodeURIComponent(message)}`;
	audio.play();

	const notifDiv = document.createElement('div');
	notifDiv.classList.add('notification');
	notifDiv.textContent = "Message sent !";
	notifDiv.style.position = 'fixed';
	notifDiv.style.bottom = '40px';
	notifDiv.style.right = '88px';
	document.body.appendChild(notifDiv);

	setTimeout(() => {
		notifDiv.classList.add('fade-out');
		notifDiv.addEventListener('transitionend', () => {
			notifDiv.remove();
		});
	}, 1500);

    fetch(url, {
        method: "POST",
        mode: "no-cors"
    }).then(() => {
        document.getElementById("contact").reset();
    }).catch(() => {
        console.error("Error submitting form.");
    });
};

// Ouvrir la boîte de contact
document.addEventListener('DOMContentLoaded', function(){
	var btn = document.getElementById('contact-btn');
	var box = document.getElementById('contact');
	btn.classList.add('show');
	btn.style.transform = 'scale(1)';

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