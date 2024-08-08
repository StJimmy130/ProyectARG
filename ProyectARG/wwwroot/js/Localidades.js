window.onload = ListadoDeLocalidades();

function ListadoDeLocalidades() {
    let provinciaID = document.getElementById("ProvinciaID").value;
    $.ajax({
        url: '../../Localidades/ListadoLocalidades',
        data: {
            ProvinciaID: provinciaID
        },
        type: 'POST',
        dataType: 'json',
        success: function (localidad) {
            $("#LocalidadModal").modal("hide");
            

            let tabla = ``;

            $.each(localidad, function (index, localidades) {

                tabla += `
                    <tr>
                        <td class"texto-recortado">${localidades.localidadNombre}</td>
                        <td class"texto-recortado">${localidades.provinciaNombre}</td>
                        <td class="text-center">
                            <button type="button" class="btn btn-success" onclick="ModalEditarLocalidad(${localidades.localidadID})">
                            Editar
                            </button>
                        </td>
                        <td class="text-center">
                            <button type="button" class="btn btn-danger" onclick="ValidarEliminacionLocalidad(${localidades.localidadID})">
                            Eliminar
                            </button>
                        </td>
                    </tr>
                `;
            });
            document.getElementById("tbodyLocalidades").innerHTML = tabla;
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}


function LimpiarModalLocalidad() {
    document.getElementById("LocalidadID").value = 0;
    document.getElementById("LocalidadNombre").value = "";
    document.getElementById("ProvinciaNombre").value = "";

}

function NuevaLocalidad() {
    $("#TituloModalLocalidad").text("Nueva localidad");
}

function GuardarLocalidad() {
    let localidadID = document.getElementById("LocalidadID").value;
    let provinciaID = document.getElementById("ProvinciaID").value;
    let nombre = document.getElementById("LocalidadNombre").value;


    $.ajax({
        url: '../../Localidades/GuardarLocalidad',
        data: { LocalidadID: localidadID, 
                ProvinciaID: provinciaID, 
                Nombre: nombre, },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {
            if (resultado != "") {
                alert(resultado)
            }
            ListadoDeLocalidades();
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}

function ModalEditarLocalidad(localidadID) {
    $.ajax({
        url: '../../Localidades/ListadoLocalidades',
        data: { LocalidadID: localidadID },
        type: 'POST',
        dataType: 'json',
        success: function (localidad) {
            console.log(localidad[0])
            let localidades = localidad[0];

            document.getElementById("LocalidadIDEdit").value = localidadID
            $("#TituloModalLocalidad").text("Editar localidad");
            document.getElementById("ProvinciaIDEdit").value = localidades.provinciaID;
            document.getElementById("LocalidadNombreEdit").value = localidades.localidadNombre;
            $("#LocalidadModal").modal("show");
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}

function ValidarEliminacionLocalidad(localidadID) {
    var elimina = confirm("¿Esta seguro que desea eliminar esta provincia?")
    if(elimina == true) {
        EliminarLocalidad(localidadID)
    }
}

function EliminarLocalidad(localidadID) {
    $.ajax({
        url: '../../Localidades/EliminarLocalidad',
        data: { LocalidadID: localidadID },
        type: 'POST',
        dataType: 'json',

        success: function (eliminarLocalidad) {
            ListadoDeLocalidades();
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}