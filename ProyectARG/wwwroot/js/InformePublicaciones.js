window.onload = inicializarVista;
// Función de inicialización para cargar la vista por defecto y configurar el botón de impresión
function inicializarVista() {
  // Mostrar la tabla de informe por fecha al cargar la página
  mostrarInformeSeleccionado();

  // Configurar el botón de impresión para que imprima el informe por fecha
  document.getElementById("btnImprimir").onclick = ImprimirInformePorFecha;
}

// Función para actualizar la vista al seleccionar un informe diferente
function actualizarInforme() {
  const informeSeleccionado = document.getElementById("informeSelect").value;
  const btnImprimir = document.getElementById("btnImprimir");

  // Cambiar el onclick del botón de imprimir según el informe seleccionado
  if (informeSeleccionado === "porFecha") {
    btnImprimir.onclick = ImprimirInformePorFecha;
  } else if (informeSeleccionado === "porLugar") {
    btnImprimir.onclick = ImprimirInformePorLugar;
  } else if (informeSeleccionado === "porUsuario") {
    btnImprimir.onclick = ImprimirInformePorUsuario;
  }

  // Llama a mostrarInformeSeleccionado para mostrar la tabla correspondiente
  mostrarInformeSeleccionado();
}

// Función para mostrar la tabla correspondiente al informe seleccionado
function mostrarInformeSeleccionado() {
  const informeSeleccionado = document.getElementById("informeSelect").value;

  // Ocultar todas las tablas
  document.getElementById("TablaPorFecha").style.display = "none";
  document.getElementById("TablaPorProvincia").style.display = "none";
  document.getElementById("TablaPorUsuario").style.display = "none";

  // Mostrar la tabla correspondiente y llamar a la función AJAX
  if (informeSeleccionado === "porFecha") {
    document.getElementById("TablaPorFecha").style.display = "table";
    ListadoInformePorFecha();
  } else if (informeSeleccionado === "porLugar") {
    document.getElementById("TablaPorProvincia").style.display = "table";
    ListadoInformePorLugar();
  } else if (informeSeleccionado === "porUsuario") {
    document.getElementById("TablaPorUsuario").style.display = "table";
    ListadoInformePorUsuario();
  }
}




function ListadoInformePorFecha() {
  $.ajax({
    url: "../../Administracion/GetInformePublicacionesPorFecha",
    data: {},
    type: "POST",
    dataType: "json",
    success: function (informePublicacionesPorFechaMostrar) {
      let contenidoTabla = ``;
      let encabezadoTabla = `
        <tr class="text-center">
          <th>FECHA</th>
          <th>VISTAS</th>
          <th>USUARIO</th>
          <th>LOCALIDAD</th>
          <th>TÍTULO</th>
          <th>PRECIO</th>
          <th>TIPO</th>
          <th>DIRECCIÓN</th>
        </tr>
      `;
      
      document.getElementById("thead-publicacionesPorFecha").innerHTML = encabezadoTabla;


      let agrupadoPorFecha = {};
      $.each(informePublicacionesPorFechaMostrar, function (index, fecha) {
        if (!agrupadoPorFecha[fecha.fechaPublicacionString]) {
          agrupadoPorFecha[fecha.fechaPublicacionString] = [];
        }
        agrupadoPorFecha[fecha.fechaPublicacionString].push(fecha);
      });


      for (let fechaPublicacionString in agrupadoPorFecha) {
        contenidoTabla += `
          <tr>
            <td colspan="8" class="text-start" style="text-transform: Uppercase">${fechaPublicacionString}</td>
          </tr>
        `;

        $.each(agrupadoPorFecha[fechaPublicacionString], function (index, fecha) {
          contenidoTabla += `
            <tr style="text-transform: Uppercase">
              <td></td>
              <td class="text-end" style="max-width: 30px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${fecha.cantidadVistas}</td>
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

function ListadoInformePorLugar() {
  $.ajax({
      url: '../../Administracion/GetInformePublicacionesPorUsuario',
      data: {},
      type: 'POST',
      dataType: 'json',
      success: function (informePublicacionesPorProvinciaMostrar) {
          let contenidoTabla = ``;

          let encabezadoTabla = `
          <tr class="text-center">
            <th>PROVINCIA</th>
            <th>LOCALIDAD</th>
            <th>TÍTULO</th>
            <th>PRECIO</th>
            <th>TIPO</th>
            <th>BARRIO</th>
            <th>DIRECCIÓN</th>
          </tr>
          `;
        
          document.getElementById("thead-publicacionesPorProvincia").innerHTML = encabezadoTabla;
  
  

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

function ListadoInformePorUsuario() {
  $.ajax({
      url: '../../Administracion/GetInformePublicacionesPorUsuario',
      data: {},
      type: 'POST',
      dataType: 'json',
      success: function (informePublicacionesPorUsuarioMostrar) {
          let contenidoTabla = ``;
          let encabezadoTabla = `
          <tr>
              <th class="text-center">USUARIO</th>
              <th class="text-center">TÍTULO</th>
              <th class="text-center">PRECIO</th>
              <th class="text-center">TIPO</th>
              <th class="text-center">LOCALIDAD</th>
              <th class="text-center">BARRIO</th>
              <th class="text-center">DIRECCIÓN</th>
          </tr>
          `;

          document.getElementById("thead-publicacionesPorUsuario").innerHTML = encabezadoTabla;
  
  
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



