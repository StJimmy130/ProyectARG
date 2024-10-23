window.onload = GraficoTorta(),PublicacionesPorTipoDeOperacion();

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

            let top10Provincias = inmueblesPorProvincia.sort((a, b) => b.cantidadInmuebles - a.cantidadInmuebles).slice(0, 10);

            // Preparar los datos para el gráfico de barras
            $.each(top10Provincias, function (index, inmueble) {
                let nombreProvincia = inmueble.provincia ? inmueble.provincia : "Desconocido";
                let etiquetaProvincia = `Top #${index + 1} - ${nombreProvincia}`;
                
                labelsBarras.push(etiquetaProvincia); // Provincias para las barras
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
                                usePointStyle: true, // Usa un punto en lugar del cuadro
                                pointStyle: 'line'   // Cambia el punto por una línea o cualquier otro estilo
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function (tooltipItem) {
                                    // Solo muestra el número de inmuebles
                                    return tooltipItem.raw;
                                }
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



function PublicacionesPorTipoDeOperacion() {
    $.ajax({
        url: '/Administracion/ContarPublicacionesPorTipoOperacion', // Ajusta esta ruta según tu controlador
        type: 'GET',
        success: function (response) {
            let labelsTorta = [];
            let dataTorta = [];
            let coloresTorta = [];
    
            // Recorrer la respuesta y preparar los datos para el gráfico
            $.each(response, function (index, item) {
                // Cambiar el nombre de la operación si es AlquilerTemporal
                let tipoOperacion = item.tipoOperacion === "AlquilerTemporal" ? "Alquiler temporal" : item.tipoOperacion;

                labelsTorta.push(tipoOperacion); // Agregar el nombre del tipo de operación
                dataTorta.push(item.cantidad); // Agregar la cantidad correspondiente
    
                // Generar un color aleatorio en la gama de azules y verdes
                let color = GenerarColorAzulVerde();
                coloresTorta.push(color);
            });
    
            // Crear el gráfico de torta
            let ctxTorta = document.getElementById("graficoPublicacionesPorOperacion").getContext('2d');
            let graficoTorta = new Chart(ctxTorta, {
                type: 'pie', // Tipo de gráfico (torta)
                data: {
                    labels: labelsTorta, // Etiquetas (Alquiler, Venta, AlquilerTemporal)
                    datasets: [{
                        data: dataTorta, // Datos (cantidades)
                        backgroundColor: coloresTorta, // Colores generados
                    }],
                },
                options: {
                    responsive: true, // Gráfico responsivo
                    plugins: {
                        legend: {
                            position: 'bottom', // Posición de la leyenda
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    let label = context.label || '';
                                    let value = context.raw || 0;
                                    return `${label}: ${value}`; // Formato de la etiqueta en el tooltip
                                }
                            }
                        }
                    }
                }
            });
        },
        error: function (xhr, status, error) {
            console.error("Error al realizar la solicitud: ", error);
        }
    });
}



// Función para generar colores en la gama de azules y verdes
function GenerarColorAzulVerde() {
    let rr = Math.floor(Math.random() * 50); // Componente rojo bajo
    let gg = Math.floor(100 + Math.random() * 156); // Verde medio-alto
    let bb = Math.floor(150 + Math.random() * 106); // Azul medio-alto
    return `rgb(${rr}, ${gg}, ${bb})`; // Retorna un color en formato RGB
}




function GenerarColor() {
    let rr, gg, bb;
  
    // Función para generar un valor aleatorio entre un rango dado
    function ajustarColor(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
  
    // Generar colores entre azul, violeta, y rojo, evitando verdes
    rr = ajustarColor(0, 100);    // Rango bajo para rojo (evita que el rojo sea predominante)
    gg = ajustarColor(100, 256);  // Rango más alto para verde
    bb = ajustarColor(150, 256);  // Rango alto para azul
    
    // Convertimos a hexadecimal y formateamos para que tenga siempre dos dígitos.
    let colorHex = `#${rr.toString(16).padStart(2, '0')}${gg.toString(16).padStart(2, '0')}${bb.toString(16).padStart(2, '0')}`;
    return colorHex;
  }
  