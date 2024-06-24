window.onload = listadoPublicaciones();

function listadoPublicaciones() {
    $.ajax({
        url: '../../Publicacion/GetPublicaciones',
        data: {  },
        type: 'POST',
        dataType: 'json',
        success: function (Listado)
        {
            console.log(Listado)
            let contenidoTabla = ``;
            $.each(Listado, function (Index, item) {
                contenidoTabla += `
                <div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">${item.titulo}</h5>
                        <p class="card-text">${item.descripcion}</p>
                        <a href="#" class="btn btn-primary">Go somewhere</a>
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