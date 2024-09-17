window.onload = ListadoInformePorFecha();
function ListadoInformePorFecha() {
  $.ajax({
    url: "../../Administracion/GetInformePublicacionesPorFecha",
    data: {},
    type: "POST",
    dataType: "json",
    success: function (informePublicacionesPorFechaMostrar) {
      let contenidoTabla = ``;
      let agrupadoPorFecha = {};

      // Agrupamos por fecha
      $.each(informePublicacionesPorFechaMostrar, function (index, fecha) {
        if (!agrupadoPorFecha[fecha.fechaPublicacionString]) {
          agrupadoPorFecha[fecha.fechaPublicacionString] = [];
        }

        // Añadir los datos a la lista correspondiente
        agrupadoPorFecha[fecha.fechaPublicacionString].push(fecha);
      });

      // Recorremos las fechas
      for (let fechaPublicacionString in agrupadoPorFecha) {
        contenidoTabla += `
                <tr>
                    <td colspan="7" class="text-start" style="text-transform: Uppercase">${fechaPublicacionString}</td>
                </tr>
                `;

        // Recorremos las publicaciones de esa fecha
        $.each(agrupadoPorFecha[fechaPublicacionString], function (index, fecha) {
          contenidoTabla += `
                <tr style="text-transform: Uppercase">
                    <td></td>
                    <td class="text-start" style="max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${fecha.nombreUsuario}</td>
                    <td class="text-start" style="max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${fecha.localidadString} - ${fecha.provinciaString}</td>
                    <td class="text-start" style="max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${fecha.tituloString}</td>                   
                    <td class="text-end" style="max-width: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${fecha.precioString} ${fecha.moneda ? "U$D" : "AR$"}</td>
                    <td class="text-start" style="max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${fecha.tipoInmuebleString} - ${fecha.tipoOperacionString}</td>
                    <td class="text-start" style="max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${fecha.direccionString} - ${fecha.nroDireccionString}</td>
                </tr>
            `;
        });
      }

      document.getElementById("tbody-publicacionesPorFecha").innerHTML = contenidoTabla;
    },
    error: function (xhr, status) {
      alert("Disculpe, existió un problema al procesar la solicitud.");
    },
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

  var elem = document.getElementById("TablaPorFecha");
  var res = doc.autoTableHtmlToJson(elem);
  doc.autoTable(res.columns, res.data, {
    addPageContent: pageContent,
    theme: "grid",
    styles: { fillColor: [0, 143, 81], halign: "center" },
    columnStyles: {
      0: { halign: "center", fillColor: [255, 255, 255], fontSize: 7 },
      1: { halign: "left", fillColor: [255, 255, 255], fontSize: 7 }, 
      2: { halign: "left", fillColor: [255, 255, 255], fontSize: 7 }, 
      3: { halign: "left", fillColor: [255, 255, 255], fontSize: 7, cellWidth: 80 },
      4: { halign: "right", fillColor: [255, 255, 255], fontSize: 7, cellWidth: 60 },
      5: { halign: "left", fillColor: [255, 255, 255], fontSize: 7, cellWidth: 100 },
      6: { halign: "left", fillColor: [255, 255, 255], fontSize: 7, cellWidth: 100 },
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
