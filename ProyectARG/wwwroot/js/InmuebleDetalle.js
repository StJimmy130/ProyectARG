// Selector de imagen principal

// Obtener todos los elementos de las miniaturas
var thumbnails = document.querySelectorAll(".miniatura");

// Agregar evento de clic a cada miniatura
thumbnails.forEach(function (thumbnail) {
  thumbnail.addEventListener("click", function () {
    // Obtener el elemento de la imagen principal
    var mainImage = document.getElementById("mainImage");

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

window.onload = cargarDetallePublicacion();






function cargarDetallePublicacion(inmuebleID) {
  $.ajax({
      url: '../../Inmuebles/GetDetallePublicacion',
      data: { InmuebleID: inmuebleID }, // Asegúrate de que el parámetro coincida con el esperado por el servidor
      type: 'POST',
      dataType: 'json',
      success: function (data) {
          console.log('Datos recibidos:', data); // Verifica los datos recibidos

          let contenidoVista = ``;
          $.each(data, function (index, item) {
              contenidoVista += `
              <h1>${item.titulo}</h1>
              `
          });

          document.getElementById("vistaPublicacion").innerHTML = contenidoVista;
      },
      error: function (xhr, status, error) {
          console.log('Disculpe, existió un problema al cargar los detalles del inmueble', status, error);
      }
  });
}


function changeImage(element) {
    $('#mainImage').attr('src', $(element).attr('src'));
}
