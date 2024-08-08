(window.onload = cargarDetallePublicacion()), cargarImagenDetallePublicacion();

function setupThumbnailClickHandler() {
  var thumbnails = document.querySelectorAll(".miniatura");

  // Agregar evento de clic a cada miniatura
  thumbnails.forEach(function (thumbnail) {
    thumbnail.addEventListener("click", function () {
      // Obtener el elemento de la imagen principal
      var mainImage = document.getElementById("MainImage");

      // Obtener la URL de la imagen del elemento del thumbnail clickeado
      var newImageSrc = this.getAttribute("src");

      // Actualizar la fuente de la imagen principal
      mainImage.src = newImageSrc;

      // Remover la clase "active" de todos los thumbnails
      thumbnails.forEach(function (thumb) {
        thumb.classList.remove("active");
      });

      // Agregar la clase "active" al thumbnail clickeado
      this.classList.add("active");
    });
  });
}

function cargarImagenDetallePublicacion() {
  const url = window.location.href; // Obtiene la URL completa
  const partes = url.split("/"); // Divide la URL en partes usando el slash como delimitador
  const inmuebleID = partes[partes.length - 1]; // El ID es la última parte de la URL

  $.ajax({
      url: "../../Inmuebles/GetDetallePublicacion",
      data: { InmuebleID: inmuebleID }, // Asegúrate de que el parámetro coincida con el esperado por el servidor
      type: "POST",
      dataType: "json",
      success: function (data) {
          console.log("Datos recibidos:", data); // Verifica los datos recibidos

          if (data.length > 0) {
              let inmueble = data[0]; // Supone que sólo hay un inmueble en la respuesta



              $("#MainImage").attr("src", inmueble.imagenes[0].imagenSrc);
              // Establecer la descripción inicial
              $("#Descripcion").text(inmueble.descripcionString);

              // Suponiendo que 'Imagenes' es una lista de objetos que contienen las URLs de las imágenes
              let miniaturas = ``;
              $.each(inmueble.imagenes, function (index, imagen) {
                  miniaturas += `
                      <img src="${imagen.imagenSrc}" alt="Miniatura ${index + 1}" class="miniatura ${index === 0 ? "active" : ""}">
                  `;
              });
              $("#Miniaturas-container").html(miniaturas);

              // Llamar a la función para manejar la selección de imágenes
              setupThumbnailClickHandler();
          }
      },
      error: function (xhr, status, error) {
          console.log(
              "Disculpe, existió un problema al cargar los detalles del inmueble",
              status,
              error
          );
      },
  });
}

function changeImage(element) {
  $("#MainImage").attr("src", $(element).attr("src"));
}

function cargarDetallePublicacion() {
  const url = window.location.href; // Obtiene la URL completa
  const partes = url.split("/"); // Divide la URL en partes usando el slash como delimitador
  const inmuebleID = partes[partes.length - 1]; // El ID es la última parte de la URL
  $.ajax({
    url: "../../Inmuebles/GetDetallePublicacion",
    data: { InmuebleID: inmuebleID }, // Asegúrate de que el parámetro coincida con el esperado por el servidor
    type: "POST",
    dataType: "json",
    success: function (data) {
      console.log("Datos recibidos:", data); // Verifica los datos recibidos

      let datosPrincipales = ``;
      $.each(data, function (index, item) {
        datosPrincipales += `
              <h2>${item.tituloString}</h2>
              <h3>$ ${item.precioString}</h3>
              <h4>${item.provinciaString} - ${item.localidadString}</h4>
              <h4>${item.tipoInmuebleString} - ${item.tipoOperacionString}</h4>
              `;
      });

      document.getElementById("DatosPrincipales").innerHTML = datosPrincipales;

      let DetallesPublicaciones = ``;
      $.each(data, function (index, item) {
        DetallesPublicaciones += `
          <h3>Detalles:</h3>
          <p>Superficie total: ${item.superficieTotalString} m²</p>
          <p>Superficie cubierta: ${item.superficieCubiertaString} m²</p>
          <p>Habitaciones: ${item.dormitoriosString}</p>
          <p>Baños: ${item.baniosString}</p>
          <p>Ambientes: ${item.cantidadAmbientesString}</p>
          <p>Cochera: ${item.cocheraString}</p>
          <p>Amoblado: ${item.amobladoString}</p>
          <p>barrio: ${item.barrioString}</p>
          <p>Dirección: ${item.direccionString} - ${item.nroDireccionString}</p>
          `;
      });

      document.getElementById("DetallesPublicaciones").innerHTML = DetallesPublicaciones;
    },
    error: function (xhr, status, error) {
      console.log(
        "Disculpe, existió un problema al cargar los detalles del inmueble",
        status,
        error
      );
    },
  });
}
