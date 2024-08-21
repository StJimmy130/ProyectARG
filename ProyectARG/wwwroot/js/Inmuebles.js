

window.onload = function() {
  icon.innerHTML = '<i class="bx bxs-error-circle"></i>';
  icon.classList.add("alert-svg");
  titulo.innerHTML = "Atencion!!!"
  descripcion.innerHTML = `<label>los campos con (<p>*</p>) son obligatorios</label>`
  aceptar.style.display = "block";
  background.classList.add("alert");
  alerta.classList.add("enter-alert");
}

document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 0;
  const steps = document.querySelectorAll('.step');

  function showStep(index) {
    steps.forEach((step, i) => {
      step.classList.toggle('active', i === index);
    });
  }

  document.getElementById('boton-next').addEventListener('click', function(event) {
    form = document.getElementById("form");
    
    if (document.getElementById("Titulo").value == "" ||
    document.getElementById("Precio").value == "" ||
    document.getElementById("Operacion").value == 0 ||
    document.getElementById("TipoInmueble").value == 0 ||
    document.getElementById("LocalidadID").value == 0 ||
    document.getElementById("ProvinciaID").value == 0) {
      // Si el formulario no es válido, mostrar un mensaje
      background.classList.add("denied");
      icon.classList.add("denied-svg");
      icon.innerHTML = '<i class="bx bxs-x-circle" ></i>';
      titulo.innerHTML = "Advertencia"
      descripcion.innerHTML = "Por favor, complete todos los campos requeridos."
      aceptar.style.display = "block";
      alerta.classList.add("enter-alert");
      form.reportValidity();

      setTimeout(function() {
        hiddenAlert()
        
      }, 3000);
    }
  });

  const inputs = [
    document.getElementById("Titulo"),
    document.getElementById("Precio"),
    document.getElementById("Operacion"),
    document.getElementById("TipoInmueble"),
    document.getElementById("LocalidadID"),
    document.getElementById("ProvinciaID")
  ];

  inputs.forEach(input => {
    input.addEventListener('input', validarInputs); // Para inputs de texto
    input.addEventListener('change', validarInputs); // Para select y otros inputs
  });

  function validarInputs() {
    boton = document.getElementById("boton-next");
    if(
      document.getElementById("Titulo").value != "" &&
      document.getElementById("Precio").value != "" &&
      document.getElementById("Operacion").value != 0 &&
      document.getElementById("TipoInmueble").value != 0 &&
      document.getElementById("LocalidadID").value != 0 &&
      document.getElementById("ProvinciaID").value != 0
    ){
      boton.classList.add("btn-primary", "next-btn");
      boton.classList.remove("btn-secondary");
    }
    else{
      boton.classList.remove("btn-primary", "next-btn");
      boton.classList.add("btn-secondary");
    }
  
    refreshBtn();
  }
  
  function nextStep() {
    // Verifica nuevamente que los campos estén completos antes de avanzar
    if(
      document.getElementById("Titulo").value == "" ||
      document.getElementById("Precio").value == "" ||
      document.getElementById("Operacion").value == 0 ||
      document.getElementById("TipoInmueble").value == 0 ||
      document.getElementById("LocalidadID").value == 0 ||
      document.getElementById("ProvinciaID").value == 0
    ){
      return; // No avanza al siguiente paso
    }
  
    if (currentStep < steps.length - 1) {
      currentStep++;
      showStep(currentStep);
    }
  }
  
  function prevStep() {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  }
  
  function refreshBtn() {
    // Reasigna los listeners cada vez que se refresca el estado del botón
    document.querySelectorAll('.next-btn').forEach(button => {
      button.removeEventListener('click', nextStep); // Elimina el listener anterior para evitar duplicados
      button.addEventListener('click', nextStep);
    });
  
    document.querySelectorAll('.prev-btn').forEach(button => {
      button.removeEventListener('click', prevStep); // Elimina el listener anterior para evitar duplicados
      button.addEventListener('click', prevStep);
    });
  }

  showStep(currentStep); // Inicializa mostrando el primer paso
});

function actualizarLocalidades() {
  var provinciaID = document.getElementById("ProvinciaID").value;

  // Realizar la solicitud AJAX para obtener las localidades
  $.ajax({
      url: '../../Home/GetLocalidadesByProvincia',
      type: 'GET',
      data: { provinciaID: provinciaID },
      success: function (localidades) {
          var localidadSelect = document.getElementById("LocalidadID");
          localidadSelect.innerHTML = '<option value="0">[SELECCIONE...]</option>'; // Limpiar opciones anteriores

          // Agregar nuevas opciones
          localidades.forEach(function (localidad) {
              var option = document.createElement("option");
              option.value = localidad.localidadID;
              option.text = localidad.nombre;
              localidadSelect.add(option);
          });
      },
      error: function () {
          console.log('Error al cargar las localidades.');
      }
  });
}



function GuardarPublicacion() {
  let inmuebleID = document.getElementById("InmuebleID").value;
  let localidadID = document.getElementById("LocalidadID").value;
  let provinciaID = document.getElementById("ProvinciaID").value;
  let barrio = document.getElementById("Barrio").value;
  let titulo = document.getElementById("Titulo").value;
  let precio = document.getElementById("Precio").value;
  let superficieTotal = document.getElementById("Area").value;
  let superficieCubierta = document.getElementById("AreaCubierta").value;
  let tipoOperacion = document.getElementById("Operacion").value;
  let tipoInmueble = document.getElementById("TipoInmueble").value;
  let amoblado = document.getElementById("Amoblado").checked;
  let dormitorios = document.getElementById("Habitaciones").value;
  let banios = document.getElementById("Banios").value;
  let cantidadAmbientes = document.getElementById("Ambientes").value;
  let cochera = document.getElementById("Estacionamiento").checked;
  let direccion = document.getElementById("Direccion").value;
  let nroDireccion = document.getElementById("NroDireccion").value;
  let piso = document.getElementById("Piso").value;
  let nroDepartamento = document.getElementById("NroDepartamento").value;
  let descripcion = document.getElementById("Descripcion").value;
  let imagenes = document.getElementById("Imagen").files; // Nuevo input para archivos de imagen

  // Crear un objeto FormData para enviar los datos y archivos
  let formData = new FormData();
  formData.append("InmuebleID", inmuebleID);
  formData.append("LocalidadID", localidadID);
  formData.append("ProvinciaID", provinciaID);
  formData.append("Barrio", barrio);
  formData.append("Titulo", titulo);
  formData.append("Precio", precio);
  formData.append("SuperficieTotal", superficieTotal);
  formData.append("SuperficieCubierta", superficieCubierta);
  formData.append("TipoOperacion", tipoOperacion);
  formData.append("TipoInmueble", tipoInmueble);
  formData.append("Amoblado", amoblado);
  formData.append("Dormitorios", dormitorios);
  formData.append("Banios", banios);
  formData.append("CantidadAmbientes", cantidadAmbientes);
  formData.append("Cochera", cochera);
  formData.append("Direccion", direccion);
  formData.append("NroDireccion", nroDireccion);
  formData.append("Piso", piso);
  formData.append("NroDepartamento", nroDepartamento);
  formData.append("Descripcion", descripcion);

  // Agregar cada imagen al FormData
  for (let i = 0; i < imagenes.length; i++) {
      formData.append("Imagenes", imagenes[i]);
  }

  $.ajax({
      url: "/Inmuebles/GuardarPublicacion",
      data: formData,
      type: "POST",
      dataType: "json",
      contentType: false,
      processData: false,
      success: function (resultado) {
          if (resultado != "") {
            icon.classList.add("succes-svg");
            icon.innerHTML = '<i class="bx bxs-check-circle"></i>'
            
            document.getElementById("alert-title").innerHTML = "Felicitaciones!!!"
            document.getElementById("alert-description").innerHTML = (resultado)
            aceptar.style.display = "block";
            background.classList.add("success");
            alerta.classList.add("enter-alert");

            setTimeout(function() {
              hiddenAlert();
            }, 3000);
          }
          ListadoPublicaciones();
      },
      error: function (err) {
          console.error(err);
      }
  });
}





function ValidarEliminacion(inmuebleID) {
    var elimina = confirm("¿Esta seguro que desea eliminar esta publicación?")
    if(elimina == true) {
        EliminarPublicacion(inmuebleID)
    }
}

function EliminarPublicacion(inmuebleID) {
    $.ajax({
        url: '../../Inmuebles/EliminarPublicacion',
        data: { InmuebleID: inmuebleID },
        type: 'POST',
        dataType: 'json',

        success: function (eliminarPublicacion) {
        
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
  const fileInput = document.getElementById('Imagen');
  const listContainer = document.getElementById('list-container');
  const previewContainer = document.getElementById('preview-container');
  
  fileInput.addEventListener('change', (event) => {
    listContainer.innerHTML = ''; // Limpiar el contenedor de lista
    previewContainer.innerHTML = ''; // Limpiar el contenedor de vista previa
    const files = event.target.files;
  
    // Mostrar hasta diez imágenes en list-container
    const maxPreview = 100;
    for (let i = 0; i < Math.min(files.length, maxPreview); i++) {
      const file = files[i];
  
      // Crear una URL para la imagen
      const fileReader = new FileReader();
      fileReader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.classList.add('miniatura');
        listContainer.appendChild(img);

        // Si es la primera imagen, también agregarla al preview-container
        if (i === 0) { // Cambié de i === 1 a i === 0
          const previewImg = document.createElement('img');
          previewImg.src = e.target.result;
          previewImg.id = 'mainImage';
          previewContainer.appendChild(previewImg);
        }
        
        // Actualizar los eventos de clic para las miniaturas
        updateThumbnailEvents();
      }
      fileReader.readAsDataURL(file);
    }
  
    // Mostrar contador si hay más de diez imágenes
    if (files.length > maxPreview) {
      const imageCounter = document.createElement('div');
      imageCounter.id = 'image-counter';
      imageCounter.innerText = `+${files.length - maxPreview}`;
      listContainer.appendChild(imageCounter);
    }
  });

  function updateThumbnailEvents() {
    const thumbnails = listContainer.querySelectorAll('img.miniatura');
    
    // Agregar evento de clic a cada miniatura
    thumbnails.forEach(function(thumbnail) {
      thumbnail.addEventListener('click', function() {
        // Obtener el elemento de la imagen principal
        const mainImage = document.getElementById("mainImage");

        // Obtener la URL de la imagen del elemento del thumbnail clickeado
        const newImageSrc = this.getAttribute("src");

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
  }
});


// funcion para hacer aparecer inputs de departamentos

document.addEventListener('DOMContentLoaded', function() {
  // Obtener el select y los contenedores de los inputs
  const tipoInmuebleSelect = document.getElementById('TipoInmueble');
  const pisoContainer = document.getElementById('piso-container');
  const departamentoContainer = document.getElementById('departamento-container');

  // Función para mostrar/ocultar los inputs
  function toggleInputs() {
    if (tipoInmuebleSelect.value === '5') {
      pisoContainer.style.display = 'block';
      departamentoContainer.style.display = 'block';
    } else {
      pisoContainer.style.display = 'none';
      departamentoContainer.style.display = 'none';
    }
  }

  // Inicializar la visibilidad de los inputs
  toggleInputs();

  // Agregar un event listener para detectar cambios en el select
  tipoInmuebleSelect.addEventListener('change', toggleInputs);
});