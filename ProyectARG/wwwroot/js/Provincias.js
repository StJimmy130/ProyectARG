window.onload = ListadoDeProvincias();

function ListadoDeProvincias() {
  $.ajax({
    url: "../../Provincias/ListadoProvincias",
    data: {},
    type: "POST",
    dataType: "json",
    success: function (provincia) {
      console.log(provincia);
      $("#ProvinciaModal").modal("hide");
      LimpiarModals();

      let tabla = ``;

      $.each(provincia, function (index, provincias) {
        tabla += `
                    <tr>
                        <td class="texto-recortado">${provincias.nombre}</td>
                        <td class="text-center">
                            <button type="button" class="btn btn-success" onclick="ModalEditar(${provincias.provinciaID})">
                            Editar
                            </button>
                        </td>
                        <td class="text-center">
                            <button type="button" class="btn btn-danger" onclick="ValidarEliminacion(${provincias.provinciaID})">
                            Eliminar
                            </button>
                        </td>
                    </tr>
                `;
      });
      document.getElementById("tbodyProvincias").innerHTML = tabla;
    },
    error: function (xhr, status) {
      console.log("Disculpe, existió un problema al cargar el listado");
    },
  });
}

$(document).ready(function () {
  // Cargar provincias cuando la página esté lista
  ListadoDeProvincias();

  // Filtro de búsqueda
  $("#ProvinciaNombre").on("keyup", function () {
    var searchQuery = $(this).val().toLowerCase();
    $("#tbodyProvincias tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(searchQuery) > -1);
    });
  });
});

function LimpiarModals() {
  document.getElementById("ProvinciaID").value = 0;
  document.getElementById("ProvinciaIDAdd").value = 0;
  document.getElementById("ProvinciaNombre").value = "";
  document.getElementById("LocalidadID").value = 0;
  document.getElementById("LocalidadNombre").value = "";
}

function NuevaProvincia() {
  $("#TituloModalProvincia").text("Nueva provincia");
}

function GuardarProvincia() {
  let provinciaID = document.getElementById("ProvinciaIDAdd").value;
  let nombre = document.getElementById("ProvinciaNombre").value;

  $.ajax({
    url: "../../Provincias/GuardarProvincia",
    data: { ProvinciaID: provinciaID, Nombre: nombre },
    type: "POST",
    dataType: "json",
    success: function (resultado) {
      if (resultado.error === true) {
        icon.innerHTML = '<i class="bx bxs-x-circle"></i>';
        icon.classList.add("denied-svg");
        background.classList.add("denied");
      } else {
        icon.innerHTML = '<i class="bx bxs-check-circle"></i>';
        icon.classList.add("succes-svg");
        background.classList.add("success");
      }

      titulo.innerHTML = resultado.titulo;
      descripcion.innerHTML = `<label>${resultado.texto}</label>`;
      aceptar.style.display = "block";
      aceptar.setAttribute("onclick", `hiddenAlert()`);
      alerta.classList.add("enter-alert");
      ListadoDeProvincias();
    },
    error: function (xhr, status) {
      console.log("Disculpe, existió un problema al cargar el listado");
    },
  });
}

function ModalEditar(provinciaID) {
  $.ajax({
    url: "../../Provincias/ListadoProvincias",
    data: { ProvinciaID: provinciaID },
    type: "POST",
    dataType: "json",
    success: function (provincia) {
      let provincias = provincia[0];

      document.getElementById("ProvinciaIDAdd").value = provinciaID;
      $("#TituloModalProvincia").text("Editar provinca");
      document.getElementById("ProvinciaNombre").value = provincias.nombre;
      $("#ProvinciaModal").modal("show");
    },
    error: function (xhr, status) {
      console.log("Disculpe, existió un problema al cargar el listado");
    },
  });
}

function ValidarEliminacion(provinciaID) {
  icon.innerHTML = '<i class="bx bxs-error-circle"></i>';
  icon.classList.add("alert-svg");
  titulo.innerHTML = "Atencion!!!";
  descripcion.innerHTML = `<label>¿Esta seguro que desea eliminar esta provincia?</label>`;
  aceptar.style.display = "block";
  background.classList.add("alert");
  alerta.classList.add("enter-alert");
  cancelar.setAttribute("onclick", `hiddenAlert()`);
  cancelar.style.display = "block";
  aceptar.setAttribute("onclick", `EliminarProvincia(${provinciaID})`);

  alerta.classList.add("enter-alert");
}

function EliminarProvincia(provinciaID) {
  $.ajax({
    url: "../../Provincias/EliminarProvincia",
    data: { ProvinciaID: provinciaID },
    type: "POST",
    dataType: "json",

    success: function (resultado) {
      if (resultado.error === true) {
        icon.innerHTML = '<i class="bx bxs-x-circle"></i>';
        icon.classList.add("denied-svg");
        background.classList.add("denied");
      } else {
        icon.innerHTML = '<i class="bx bxs-check-circle"></i>';
        icon.classList.add("succes-svg");
        background.classList.add("success");
      }

      titulo.innerHTML = resultado.titulo;
      descripcion.innerHTML = `<label>${resultado.texto}</label>`;
      aceptar.style.display = "block";
      aceptar.setAttribute("onclick", `hiddenAlert()`);
      ListadoDeProvincias();
    },

    error: function (xhr, status) {
      console.log("Disculpe, existió un problema al cargar el listado");
    },
  });
}
