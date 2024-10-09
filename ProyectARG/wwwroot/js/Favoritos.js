window.onload = ListadoFavoritos;


// FUNCIÓN PARA VERIFICAR SI ES FAVORITO 
function ToggleFavorito(inmuebleId, button) {
    let icon = $(button).find('i');
    let usuarioId = document.getElementById("UsuarioID").value;

    
    $.ajax({
        url: `../../Favoritos/ToggleFavorito`,
        type: 'POST',
        data: { inmuebleId: inmuebleId, usuarioId: usuarioId },
        success: function (response) {
            console.log('Respuesta del servidor:', response);
            if (response.success) {
                icon.toggleClass('fas far');
                // Actualizar el estado visual del botón
                if (response.esFavorito === true) {
                    icon.removeClass('far').addClass('fas');
                } else if (response.esFavorito === false){
                    icon.removeClass('fas').addClass('far');
                }
            } else {
                console.error('Error al actualizar el favorito: ' + response.message);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error al actualizar el favorito: ' + error);
        }
    });
}

// Asegúrate de que este código se ejecute cuando la página se carga
$(document).ready(function() {
    // Prevenir la navegación al hacer clic en el botón de favorito
    $('.favorite-btn').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
    });
});


function ListadoFavoritos() {
    showLoadingScreen();
    let usuarioId = document.getElementById("UsuarioID").value;
    // Llamada AJAX para obtener las publicaciones
    $.ajax({
        url: "../../Favoritos/ListadoFavoritos",
        type: "POST",
        data: { usuarioId: usuarioId },
        dataType: "json",
        success: function (Listado) {
            if (Listado.length > 0) {
                publicacionesOriginales = Listado;
                renderizarTabla(publicacionesOriginales);
            }
            hideLoadingScreen();
        },
        error: function () {
            console.log("Disculpe, existió un problema al cargar el listado");
            hideLoadingScreen();
        },
    });
}

var publicacionesOriginales = [];

function renderizarTabla(publicaciones) {
    if (publicaciones.length === 0) {
        document.getElementById("publicaciones").innerHTML = "<p>No se encontraron resultados</p>";
    } else {
        mostrarPublicaciones(publicaciones);
    }
}

function mostrarPublicaciones(publicaciones) {
    showLoadingScreen();
    let contenidoTabla = "";

    $.each(publicaciones, function (i, item) {
        contenidoTabla += `
        <div class="col-lg-4 col-md-6 col-sm-12 mb-4 activo">
            <a href="../Inmuebles/Detalle/${item.inmuebleID}">
                <div class="card">
                    <div class="image-container">
                        <img src="${item.imagenSrc}" alt="Imagen del Inmueble">
                        <button class="favorite-btn position-absolute top-0 end-0 m-2" onclick="ToggleFavorito(${item.inmuebleID}, this); return false;">
                            <i id="fav-icon-${item.inmuebleID}" class="${item.esFavorito ? 'fas fa-heart' : 'far fa-heart'}"></i>
                        </button>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title fs-4">${item.tituloString}</h5>
                        <p class="card-text fs-5">${item.precioString} ${item.moneda ? "U$D" : "AR$"} - ${item.tipoOperacionString}</p>
                        <p class="card-title fs-5">${item.provinciaString}, ${item.localidadString} - ${item.direccionString} ${item.nroDireccionString}</p>
                    </div>
                </div>
            </a>
        </div>`;
    });

    document.getElementById("publicaciones").innerHTML = contenidoTabla;
    hideLoadingScreen();
}
