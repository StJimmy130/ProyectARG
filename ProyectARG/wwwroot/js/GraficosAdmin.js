window.onload = GraficoTorta();

function GraficoTorta() {
    $.ajax({
        url: '../../Administracion/InmueblesPorProvincia', // La URL del método en el backend
        type: 'POST', // Asegúrate de que tu método en el controlador acepte POST
        dataType: 'json',
        success: function (inmueblesPorProvincia) { 
            let labelsTorta = [];
            let dataTorta = [];
            let fondoTorta = [];

            let labelsBarras = [];
            let dataBarras = [];
            let fondoBarras = [];

            // Iterar sobre los resultados para el gráfico de torta
            $.each(inmueblesPorProvincia, function (index, inmueble) {  
                labelsTorta.push(inmueble.provincia); // Agregar el nombre de la provincia
                dataTorta.push(inmueble.cantidadInmuebles); // Agregar la cantidad de inmuebles
                let color = GenerarColor(); // Generar un color para cada sección
                fondoTorta.push(color);
            });

            // Crear el gráfico de torta
            let ctxTorta = document.getElementById("graficoTorta");
            graficoTortaEjercicio = new Chart(ctxTorta, {
                type: 'pie', // Tipo de gráfico (torta)
                data: {
                    labels: labelsTorta,
                    datasets: [{
                        data: dataTorta,
                        backgroundColor: fondoTorta,
                        borderWidth: 3,
                    }],
                },
            });

            // Ordenar las provincias por la cantidad de inmuebles y tomar el top 10
            let top10Provincias = inmueblesPorProvincia.sort((a, b) => b.cantidadInmuebles - a.cantidadInmuebles).slice(0, 10);

            // Preparar los datos para el gráfico de barras
            $.each(top10Provincias, function (index, inmueble) {
                // Verifica si el campo provincia está definido, si no asigna un valor por defecto
                let nombreProvincia = inmueble.provincia ? inmueble.provincia : "Desconocido";
                labelsBarras.push(nombreProvincia); // Provincias para las barras
                dataBarras.push(inmueble.cantidadInmuebles); // Cantidad de inmuebles
                let color = GenerarColor(); // Generar un color para las barras
                fondoBarras.push(color);
            });

            // Crear el gráfico de barras horizontales
            let ctxBarras = document.getElementById("graficoBarras");
            let graficoBarras = new Chart(ctxBarras, {
                type: 'bar', // Tipo de gráfico (barras)
                data: {
                    labels: labelsBarras,
                    datasets: [{
                        label: 'Top 10 provincias con más actividad',
                        data: dataBarras,
                        backgroundColor: fondoBarras,
                        borderWidth: 3,
                    }],
                },
                options: {
                    indexAxis: 'y', // Esto hace que las barras sean horizontales
                    scales: {
                        x: {
                            beginAtZero: true // Para que el eje X comience desde 0
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                // Elimina el cuadro de color
                                usePointStyle: true, // Usa un punto en lugar del cuadro
                                pointStyle: 'line'   // Cambia el punto por una línea o cualquier otro estilo
                            }
                        }
                    }
                }
            });


        },
        error: function (xhr, status) {
            Swal.fire({
                title: "Disculpe",
                text: "Existió un problema al cargar los gráficos.",
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
  