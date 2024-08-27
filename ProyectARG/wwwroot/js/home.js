window.onload = function() {
    ListadoPublicaciones();    
};

$(document).ready(function () {
    // Cerrar el menú al hacer clic fuera de él
    $(document).click(function (event) {
        var $target = $(event.target);
        var $menu = $('#filterMenu');
        var $toggler = $('.navbar-toggler');

        // Si el clic no está dentro del menú o en el botón de toggler
        if (!$target.closest($menu).length && !$target.closest($toggler).length && $menu.hasClass('show')) {
            $menu.collapse('hide');
        }
    });

    // Cerrar el menú al hacer clic en el botón "Filtrar"
    $('.btn-success').click(function () {
        $('#filterMenu').collapse('hide');
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const filterToggles = document.querySelectorAll('.filter-toggle');
    const collapseIds = ['#collapse1', '#collapse2', '#collapse3', '#collapse4', '#collapse5'];

    filterToggles.forEach(toggle => {
        toggle.addEventListener('click', function (event) {
            event.preventDefault(); // Previene el comportamiento por defecto del enlace

            const targetId = this.getAttribute('href');
            const targetCollapse = document.querySelector(targetId);

            // Si el targetCollapse está abierto, simplemente ciérralo y salimos de la función
            if (targetCollapse.classList.contains('show')) {
                const bsTargetCollapse = bootstrap.Collapse.getInstance(targetCollapse) || new bootstrap.Collapse(targetCollapse, {
                    toggle: false
                });
                bsTargetCollapse.hide();
                return; // Salimos de la función para evitar abrir otro colapso
            }

            // Cierra todos los colapsos excepto el que se va a abrir
            collapseIds.forEach(id => {
                const collapse = document.querySelector(id);
                if (collapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(collapse) || new bootstrap.Collapse(collapse, {
                        toggle: false
                    });
                    bsCollapse.hide();
                }
            });

            // Abre el colapso del filtro seleccionado
            const bsTargetCollapse = bootstrap.Collapse.getInstance(targetCollapse) || new bootstrap.Collapse(targetCollapse, {
                toggle: false
            });
            bsTargetCollapse.show();
        });
    });
});

function actualizarLocalidades() {
    var provinciaID = document.getElementById("ProvinciaID").value;

    // Realizar la solicitud AJAX para obtener las localidades
    $.ajax({
        url: '../../Home/GetLocalidadesByProvincia',
        type: 'GET',
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
            console.log('Error al cargar las localidades.');
        }
    });
}

function ListadoPublicaciones() {
    showLoadingScreen();
    let provinciaID = document.getElementById("ProvinciaID").value;
    let localidadID = document.getElementById("LocalidadID").value;
    let precioMinimo = document.getElementById("min-price").value;
    let precioMaximo = document.getElementById("max-price").value;
    let operacion = document.getElementById("OperacionID").value;
    let selectedValues = [];

    // Obtener valores seleccionados de los checkboxes
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(checked => {
        selectedValues.push(checked.value);
    });

    $.ajax({
        url: '../../Home/ListadoInmuebles',
        data: {
            ProvinciaID: provinciaID,
            LocalidadID: localidadID,
            TipoInmueble: selectedValues,
            Operacion: operacion,
            PrecioMinimo: precioMinimo,
            PrecioMaximo: precioMaximo
        },
        type: 'POST',
        dataType: 'json',
        success: function (Listado) {
            renderizarTabla(Listado);
},
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}

var paginaActual = 0;
var itemsPorPagina = 12;
var paginas = [];

function paginarPublicaciones(publicaciones, itemsPorPagina) {
  var paginas = [];
  for (var i = 0; i < publicaciones.length; i += itemsPorPagina) {
    paginas.push(publicaciones.slice(i, i + itemsPorPagina));
  }
  return paginas;
}

function renderizarTabla(publicaciones) {
  paginas = paginarPublicaciones(publicaciones, itemsPorPagina);
  mostrarPagina(paginaActual);
  renderizarPaginacion();
}

function renderizarPaginacion() {
    var paginacion = document.getElementById("paginacion");
    paginacion.innerHTML = '';
    
    for (var i = 0; i < paginas.length; i++) {
      var botonPagina = document.createElement("button");
      botonPagina.className = "btn btn-link";
      botonPagina.style.padding = "5px";
      botonPagina.style.margin = "0 2px";
      botonPagina.textContent = i + 1;
      botonPagina.onclick = (function(pagina) {
        return function() {
          paginaActual = pagina;
          mostrarPagina(pagina);
          renderizarPaginacion();
        };
      })(i);
      
      if (i === paginaActual) {
        botonPagina.style.fontWeight = "bold";
      }
      
      paginacion.appendChild(botonPagina);
    }
  }
  
  function cambiarPagina(delta) {
    paginaActual += delta;
    if (paginaActual < 0) paginaActual = 0;
    if (paginaActual >= paginas.length) paginaActual = paginas.length - 1;
    mostrarPagina(paginaActual);
    renderizarPaginacion();
  }


function mostrarPagina(pagina) {
    let contenidoTabla = ``;
    $.each(paginas[pagina], function (i, item) {
        contenidoTabla += `
        <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div class="card">
                <div class="image-container">
                    <img src="${item.imagenSrc}" alt="Imagen del Inmueble">
                </div>
                <div class="card-body">
                    <h5 class="card-title fs-4">${item.tituloString}</h5>
                    <p class="card-text fs-5">$ ${item.precioString} - ${item.tipoOperacionString}</p>
                    <p class="card-title fs-5">${item.provinciaString}, ${item.localidadString} - ${item.direccionString} ${item.nroDireccionString}</p>
                    <div class="container d-flex justify-content-end">
                    <a href="Inmuebles/Detalle/${item.inmuebleID}" class="btn btn-primary">Ver más</a>
                    </div>
                </div>
            </div>
        </div>
        `;
    });
    document.getElementById("publicaciones").innerHTML = contenidoTabla;
    hideLoadingScreen();
}



$(document).ready(function() {
    // Ejecutar la búsqueda cuando se haga clic en el ícono de búsqueda
    $('#searchButton').on('click', function() {
        var searchQuery = $('#buscadorPorTitulo').val().toLowerCase();

        $('#publicaciones .card').filter(function() {
            // Filtra las tarjetas en base al texto dentro de <h5> con la clase "fs-4"
            $(this).toggle($(this).find('h5.fs-4').text().toLowerCase().indexOf(searchQuery) > -1);
        });
    });

    // Cargar el listado de publicaciones cuando la página esté lista
    ListadoPublicaciones(); // Asegúrate de que esta función ya esté definida
});


function updatePriceRange() {
    const minPriceInput = document.getElementById('min-price-input');
    const minPriceRange = document.getElementById('min-price');
  
    const minPrice = parseInt(minPriceInput.value);
    const maxPriceInput = document.getElementById('max-price-input');
    const maxPrice = parseInt(maxPriceInput.value);
  
    // Asegurarse de que el valor mínimo no sea mayor al máximo
    if (minPrice >= maxPrice) {
      minPriceInput.value = maxPrice - minPriceInput.step;
    }
  
    // Actualizar el valor del input range del precio mínimo
    minPriceRange.value = minPriceInput.value;
  }
  
  function updateMaxPrice() {
    const maxPriceInput = document.getElementById('max-price-input');
    const maxPriceRange = document.getElementById('max-price');
    const minPriceRange = document.getElementById('min-price');
  
    const maxPrice = parseInt(maxPriceInput.value);
  
    // Actualizar el máximo del range del precio máximo
    maxPriceRange.max = maxPrice;
  
    // Ajustar el máximo del range del precio mínimo
    minPriceRange.max = maxPrice;
  }
  
  function syncInput(id) {
    const input = document.getElementById(`${id}-input`);
    const range = document.getElementById(id);
  
    // Sincronizar el valor del input de número con el range
    input.value = range.value;
  }