window.onload = function () {
  ListadoPublicaciones();
  checkSocialMedia();
};

$(document).ready(function () {
  // Cerrar el menú al hacer clic fuera de él
  $(document).click(function (event) {
    var $target = $(event.target);
    var $menu = $("#filterMenu");
    var $toggler = $(".navbar-toggler");

    // Si el clic no está dentro del menú o en el botón de toggler
    if (
      !$target.closest($menu).length &&
      !$target.closest($toggler).length &&
      $menu.hasClass("show")
    ) {
      $menu.collapse("hide");
    }
  });

  // Cerrar el menú al hacer clic en el botón "Filtrar"
  $(".btn-success").click(function () {
    $("#filterMenu").collapse("hide");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const filterToggles = document.querySelectorAll(".filter-toggle");
  const collapseIds = [
    "#collapse1",
    "#collapse2",
    "#collapse3",
    "#collapse4",
    "#collapse5",
  ];

  filterToggles.forEach((toggle) => {
    toggle.addEventListener("click", function (event) {
      event.preventDefault(); // Previene el comportamiento por defecto del enlace

      const targetId = this.getAttribute("href");
      const targetCollapse = document.querySelector(targetId);

      // Si el targetCollapse está abierto, simplemente ciérralo y salimos de la función
      if (targetCollapse.classList.contains("show")) {
        const bsTargetCollapse =
          bootstrap.Collapse.getInstance(targetCollapse) ||
          new bootstrap.Collapse(targetCollapse, {
            toggle: false,
          });
        bsTargetCollapse.hide();
        return; // Salimos de la función para evitar abrir otro colapso
      }

      // Cierra todos los colapsos excepto el que se va a abrir
      collapseIds.forEach((id) => {
        const collapse = document.querySelector(id);
        if (collapse.classList.contains("show")) {
          const bsCollapse =
            bootstrap.Collapse.getInstance(collapse) ||
            new bootstrap.Collapse(collapse, {
              toggle: false,
            });
          bsCollapse.hide();
        }
      });

      // Abre el colapso del filtro seleccionado
      const bsTargetCollapse =
        bootstrap.Collapse.getInstance(targetCollapse) ||
        new bootstrap.Collapse(targetCollapse, {
          toggle: false,
        });
      bsTargetCollapse.show();
    });
  });
});

// FUNCIÓN PARA VERIFICAR SI ES FAVORITO
function ToggleFavorito(inmuebleId, button) {
  let icon = $(button).find("i");
  let usuarioId = document.getElementById("UsuarioID").value;
  

  $.ajax({
    url: `../../Favoritos/ToggleFavorito`,
    type: "POST",
    data: { inmuebleId: inmuebleId, usuarioId: usuarioId },
    success: function (response) {
      console.log("Respuesta del servidor:", response);
      if (response.success) {
        icon.toggleClass("fas far");
        // Actualizar el estado visual del botón
        if (response.isFavorito === true) {
          icon.removeClass("far").addClass("fas");
        } else if (response.isFavorito === false) {
          icon.removeClass("fas").addClass("far");
        }
      } else {
        console.error("Error al actualizar el favorito: " + response.message);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error al actualizar el favorito: " + error);
    },
  });
}

// Asegúrate de que este código se ejecute cuando la página se carga
$(document).ready(function () {
  // Prevenir la navegación al hacer clic en el botón de favorito
  $(".favorite-btn").on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
  });
});

function actualizarLocalidades() {
  var provinciaID = document.getElementById("ProvinciaID").value;

  // Realizar la solicitud AJAX para obtener las localidades
  $.ajax({
    url: "../../Home/GetLocalidadesByProvincia",
    type: "GET",
    data: { provinciaID: provinciaID },
    success: function (localidades) {
      var localidadSelect = document.getElementById("LocalidadID");
      localidadSelect.innerHTML = '<option value="0">[SELECCIONE...]</option>'; // Limpiar opciones anteriores

      // Agregar nuevas opciones
      localidades.forEach(function (localidad) {
        var option = document.createElement("option");
        option.value = localidad.localidadID;
        option.text = localidad.nombre;
        localidadSelect.add(option);
      });
    },
    error: function () {
      console.log("Error al cargar las localidades.");
    },
  });
}

function ListadoPublicaciones() {
  showLoadingScreen();

  let provinciaID = document.getElementById("ProvinciaID").value;
  let localidadID = document.getElementById("LocalidadID").value;
  let precioMinimo = document.getElementById("min-price").value;
  let precioMaximo = document.getElementById("max-price").value;
  let operacion = document.getElementById("OperacionID").value;
  let usuarioId = document.getElementById("UsuarioID").value;
  let selectedValues = [];

  // Obtener valores seleccionados de los checkboxes
  document
    .querySelectorAll('input[type="checkbox"]:checked')
    .forEach((checked) => {
      selectedValues.push(checked.value);
    });

  // Llamada AJAX para obtener las publicaciones
  $.ajax({
    url: "../../Home/ListadoInmuebles",
    data: {
      ProvinciaID: provinciaID,
      LocalidadID: localidadID,
      TipoInmueble: selectedValues,
      Operacion: operacion,
      PrecioMinimo: precioMinimo,
      PrecioMaximo: precioMaximo,
      UsuarioID: usuarioId,
    },
    type: "POST",
    dataType: "json",
    success: function (Listado) {
      

      if (Listado && Listado.length > 0) {
        publicacionesOriginales = Listado; // Asigna las publicaciones originales
        renderizarTabla(publicacionesOriginales); // Renderiza la tabla con las publicaciones
      } else {
        var paginacion = document.getElementById("paginacion");
        document.getElementById("publicaciones").innerHTML = `
        <div style="justify-content: center; text-align: center;">
            <img src="/img/NoCasa.png" style="align-items: center; max-width: 100%; height: auto;">
            <p class"fw-bold">No se encontraron resultados</p>
        </div>`
        paginacion.style.display = "none";
      }
      hideLoadingScreen(); // Ocultar pantalla de carga después de la respuesta
    },
    error: function () {
      console.log("Disculpe, existió un problema al cargar el listado");
      hideLoadingScreen(); // Ocultar pantalla de carga en caso de error
    },
  });
}

function LimpiarFiltros() {
  // Restablecer los campos de entrada
  document.getElementById("ProvinciaID").value = 0;
  document.getElementById("LocalidadID").value = 0;
  document.getElementById("min-price").value = 0;
  document.getElementById("max-price").value = 0;
  document.getElementById("OperacionID").value = 0;

  // Desmarcar todos los checkboxes
  document
    .querySelectorAll('input[type="checkbox"]:checked')
    .forEach((checked) => {
      checked.checked = false;
    });

  // Opcional: Llamar a ListadoPublicaciones para refrescar la lista
  ListadoPublicaciones();
}

var paginaActual = 0;
var itemsPorPagina = 12;
var paginas = [];
var publicacionesFiltradas = []; // Para mantener las publicaciones filtradas
var publicacionesOriginales = []; // Para mantener las publicaciones originales

function paginarPublicaciones(publicaciones, itemsPorPagina) {
  var paginas = [];
  for (var i = 0; i < publicaciones.length; i += itemsPorPagina) {
    paginas.push(publicaciones.slice(i, i + itemsPorPagina));
  }
  return paginas;
}

function renderizarTabla(publicaciones) {
  publicacionesFiltradas = publicaciones; // Mantener el estado de las publicaciones filtradas
  paginas = paginarPublicaciones(publicacionesFiltradas, itemsPorPagina);

  // Si la página actual es mayor que el total de páginas disponibles, resetear a la primera página
  if (paginaActual >= paginas.length) {
    paginaActual = 0;
  }

  // Si no hay publicaciones, mostrar mensaje
  if (publicaciones.length === 0) {
    document.getElementById("publicaciones").innerHTML = `
        <div style="justify-content: center; text-align: center;">
            <img src="/img/NoCasa.png" style="align-items: center; max-width: 100%; height: auto;">
            <p class="fs-3" style="color: var(--text-color2);">NO SE ENCONTRARON PUBLICACIONES</p>
        </div>`;
  } else {
    mostrarPagina(paginaActual); // Mostrar publicaciones si hay resultados
  }

  renderizarPaginacion(); // Renderizar la paginación
}

function renderizarPaginacion() {
  var paginacion = document.getElementById("paginacion");
  paginacion.innerHTML = "";

  // Solo renderizar la paginación si hay más de una página y publicaciones filtradas no está vacía
  if (paginas.length > 1 && publicacionesFiltradas.length > 0) {
    for (var i = 0; i < paginas.length; i++) {
      var botonPagina = document.createElement("button");
      botonPagina.className = "btn btn-link pagination-item";
      botonPagina.textContent = i + 1;
      botonPagina.onclick = (function (pagina) {
        return function () {
          paginaActual = pagina;
          mostrarPagina(pagina);
          renderizarPaginacion();

          // Scroll a la parte superior
          setTimeout(function () {
            window.scroll(0, 0);
          }, 0);
        };
      })(i);

      if (i === paginaActual) {
        botonPagina.style.fontWeight = "bold";
      }

      paginacion.appendChild(botonPagina);
    }
  }
}

function cambiarPagina(delta) {
  // Ajustamos el índice de la página actual
  paginaActual += delta;
  if (paginaActual < 0) paginaActual = 0;
  if (paginaActual >= paginas.length) paginaActual = paginas.length - 1;

  // Mostramos el contenido de la nueva página
  mostrarPagina(paginaActual);

  // Renderizamos la paginación después de mostrar la nueva página
  renderizarPaginacion();

  requestAnimationFrame(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  });
}

function mostrarPagina(pagina) {
  showLoadingScreen(); // Mostrar pantalla de carga al renderizar una nueva página

  
  let contenidoTabla = '';

  // Condición para mostrar el botón solo en pantallas pequeñas cuando el menú está oculto
  
  contenidoTabla += `<button class="navbar-toggler d-xl-none" type="button" data-bs-toggle="collapse" data-bs-target="#filterMenu"
      aria-controls="filterMenu" aria-expanded="false" aria-label="Toggle navigation">
      <span class="container span-filtros"><i class='bx bx-menu-alt-left'></i>Filtros</span>
    </button>`;
  

  // Generar el resto del contenido de la tabla
  $.each(paginas[pagina], function (i, item) {
    const precioFormateado = Number(item.precioString).toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    contenidoTabla += `
    <div class="col-lg-4 col-md-6 col-sm-12 activo">
      <a href="../Inmuebles/Detalle/${item.inmuebleID}">
        <div class="card">
          <div class="image-container">
            <img src="${item.imagenSrc}" alt="Imagen del Inmueble">
            <button class="favorite-btn position-absolute top-0 end-0 m-2" onclick="ToggleFavorito(${
              item.inmuebleID
            }, this); return false;">
              <i id="fav-icon-${item.inmuebleID}" class="${
      item.esFavorito ? "fas fa-heart" : "far fa-heart"
    }"></i>
            </button>
          </div>
          <div class="card-body">
            <h5 class="card-title fs-4">${item.tituloString}</h5>
            <p class="card-text fs-5">${
              item.moneda ? "U$D" : "AR$"
            } ${precioFormateado} - ${item.tipoOperacionString}</p>
            <p class="card-title fs-5">${item.provinciaString}, ${
      item.localidadString
    } - ${item.direccionString} ${item.nroDireccionString}</p>
          </div>
        </div>
      </a>
    </div>`;
  });

  document.getElementById("publicaciones").innerHTML = contenidoTabla;
  hideLoadingScreen(); // Ocultar pantalla de carga después de mostrar la página
}


// Función de búsqueda
$(document).ready(function () {
  $("#SearchButton").on("click", function () {
    showLoadingScreen(); // Mostrar pantalla de carga durante la búsqueda
    var searchQuery = $("#BuscadorPorTitulo").val().toLowerCase();

    // Filtramos las publicaciones originales en lugar de modificar las filtradas
    var resultadosFiltrados = publicacionesOriginales.filter(function (
      publicacion
    ) {
      return publicacion.tituloString.toLowerCase().indexOf(searchQuery) > -1;
    });

    // Renderizamos la tabla con los resultados filtrados
    renderizarTabla(resultadosFiltrados);

    hideLoadingScreen(); // Ocultar pantalla de carga después de la búsqueda
  });

  // Cargar el listado de publicaciones cuando la página esté lista
  ListadoPublicaciones(); // Asegúrate de que esta función ya esté definida
});

function syncInput(id) {
  const input = document.getElementById(`${id}-input`);
  const range = document.getElementById(id);

  // Sincronizar el valor del input de número con el range
  input.value = range.value;
}

// js code to toggle search box
searchToggle.addEventListener("click", () => {
  searchToggle.classList.toggle("active");
});

function checkSocialMedia() {
  let UsuarioID = document.getElementById("UsuarioID").value;

  $.ajax({
    url: "../../Home/CheckSocialMedia",
    data: {
      UsuarioID: UsuarioID,
    },
    type: "POST",
    dataType: "json",
    success: function (resultado) {
      if (resultado != "") {
        icon.innerHTML = '<i class="bx bxs-error-circle"></i>';
        icon.classList.add("succes-svg");
        background.classList.add("success");

        titulo.innerHTML = "Atencion";
        descripcion.innerHTML = `<label>${resultado}</label>`;
        aceptar.style.display = "block";
        aceptar.setAttribute("onclick", `hiddenAlert()`);
        alerta.classList.add("enter-alert");

        setTimeout(function () {
          hiddenAlert();
        }, 5000);
      }
    },
    error: function (xhr, status) {
      console.log("Disculpe, existió un problema al cargar el listado");
    },
  });
}
