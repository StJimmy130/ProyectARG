window.onload = getMisPublicaciones();

function getMisPublicaciones() {
  let usuarioID = document.getElementById("UsuarioID").value;
  $.ajax({
    url: "../../MisPublicaciones/GetPublicaciones",
    data: { usuarioID: usuarioID },
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
    if (item.activo == true) {
      tabla += `
          <tr class="text-sm-start">
              <td class="text-start" style="text-overflow: ellipsis;">${
                item.tituloString
              }</td>
              <td class="text-end" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${
                item.precioString
              } ${item.moneda ? "U$D" : "AR$"}</td>
              <td class="text-start hide-on-small" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${
                item.localidadString
              }, ${item.provinciaString} - ${item.direccionString} ${
        item.nroDireccionString
      }</td>
              <td class="text-start hide-on-small">${
                item.tipoOperacionString
              }</td>
              <td><button type="button" class="btn btn-primary" onclick="cargarInformacion(${
                item.inmuebleID
              })">Administrar</button></td>
          </tr>
      `;
    } else {
      tabla += `
          <tr class="item-suspendido">
              <td><p>${item.tituloString}</p></td>
              <td><p>${item.precioString}</p></td>
              <td class="hide-on-small"><p>${item.provinciaString}, ${item.localidadString} - ${item.direccionString} ${item.nroDireccionString}</p></td>
              <td class="hide-on-small"><p>${item.tipoOperacionString}</p></td>
              <td><button type="button" class="btn btn-primary" onclick="cargarInformacion(${item.inmuebleID})">Administrar</button></td>
          </tr>
      `;
    }
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
        
        document.getElementById("main-title").innerHTML = item.tituloString;
        document.getElementById("main-description").innerHTML =
          item.descripcionString;
        
        document
          .getElementById("btn-eliminar")
          .setAttribute(
            "onclick",
            `ValidarEliminacionInmueble(${item.inmuebleID}, 'eliminar')`
          );
        if (item.activo == true) {
          document
            .getElementById("btn-suspender")
            .setAttribute(
              "onclick",
              `ValidarEliminacionInmueble(${item.inmuebleID}, 'suspender')`
            );
          document.getElementById("btn-suspender").innerHTML = "suspender";
        } else {
          document
            .getElementById("btn-suspender")
            .setAttribute(
              "onclick",
              `ValidarEliminacionInmueble(${item.inmuebleID}, 'suspender')`
            );
          document.getElementById("btn-suspender").innerHTML = "activar";
        }
        document
          .getElementById("btn-editar")
          .setAttribute("onclick", `AbrirModalEditar(${item.inmuebleID})`);
        document.getElementById("main-img").src = item.imagenes[0].imagenSrc;
      });
    },
  });
  showPanel();
}

function GuardarPublicacion() {
  let inmuebleID = document.getElementById("InmuebleID").value;
  let localidadID = document.getElementById("LocalidadID").value;
  let provinciaID = document.getElementById("ProvinciaID").value;
  let barrio = document.getElementById("Barrio").value;
  let titulo = document.getElementById("Titulo").value;
  let precio = document.getElementById("Precio").value;
  // let moneda = document.getElementById("Moneda").checked;
  let superficieTotal = document.getElementById("Area").value;
  let superficieCubierta = document.getElementById("AreaCubierta").value;
  let tipoOperacion = document.getElementById("Operacion").value;
  let tipoInmueble = document.getElementById("TipoInmueble").value;
  let amoblado = document.getElementById("Amoblado").checked;
  let dormitorios = document.getElementById("Habitaciones").value;
  let banios = document.getElementById("Banios").value;
  let cantidadAmbientes = document.getElementById("Ambientes").value;
  let cochera = document.getElementById("Estacionamiento").checked;
  let direccion = document.getElementById("Direccion").value;
  let nroDireccion = document.getElementById("NroDireccion").value;
  let piso = document.getElementById("Piso").value;
  let nroDepartamento = document.getElementById("NroDepartamento").value;
  let descripcion = document.getElementById("Descripcion").value;
  let usuarioID = document.getElementById("UsuarioID").value;

  // Crear un objeto FormData para enviar los datos y archivos
  let formData = new FormData();
  formData.append("InmuebleID", inmuebleID);
  formData.append("LocalidadID", localidadID);
  formData.append("ProvinciaID", provinciaID);
  formData.append("Barrio", barrio);
  formData.append("Titulo", titulo);
  formData.append("Precio", precio);
  formData.append("SuperficieTotal", superficieTotal);
  formData.append("SuperficieCubierta", superficieCubierta);
  formData.append("TipoOperacion", tipoOperacion);
  formData.append("TipoInmueble", tipoInmueble);
  formData.append("Amoblado", amoblado);
  formData.append("Dormitorios", dormitorios);
  formData.append("Banios", banios);
  formData.append("CantidadAmbientes", cantidadAmbientes);
  formData.append("Cochera", cochera);
  formData.append("Direccion", direccion);
  formData.append("NroDireccion", nroDireccion);
  formData.append("Piso", piso);
  formData.append("NroDepartamento", nroDepartamento);
  formData.append("Descripcion", descripcion);
  formData.append("UsuarioID", usuarioID);
  // formData.append("Moneda", moneda);

  // Obtener el orden actual de las imágenes en el list-container
  let imagenes = getOrderedFiles();

  for (let i = 0; i < imagenes.length; i++) {
    formData.append("Imagenes", imagenes[i]);
  }
  console.log(imagenes);
  $.ajax({
    url: "/Inmuebles/GuardarPublicacion",
    data: formData,
    type: "POST",
    dataType: "json",
    contentType: false,
    processData: false,
    success: function (resultado) {
      if (resultado.estado == true) {
        icon.classList.add("succes-svg");
        icon.innerHTML = '<i class="bx bxs-check-circle"></i>';
        document.getElementById("alert-title").innerHTML = "Felicitaciones!";
        document.getElementById("alert-description").innerHTML =
          resultado.texto;
        aceptar.style.display = "block";
        background.classList.add("success");
        alerta.classList.add("enter-alert");

        setTimeout(function () {
          hiddenAlert();
        }, 3000);
      } else {
        icon.classList.add("denied-svg");
        icon.innerHTML = '<i class="bx bxs-x-circle"></i>';
        document.getElementById("alert-title").innerHTML = "Hay un problema";
        document.getElementById("alert-description").innerHTML =
          resultado.texto;
        aceptar.style.display = "block";
        background.classList.add("denied");
        alerta.classList.add("enter-alert");

        setTimeout(function () {
          hiddenAlert();
          window.location.href = "../../Home/Index";
        }, 3000);
      }
    },
    error: function (err) {
      console.error(err);
    },
  });
}

function AbrirModalEditar(inmuebleID) {
  $.ajax({
    // la URL para la petición
    url: "/Inmuebles/GetDetallePublicacion",
    // la información a enviar
    // (también es posible utilizar una cadena de datos)
    data: { inmuebleID: inmuebleID },
    // especifica si será una petición POST o GET
    type: "POST",
    // el tipo de información que se espera de respuesta
    dataType: "json",
    // código a ejecutar si la petición es satisfactoria;
    // la respuesta es pasada como argumento a la función
    success: function (Inmuebles) {
      
      let Inmueble = Inmuebles[0];
      document.getElementById("InmuebleID").value = inmuebleID;
      document.getElementById("Barrio").value = Inmueble.barrioString;
      document.getElementById("Titulo").value = Inmueble.tituloString;
      document.getElementById("Precio").value = Inmueble.precioString;
      document.getElementById("Area").value = Inmueble.superficieTotalString;
      document.getElementById("AreaCubierta").value =
        Inmueble.superficieCubiertaString;
      document.getElementById("Amoblado").checked = Inmueble.amobladoString;
      document.getElementById("Habitaciones").value =
        Inmueble.dormitoriosString;
      document.getElementById("Banios").value = Inmueble.baniosString;
      document.getElementById("Ambientes").value =
        Inmueble.cantidadAmbientesString;
      document.getElementById("Estacionamiento").checked =
        Inmueble.cocheraString;
      document.getElementById("Direccion").value = Inmueble.direccionString;
      document.getElementById("NroDireccion").value =
        Inmueble.nroDireccionString;
      document.getElementById("Piso").value = Inmueble.pisoString;
      document.getElementById("NroDepartamento").value =
        Inmueble.nroDepartamentoString;
      document.getElementById("Descripcion").value = Inmueble.descripcionString;
      // Al cargar la información desde el back
      let miniaturas = Inmueble.imagenes
        .map(
          (
            imagen,
            index
          ) => `<div class="draggable" draggable="true" id="img${imagen.imagenID}">
                                <img src="${imagen.imagenSrc}">
                              </div>`
        )
        .join("");

      $("#list-container").html(miniaturas);

      setTimeout("IniciarTouch()", 500);

      backFiles = Inmueble.imagenes;
    },

    // código a ejecutar si la petición falla;
    // son pasados como argumentos a la función
    // el objeto de la petición en crudo y código de estatus de la petición
    error: function (xhr, status) {
      console.log(
        "Disculpe, existió un problema al consultar el registro para ser modificado."
      );
    },
  });

  $.ajax({
    url: "/Inmuebles/GetDataInmueble",
    data: { inmuebleID: inmuebleID },
    type: "POST",
    dataType: "json",
    success: function (data) {
      
      let publicacion = data[0];
      document.getElementById("LocalidadID").value = publicacion.localidadID;
      document.getElementById("ProvinciaID").value = publicacion.provinciaID;
      document.getElementById("Operacion").value = publicacion.tipoOperacion;
      document.getElementById("TipoInmueble").value = publicacion.tipoInmueble;

      $("#ModalEditarPublicacion").modal("show");
    },
  });
}

function ValidarEliminacionInmueble(inmuebleID, Operacion) {
  icon.innerHTML = '<i class="bx bxs-error-circle"></i>';
  icon.classList.add("alert-svg");
  titulo.innerHTML = "Atencion!";
  descripcion.innerHTML = `<label>¿Está seguro de que desea ${Operacion} esta publicación?</label>`;
  aceptar.style.display = "block";
  background.classList.add("alert");
  alerta.classList.add("enter-alert");
  cancelar.setAttribute("onclick", `hiddenAlert()`);
  cancelar.style.display = "block";

  if (Operacion == "eliminar") {
    aceptar.setAttribute("onclick", `eliminarInmueble(${inmuebleID})`);
  } else if (Operacion == "suspender") {
    aceptar.setAttribute("onclick", `suspenderInmueble(${inmuebleID})`);
  }

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
      if (resultado.estado === true) {
        icon.classList.add("succes-svg");
        icon.innerHTML = '<i class="bx bxs-check-circle"></i>';
        background.classList.add("success");
      } else {
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
  hiddenPanel();
}

function suspenderInmueble(inmuebleID) {
  $.ajax({
    url: "/Inmuebles/SuspenderPublicacion",
    data: { inmuebleID: inmuebleID },
    type: "POST",
    dataType: "json",

    success: function (resultado) {
      icon.classList.remove("alert-svg", "succes-svg", "denied-svg");
      background.classList.remove("alert");
      if (resultado.titulo != "Hubo un problema") {
        if (resultado.estado === true) {
          icon.innerHTML = "<i class='bx bxs-lock'></i>";
        } else {
          icon.innerHTML = '<i class="bx bxs-lock-open"></i>';
        }
      } else {
        icon.innerHTML = '<i class="bx bxs-x-circle"></i>';
        icon.classList.add("denied-svg");
        background.classList.add("denied");
      }

      icon.classList.add("succes-svg");
      background.classList.add("success");
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
  hiddenPanel();
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

let orderedFiles = []; // Lista interna de archivos
function getOrderedFiles() {
  return orderedFiles;
}

const listContainer = document.getElementById("list-container");

document.addEventListener("DOMContentLoaded", function () {
  let inputFile = document.getElementById("Imagen");

  inputFile.addEventListener("change", function (event) {
    const files = event.target.files;
    orderedFiles = Array.from(files); // Actualizar la lista con los archivos nuevos
    cargarImagenes(); // Llamar a la función para cargar las imágenes
  });

  function cargarImagenes() {
    
    const maxPreview = 100;

    for (let i = 0; i < Math.min(orderedFiles.length, maxPreview); i++) {
      const file = orderedFiles[i];

      // CREAR EL DIV
      var div = document.createElement("div");
      div.classList.add("draggable");
      div.setAttribute("draggable", true); // Hacer que la imagen sea arrastrable

      // Crear la imagen
      let img = document.createElement("img");
      img.dataset.index = i; // Almacenar el índice de la imagen

      if (file instanceof File) {
        // Si es un archivo, usar FileReader
        const fileReader = new FileReader();
        fileReader.onload = function (e) {
          img.src = e.target.result;
        };
        fileReader.readAsDataURL(file);
      } else if (file.imagenSrc) {
        // Si es base64 desde el backend
        img.src = file.imagenSrc;
      }

      // Insertar la imagen dentro del div
      div.appendChild(img);
      document.getElementById("list-container").appendChild(div);
    }

    IniciarTouch(); // Iniciar arrastrar y soltar después de cargar las imágenes
  }
});

function IniciarTouch() {
  const draggables = document.querySelectorAll(".draggable");
  const container = document.getElementById("list-container");

  let draggedElement = null;

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", function () {
      draggedElement = this;
      setTimeout(() => (this.style.opacity = "0.4"), 0);
    });

    draggable.addEventListener("dragend", function () {
      setTimeout(() => {
        this.style.opacity = "1";
        draggedElement = null;
      }, 0);
    });

    draggable.addEventListener("drop", (event) => {
      event.preventDefault();
      if (draggedElement !== draggable) {
        let allImages = Array.from(
          listContainer.querySelectorAll("div.draggable")
        );
        let draggedIndex = allImages.indexOf(draggedElement);
        let targetIndex = allImages.indexOf(draggable);

        // Reordenar los archivos en la lista interna de orderedFiles
        if (draggedIndex > targetIndex) {
          orderedFiles.splice(
            targetIndex,
            0,
            orderedFiles.splice(draggedIndex, 1)[0]
          );
        } else {
          orderedFiles.splice(
            targetIndex + 1,
            0,
            orderedFiles.splice(draggedIndex, 1)[0]
          );
        }

        // Verificar que draggedElement y draggable son nodos válidos
        if (draggedElement && draggedElement.nodeType === 1) {
          if (draggedIndex > targetIndex) {
            listContainer.insertBefore(draggedElement, draggable);
          } else {
            listContainer.insertBefore(draggedElement, draggable.nextSibling);
          }
          updateImageOrder(); // Actualizar el orden después de reordenar
        } else {
          console.error("Elemento arrastrado no válido:", draggedElement);
        }
      }
    });
  });

  container.addEventListener("dragover", function (e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientX);
    const draggable = draggedElement;

    // Asegurarse de que el draggedElement es válido antes de insertarlo
    if (draggable && draggable.nodeType === 1) {
      if (afterElement == null) {
        container.appendChild(draggable);
      } else {
        container.insertBefore(draggable, afterElement);
      }
    }
  });

  function getDragAfterElement(container, x) {
    const draggableElements = [
      ...container.querySelectorAll(".draggable:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }
}

function updateImageOrder() {
  const images = listContainer.querySelectorAll("div.draggable");
  images.forEach((div, index) => {
    div.dataset.index = index + 1;
  });
  console.log(images);
  console.log("Ordered Files: ", orderedFiles); // Verificar si se reordenan correctamente
}