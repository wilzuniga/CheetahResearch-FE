let imgPP ;


function loadInterviewer(){
    
        const nombre = 'Socrates';
        const imagen = 'assets/img/Socrates.jpg';
        const interviewerGreeting = `Saludos, buscador de verdades. Soy Sócrates, tu guía en este viaje hacia el conocimiento. A través del arte de la dialéctica, juntos desentrañaremos los misterios ocultos en los datos que nos rodean, pues es por medio del diálogo y la reflexión profunda que alcanzamos la verdadera sabiduría. Pregunta sin temor, y hallaremos respuestas que iluminen el camino hacia la comprensión.`;



        const formContainerI = document.getElementById('overlay');



        document.getElementById('Bot-Name').innerText = nombre; 
        const formContainer = document.createElement('div');



        formContainer.innerHTML = `
        <div id="overlayContent" class="text-wrap">
            <img src="${imagen}" alt="Imagen del encuestador" style="width: 100px; height: 100px; border-radius: 50%;">
            <p id="greeting">
            ${interviewerGreeting}
            </p>
            <button id="AceptarChat" class="btn btn-primary" style="margin: 10px 10px 0 0;">Iniciar</button>
        </div>
        `;

        imgPP = imagen;
        



        

        document.getElementById('overlay').innerHTML = formContainer.innerHTML;

        document.getElementById('AceptarChat').addEventListener('click', (event) => {
            event.preventDefault();
            document.getElementById('overlay').style.display = 'none';
            load();
        });

}