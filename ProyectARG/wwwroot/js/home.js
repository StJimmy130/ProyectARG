window.onload = function() {
    ListadoPublicaciones();

    
};

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



function ListadoPublicaciones() {
    $.ajax({
        url: '../../Home/ListadoInmuebles',
        data: {},
        type: 'POST',
        dataType: 'json',
        success: function (Listado) {
            console.log(Listado)
            let contenidoTabla = ``;
            $.each(Listado, function (Index, item) {
                contenidoTabla += `
                <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
                    <div class="card">
                        <div class="image-container">
                            <img src="img/Casa.jpg" alt="Casa">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title fs-4">${item.tituloString}</h5>
                            <p class="card-text fs-5">$ ${item.precioString} - ${item.tipoOperacionString}</p>
                            <p>${item.provinciaString}, ${item.localidadString} - ${item.direccionString} ${item.nroDireccionString}</p>
                            
                            <div class="container d-flex justify-content-end">
                            
                            <a href="Inmuebles/Detalle" class="btn btn-success">Ver más</a>
                            </div>
                            
                        </div>
                    </div>
                </div>
                `;
            });

            document.getElementById("publicaciones").innerHTML = contenidoTabla;
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}


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