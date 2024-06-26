window.onload = ListadoDeLocalidades();

function ListadoDeLocalidades() {
    $.ajax({
        url: '../../Localidades/ListadoLocalidades',
        data: {},
        type: 'POST',
        dataType: 'json',
        success: function (localidad) {
            $("#LocalidadModal").modal("hide");
            LimpiarModals();

            let tabla = ``;

            $.each(localidad, function (index, localidades) {

                tabla += `
                    <tr>
                        <td>${localidades.localidadNombre}</td>
                        <td>${localidades.provinciaNombre}</td>
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
            let localidades = localidad[0];

            document.getElementById("LocalidadID").value = localidadID
            $("#TituloModalLocalidad").text("Editar localidad");
            document.getElementById("ProvinciaID").value = localidades.provinciaID;
            document.getElementById("LocalidadNombre").value = localidades.localidadNombre;
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