window.onload = GraficoTorta();

function GraficoTorta() {
    $.ajax({
        url: '../../Administracion/InmueblesPorProvincia', // Cambia la URL según tu configuración
        type: 'POST', // Asegúrate de que tu método en el controlador acepte POST
        dataType: 'json',
        success: function (inmueblesPorProvincia) { 
            let labels = [];
            let data = [];
            let fondo = [];

            // Iterar sobre los resultados recibidos
            $.each(inmueblesPorProvincia, function (index, inmueble) {  
                labels.push(inmueble.provincia); // Agregar el nombre de la provincia
                data.push(inmueble.cantidadInmuebles); // Agregar la cantidad de inmuebles
                let color = GenerarColor(); // Generar un color para cada sección
                fondo.push(color);
            });
            
            let ctxTorta = document.getElementById("graficoTorta");
            graficoTortaEjercicio = new Chart(ctxTorta, {
                type: 'pie', // Tipo de gráfico (torta)
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: fondo,
                        borderWidth: 3,
                    }],
                },
            });

        },
        error: function (xhr, status) {
            Swal.fire({
                title: "Disculpe",
                text: "Existió un problema al cargar el gráfico.",
                icon: "warning",
            });
        }
    });  
}



function GenerarColor() {
    let rr, gg, bb;
  
    // Función para generar un valor aleatorio entre un rango dado
    function ajustarColor(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
  
    // Generar colores entre azul, violeta, y rojo, evitando verdes
    rr = ajustarColor(0, 256); // 128 a 255 para rojo y violeta
    gg = ajustarColor(0, 256); // 0 a 127 para evitar verdes
    bb = ajustarColor(0, 256); // 128 a 255 para azul y violeta
  
    // Convertimos a hexadecimal y formateamos para que tenga siempre dos dígitos.
    let colorHex = `#${rr.toString(16).padStart(2, '0')}${gg.toString(16).padStart(2, '0')}${bb.toString(16).padStart(2, '0')}`;
    return colorHex;
  }
  