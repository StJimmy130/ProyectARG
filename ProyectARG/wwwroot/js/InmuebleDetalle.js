window.onload = CargarDatosPublicacion();

function toggleMiniaturasVisibility() {
  const miniaturasContainer = document.getElementById("Miniaturas-container");

  if (window.innerWidth < 768) {
    miniaturasContainer.style.display = "none";
  } else {
    miniaturasContainer.style.display = "block";
  }
}

// Ejecutar la función al cargar la página
toggleMiniaturasVisibility();

// Escuchar el evento de cambio de tamaño de la ventana
window.addEventListener("resize", toggleMiniaturasVisibility);

function setupThumbnailClickHandler() {
  const thumbnails = document.querySelectorAll(".miniatura");
  let currentImageIndex = 0;

  // Función para actualizar la imagen principal y la clase active
  function updateMainImage(index) {
    const mainImage = document.getElementById("MainImage");
    const newImageSrc = thumbnails[index].getAttribute("src");

    mainImage.src = newImageSrc;

    // Remover la clase "active" de todos los thumbnails
    thumbnails.forEach((thumb) => thumb.classList.remove("active"));

    // Agregar la clase "active" al thumbnail seleccionado
    thumbnails[index].classList.add("active");
  }

  // Asignar evento a cada miniatura para actualizar la imagen principal al hacer clic
  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", function () {
      currentImageIndex = index;
      updateMainImage(currentImageIndex);
    });
  });

  // Manejar los botones de navegación
  document
    .querySelector(".bx-chevron-right")
    .addEventListener("click", function () {
      currentImageIndex = (currentImageIndex + 1) % thumbnails.length;
      updateMainImage(currentImageIndex);
    });

  document
    .querySelector(".bx-chevron-left")
    .addEventListener("click", function () {
      currentImageIndex =
        (currentImageIndex - 1 + thumbnails.length) % thumbnails.length;
      updateMainImage(currentImageIndex);
    });
}

function changeImage(element) {
  $("#MainImage").attr("src", $(element).attr("src"));
}

function CargarDatosPublicacion() {
  showLoadingScreen();

  const url = window.location.href;
  const partes = url.split("/");
  const inmuebleID = partes[partes.length - 1];

  $.ajax({
    url: "../../Inmuebles/GetDetallePublicacion",
    data: { InmuebleID: inmuebleID },
    type: "POST",
    dataType: "json",
    success: function (data) {
      let datosPrincipales = ``;
      let datosVendedor = ``;
      let detallesPublicaciones = ``;

      if (data.length > 0) {
        let inmueble = data[0];

        // Datos Principales
        datosPrincipales += `
          <p class="text-muted text-sm">${inmueble.fechaPublicacionString} - ${inmueble.cantidadVistas} <i class="fa-solid fa-eye"></i></p>
          <h2>${inmueble.tituloString}</h2>
          <h3>${inmueble.moneda ? "U$D" : "AR$"} ${inmueble.precioString}</h3>
          <h4>${inmueble.provinciaString} - ${inmueble.localidadString}</h4>
          <h4>${inmueble.tipoInmuebleString} - ${
          inmueble.tipoOperacionString
        }</h4>
        `;

        // Datos Vendedor
        if (inmueble.tipoOperacionString === "AlquilerTemporal") {
        datosVendedor += `
          <div class="rating" id="Valoracion">
    <div class="rating-fill" style="width: 50%"></div>
    <input value="5" name="rating" id="star5" type="radio">
    <label for="star5" class="label"></label>
    <input value="4" name="rating" id="star4" type="radio">
    <label for="star4" class="label"></label>
    <input value="3" name="rating" id="star3" type="radio">
    <label for="star3" class="label"></label>
    <input value="2" name="rating" id="star2" type="radio">
    <label for="star2" class="label"></label>
    <input value="1" name="rating" id="star1" type="radio">
    <label for="star1" class="label"></label>
</div>`;
        };
        datosVendedor += `<h2>Vendedor</h2>`;
        inmueble.datosUsuario.forEach((usuario) => {
          datosVendedor += `
            <p>${usuario.nombre || ''}</p>
            <p>${usuario.nroTelefono || ''}</p>
            <div class="icons-vendedor">
              ${usuario.facebook ? `<a class="facebook" href="${usuario.facebook}" target="_blank"><i class='bx bxl-facebook'></i></a>` : ''}
              ${usuario.instagram ? `<a class="instagram" href="https://www.instagram.com/${usuario.instagram}/" target="_blank"><i class="bx bxl-instagram"></i></a>` : ''}
              ${usuario.whatsapp ? `<a class="whatsapp" href="https://wa.me/${usuario.whatsapp}" target="_blank"><i class="bx bxl-whatsapp"></i></a>` : ''}
              ${usuario.gmail ? `<a class="gmail" href="mailto:${usuario.gmail}" target="_blank"><i class="bx bxl-gmail"></i></a>` : ''}
            </div>
          `;
        });

        // Detalles Publicaciones
        inmueble.cocheraString = inmueble.cocheraString ? "Si" : "No";
        inmueble.amobladoString = inmueble.amobladoString ? "Si" : "No";

        detallesPublicaciones += `
          <h3>Detalles:</h3>
          <p><i class="fa-solid fa-ruler-combined"></i> Superficie total: ${inmueble.superficieTotalString} m²</p>
          <p><i class="fa-solid fa-ruler-horizontal"></i> Superficie cubierta: ${inmueble.superficieCubiertaString} m²</p>
          <p><i class="fa-solid fa-bed"></i> Habitaciones: ${inmueble.dormitoriosString}</p>
          <p><i class="fa-solid fa-bath"></i> Baños: ${inmueble.baniosString}</p>
          <p><i class="fa-solid fa-utensils"></i> Ambientes: ${inmueble.cantidadAmbientesString}</p>
          <p><i class="fa-solid fa-car"></i> Cochera: ${inmueble.cocheraString}</p>
          <p><i class="fa-solid fa-couch"></i> Amoblado: ${inmueble.amobladoString}</p>
          <p><i class="fa-solid fa-city"></i> Barrio: ${inmueble.barrioString}</p>
          <p><i class="fa-solid fa-signs-post"></i> Dirección: ${inmueble.direccionString} - ${inmueble.nroDireccionString}</p>
          ${inmueble.pisoString && inmueble.nroDepartamentoString ? `<p><i class="fa-solid fa-building"></i> Piso: ${inmueble.pisoString} - Departamento: ${inmueble.nroDepartamentoString}</p>` : ''}

        `;

        // Imágenes
        $("#MainImage").attr("src", inmueble.imagenes[0].imagenSrc);
        let descripcionConSaltos
        if(inmueble.descripcionString != null){
          descripcionConSaltos = inmueble.descripcionString.replace(/\n/g,"<br>");
        }
        
        $("#Descripcion").html(descripcionConSaltos);
        let miniaturas = inmueble.imagenes
          .map(
            (imagen, index) => `
          <img src="${imagen.imagenSrc}" alt="Miniatura ${
              index + 1
            }" class="miniatura ${index === 0 ? "active" : ""}">
        `
          )
          .join("");

        $("#Miniaturas-container").html(miniaturas);
        setupThumbnailClickHandler();

        // Actualizar el DOM
        $("#DatosPrincipales").html(datosPrincipales);
        $("#DatosVendedor").html(datosVendedor);
        $("#DetallesPublicaciones").html(detallesPublicaciones);
        if(inmueble.tipoOperacionString == "AlquilerTemporal"){
          document.getElementById("ComentariosContainer").style.display = "block";
          getComentarios();
          
        }

        hideLoadingScreen();
      }
    },
    error: function (xhr, status, error) {
      console.log(
        "Disculpe, existió un problema al cargar los detalles del inmueble",
        status,
        error
      );
      hideLoadingScreen();
    },
  });
}

function getComentarios() {
  const url = window.location.href;
  const partes = url.split("/");
  const inmuebleID = partes[partes.length - 1];
  $.ajax({
    url: "../../Comentarios/GetComentarios",
    type: "POST",
    data: {
      inmuebleID: inmuebleID,
    },
    success: function (data) {
      console.log(data);
      let listaComentarios = "";
      $.each(data, function (index, comentario) {
        listaComentarios +=`
      <div class="comment">
        <h6>${comentario.nombreUsuario}</h6>
        <p>${comentario.mensaje}</p>
      </div>
      `

      $("#Comentarios").html(listaComentarios);
      })
      
    },
    error: function (xhr, status, error) {
      console.log("Disculpe, existió un problema al cargar los comentarios", status, error);
    },
  });
}

function modalComentarios() {
  $("#ModalComentarios").modal("show");
}

function guardarComentario() {
  const url = window.location.href;
  const partes = url.split("/");
  const inmuebleID = partes[partes.length - 1];

  let usuarioID = document.getElementById("UsuarioID").value;
  let mensaje = document.getElementById("Comentario").value;
  let valoracion = document.querySelector('input[name="rating"]:checked').value;
  $.ajax({
    url: "../../Comentarios/PostComentario",
    type: "POST",
    data: {
      inmuebleID: inmuebleID,
      usuarioID: usuarioID,
      mensaje: mensaje,
      valoracion: valoracion,
    },
    success: function (response) {
      
      getComentarios()
      $("#ModalComentarios").modal("hidden");
      document.getElementById("UsuarioID").value = 0;
      document.getElementById("Comentario").value = "";
      document.querySelector('input[name="rating"]:checked').value = false;
    },
    error: function (xhr, status, error) {
      console.log("Disculpe, existió un problema al guardar el comentario", status, error);
    },
  })
  getComentarios()
}