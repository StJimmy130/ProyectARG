window.onload = ListadoInformePorLugar();
function ListadoInformePorLugar() {
    $.ajax({
        url: '../../Administracion/GetInformePublicacionesPorUsuario',
        data: {},
        type: 'POST',
        dataType: 'json',
        success: function (informePublicacionesPorProvinciaMostrar) {
            let contenidoTabla = ``;
            let agrupadoPorProvincia = {};

            // Agrupar por provincia
            $.each(informePublicacionesPorProvinciaMostrar, function (index, provincia) {
                if (!agrupadoPorProvincia[provincia.provinciaString]) {
                    agrupadoPorProvincia[provincia.provinciaString] = {};
                }
                if (!agrupadoPorProvincia[provincia.provinciaString][provincia.localidadString]) {
                    agrupadoPorProvincia[provincia.provinciaString][provincia.localidadString] = [];
                }
                agrupadoPorProvincia[provincia.provinciaString][provincia.localidadString].push(provincia);
            });

            // Generar el contenido de la tabla
            for (let provinciaString in agrupadoPorProvincia) {
                // Fila para la provincia
                contenidoTabla += `
                <tr class="text-sm-start">
                    <td class="text-start" colspan="8" style="text-transform: Uppercase">${provinciaString}</td>
                </tr>
                `;

                // Agrupar por localidad dentro de la provincia
                for (let localidadString in agrupadoPorProvincia[provinciaString]) {
                    // Fila para la localidad
                    contenidoTabla += `
                    <tr class="text-sm-start" style="text-transform: Uppercase">
                        <td></td>
                        <td class="text-start" colspan="7">${localidadString}</td>
                    </tr>
                    `;

                    // Fila para los detalles de cada inmueble
                    $.each(agrupadoPorProvincia[provinciaString][localidadString], function (index, inmueble) {
                        contenidoTabla += `
                        <tr class="text-sm-start" style="text-transform: Uppercase">
                            <td colspan="2"></td>
                            <td class="text-start">${inmueble.nombreUsuario}</td>
                            <td class="text-start">${inmueble.tituloString}</td>
                            <td class="text-end">${inmueble.precioString} ${inmueble.moneda ? "U$D" : "AR$"}</td>
                            <td class="text-start">${inmueble.tipoInmuebleString} - ${inmueble.tipoOperacionString}</td>
                            <td class="text-start">${inmueble.barrioString}</td>
                            <td class="text-start">${inmueble.direccionString} - ${inmueble.nroDireccionString}</td>
                        </tr>
                        `;
                    });
                }
            }
            document.getElementById("tbody-publicacionesPorProvincia").innerHTML = contenidoTabla;
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al procesar la solicitud.');
        }
    });
}