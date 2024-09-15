window.onload = ListadoInformePorFecha();

function ListadoInformePorFecha() {
    $.ajax({
        url: '../../Administracion/GetInformePublicacionesPorFecha',
        data: {},
        type: 'POST',
        dataType: 'json',
        success: function (informePublicacionesPorFechaMostrar) {
            let contenidoTabla = ``;
            let agrupadoPorFecha = {};

            // Agrupamos por fecha, luego por usuario y luego por provincia-localidad
            $.each(informePublicacionesPorFechaMostrar, function (index, fecha) {
                if (!agrupadoPorFecha[fecha.fechaPublicacionString]) {
                    agrupadoPorFecha[fecha.fechaPublicacionString] = {};
                }

                // Agrupamos por nombre de usuario dentro de cada fecha
                if (!agrupadoPorFecha[fecha.fechaPublicacionString][fecha.nombreUsuario]) {
                    agrupadoPorFecha[fecha.fechaPublicacionString][fecha.nombreUsuario] = {};
                }

                // Crear clave para provincia-localidad dentro del usuario
                const provinciaLocalidad = `${fecha.provinciaString} - ${fecha.localidadString}`;
                if (!agrupadoPorFecha[fecha.fechaPublicacionString][fecha.nombreUsuario][provinciaLocalidad]) {
                    agrupadoPorFecha[fecha.fechaPublicacionString][fecha.nombreUsuario][provinciaLocalidad] = [];
                }

                // Añadir los datos a la lista correspondiente
                agrupadoPorFecha[fecha.fechaPublicacionString][fecha.nombreUsuario][provinciaLocalidad].push(fecha);
            });

            // Recorremos las fechas
            for (let fechaPublicacionString in agrupadoPorFecha) {
                contenidoTabla += `
                <tr>
                    <td colspan="7" class="text-start" style="text-transform: Uppercase">${fechaPublicacionString}</td>
                </tr>
                `;

                // Recorremos los usuarios dentro de cada fecha
                for (let nombreUsuario in agrupadoPorFecha[fechaPublicacionString]) {
                    contenidoTabla += `
                    <tr>
                        <td></td>
                        <td colspan="6" class="text-start" style="text-transform: Uppercase;">${nombreUsuario}</td>
                    </tr>
                    `;

                    // Recorremos las provincias-localidades dentro de cada usuario
                    for (let provinciaLocalidad in agrupadoPorFecha[fechaPublicacionString][nombreUsuario]) {
                        contenidoTabla += `
                        <tr>
                            <td colspan="2"></td>
                            <td colspan="5" class="text-start" style="text-transform: Uppercase;">${provinciaLocalidad}</td>
                        </tr>
                        `;

                        // Recorremos las publicaciones del usuario en esa provincia-localidad
                        $.each(agrupadoPorFecha[fechaPublicacionString][nombreUsuario][provinciaLocalidad], function (index, fecha) {
                            contenidoTabla += `
                            <tr style="text-transform: Uppercase">
                                <td colspan="3"></td>
                                <td class="text-start" style="max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${fecha.tituloString}</td>
                                <td class="text-end" style="max-width: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${fecha.precioString} ${fecha.moneda ? "U$D" : "AR$"}</td>
                                <td class="text-start" style="max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${fecha.tipoInmuebleString} - ${fecha.tipoOperacionString}</td>
                                <td class="text-start" style="max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${fecha.direccionString} - ${fecha.nroDireccionString}</td>
                                                            
                            </tr>
                            `;
                        });
                    }
                }
            }

            document.getElementById("tbody-publicacionesPorFecha").innerHTML = contenidoTabla;
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al procesar la solicitud.');
        }
    });
}
