// Obtener puntos acumulados o arrancar en 0
let puntos = parseInt(localStorage.getItem('puntosArcade')) || 0;

// BANCO DE PREGUNTAS DIARIAS
const bancoPreguntas = [
    {
        pregunta: "¿Dónde fue nuestra primera cita?",
        opciones: ["En el cine", "En la Usina", "En una cafeteria", "En la empa", "En tu casa"],
        correcta: 1,
        puntos: 5
    },
    {
        pregunta: "¿Cuál es mi comida ideal para el dolor de huevos?",
        opciones: ["Pizza", "Helado", "Empanadas", "Chocolates", "Sushi"],
        correcta: 3,
        puntos: 5
    },
    {
        pregunta: "¿Qué día cumplimos año?",
        opciones: ["12 de Marzo", "15 de Enero", "09 de Octubre", "15 de Noviembre", "30 de Marzo"],
        correcta: 3,
        puntos: 5
    },
    {
        pregunta: "¿Cual es mi color favorito?",
        opciones: ["Rosa", "Negro", "Bordo", "Celeste", "Blanco"],
        correcta: 2,
        puntos: 5
    },
    {
        pregunta: "¿Cual es mi cafe favorito?",
        opciones: ["Latte", "Chipchillapuccino", "Mocha", "Americano", "chillapuccino"],
        correcta: 1,
        puntos: 5
    }
];

// Inicializar la interfaz al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    actualizarPuntos();

    // Eventos de botones principales
    document.getElementById('enterButton').addEventListener('click', () => irA('pantalla-juegos'));
    document.getElementById('quizButton').addEventListener('click', () => {
        cargarQuizDiario();
        irA('pantalla-quiz');
    });
    document.getElementById('marketButton').addEventListener('click', () => irA('pantalla-market'));
});

// Cambiar de pantalla
function irA(idPantalla) {
    document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activa'));
    document.getElementById(idPantalla).classList.add('activa');
}

// Actualizar contadores en todas las pantallas
function actualizarPuntos() {
    document.getElementById('puntos-juegos').textContent = puntos;
    document.getElementById('puntos-quiz').textContent = puntos;
    document.getElementById('puntos-market').textContent = puntos;
}

// Otorgar puntos con cooldown
function sumarPuntosConTiempo(cantidad, nombreJuego) {
    const claveJuego = 'ultimoJuego_' + nombreJuego;
    const ultimoAcceso = localStorage.getItem(claveJuego);
    const ahora = new Date().getTime();
    
    // Tiempo de espera de 5 horas
    const tiempoEspera = 5 * 60 * 60 * 1000; 

    if (ultimoAcceso && (ahora - ultimoAcceso < tiempoEspera)) {
        const minutosRestantes = Math.ceil((tiempoEspera - (ahora - ultimoAcceso)) / (1000 * 60));
        alert(`Espera ${minutosRestantes} minutos para volver a ganar puntos en ${nombreJuego}. ¡No me quieras robar! 😡`);
    } else {
        puntos += cantidad;
        localStorage.setItem('puntosArcade', puntos);
        localStorage.setItem(claveJuego, ahora);
        actualizarPuntos();
        alert(`¡Sumaste +${cantidad} puntos en ${nombreJuego}! ⭐`);
    }
}

// Lógica del Quiz Diario
function cargarQuizDiario() {
    const hoyStr = new Date().toDateString();
    const contestadoHoy = localStorage.getItem('quiz_fecha_' + hoyStr);
    const contenedor = document.getElementById('contenedor-quiz');
    
    if (contestadoHoy) {
        contenedor.innerHTML = `
            <p class="texto-pregunta">✨ ¡Ya respondiste la pregunta de hoy! ✨</p>
            <p style="color: #8c7391; font-weight: 600;">Volvé mañana para ganar más puntos</p>
        `;
        return;
    }

    const inicioAño = new Date(new Date().getFullYear(), 0, 0);
    const dif = new Date() - inicioAño;
    const diaDelAño = Math.floor(dif / (1000 * 60 * 60 * 24));
    
    const quizActual = bancoPreguntas[diaDelAño % bancoPreguntas.length];

    document.getElementById('texto-pregunta').textContent = quizActual.pregunta;
    
    const containerOpciones = document.getElementById('opciones-container');
    containerOpciones.innerHTML = "";

    quizActual.opciones.forEach((opcion, index) => {
        const btn = document.createElement('button');
        btn.className = 'btn-opcion';
        btn.textContent = opcion;
        btn.onclick = () => responder(index, quizActual.correcta, quizActual.puntos, hoyStr);
        containerOpciones.appendChild(btn);
    });
}

function responder(indiceElegido, indiceCorrecto, puntosRecompensa, fechaHoy) {
    if (indiceElegido === indiceCorrecto) {
        puntos += puntosRecompensa;
        localStorage.setItem('puntosArcade', puntos);
        localStorage.setItem('quiz_fecha_' + fechaHoy, 'true');
        actualizarPuntos();
        alert(`🎉 ¡CORRECTO! Sumaste +${puntosRecompensa} puntos`);
        cargarQuizDiario();
    } else {
        alert("❌ ¡Respuesta incorrecta!");
    }
}

// Canjear en el Market
function canjearCita(costo, nombreCita) {
    if (puntos >= costo) {
        puntos -= costo;
        localStorage.setItem('puntosArcade', puntos);
        actualizarPuntos();
        alert(`🎉 ¡Canjeaste: "${nombreCita}"! Mandame foto de esta noti lindo 🫦`);
    } else {
        alert(`Te faltan ${costo - puntos} puntos neneee 😢`);
    }
}
