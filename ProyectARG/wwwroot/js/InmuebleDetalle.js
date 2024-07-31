// Obtener todos los elementos de las miniaturas
var thumbnails = document.querySelectorAll('.miniatura');

// Agregar evento de clic a cada miniatura
thumbnails.forEach(function(thumbnail) {
  thumbnail.addEventListener('click', function() {
    // Obtener el elemento de la imagen principal
    var mainImage = document.getElementById("mainImage");

    // Obtener la URL de la imagen del elemento del thumbnail clickeado
    var newImageSrc = this.getAttribute("src");

    // Actualizar la fuente de la imagen principal
    mainImage.src = newImageSrc;

    // Remover la clase "active" de todos los thumbnails
    thumbnails.forEach(function(thumb) {
      thumb.classList.remove("active");
    });

    // Agregar la clase "active" al thumbnail clickeado
    this.classList.add("active");
  });
});