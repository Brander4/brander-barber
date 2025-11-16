// ==============================
// SISTEMA DE CITAS BRANDER BARBER (VERSIÓN PRO)
// ==============================

// Cargar citas guardadas
let citas = JSON.parse(localStorage.getItem("citas")) || [];

// Elementos del DOM
const form = document.getElementById("formCita");
const listaCitas = document.getElementById("listaCitas");
const mensaje = document.getElementById("mensaje");

// Cargar citas al iniciar
mostrarCitas();

// ==========================================
// 1) VALIDAR HORARIOS PERMITIDOS (8 AM – 8 PM)
// ==========================================
function horarioValido(hora) {
    const [h] = hora.split(":").map(Number);
    return h >= 8 && h <= 20;
}

// ==========================================
// 2) EVITAR HORAS OCUPADAS
// ==========================================
function horaOcupada(fecha, hora) {
    return citas.some(c => c.fecha === fecha && c.hora === hora);
}

// ==========================================
// 3) Registrar nueva cita PRO
// ==========================================
form.addEventListener("submit", (e) => {
    e.preventDefault();

    let nombre = document.getElementById("nombre").value;
    let fecha = document.getElementById("fecha").value;
    let hora = document.getElementById("hora").value;
    let servicio = document.getElementById("servicio").value;

    // Validar horario permitido
    if (!horarioValido(hora)) {
        mensaje.textContent = "❌ El horario permitido es de 8:00 AM a 8:00 PM";
        mensaje.style.color = "red";
        return;
    }

    // Validar hora ocupada
    if (horaOcupada(fecha, hora)) {
        mensaje.textContent = "❌ Ya existe una cita reservada para esa hora";
        mensaje.style.color = "red";
        return;
    }

    // Crear cita
    let cita = {
        id: Date.now(),
        nombre,
        fecha,
        hora,
        servicio
    };

    citas.push(cita);
    localStorage.setItem("citas", JSON.stringify(citas));

    mensaje.textContent = "✅ ¡Cita reservada correctamente!";
    mensaje.style.color = "green";

    mostrarCitas();
    enviarWhatsAppCliente(cita);
    enviarWhatsAppBarbero(cita);
    form.reset();
});

// ==========================================
// 4) Mostrar citas + botón eliminar
// ==========================================
function mostrarCitas() {
    listaCitas.innerHTML = "";

    citas.forEach(c => {
        let li = document.createElement("li");
        li.innerHTML = `
            <strong>${c.nombre}</strong><br>
            📅 ${c.fecha} — ⏰ ${c.hora}<br>
            💈 ${c.servicio}<br>
            <button onclick="eliminarCita(${c.id})" class="btn-eliminar">Eliminar</button>
        `;
        listaCitas.appendChild(li);
    });
}

// ==========================================
// 5) Eliminar cita
// ==========================================
function eliminarCita(id) {
    citas = citas.filter(c => c.id !== id);
    localStorage.setItem("citas", JSON.stringify(citas));
    mostrarCitas();
}

// ==========================================
// 6) CONFIRMACIÓN AUTOMÁTICA AL CLIENTE (WhatsApp)
// ==========================================
function enviarWhatsAppCliente(cita) {
    let texto = `Tu cita en *Brander Barber* está confirmada:%0A%0A` +
                `👤 Nombre: ${cita.nombre}%0A` +
                `📅 Fecha: ${cita.fecha}%0A` +
                `⏰ Hora: ${cita.hora}%0A` +
                `💈 Servicio: ${cita.servicio}%0A%0A¡Te esperamos!`;

    window.open(`https://wa.me/?text=${texto}`, "_blank");
}

// ==========================================
// 7) Enviar cita al barbero
// ==========================================
function enviarWhatsAppBarbero(cita) {
    let texto = `Nueva cita registrada:%0A` +
                `👤 ${cita.nombre}%0A` +
                `📅 ${cita.fecha}%0A` +
                `⏰ ${cita.hora}%0A` +
                `💈 ${cita.servicio}`;

    window.open(`https://wa.me/8293320367?text=${texto}`, "_blank");
}

// ==========================================
// 8) ANIMACIONES SUAVES
// ==========================================
window.addEventListener("scroll", () => {
    document.querySelectorAll('.contenedor, .card').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 50) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }
    });
});