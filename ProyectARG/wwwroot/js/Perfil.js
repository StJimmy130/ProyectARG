window.onload = getInfo();

function getInfo() {
  let usuarioID = document.getElementById("UsuarioID").value;
  $.ajax({
    url: "../../Perfiles/GetInformacion",
    data: { usuarioID: usuarioID },
    type: "POST",
    dataType: "json",
    success: function (data) {
        if (
            data.instagram == null ||
            data.facebook == null ||
            data.whatsapp == null ||
            data.nroTelefono == null
          ) {
            icon.classList.add("alert-svg");
            icon.innerHTML = '<i class="bx bxs-error-circle"></i>';
            document.getElementById("alert-title").innerHTML = "Consejo";
            document.getElementById("alert-description").innerHTML = "Le recomendamos que complete todos los campos";
            aceptar.style.display = "block";
            background.classList.add("alert");
            alerta.classList.add("enter-alert");
          }

      $("#nombre").val(data.nombre);
      $("#phone").val(data.nroTelefono);
      $("#instagram").val(data.instagram);
      $("#facebook").val(data.facebook);
      $("#whatsapp").val(data.whatsapp);

     
    },
    error: function (xhr, status) {
      console.log("Disculpe, existió un problema al cargar el listado");
    },
  });
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
    success: function (data) {
      console.log(data);
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
