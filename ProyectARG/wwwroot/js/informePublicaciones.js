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
                
                if (!agrupadoPorUsuario[usuario.nombreUsuario]) {
                    agrupadoPorUsuario[usuario.nombreUsuario] = [];
                }
                agrupadoPorUsuario[usuario.nombreUsuario].push(usuario);
            });

            for (let nombreUsuario in agrupadoPorUsuario) {
                contenidoTabla += `
                <tr>
                    <td style="text-transform: Uppercase">${nombreUsuario}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                `;
                
                $.each(agrupadoPorUsuario[nombreUsuario], function (index, usuario) {
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
