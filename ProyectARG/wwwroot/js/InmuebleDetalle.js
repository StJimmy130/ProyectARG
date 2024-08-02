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


// function cargarDetallePublicacion(inmuebleID) {
//   $.ajax({
//       url: '../../Inmuebles/GetDetallePublicacion',
//       data: { InmuebleID: inmuebleID }, // Asegúrate de que el parámetro coincida con el esperado por el servidor
//       type: 'POST',
//       dataType: 'json',
//       success: function (data) {
//           console.log('Datos recibidos:', data); // Verifica los datos recibidos

//           if (data) {
//               // Asegúrate de que data no es undefined y contiene las propiedades esperadas
//               $('#mainImage').attr('src', data.imagenPrincipal || '/path/to/default/image.jpg');
//               $('#tituloInmueble').text(data.titulo || 'Título no disponible');
//               $('#precioInmueble').text(`$ ${data.precio || 'Precio no disponible'}`);
//               $('#ubicacionInmueble').text(`${data.provincia || 'Provincia no disponible'} - ${data.localidad || 'Localidad no disponible'}`);
//               $('#tipoOperacionInmueble').text(`${data.tipoInmueble || 'Tipo de inmueble no disponible'} en ${data.tipoOperacion || 'Tipo de operación no disponible'}`);
//               $('#descripcion').text(data.descripcion || 'Descripción no disponible');

//               // Actualizar la información del vendedor (si aplica)
//               if (data.vendedor) {
//                   $('#nombreVendedor').text(`Nombre: ${data.vendedor.nombre || 'Nombre no disponible'}`);
//                   $('#telefonoVendedor').text(`Teléfono: ${data.vendedor.telefono || 'Teléfono no disponible'}`);
//                   $('#emailVendedor').text(`Email: ${data.vendedor.email || 'Email no disponible'}`);
//               } else {
//                   $('#nombreVendedor').text('Datos del vendedor no disponibles');
//                   $('#telefonoVendedor').text('');
//                   $('#emailVendedor').text('');
//               }

//               // Actualizar los detalles de la propiedad
//               $('#superficieTotal').text(`Superficie total: ${data.superficieTotal || 'No disponible'} m²`);
//               $('#superficieCubierta').text(`Superficie cubierta: ${data.superficieCubierta || 'No disponible'} m²`);
//               $('#habitaciones').text(`Habitaciones: ${data.habitaciones || 'No disponible'}`);
//               $('#banos').text(`Baños: ${data.banos || 'No disponible'}`);
//               $('#ambientes').text(`Ambientes: ${data.ambientes || 'No disponible'}`);
//               $('#cochera').text(`Cochera: ${data.cochera ? 'Sí' : 'No'}`);
//               $('#amoblado').text(`Amoblado: ${data.amoblado ? 'Sí' : 'No'}`);
//               $('#barrio').text(`Barrio: ${data.barrio || 'No disponible'}`);
//               $('#direccion').text(`Dirección: ${data.direccion || 'No disponible'} - ${data.nroDireccion || 'No disponible'}`);

//               // Actualizar las miniaturas
//               let miniaturasHtml = '';
//               if (data.miniaturas && Array.isArray(data.miniaturas) && data.miniaturas.length > 0) {
//                   data.miniaturas.forEach((miniatura, index) => {
//                       miniaturasHtml += `<img src="${miniatura}" alt="Miniatura ${index + 1}" class="miniatura" onclick="changeImage(this)">`;
//                   });
//               } else {
//                   miniaturasHtml = '<p>No hay miniaturas disponibles</p>';
//               }
//               $('#miniaturasContainer').html(miniaturasHtml);
//           } else {
//               console.log('No se recibieron datos.');
//           }
//       },
//       error: function (xhr, status, error) {
//           console.log('Disculpe, existió un problema al cargar los detalles del inmueble', status, error);
//       }
//   });
// }


// function changeImage(element) {
//     $('#mainImage').attr('src', $(element).attr('src'));
// }
