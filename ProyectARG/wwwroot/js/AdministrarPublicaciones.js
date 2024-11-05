window.onload = getMisPublicaciones();

function getMisPublicaciones() {
  $.ajax({
    url: "../../Administracion/PublicacionesParaAdministrar",
    data: {},
    type: "POST",
    dataType: "json",
    success: function (misPublicaciones) {
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
    const precioFormateado = Number(item.precioString).toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    if (item.activo == true) {
      tabla += `
      <tr class="text-sm-start text-center" style="font-size: 14px; vertical-align: middle;">
          <td class="text-start" title="${item.nombreUsuario}">${item.nombreUsuario}</td>
          <td class="text-start" title="${item.fechaPublicacionString}">${item.fechaPublicacionString}</td>
          <td class="text-start" title="${item.localidadString}, ${item.provinciaString} - ${item.direccionString} ${item.nroDireccionString}">
              ${item.localidadString}, ${item.provinciaString} - ${item.direccionString || ""} ${item.nroDireccionString || ""}
          </td>
          <td class="text-start" title="${item.tipoInmuebleString} en ${item.tipoOperacionString}">
              ${item.tipoInmuebleString} en ${item.tipoOperacionString}
          </td>
          <td><button type="button" class="btn btn-sm btn-primary" onclick="cargarInformacion(${item.inmuebleID})">Administrar</button></td>
      </tr>
      `;
    } else {
      tabla += `
        <tr class="item-suspendido"  style="font-size: 14px; vertical-align: middle;">
          <td class="text-start" title="${item.nombreUsuario}">${item.nombreUsuario}</td>
            <td class="text-start" title="${item.fechaPublicacionString}">${item.fechaPublicacionString}</td>
            <td class="text-start" title="${item.localidadString}, ${item.provinciaString} - ${item.direccionString} ${item.nroDireccionString}">
              ${item.localidadString}, ${item.provinciaString} - ${item.direccionString || ""} ${item.nroDireccionString || ""}
            </td>
            <td class="text-start" title="${item.tipoInmuebleString} en ${item.tipoOperacionString}">
              ${item.tipoInmuebleString} en ${item.tipoOperacionString}
            </td>
            <td><button type="button" class="btn btn-sm btn-primary" style="background-color: #AA0000; border: #AA0000;" onclick="cargarInformacion(${item.inmuebleID})">Administrar</button></td>
          </tr>
        `;
    }
  });
  document.getElementById("AdministrarPublicaciones").innerHTML = tabla;
}


$(document).ready(function () {
  $("#inputFiltro").on("keyup", function () {
    var searchQuery = $(this).val().toLowerCase();
    $("#AdministrarPublicaciones tr").filter(function () {
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
        document.getElementById("main-title").innerHTML = item.tituloString;
        document.getElementById("main-description").innerHTML =
          item.descripcionString;

          
        if (item.activo == true) {
          document
            .getElementById("btn-suspender")
            .setAttribute(
              "onclick",
              `ValidarEliminacionInmueble(${item.inmuebleID}, 'suspender')`
            );
          document.getElementById("btn-suspender").innerHTML = "Suspender";
        } else {
          document
            .getElementById("btn-suspender")
            .setAttribute(
              "onclick",
              `ValidarEliminacionInmueble(${item.inmuebleID}, 'suspender')`
            );
          document.getElementById("btn-suspender").innerHTML = "Activar";
        }
        document
          .getElementById("btn-detalle-link")
          .setAttribute("href", `../Inmuebles/Detalle/${item.inmuebleID}`);
          
        document.getElementById("main-img").src = item.imagenes[0].imagenSrc;
      });
    },
  });
  showPanel();
}


let panel = document.getElementById("panel");
let table = document.getElementById("table");
function showPanel() {
  const screenWidth = window.innerWidth;
  const table = document.getElementById("table"); // Asegúrate de tener el ID correcto de tu elemento
  const panel = document.getElementById("panel"); // Asegúrate de que 'panel' es el ID correcto

  if (screenWidth > 1200) {
    table.classList.remove("col-md-12");
    table.classList.add("col-md-8");
    panel.style.display = "flex"; // Cambia a flex para centrar el contenido
  } else {
    panel.style.display = "flex"; // Cambia a flex en lugar de block para mantener el centrado
  }
}

function hiddenPanel() {
  screenWidth = window.innerWidth;
  if (screenWidth > 1200) {
    table.classList.remove("col-md-8");
    table.classList.add("col-md-12");
    panel.style.display = "none";
  } else {
    panel.style.display = "none";
  }
}

