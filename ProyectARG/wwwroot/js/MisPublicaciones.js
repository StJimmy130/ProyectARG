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
      var tabla = ``;
      $.each(misPublicaciones, function (i, item) {
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
    },
    error: function (xhr, status) {
      console.log("Disculpe, existió un problema al cargar el listado");
    },
  });
}

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

      getMisPublicaciones();
      hiddenAlert();
    },

    error: function (xhr, status) {
      console.log("Disculpe, existió un problema al cargar el listado");
    },
  });
}
