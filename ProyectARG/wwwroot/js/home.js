window.onload = ListadoPublicaciones();

function ListadoPublicaciones() {
    $.ajax({
        url: '../../Home/ListadoInmuebles',
        data: {  },
        type: 'POST',
        dataType: 'json',
        success: function (Listado)
        {
            console.log(Listado)
            let contenidoTabla = ``;
            $.each(Listado, function (Index, item) {
                contenidoTabla += `
                <div class="col-lg-4 col-md-4 col-sm-12 mb-4">
            <div class="card">
                <img src="https://via.placeholder.com/150" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">${item.tituloString}</h5>
                    <p class="card-text">$ ${item.precio}</p>
                    <p>${item.provinciaString}, ${item.loacalidadString} - ${item.direccion} ${item.nroDireccion}</p>
                    <div>${item.tipoOperacionString}</div>
                    <a href="#" class="btn btn-primary">Ver más</a>
                </div>
            </div>
        </div>
            `;});

            document.getElementById("publicaciones").innerHTML = contenidoTabla;

        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}