const body = document.getElementById('body');

function showAlert() {
	//console.log(bha_type,hole_depth,mud_density,Wob,theta);
	let message = 'Por favor, ingrese todos los datos necesarios.';
	
	const message_container = document.createElement('div');
	message_container.setAttribute("class", "msg-container");
	message_container.innerHTML = `
		<p>${message}</p>
	`;


	body.appendChild(message_container);
	let y = window.scrollY;

	message_container.style.top = `calc(${y}px + 100vh/2 - 50px)`;
	message_container.style.left = `calc(50vw - 150px)`;

	setTimeout(()=>{
		body.removeChild(message_container);
	},3000);
}