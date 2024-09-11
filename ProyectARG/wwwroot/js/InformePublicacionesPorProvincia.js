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

            $.each(informePublicacionesPorProvinciaMostrar, function (index, provincia) {
                
                if (!agrupadoPorProvincia[provincia.provinciaString]) {
                    agrupadoPorProvincia[provincia.provinciaString] = [];
                }
                agrupadoPorProvincia[provincia.provinciaString].push(provincia);
            });

            for (let provinciaString in agrupadoPorProvincia) {
                contenidoTabla += `
                <tr>
                    <td style="text-transform: Uppercase">${provinciaString}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                `;
                
                $.each(agrupadoPorProvincia[provinciaString], function (index, provincia) {
                    contenidoTabla += `
                    <tr style="text-transform: Uppercase">
                        <td></td>
                        <td>${provincia.localidadString}</td>
                        <td>${provincia.nombreUsuario}</td>
                        <td>${provincia.tituloString}</td>
                        <td>$ ${provincia.precioString}</td>
                        <td>${provincia.tipoInmuebleString} - ${provincia.tipoOperacionString}</td>
                        <td>${provincia.barrioString}</td>
                        <td>${provincia.direccionString} - ${provincia.nroDireccionString}</td>
                    </tr>
                    `
                });
            }
            document.getElementById("tbody-publicacionesPorProvincia").innerHTML = contenidoTabla;
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al procesar la solicitud.');
        }
    });
}
