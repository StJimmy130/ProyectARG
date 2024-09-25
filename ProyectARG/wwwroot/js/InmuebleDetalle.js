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
  document.querySelector(".bx-chevron-right").addEventListener("click", function () {
    currentImageIndex = (currentImageIndex + 1) % thumbnails.length;
    updateMainImage(currentImageIndex);
  });

  document.querySelector(".bx-chevron-left").addEventListener("click", function () {
    currentImageIndex = (currentImageIndex - 1 + thumbnails.length) % thumbnails.length;
    updateMainImage(currentImageIndex);
  });
}

function changeImage(element) {
  $("#MainImage").attr("src", $(element).attr("src"));
}


function CargarDatosPublicacion() {
  showLoadingScreen(); // Mostrar pantalla de carga mientras se procesan los datos

  const url = window.location.href; // Obtiene la URL completa
  const partes = url.split("/"); // Divide la URL en partes usando el slash como delimitador
  const inmuebleID = partes[partes.length - 1]; // El ID es la última parte de la URL

  $.ajax({
    url: "../../Inmuebles/GetDetallePublicacion",
    data: { InmuebleID: inmuebleID }, // Asegúrate de que el parámetro coincida con el esperado por el servidor
    type: "POST",
    dataType: "json",
    success: function (data) {
      let datosPrincipales = ``;
      let datosVendedor = ``;
      let DetallesPublicaciones = ``;

      if (data.length > 0) {
        let inmueble = data[0]; // Asumiendo que el primer elemento contiene los datos principales del inmueble

        // ------------------ Datos Principales ------------------ //
        datosPrincipales += `
              <p>${inmueble.fechaPublicacionString} - ${inmueble.cantidadVistas} <i class="fa-solid fa-eye"></i></p>
              <h2>${inmueble.tituloString}</h2>
              <h3>${inmueble.moneda ? "U$D" : "AR$"} ${inmueble.precioString}</h3>
              <h4>${inmueble.provinciaString} - ${inmueble.localidadString}</h4>
              <h4>${inmueble.tipoInmuebleString} - ${inmueble.tipoOperacionString}</h4>
              `;

        // ------------------ Datos Vendedor ------------------ //
        $.each(inmueble.datosUsuario, function (index, usuario) {
          datosVendedor += `
              <h2>Vendedor</h2>
              <p>${usuario.nombre}</p>
              <p>${usuario.nroTelefono}</p>
              <div class="icons-vendedor">
                <a href="${usuario.facebook}" target="_blank"><i class='bx bxl-facebook'></i></a>
                <a href="https://www.instagram.com/${usuario.instagram}/" target="_blank"><i class="bx bxl-instagram"></i></a>
                <a href="https://wa.me/${usuario.whatsapp}" target="_blank"><i class="bx bxl-whatsapp"></i></a>
                <a href="#" target="_blank"><i class="bx bxl-gmail"></i></a>
              </div>
              `;
        });

        // ------------------ Detalles Publicaciones ------------------ //
        inmueble.cocheraString = inmueble.cocheraString ? "Si" : "No";
        inmueble.amobladoString = inmueble.amobladoString ? "Si" : "No";


        DetallesPublicaciones += `
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
          `;

        // ------------------ Imágenes ------------------ //
        $("#MainImage").attr("src", inmueble.imagenes[0].imagenSrc);
        $("#Descripcion").text(inmueble.descripcionString);

        let miniaturas = ``;
        $.each(inmueble.imagenes, function (index, imagen) {
          miniaturas += `
              <img src="${imagen.imagenSrc}" alt="Miniatura ${index + 1}" class="miniatura ${index === 0 ? "active" : ""}">
          `;
        });
        $("#Miniaturas-container").html(miniaturas);

        // Llamar a la función para manejar la selección de imágenes
        setupThumbnailClickHandler();

        // Actualizar el DOM con los datos obtenidos
        document.getElementById("DatosPrincipales").innerHTML = datosPrincipales;
        document.getElementById("DatosVendedor").innerHTML = datosVendedor;
        document.getElementById("DetallesPublicaciones").innerHTML = DetallesPublicaciones;

        hideLoadingScreen(); // Ocultar la pantalla de carga
      }
    },
    error: function (xhr, status, error) {
      console.log("Disculpe, existió un problema al cargar los detalles del inmueble", status, error);
      hideLoadingScreen(); // Ocultar la pantalla de carga en caso de error
    },
  });
}
