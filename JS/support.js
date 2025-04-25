window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const nombre = params.get("nombre");
  if (nombre) {
    const mensaje = document.getElementById("mensaje-cliente");
    mensaje.textContent = `Bienvenido ${nombre} a tu servicio de mantenimiento.`;
  }
});

document.getElementById('ingresar-btn').addEventListener('click', function(event) {
  document.getElementById("ocultar").style.display = "none";
  const nombre = document.getElementById('cliente-nombre').value.trim();
  const mensaje = document.getElementById('mensaje-cliente');
  const contenedor = document.getElementById('timeline-container');

  if (nombre !== "") {
    mensaje.textContent = `Bienvenido ${nombre} a tu servicio de mantenimiento`;
    contenedor.classList.remove('hidden');
    document.getElementById('form-etapa1').classList.remove('hidden');
  } else {
    alert('Por favor ingresa tu nombre.');
  }
});


document.getElementById('descargar-pdf').addEventListener('click', () => {
  const element = document.getElementById('formulario-equipo');

  const opt = {
    margin: 0.5,
    filename: 'hoja-de-vida-dispositivo.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
});



document.getElementById("descargar-pdf").addEventListener("click", async function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Obtener los valores del formulario
  const nombrePersona = document.getElementById("nombre-persona").value;
  const documento = document.getElementById("documento").value;
  const tipoDispositivo = document.getElementById("tipo-dispositivo").value;
  const nombreEquipo = document.getElementById("nombre-equipo").value;
  const marca = document.getElementById("marca").value;
  const serial = document.getElementById("serial").value;
  const estado = document.getElementById("estado").value;
  const diagnostico = document.getElementById("diagnostico").value;
  const autorizo = document.getElementById("autorizo-datos").checked ? "Sí" : "No";
  const procedimiento = document.getElementById("acepto-procedimiento").checked ? "Sí" : "No";
  const foto = document.getElementById("foto").files[0];

  // Encabezado
  doc.setFontSize(16);
  doc.text("Hoja de Vida del Dispositivo", 20, 20);

  // Tabla de datos
  doc.autoTable({
    startY: 30,
    head: [["Campo", "Valor"]],
    body: [
      ["Nombre del cliente", nombrePersona],
      ["Documento", documento],
      ["Tipo de dispositivo", tipoDispositivo],
      ["Nombre del equipo", nombreEquipo],
      ["Marca", marca],
      ["Serial", serial],
      ["Estado", estado],
      ["Primer diagnóstico", diagnostico],
      ["Autorización de datos", autorizo],
      ["Conformidad con procedimiento", procedimiento],
    ],
    styles: { fontSize: 10 }
  });

  // Si hay una imagen, la agregamos
  if (foto) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imgData = e.target.result;
      doc.addPage();
      doc.setFontSize(14);
      doc.text("Registro Fotográfico", 20, 20);
      doc.addImage(imgData, "JPEG", 20, 30, 160, 120); // Ajusta tamaño si hace falta
      doc.save("hoja-de-vida.pdf");
    };
    reader.readAsDataURL(foto);
  } else {
    doc.save("hoja-de-vida.pdf");
  }
});