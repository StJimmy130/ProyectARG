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
                    agrupadoPorProvincia[provincia.provinciaString] = [];
                }
                agrupadoPorProvincia[provincia.provinciaString].push(provincia);
            });

            // Generar el contenido de la tabla
            for (let provinciaString in agrupadoPorProvincia) {
                // Fila para la provincia
                contenidoTabla += `
                <tr class="text-sm-start">
                    <td class="text-start" colspan="8" style="text-transform: Uppercase">${provinciaString}</td>
                </tr>
                `;

                // Fila para los detalles de cada inmueble
                $.each(agrupadoPorProvincia[provinciaString], function (index, inmueble) {
                    contenidoTabla += `
                    <tr class="text-sm-start" style="text-transform: Uppercase">
                        <td></td>
                        <td class="text-start">${inmueble.localidadString}</td>
                        <td class="text-start" style="min-width: 70px;">${inmueble.tituloString}</td>
                        <td class="text-end">${inmueble.precioString} ${inmueble.moneda ? "U$D" : "AR$"}</td>
                        <td class="text-start">${inmueble.tipoInmuebleString} - ${inmueble.tipoOperacionString}</td>
                        <td class="text-start">${inmueble.barrioString}</td>
                        <td class="text-start">${inmueble.direccionString} - ${inmueble.nroDireccionString}</td>
                    </tr>
                    `;
                });
            }
            document.getElementById("tbody-publicacionesPorProvincia").innerHTML = contenidoTabla;
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al procesar la solicitud.');
        }
    });
}


function Imprimir() {
    // var doc = new jsPDF();
    var doc = new jsPDF('l', 'mm', [297, 210]);
  
    var totalPagesExp = "{total_pages_count_string}";
    var pageContent = function (data) {
      var pageHeight =
        doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
      var pageWidth =
        doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

      
      // // HEADER
      // doc.setFontSize(14);
      // doc.setFont("helvetica", "bold");
      // doc.text("Informe de publicaciones por provincia", 15, 10);

  
      // FOOTER
      var str = "Pagina " + data.pageCount;
      // Total page number plugin only available in jspdf v1.0+
      if (typeof doc.putTotalPages == "function") {
        str = str + " de " + totalPagesExp;
      }
  
      doc.setLineWidth(8);
      doc.setDrawColor(238, 238, 238);
      doc.line(14, pageHeight - 11, 196, pageHeight - 11);
  
      doc.setFontSize(10);
  
      doc.setFontStyle("bold");
  
      doc.text(str, 17, pageHeight - 10);
    };
  
    var elem = document.getElementById("TablaPorProvincia");
    var res = doc.autoTableHtmlToJson(elem);
    doc.autoTable(res.columns, res.data, {
      addPageContent: pageContent,
      theme: "grid",
      styles: { fillColor: [0, 143, 81], halign: "center" },
      columnStyles: {
        0: { halign: "center", fillColor: [255, 255, 255], fontSize: 7 }, // Columna de FECHA, centrada
        1: { halign: "left", fillColor: [255, 255, 255], fontSize: 7 }, // Columna de USUARIO, alineada a la izquierda
        2: { halign: "left", fillColor: [255, 255, 255], fontSize: 7 }, // Columna de LOCALIDAD, alineada a la izquierda
        3: { halign: "right", fontSize: 7, fillColor: [255, 255, 255], cellWidth: 80, },
        4: { halign: "left", fontSize: 7, fillColor: [255, 255, 255], cellWidth: 60 },
        5: { halign: "left", fillColor: [255, 255, 255], fontSize: 7, cellWidth: 100 },
        6: { halign: "left", fontSize: 7, fillColor: [255, 255, 255], cellWidth: 100 },
      }, // Celdas de la primera columna centradas y verdes
      margin: { top: 10 },
    });
  
    // ESTO SE LLAMA ANTES DE ABRIR EL PDF PARA QUE MUESTRE EN EL PDF EL NRO TOTAL DE PAGINAS. ACA CALCULA EL TOTAL DE PAGINAS.
    if (typeof doc.putTotalPages === "function") {
      doc.putTotalPages(totalPagesExp);
    }
  
    //doc.save('InformeSistema.pdf')
  
    var string = doc.output("datauristring");
    var iframe =
      "<iframe width='100%' height='100%' src='" + string + "'></iframe>";
  
    var x = window.open();
    x.document.open();
    x.document.write(iframe);
    x.document.close();
  }
  