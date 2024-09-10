window.onload = ListadoInformePorLugar();
function ListadoInformePorLugar() {
    $.ajax({
        url: '../../Localidades/InformePublicacionesPorUsuario',
        data: {},
        type: 'POST',
        dataType: 'json',
        success: function (informePublicacionesPorUsuarioMostrar) {
            let contenidoTabla = ``;
            let agrupadoPorUsuario = {};

            $.each(informePublicacionesPorUsuarioMostrar, function (index, usuario) {
                
                if (!agrupadoPorUsuario[usuario.usuarioID]) {
                    agrupadoPorUsuario[usuario.usuarioID] = [];
                }
                agrupadoPorUsuario[usuario.usuarioID].push(usuario);
            });

            for (let usuarioID in agrupadoPorUsuario) {
                contenidoTabla += `
                <tr>
                    <td style="text-transform: Uppercase">${usuarioID}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                `;
                
                $.each(agrupadoPorUsuario[usuarioID], function (index, usuario) {
                    contenidoTabla += `
                    <tr style="text-transform: Uppercase">
                        <td></td>
                        <td>${usuario.tituloString}</td>
                        <td>$ ${usuario.precioString}</td>
                        <td>${usuario.tipoInmuebleString} - ${usuario.tipoOperacionString}</td>
                        <td>${usuario.localidadString} - ${usuario.provinciaString}</td>
                        <td>${usuario.barrioString}</td>
                        <td>${usuario.direccionString} - ${usuario.nroDireccionString}</td>
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
