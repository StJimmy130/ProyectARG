window.onload = ListadoInformePorLugar();
function ListadoInformePorLugar() {
    $.ajax({
        url: '../../Administracion/GetInformePublicacionesPorUsuario',
        data: {},
        type: 'POST',
        dataType: 'json',
        success: function (informePublicacionesPorUsuarioMostrar) {
            let contenidoTabla = ``;
            let agrupadoPorUsuario = {};

            $.each(informePublicacionesPorUsuarioMostrar, function (index, usuario) {
                
                if (!agrupadoPorUsuario[usuario.nombreUsuario]) {
                    agrupadoPorUsuario[usuario.nombreUsuario] = [];
                }
                agrupadoPorUsuario[usuario.nombreUsuario].push(usuario);
            });

            for (let nombreUsuario in agrupadoPorUsuario) {
                contenidoTabla += `
                <tr class="text-sm-start">
                    <td colspan="8" class="text-start" style="text-transform: Uppercase">${nombreUsuario}</td>
                </tr>
                `;
                
                $.each(agrupadoPorUsuario[nombreUsuario], function (index, usuario) {
                    contenidoTabla += `
                    <tr class="text-sm-start" style="text-transform: Uppercase">
                        <td></td>
                        <td class="text-start">${usuario.tituloString}</td>
                        <td class="text-end">$ ${usuario.precioString}</td>
                        <td class="text-start">${usuario.tipoInmuebleString} - ${usuario.tipoOperacionString}</td>
                        <td class="text-start">${usuario.localidadString} - ${usuario.provinciaString}</td>
                        <td class="text-start">${usuario.barrioString}</td>
                        <td class="text-start">${usuario.direccionString} - ${usuario.nroDireccionString}</td>
                    </tr>
                    `
                });
            }
            document.getElementById("tbody-publicacionesPorUsuario").innerHTML = contenidoTabla;
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al procesar la solicitud.');
        }
    });
}
