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
    const precioFormateado = Number(item.precioString).toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    if (item.activo == true) {
      tabla += `
        <tr class="text-sm-start small">
          <td class="text-start " title="${item.tituloString}">${item.tituloString}</td>
          <td class="text-end cut_col" title="${precioFormateado} ${item.moneda ? "U$D" : "AR$"}">${precioFormateado} ${item.moneda ? "U$D" : "AR$"}</td>
          <td class="text-start" title="${item.localidadString}, ${item.provinciaString} - ${item.direccionString} ${item.nroDireccionString}">
            ${item.localidadString}, ${item.provinciaString} - ${item.direccionString || ''} ${item.nroDireccionString || ''}
          </td>
          <td class="text-start cut_col"  title="${item.tipoOperacionString}">${item.tipoOperacionString}</td>
          <td><button type="button" class="btn btn-primary" onclick="cargarInformacion(${item.inmuebleID})">Administrar</button></td>
        </tr>
      `;
    } else {
      tabla += `
        <tr class="item-suspendido small">
          <td class="text-start " title="${item.tituloString}">${item.tituloString}</td>
          <td class="text-end cut_col" title="${precioFormateado} ${item.moneda ? "U$D" : "AR$"}">${precioFormateado} ${item.moneda ? "U$D" : "AR$"}</td>
          <td class="text-start" title="${item.provinciaString}, ${item.localidadString} - ${item.direccionString} ${item.nroDireccionString}">
            ${item.provinciaString}, ${item.localidadString} - ${item.direccionString} ${item.nroDireccionString}
          </td>
          <td class="text-start cut_col"  title="${item.tipoOperacionString}">${item.tipoOperacionString}</td>
          <td><button type="button" class="btn btn-primary" style="background-color: #AA0000; border: #AA0000;" onclick="cargarInformacion(${item.inmuebleID})">Administrar</button></td>
        </tr>
      `;
    }
  });
  document.getElementById("misPublicaciones").innerHTML = tabla;
  
}

document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.getElementById("Precio");
  console.log(inputField);
  if (inputField) {
      inputField.addEventListener("input", (event) => {
        formatNumber(inputField);
        console.log(inputField.value);
      });
  }
});

function formatNumber(input) {
  // Eliminar cualquier carácter que no sea un dígito
  let value = input.value.replace(/\D/g, '');
  
  // Insertar un punto cada 3 dígitos de derecha a izquierda
  input.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
          .getElementById("btn-editar")
          .setAttribute("onclick", `AbrirModalEditar(${item.inmuebleID})`);
        document.getElementById("main-img").src = item.imagenes[0].imagenSrc;
      });
    },
  });
  showPanel();
}





function actualizarVisibilidad() {
  const tipoInmueble = document.getElementById("TipoInmueble").value;
  const pisoContainer = document.getElementById("piso-container");
  const departamentoContainer = document.getElementById("departamento-container");

  if (tipoInmueble === "5") { 
    pisoContainer.style.display = "flex"; 
    departamentoContainer.style.display = "flex"; 
  } else {
    pisoContainer.style.display = "none"; 
    departamentoContainer.style.display = "none"; 
  }
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
  precio = precio.replace(/\./g, "");

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
  let imagenesBack = getBackFiles();

  console.log(imagenesBack);



  for (let i = 0; i < imagenesBack.length; i++) {
    formData.append(`ImagenesBack[${i}]`, JSON.stringify(imagenesBack[i]));
  }
  console.log(formData);
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

        $("#ModalEditarPublicacion").modal("hide")

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
      backFiles = Inmueble.imagenes;
      // Al cargar la información desde el back
      let miniaturas = "";

      backFiles.forEach((imagen, index) => {
        miniaturas += `<div class="draggable back" draggable="true" id="${imagen.imagenID}">
                            <img src="${imagen.imagenSrc}">
                            <button class="btn-delete" onclick="deleteImage(${imagen.imagenID})"><i class="bx bx-trash"></i></button>
                        </div>`;
                        imagen.position = index + 1;
      });
 console.log(backFiles);
 actualizarDataIndex();
 actualizarVisibilidad();

      $("#list-container").html(miniaturas);

      setTimeout("IniciarTouch()", 500);
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
      setTimeout(() => {
        updateDropArea();
      }, 500);
      
    },
  });
}

function updateDropArea() {
  const height = container.clientHeight;
  container.style.height = `${height}px`; // Esto fuerza la actualización del área visible
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
let backFiles = []; // Lista interna de archivos
function getOrderedFiles() {
  return orderedFiles;
}

function getBackFiles() {
  return backFiles;
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
    let contentList = document.getElementById("input-container");
    let divCount = contentList.querySelectorAll("div").length;

    for (let i = divCount; i < Math.min(orderedFiles.length + divCount, maxPreview); i++ ) {
      let nroFile = 0
      const file = orderedFiles[nroFile];
      

      // CREAR EL DIV
      var div = document.createElement("div");
      div.classList.add("draggable");
      div.setAttribute("draggable", true); // Hacer que la imagen sea arrastrable
      div.setAttribute("id" , nroFile);
      div.setAttribute('data-index', i)
      

      // Crear la imagen
      let img = document.createElement("img");

      div.classList.add("file");
      // Si es un archivo, usar FileReader
      // Insertar la imagen dentro del div
      div.appendChild(img);
      contentList.appendChild(div);

      actualizarDataIndex()
    IniciarTouch(); // Iniciar arrastrar y soltar después de cargar las imágenes

      const fileReader = new FileReader();
      fileReader.onload = function (e) {
        img.src = e.target.result;
      };
      fileReader.readAsDataURL(file);

      nroFile++
    }
    
  }
  
});
const container = document.getElementById("list-container");
function IniciarTouch() {
  const draggables = document.querySelectorAll(".draggable");
  
  let draggedElement = null;

  // Asegúrate de que estas variables estén definidas
  

  draggables.forEach((draggable) => {
    draggable.addEventListener("click", function () {
      draggedElement = this;
      console.log(draggedElement);
    });
  
    draggable.addEventListener("dragstart", function () {
      draggedElement = this;
      setTimeout(() => {
        this.style.opacity = "0.4";
      }, 0);
    });
  
    draggable.addEventListener("dragend", function () {
      setTimeout(() => {
        this.style.opacity = "1";
        draggedElement = null;
      }, 0);
    });
  
    draggable.addEventListener("drop", (event) => {
      event.preventDefault();
  
      if (draggedElement === draggable) {
        let allImages = Array.from(container.querySelectorAll("div.draggable"));
        
        let draggedIndex = allImages.indexOf(draggedElement);
        let targetIndex = allImages.indexOf(draggable);
  
     
        
        // Obtener el atributo 'value' del draggedElement para buscar en el array
        const draggedValue = draggedElement.getAttribute('id'); 
        let div1 
  
        
         div1 = backFiles.find(obj => obj.imagenID == draggedValue);

  
  
        // Verificar si la imagen fue movida de posición
        if (draggedIndex == targetIndex) {
          // Actualizar la posición del objeto que estás arrastrando
          if (backFiles && draggedIndex !== -1) {
            actualizarDataIndex();
            if (div1) {
              let lastPosition = div1.position;

              div1.position = parseInt(draggable.getAttribute('data-index')); 

              if (div1.position > lastPosition) {
                for (let i = lastPosition + 1 ; i <= div1.position; i++) {
                  let div = backFiles.find(obj => obj.position == i && obj.imagenID != div1.imagenID);
                  div.position = i - 1;
                }
              }
              else if (div1.position < lastPosition) {
                for (let i = lastPosition - 1 ; i >= div1.position; i--) {
                  let div = backFiles.find(obj => obj.position == i && obj.imagenID != div1.imagenID);
                  div.position = i + 1;
                }
              }
            }
          } else {
            console.error("Error al actualizar posición");
          }
  
          // Mover el elemento en el DOM
          if (draggedElement && draggedElement.nodeType === 1) {
            if (draggedIndex > targetIndex) {
              container.insertBefore(draggedElement, draggable);
            } else {
              container.insertBefore(draggedElement, draggable.nextSibling);
            }
          } else {
            console.error("Elemento arrastrado no válido:", draggedElement);
          }
        }
      }
      updateImageOrder(); // Llamar a tu función para actualizar el orden visual
    });
  });
  
  container.addEventListener("dragover", function (e) {
    e.preventDefault();
    updateDropArea();
    
    const afterElement = getDragAfterElement(container, e.clientX, e.clientY);
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


function getDragAfterElement(container, x, y) {
  const draggableElements = [
    ...container.querySelectorAll(".draggable:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      
      // Cálculo de offset tanto en el eje X como Y
      const offsetX = x - (box.left + box.width / 2);
      const offsetY = y - (box.top + box.height / 2);

      // Determinamos qué tan cerca está del centro del elemento
      const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

      if (distance < closest.distance) {
        return { distance: distance, element: child };
      } else {
        return closest;
      }
    },
    { distance: Number.POSITIVE_INFINITY }
  ).element || getLastElement(container, y);
}

// Función para obtener el último elemento cuando se suelta fuera de los límites
function getLastElement(container, y) {
  const lastElement = container.querySelector(".draggable:last-of-type");
  const box = lastElement.getBoundingClientRect();

  // Si estás por debajo del último elemento, lo colocás al final
  if (y > box.bottom) {
    return lastElement;
  }

  return null;
}

  
}

function actualizarDataIndex() {
  // Obtener todos los divs dentro del listContainer
  let allDivs = listContainer.querySelectorAll('div.draggable');

  // Recorrer todos los divs y asignar un data-index consecutivo
  allDivs.forEach((div, index) => {
    div.setAttribute('data-index', index + 1); // Asignar el data-index (comienza en 1)
  });
}

function updateImageOrder() {
  const images = listContainer.querySelectorAll("div.draggable");
  images.forEach((div, index) => {
    div.dataset.index = index + 1;
  });
  
  console.log("Ordered Files: ", orderedFiles); // Verificar si se reordenan correctamente
  console.log("Back Files: ", backFiles);
}


function guardarImagenes() {
  let inmuebleID = document.getElementById("InmuebleID").value;
  const formData = new FormData();
  imagenes = getOrderedFiles();
  for (let i = 0; i < imagenes.length; i++) {
    formData.append("Imagenes", imagenes[i]);
  }
  formData.append("InmuebleID", inmuebleID);

  $.ajax({
    url: "../../MisPublicaciones/GuardarImagenes",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      if (response === true) {
        console.log("Imagenes guardadas exitosamente");
        AbrirModalEditar(inmuebleID);
        document.getElementById("Imagen").value = "";
        document.getElementById("input-container").innerHTML = "";
        updateDropArea();
      } else {
        console.error("Error al guardar las imagenes:", response.message);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
    },
  });
}

function deleteImage(imagenID) {
  let inmuebleID = document.getElementById("InmuebleID").value;
  $.ajax({
    url: "../../MisPublicaciones/EliminarImagen",
    type: "POST",
    data: { imagenID: imagenID },
    success: function (response) {
      if (response === true) {
        console.log("Imagen eliminada exitosamente");
        updateDropArea();
        AbrirModalEditar(inmuebleID);
      } else {
        console.error("Error al eliminar la imagen:", response.message);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
    },
  });
}