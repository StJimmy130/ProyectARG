document.addEventListener('DOMContentLoaded', () => {
    let currentStep = 0;
    const steps = document.querySelectorAll('.step');
  
    function showStep(index) {
      steps.forEach((step, i) => {
        step.classList.toggle('active', i === index);
      });
    }
  
    function nextStep() {
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
  
    document.querySelectorAll('.next-btn').forEach(button => {
      button.addEventListener('click', nextStep);
    });
  
    document.querySelectorAll('.prev-btn').forEach(button => {
      button.addEventListener('click', prevStep);
    });
  
    showStep(currentStep); // Inicializa mostrando el primer paso
  });


  function GuardarPublicacion() {
    let inmuebleID = document.getElementById("InmuebleID").value;
    let localidadID = document.getElementById("LocalidadID").value;
    let provinciaID = document.getElementById("ProvinciaID").value;
    let precio = document.getElementById("Precio").value;
    let superficieTotal = document.getElementById("Area").value;
    let superficieCubierta = document.getElementById("AreaCubierta").value;
    let tipoOperacion = document.getElementById("Operacion").value;
    let tipoInmueble = document.getElementById("TipoInmueble").value;
    let amoblado = document.getElementById("Amoblado").checked ? 1 : 0;
    let dormitorios = document.getElementById("Habitaciones").value;
    let banios = document.getElementById("Banios").value;
    let cantidadAmbientes = document.getElementById("Ambientes").value;
    let cochera = document.getElementById("Estacionamiento").checked ? 1 : 0;
    let direccion = document.getElementById("Direccion").value;
    let nroDireccion = document.getElementById("NroDireccion").value;
    let descripcion = document.getElementById("Descripcion").value;


    $.ajax({
        url: "/Inmuebles/GuardarPublicacion",
        data: {
            InmuebleID: inmuebleID,
            LocalidadID: localidadID,
            ProvinciaID: provinciaID,
            Precio: precio,
            SuperficieTotal: superficieTotal,
            SuperficieCubierta: superficieCubierta,
            TipoOperacion: tipoOperacion,
            TipoInmueble: tipoInmueble,
            Amoblado: amoblado,
            Dormitorios: dormitorios,
            Banios: banios,
            CantidadAmbientes: cantidadAmbientes,
            Cochera: cochera,
            Direccion: direccion,
            NroDireccion: nroDireccion,
            Descripcion: descripcion,
        
        },
        type: "POST",
        dataType: "json",
        success: function (resultado) {
            if (resultado != "") {
                alert(resultado);
            }
            // Actualizar el listado de publicaciones o cualquier otra acción
        }
    });
}


function MostrarPublicacion(){
    $.ajax({
        
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
  const previewContainer = document.getElementById('preview-container');
  
  fileInput.addEventListener('change', (event) => {
    previewContainer.innerHTML = ''; // Limpiar el contenedor de vista previa
    const files = event.target.files;
  
    // Mostrar hasta tres imágenes
    const maxPreview = 3;
    for (let i = 0; i < Math.min(files.length, maxPreview); i++) {
      const file = files[i];
  
      // Crear una URL para la imagen
      const fileReader = new FileReader();
      fileReader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        previewContainer.appendChild(img);
      }
      fileReader.readAsDataURL(file);
    }
  
    // Mostrar contador si hay más de tres imágenes
    if (files.length > maxPreview) {
      const imageCounter = document.createElement('div');
      imageCounter.id = 'image-counter';
      imageCounter.innerText = `+${files.length - maxPreview}`;
      previewContainer.appendChild(imageCounter);
    }
  });
});

