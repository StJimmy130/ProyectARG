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
                <tr>
                    <td style="text-transform: Uppercase">${provinciaString}</td>
                    <td colspan="7"></td>
                </tr>
                `;

                // Agrupar por localidad dentro de la provincia
                for (let localidadString in agrupadoPorProvincia[provinciaString]) {
                    // Fila para la localidad
                    contenidoTabla += `
                    <tr style="text-transform: Uppercase">
                        <td></td>
                        <td>${localidadString}</td>
                        <td colspan="6"></td>
                    </tr>
                    `;

                    // Fila para los detalles de cada inmueble
                    $.each(agrupadoPorProvincia[provinciaString][localidadString], function (index, inmueble) {
                        contenidoTabla += `
                        <tr style="text-transform: Uppercase">
                            <td></td>
                            <td></td>
                            <td>${inmueble.nombreUsuario}</td>
                            <td>${inmueble.tituloString}</td>
                            <td>$ ${inmueble.precioString}</td>
                            <td>${inmueble.tipoInmuebleString} - ${inmueble.tipoOperacionString}</td>
                            <td>${inmueble.barrioString}</td>
                            <td>${inmueble.direccionString} - ${inmueble.nroDireccionString}</td>
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