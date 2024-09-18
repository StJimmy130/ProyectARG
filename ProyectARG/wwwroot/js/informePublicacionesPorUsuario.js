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
                        <td class="text-start" style="min-width: 85px; max-width: 190px">${usuario.tituloString}</td>
                        <td class="text-end" style="min-width: 85px;">${usuario.precioString} ${usuario.moneda ? "U$D" : "AR$"}</td>
                        <td class="text-start" style="min-width: 85px; max-width: 190px">${usuario.tipoInmuebleString} - ${usuario.tipoOperacionString}</td>
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

function Imprimir() {
    var doc = new jsPDF('l', 'mm', [297, 210]);
  
    var totalPagesExp = "{total_pages_count_string}";
    var pageContent = function (data) {
        var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
  
        // HEADER
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Informe de publicaciones por usuario", 15, 10);
  
        // FOOTER
        var str = "Página " + data.pageCount;
        if (typeof doc.putTotalPages == "function") {
            str = str + " de " + totalPagesExp;
        }
  
        doc.setLineWidth(8);
        doc.setDrawColor(1, 1, 1);
        doc.line(14, pageHeight - 11, 196, pageHeight - 11);
  
        doc.setFontSize(10);
        doc.setFontStyle("bold");
        doc.text(str, 17, pageHeight - 10);
    };
  
    var elem = document.getElementById("TablaPorUsuario");
    var res = doc.autoTableHtmlToJson(elem);
    doc.autoTable(res.columns, res.data, {
        addPageContent: pageContent,
        theme: 'grid',
        styles: { fillColor: [0, 143, 81], halign: "center" },
        columnStyles: {
            0: { halign: "left", fillColor: [255, 255, 255], fontSize: 7 }, 
            1: { halign: "left", fillColor: [255, 255, 255], fontSize: 7 },
            2: { halign: "right", fillColor: [255, 255, 255], fontSize: 7, cellWidth: 100 },
            3: { halign: "left", fillColor: [255, 255, 255], fontSize: 7 },
            4: { halign: "left", fillColor: [255, 255, 255], fontSize: 7 },
            5: { halign: "left", fillColor: [255, 255, 255], fontSize: 7 },
            6: { halign: "left", fillColor: [255, 255, 255], fontSize: 7 },
        },
        margin: { top: 20 },
    });
  
    if (typeof doc.putTotalPages === "function") {
        doc.putTotalPages(totalPagesExp);
    }
  
    var string = doc.output("datauristring");
    var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>";
  
    var x = window.open();
    x.document.open();
    x.document.write(iframe);
    x.document.close();
}
