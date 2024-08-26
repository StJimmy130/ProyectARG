window.onload = getMisPublicaciones();

function getMisPublicaciones() {
  let usuarioID = document.getElementById("UsuarioID").value;
  $.ajax({
    url: "../../MisPublicaciones/GetPublicaciones",
    data: { usuarioID: usuarioID },
    type: "POST",
    dataType: "json",
    success: function (misPublicaciones) {
      console.log(misPublicaciones);
      renderizarTabla(misPublicaciones);
    },
    error: function (xhr, status) {
      console.log("Disculpe, existió un problema al cargar el listado");
    },
  });
}

function renderizarTabla(publicaciones) {
  var tabla = ``;
  $.each(publicaciones, function (i, item) {
    tabla += `
          <tr>
              <td>${item.tituloString}</td>
              <td>${item.precioString}</td>
              <td>${item.provinciaString}, ${item.localidadString}-${item.direccionString}</td>
              <td>${item.tipoOperacionString}</td>
              <td><button type="button" class="btn btn-primary" onclick="cargarInformacion(${item.inmuebleID})">Administrar</button></td>
          </tr>
      `;
  });
  document.getElementById("misPublicaciones").innerHTML = tabla;
}

$(document).ready(function () {
  $("#inputFiltro").on("keyup", function () {
    var searchQuery = $(this).val().toLowerCase();
    $("#misPublicaciones tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(searchQuery) > -1);
    });
  });

  // Cargar publicaciones cuando la página esté lista
  getMisPublicaciones();
});

function cargarInformacion(inmuebleID) {
  $.ajax({
    url: "../../MisPublicaciones/GetPublicaciones",
    data: { inmuebleID: inmuebleID },
    type: "POST",
    dataType: "json",
    success: function (misPublicaciones) {
      $.each(misPublicaciones, function (i, item) {
        console.log(item);
        document.getElementById("main-title").innerHTML = item.tituloString;
        document.getElementById("main-description").innerHTML =
          item.descripcionString;
        console.log(item.imagenes);
        document.getElementById("main-img").src = item.imagenes[0].imagenSrc;
      });
    },
  });
}
