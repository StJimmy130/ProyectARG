window.onload = getInfo();

function getInfo() {
  let usuarioID = document.getElementById("UsuarioID").value;
  $.ajax({
    url: "../../Perfiles/GetInformacion",
    data: { usuarioID: usuarioID },
    type: "POST",
    dataType: "json",
    success: function (data) {


      $("#nombre").val(data.nombre);
      $("#phone").val(formatPhoneNumber(data.nroTelefono));
      $("#instagram").val(data.instagram);
      $("#facebook").val(data.facebook);
      $("#whatsapp").val(formatPhoneNumber(data.whatsapp));


    },
    error: function (xhr, status) {
      console.log("Disculpe, existió un problema al cargar el listado");
    },
  });
}

function formatPhoneNumber(phoneNumber) {
  // Eliminar cualquier carácter que no sea un dígito
  let cleaned = ('' + phoneNumber).replace(/\D/g, '');

  // Verificar que tenga el largo adecuado
  if (cleaned.length !== 10) {
      return phoneNumber; // Retorna el original si no es un número válido
  }

  // Dividir el número en partes
  let part1 = cleaned.slice(0, 4);
  let part2 = cleaned.slice(4, 6);
  let part3 = cleaned.slice(6);

  // Armar el formato deseado
  return `(${part1}) ${part2}-${part3}`;
}

function ActualizarInformacion() {
  let usuarioID = document.getElementById("UsuarioID").value;
  let nombre = $("#nombre").val();
  let phone = $("#phone").val();
  let instagram = $("#instagram").val();
  let facebook = $("#facebook").val();
  let whatsapp = $("#whatsapp").val();
  $.ajax({
    url: "../../Perfiles/UpdateInformacion",
    data: {
      UsuarioID: usuarioID,
      Nombre: nombre,
      NroTelefono: phone,
      Instagram: instagram,
      Facebook: facebook,
      Whatsapp: whatsapp,
    },
    type: "POST",
    dataType: "json",
    success: function () {
      icon.innerHTML = '<i class="bx bxs-check-circle"></i>';
      icon.classList.add("succes-svg");
      titulo.innerHTML = "Hecho";
      descripcion.innerHTML = `<label>Se ha actualizado la información</label>`;
      aceptar.style.display = "block";
      background.classList.add("success");
      alerta.classList.add("enter-alert");
      setTimeout(function () {
        hiddenAlert();
      }, 4000);
    },
    error: function (xhr, status) {
      console.log("Disculpe, existió un problema al cargar el listado");
    },
  });
}

const nombre = document.getElementById("nombre");
const nombreError = document.getElementById("span-nombre");

// Validación del nombre en tiempo real
nombre.addEventListener("input", function () {
  const nameValue = nombre.value;

  if (nameValue.trim() === "") {
    nombreError.textContent = "El nombre no puede estar vacío";
    nombreError.style.display = "block";
  } else {
    nombreError.textContent = "";
    nombreError.style.display = "none";
  }
});



// DAR FORMATO A NUMERO DE TELEFONO
function formatearTelefono(input) {
  // Eliminar todo lo que no sea un número
  const numeroSolo = input.value.replace(/\D/g, '');

  // Aplicar el formato (XXXX) XX-XXXX
  const formatoTelefono = numeroSolo.replace(/^(\d{4})(\d{2})(\d{0,4})/, function(match, p1, p2, p3) {
      if (p3) {
          return `(${p1}) ${p2}-${p3}`;
      } else if (p2) {
          return `(${p1}) ${p2}`;
      } else if (p1) {
          return `(${p1}`;
      }
      return '';
  });

  // Establecer el valor formateado en el input
  input.value = formatoTelefono;
}


