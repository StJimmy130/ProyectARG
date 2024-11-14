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

            // Verificar si la pantalla es pequeña
            let isSmallScreen = window.innerWidth <= 1200; // Puedes ajustar el tamaño en función de tu diseño

            // Limitar los datos a 10 registros si la pantalla es pequeña
            let labelsTortaDisplay = isSmallScreen ? labelsTorta.slice(0, 10) : labelsTorta;
            let dataTortaDisplay = isSmallScreen ? dataTorta.slice(0, 10) : dataTorta;
            let fondoTortaDisplay = isSmallScreen ? fondoTorta.slice(0, 10) : fondoTorta;

            graficoTortaInmuebles = new Chart(ctxTorta, {
                type: 'pie',
                data: {
                    labels: labelsTortaDisplay,
                    datasets: [{
                        data: dataTortaDisplay,
                        backgroundColor: fondoTortaDisplay,
                        borderColor: 'rgba(255, 255, 255, 0.7)',
                        borderWidth: 1,
                        hoverBorderColor: 'rgba(0, 0, 0, 0.8)',
                        hoverBackgroundColor: 'rgba(255, 255, 255, 0.2)'
                    }],
                },
                options: {
                    responsive: true,
                    plugins: {
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: 'white',
                            bodyColor: 'white',
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                            borderWidth: 1,
                        },
                        legend: {
                            display: true,
                            position: 'right',
                            align: 'start',
                            labels: {
                                usePointStyle: true,
                                boxWidth: 10,
                                padding: 20
                            }
                        }
                    },
                }
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
                        label: "Cantidad de Inmuebles",
                        data: dataBarras,
                        backgroundColor: fondoBarras,
                        borderColor: 'rgba(255, 255, 255, 0.7)', // Color de borde
                        borderWidth: 1, // Bordes más finos
                        hoverBorderColor: 'rgba(0, 0, 0, 0.8)', // Color del borde al pasar el ratón
                        hoverBackgroundColor: 'rgba(255, 255, 255, 0.8)' // Color de fondo al pasar el ratón
                    }]
                },
                options: {
                    indexAxis: 'y', // Esto hace que las barras sean horizontales
                    scales: {
                        x: {
                            beginAtZero: true, // Para que el eje X comience desde 0
                            ticks: {
                                color: '#3f3f3f' // Color del texto de los ticks
                            },
                            grid: {
                                color: 'rgba(1, 1, 1, 0.2)' // Color de las líneas de la cuadrícula
                            }
                        },
                        y: {
                            ticks: {
                                color: '#3f3f3f' // Color del texto de los ticks
                            },
                            grid: {
                                color: 'rgba(1, 1, 1, 0.2)' // Color de las líneas de la cuadrícula
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false // Oculta la leyenda del gráfico de barras
                        },
                        tooltip: {
                            callbacks: {
                                label: function (tooltipItem) {
                                    // Solo muestra el número de inmuebles
                                    return tooltipItem.raw;
                                }
                            },
                            backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fondo del tooltip
                            titleColor: 'rgba(255, 255, 255, 1)', // Color del título del tooltip
                            bodyColor: 'white', // Color del texto del cuerpo del tooltip
                            borderColor: 'rgba(255, 255, 255, 0.5)', // Color del borde del tooltip
                            borderWidth: 1, // Grosor del borde del tooltip
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
    // Obtener el color de la variable CSS
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color2').trim();

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
                let color = GenerarColor();
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
                        borderColor: 'rgba(255, 255, 255, 0.7)', // Color de borde
                        borderWidth: 1, // Bordes más finos
                        hoverBorderColor: 'rgba(0, 0, 0, 0.8)', // Color del borde al pasar el ratón
                        hoverBackgroundColor: 'rgba(255, 255, 255, 0.2)' 
                    }],
                },
                options: {
                    responsive: true, // Gráfico responsivo
                    plugins: {
                        legend: {
                            position: 'bottom', // Posición de la leyenda
                            labels: {
                                usePointStyle: true, // Usa puntos en lugar de cuadros
                                pointStyle: 'circle', // Forma de los puntos en la leyenda
                                color: '#3f3f3f', // Color de la leyenda
                                boxHeight: 10, // Altura de los cuadros en la leyenda
                                padding: 20 // Espaciado entre leyenda
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fondo del tooltip
                            titleColor: 'white', // Color del título del tooltip
                            bodyColor: 'white', // Color del texto del cuerpo del tooltip
                            borderColor: 'rgba(255, 255, 255, 0.5)', // Color del borde del tooltip
                            borderWidth: 1, // Grosor del borde del tooltip
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


function GenerarColor() {
    // Ajusta los rangos para obtener colores más saturados
    let rr = Math.floor(50 + Math.random() * (156)); // Rojo entre 50 y un rango ajustado por saturación
    let gg = Math.floor(100 + Math.random() * (100)); // Verde entre 100 y un rango ajustado por saturación
    let bb = Math.floor(150 + Math.random() * (106)); // Azul entre 150 y un rango ajustado por saturación
    let aa = 1; // Opacidad siempre máxima

    return `rgba(${rr}, ${gg}, ${bb}, ${aa})`;
}



$(document).ready(function() {
    $.ajax({
        url: '../Administracion/InmueblesTotalesActivos',
        method: 'GET',
        contentType: 'application/json',
        success: function(data) {
            $('#inmueblesActivos').text(data);

        },
        error: function() {
            $('#inmueblesActivos').text('Error al cargar los datos');
            console.error('Error al cargar los datos');
        }
    });
});

$(document).ready(function() {
    $.ajax({
        url: '../Administracion/InmueblesUltimos30Dias',
        method: 'GET',
        contentType: 'application/json',
        success: function(data) {
            const { inmueblesUltimos30Dias, inmueblesPeriodoAnterior } = data;
            $('#inmueblesUltimos30Dias').text(inmueblesUltimos30Dias);

            // Lógica para mostrar la flecha de incremento o decremento
            let flechaHtml = '';
            if (inmueblesUltimos30Dias > inmueblesPeriodoAnterior) {
                flechaHtml = '<i class="ms-2 fa-solid fa-circle-arrow-up" style="color: green; font-size: 18px"></i>';
            } else if (inmueblesUltimos30Dias < inmueblesPeriodoAnterior) {
                flechaHtml = '<i class="ms-2 fa-solid fa-circle-arrow-down" style="color: red; font-size: 18px"></i>';
            } else {
                flechaHtml = '<i class="ms-2 fa-solid fa-circle-minus" style="color: gray; font-size: 18px"></i>';
            }

            $('#inmueblesUltimos30Dias').append(flechaHtml);
        },
        error: function() {
            $('#inmueblesActivos').text('Error al cargar los datos');
            console.error('Error al cargar los datos');
        }
    });
});



$(document).ready(function() {
    $.ajax({
        url: '../Administracion/UsuariosTotales',
        method: 'GET',
        contentType: 'application/json',
        success: function(data) {
            $('#usuariosRegistrados').text(data);
        },
        error: function() {
            $('#usuariosRegistrados').text('Error al cargar los datos');
            console.error('Error al cargar los datos');
        }
    });
});
