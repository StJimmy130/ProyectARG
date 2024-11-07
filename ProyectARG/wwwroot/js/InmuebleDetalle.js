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

  // Función para actualizar la imagen principal, la clase active y desplazar la miniatura activa al centro
  function updateMainImage(index) {
    const mainImage = document.getElementById("MainImage");
    const newImageSrc = thumbnails[index].getAttribute("src");

    mainImage.src = newImageSrc;

    // Remover la clase "active" de todos los thumbnails
    thumbnails.forEach((thumb) => thumb.classList.remove("active"));

    // Agregar la clase "active" al thumbnail seleccionado
    const activeThumbnail = thumbnails[index];
    activeThumbnail.classList.add("active");

    // Desplazar el contenedor para que el thumbnail activo esté visible
    activeThumbnail.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center"
    });
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
        <div class="views-valoraciones align-items-center justify-content-between">
          <p class="text-muted info-valoracion d-flex">${inmueble.fechaPublicacionString} - ${inmueble.cantidadVistas} <i class="fa-solid fa-eye"></i></p>
          ${inmueble.tipoOperacionString === "Alquiler Temporal" ? `
          <div class="d-flex mb-2 align-items-end" style="font-size: 13px">
            <p id="promedio" class="info-valoracion text-muted" style="font-size: 13px"></p>
            <div class="rating" id="Valoracion" style="font-size: 13px">
              <div class="rating-fill" id="avgValoracion">★★★★★</div>
              <input value="5" name="rating" id="star5" type="radio" onclick="valoracion()">
              <label for="star5" class="label"></label>
              <input value="4" name="rating" id="star4" type="radio" onclick="valoracion()">
              <label for="star4" class="label"></label>
              <input value="3" name="rating" id="star3" type="radio" onclick="valoracion()">
              <label for="star3" class="label"></label>
              <input value="2" name="rating" id="star2" type="radio" onclick="valoracion()">
              <label for="star2" class="label"></label>
              <input value="1" name="rating" id="star1" type="radio" onclick="valoracion()">
              <label for="star1" class="label"></label>
            </div>
            <p id="valoracion" class="info-valoracion text-muted" style="font-size: 13px"></p>
          </div>` : ''}
        </div>
      `;

      const precioFormateado = Number(inmueble.precioString).toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      
      datosPrincipales += `
        <h2 style="font-weight: 500; font-size: 24px; text-transform: uppercase">${inmueble.tituloString}</h2>
        <p style="font-weight: 300; font-size: 25px; margin-top: 20px">${inmueble.moneda ? "U$D" : "AR$"} ${precioFormateado}</p>
        <h4 style="font-weight: 400; font-size: 18px; margin-top: 20px"><i class="fa-solid fa-arrow-right"></i> ${inmueble.tipoInmuebleString} en ${inmueble.tipoOperacionString}</h4>
        <h4 style="font-weight: 400; font-size: 18px;"><i class="fa-solid fa-location-dot"></i> ${inmueble.provinciaString} - ${inmueble.localidadString}</h4>
        `;
      
        // Datos Vendedor
        inmueble.datosUsuario.forEach((usuario) => {
          datosVendedor += `
            <h5 style="font-weight: 300; font-size: 20px; margin-top: 20px">Contacto</h5>
            <p style="font-weight: 300; font-size: 18px; margin-top: -5px"><i class="fa-solid fa-user"></i> ${usuario.nombre || ''}</p>
            <p style="font-weight: 300; font-size: 18px; margin: -10px 0 10px 0"><i class="fa-solid fa-phone"></i>  ${formatPhoneNumber(usuario.nroTelefono) || ''}</p>
            <div class="icons-vendedor">
              ${usuario.facebook ? `<a class="facebook" href="${usuario.facebook}" target="_blank"><i class='bx bxl-facebook'></i></a>` : ''}
              ${usuario.instagram ? `<a class="instagram" href="https://www.instagram.com/${usuario.instagram}/" target="_blank"><i class="bx bxl-instagram"></i></a>` : ''}
              ${usuario.whatsapp ? `<a class="whatsapp" href="https://wa.me/${usuario.whatsapp}" target="_blank"><i class="bx bxl-whatsapp"></i></a>` : ''}
              ${usuario.email ? 
                `<a class="gmail" href="mailto:${usuario.email}?subject=Consulta%20sobre%20${encodeURIComponent(inmueble.tituloString)}&body=¡Hola%20${encodeURIComponent(usuario.nombre)}!%20Estoy%20interesado%20en%20${encodeURIComponent(inmueble.tituloString)}%20Publicado%20en%20ProyectARG.%20¿Me%20podría%20proporcionar%20información%20adicional?%20¡Muchas%20gracias!" target="_blank">
                  <i class='bx bx-mail-send'></i>
                </a>` 
                : ''}              
            </div>
          `;
        });

        // Detalles Publicaciones
        inmueble.cocheraString = inmueble.cocheraString ? "Si" : "No";
        inmueble.amobladoString = inmueble.amobladoString ? "Si" : "No";

        detallesPublicaciones += `
          <p style="font-weight: 300; font-size: 26px; margin-top: -5px">Detalles</p>
          <div style="font-weight: 300; font-size: 16px;">
            <p><i class="fa-solid fa-ruler-combined"></i> Superficie total: ${inmueble.superficieTotalString || 'Consultar'} m²</p>
            <p><i class="fa-solid fa-ruler-horizontal"></i> Superficie cubierta: ${inmueble.superficieCubiertaString || 'Consultar'} m²</p>
            <p><i class="fa-solid fa-bed"></i> Habitaciones: ${inmueble.dormitoriosString || 'Consultar'}</p>
            <p><i class="fa-solid fa-bath"></i> Baños: ${inmueble.baniosString || 'Consultar'}</p>
            <p><i class="fa-solid fa-utensils"></i> Ambientes: ${inmueble.cantidadAmbientesString || 'Consultar'}</p>
            <p><i class="fa-solid fa-car"></i> Cochera: ${inmueble.cocheraString || 'Consultar'}</p>
            <p><i class="fa-solid fa-couch"></i> Amoblado: ${inmueble.amobladoString || 'Consultar'}</p>
            <p><i class="fa-solid fa-city"></i> Barrio: ${inmueble.barrioString || 'Consultar'}</p>
            <p><i class="fa-solid fa-signs-post"></i> Dirección:
              ${inmueble.direccionString || inmueble.nroDireccionString 
              ? `${inmueble.direccionString || ''} ${inmueble.nroDireccionString ? 'al ' + inmueble.nroDireccionString : ''}`: 'Consultar'}
            </p>
            ${inmueble.pisoString && inmueble.nroDepartamentoString ? `<p><i class="fa-solid fa-building"></i> Piso: ${inmueble.pisoString} - Departamento: ${inmueble.nroDepartamentoString}</p>` : ''}
        </div>
          `;

          let comentarios = `
        <div class="col-lg-12 col-md-12 col-sm-12 ">
              <div class="property-details">
                <p style="font-weight: 300; font-size: 26px; margin-top: -5px;">Descripción</p>
                <p id="Descripcion"></p>
              </div>
            </div>
          <div class="col-lg-12 col-md-12 col-sm-12 ">
              <div class="property-details container-comments" id="ComentariosContainer">
                <h4>Comentarios</h4>
                <button onclick="modalComentarios()">Comentar</button>
                <div id="Comentarios">

                </div>
              </div>
            </div>
          `;

        let ancho = window.innerWidth;
          if (ancho <= 1199) {
            $("#pos2").html(comentarios);
          } else{
            $("#pos1").html(comentarios);
          }


        // Imágenes
        $("#MainImage").attr("src", inmueble.imagenes[0].imagenSrc);
        let descripcionConSaltos
        if(inmueble.descripcionString != null){
          descripcionConSaltos = inmueble.descripcionString.replace(/\n/g,"<br>");
        }
        else{
          descripcionConSaltos = "El vendedor no ha incluido una descripción.";
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
        if(inmueble.tipoOperacionString == "Alquiler Temporal"){
          document.getElementById("ComentariosContainer").style.display = "block";

          

          


          getComentarios();
          avgValoraciones()
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

function formatPhoneNumber(phoneNumber) {
  // Eliminar cualquier carácter que no sea un dígito
  let cleaned = ('' + phoneNumber).replace(/\D/g, '');

  // Verificar que tenga el largo adecuado
  if (cleaned.length !== 10) {
      return phoneNumber; // Retorna el original si no es un número válido
  }

  // Dividir el número en partes
  let part1 = cleaned.slice(0, 4);
  let part2 = cleaned.slice(4, 6);
  let part3 = cleaned.slice(6);

  // Armar el formato deseado
  return `(${part1}) ${part2}-${part3}`;
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
      
      let listaComentarios = "";
      $.each(data, function (index, comentario) {
        listaComentarios +=`
      <div class="comment">
        <h6>${comentario.nombreUsuario}:</h6>
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
  

  let usuarioID = document.getElementById("UsuarioID").value;
  let mensaje = document.getElementById("Comentario").value;
  
  $.ajax({
    url: "../../Comentarios/PostComentario",
    type: "POST",
    data: {
      inmuebleID: inmuebleID,
      usuarioID: usuarioID,
      mensaje: mensaje,
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

function avgValoraciones(){

  $.ajax({
    url: "../../Comentarios/AvgValoracion",
    type: "POST",
    data: {
      inmuebleID: inmuebleID,
    },
    success: function (data) {
      

      document.getElementById("avgValoracion").style = "width: " + data.porcentaje + "%";  
      document.getElementById("promedio").innerHTML = data.puntuacion.toFixed(1);  
      document.getElementById("valoracion").innerHTML = "(" + data.count + ")";
      

    },
    error: function (xhr, status, error) {
      console.log("Disculpe, existió un problema al cargar los comentarios", status, error);
    }
}

)
}

function valoracion() {
  let puntuacion = document.querySelector('input[name="rating"]:checked').value;
  let usuarioID = document.getElementById("UsuarioID").value;

  $.ajax({
    url: "../../Comentarios/PostValoracion",
    type: "POST",
    data: {
      inmuebleID: inmuebleID,
      usuarioID: usuarioID,
      puntuacion: puntuacion,
    },
    success: function (response) {
      icon.innerHTML = '<i class="bx bxs-check-circle"></i>';
      icon.classList.add("succes-svg");
      titulo.innerHTML = "Muchas gracias";
      descripcion.innerHTML = `<label>su valoración ha sido recibida</label>`;
      aceptar.style.display = "block";
      background.classList.add("success");
      alerta.classList.add("enter-alert");
    },
    error: function (xhr, status, error) {
      icon.innerHTML = '<i class="bx bxs-error-circle"></i>';
      icon.classList.add("denied-svg");
      titulo.innerHTML = "Lo sentimos";
      descripcion.innerHTML = `<label>debe estar registrado para valorar este inmueble</label>`;
      aceptar.style.display = "block";
      background.classList.add("denied");
      alerta.classList.add("enter-alert");
    },
  })
  getComentarios()
}


const url = window.location.href;
  const partes = url.split("/");
  const inmuebleID = partes[partes.length - 1];