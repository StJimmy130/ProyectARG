window.onload = function() {
    ListadoPublicaciones();

    document.addEventListener('DOMContentLoaded', function () {
        const filterToggles = document.querySelectorAll('.filter-toggle');
        const collapseIds = ['#collapse1', '#collapse2', '#collapse3', '#collapse4', '#collapse5'];

        filterToggles.forEach(toggle => {
            toggle.addEventListener('click', function (event) {
                event.preventDefault(); // Previene el comportamiento por defecto del enlace

                const targetId = this.getAttribute('href');
                const targetCollapse = document.querySelector(targetId);

                // Cierra todos los colapsos excepto el que se va a abrir
                collapseIds.forEach(id => {
                    const collapse = document.querySelector(id);
                    if (collapse !== targetCollapse && collapse.classList.contains('show')) {
                        collapse.classList.remove('show');
                    }
                });

                // Alterna el colapso del filtro seleccionado
                if (!targetCollapse.classList.contains('show')) {
                    targetCollapse.classList.add('show');
                }
            });
        });
    });
};
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
                <div class="col-lg-4 col-md-4 col-sm-12 mb-4">
                    <div class="card">
                        <img src="https://via.placeholder.com/150" alt="Card image cap">
                        <div class="card-body">
                            <h5 class="card-title">${item.tituloString}</h5>
                            <p class="card-text">$ ${item.precioString}</p>
                            <p>${item.provinciaString}, ${item.loacalidadString} - ${item.direccionString} ${item.nroDireccionString}</p>
                            <div>${item.tipoOperacionString}</div>
                            <a href="#" class="btn btn-primary">Ver más</a>
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
