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
              <td><p>${item.tituloString}</p></td>
              <td><p>${item.precioString}</p></td>
              <td><p>${item.provinciaString}, ${item.localidadString}-${item.direccionString}</p></td>
              <td><p>${item.tipoOperacionString}</p></td>
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
        document
          .getElementById("btn-eliminar")
          .setAttribute(
            "onclick",
            `ValidarEliminacionInmueble(${item.inmuebleID})`
          );
        document.getElementById("main-img").src = item.imagenes[0].imagenSrc;
      });
    },
  });
}

function ValidarEliminacionInmueble(inmuebleID) {
    icon.innerHTML = '<i class="bx bxs-error-circle"></i>';
    icon.classList.add("alert-svg");
    titulo.innerHTML = "Atencion!!!";
    descripcion.innerHTML = `<label>¿Esta seguro que desea eliminar esta publicación? no podran recuperarse sus datos</label>`;
    aceptar.style.display = "block";
    background.classList.add("alert");
    alerta.classList.add("enter-alert");
    aceptar.setAttribute("onclick", `eliminarInmueble(${inmuebleID})`);
    cancelar.setAttribute("onclick", `hiddenAlert()`);
    cancelar.style.display = "block";
    alerta.classList.add("enter-alert");
}
function eliminarInmueble(inmuebleID) {
  let usuarioID = document.getElementById("UsuarioID").value;
  $.ajax({
    url: "/Inmuebles/EliminarPublicacion",
    data: { inmuebleID: inmuebleID, usuarioID: usuarioID },
    type: "POST",
    dataType: "json",

    success: function (resultado) {
      icon.classList.remove("alert-svg", "succes-svg", "denied-svg");
      background.classList.remove("alert");
      if(resultado.eliminado === true){
        icon.classList.add("succes-svg");
        icon.innerHTML = '<i class="bx bxs-check-circle"></i>';
        background.classList.add("success");
      }
      else{
        icon.innerHTML = '<i class="bx bxs-x-circle"></i>';
        icon.classList.add("denied-svg");
        background.classList.add("denied");
      }
    
    titulo.innerHTML = `${resultado.titulo}`;
    descripcion.innerHTML = `<label>${resultado.error}</label>`;
    aceptar.style.display = "block";
    aceptar.setAttribute("onclick", `hiddenAlert()`);
    cancelar.style.display = "none";


      getMisPublicaciones();
      setTimeout(function () {
        hiddenAlert();
      }, 3000);
      
    },

    error: function (xhr, status) {
      console.log("Disculpe, existió un problema al cargar el listado");
    },
  });
}
