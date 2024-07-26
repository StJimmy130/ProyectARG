function GuardarPublicacion(){
    let inmuebleID = document.getElementById("InmuebleID").value;
    let localidadID = document.getElementById("LocalidadID").value;
    let provinciaID = document.getElementById("ProvinciaID").value;
    let barrio = document.getElementById("Barrio").value;
    let titulo = document.getElementById("Titulo").value;
    let precio = document.getElementById("Precio").value;
    let superficieTotal = document.getElementById("SuperficieTotal").value;
    let superficieCubierta = document.getElementById("superficieCubierta").value;
    let tipoOperacion = document.getElementById("TipoOperacion").value;
    let tipoInmueble = document.getElementById("TipoInmueble");
    let amoblado = document.getElementById("Amoblado").value;
    let dormitorios = document.getElementById("Dormitorios").value;
    let banios = document.getElementById("Banios").value;
    let cantidadAmbientes = document.getElementById("CantidadAmbientes").value;
    let cochera = document.getElementById("Cochera").value;
    let direccion = document.getElementById("Direccion").value;
    let nroDireccion = document.getElementById("NroDireccion").value;
    let descripcion = document.getElementById("Descripcion").value;
    let usuarioID = document.getElementById("UsuarioID").value;

    $.ajax({
        url: "/Inmuebles/GuardarPublicacion",
        data: {
            InmuebleID: inmuebleID,
            LocalidadID: localidadID,
            provinciaID: provinciaID,
            Barrio: barrio,
            Titulo: titulo,
            Precio: precio,
            SuperficieTotal: superficieTotal,
            SuperficieCubierta: superficieCubierta,
            TipoOperacion: tipoOperacion,
            TipoInmueble: tipoInmueble,
            Amoblado: amoblado,
            Dormitorios: dormitorios,
            Banios: banios,
            CantidadAmbientes: cantidadAmbientes,
            Cochera: cochera,
            Direccion: direccion,
            NroDireccion: nroDireccion,
            Descripcion: descripcion,
            UsuarioID: usuarioID
        },
        type: "POST",
        dataType: "json",
        success: function (resultado) 
        {
            if(resultado != "")
            {
                alert(resultado);
            }
            ListadoPublicaciones();    
        },
    });
}

function MostrarPublicacion(){
    $.ajax({
        
    });
}



function ValidarEliminacion(inmuebleID) {
    var elimina = confirm("¿Esta seguro que desea eliminar esta publicación?")
    if(elimina == true) {
        EliminarPublicacion(inmuebleID)
    }
}

function EliminarPublicacion(inmuebleID) {
    $.ajax({
        url: '../../Inmuebles/EliminarPublicacion',
        data: { InmuebleID: inmuebleID },
        type: 'POST',
        dataType: 'json',

        success: function (eliminarPublicacion) {
        
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}

