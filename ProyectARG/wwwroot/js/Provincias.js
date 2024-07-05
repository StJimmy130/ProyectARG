window.onload = ListadoDeProvincias();

function ListadoDeProvincias() {
    $.ajax({
        url: '../../Provincias/ListadoProvincias',
        data: {},
        type: 'POST',
        dataType: 'json',
        success: function (provincia) {
            console.log(provincia)
            $("#ProvinciaModal").modal("hide");
            LimpiarModals();

            let tabla = ``;

            $.each(provincia, function (index, provincias) {

                tabla += `
                    <tr>
                        <td class="texto-recortado">${provincias.nombre}</td>
                        <td class="text-center ">
                            <button type="button" class="btn btn-success" onclick="ModalEditar(${provincias.provinciaID})">
                            Editar
                            </button>
                        </td>
                        <td class="text-center">
                            <button type="button" class="btn btn-danger" onclick="ValidarEliminacion(${provincias.provinciaID})">
                            Eliminar
                            </button>
                        </td>
                    </tr>
                `;
            });
            document.getElementById("tbodyProvincias").innerHTML = tabla;
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}

function LimpiarModals() {
    document.getElementById("ProvinciaID").value = 0;
    document.getElementById("ProvinciaIDAdd").value = 0;
    document.getElementById("ProvinciaNombre").value = "";
    document.getElementById("LocalidadID").value = 0;
    document.getElementById("LocalidadNombre").value = "";

}

function NuevaProvincia() {
    $("#TituloModalProvincia").text("Nueva provincia");
}

function GuardarProvincia() {
    let provinciaID = document.getElementById("ProvinciaIDAdd").value;
    let nombre = document.getElementById("ProvinciaNombre").value;


    $.ajax({
        url: '../../Provincias/GuardarProvincia',
        data: { ProvinciaID: provinciaID, Nombre: nombre, },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {
            if (resultado != "") {
                alert(resultado)
            }
            ListadoDeProvincias();
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}

function ModalEditar(provinciaID) {
    $.ajax({
        url: '../../Provincias/ListadoProvincias',
        data: { ProvinciaID: provinciaID },
        type: 'POST',
        dataType: 'json',
        success: function (provincia) {
            let provincias = provincia[0];

            document.getElementById("ProvinciaIDedit").value = provinciaID
            $("#TituloModalProvincia").text("Editar provinca");
            document.getElementById("ProvinciaNombreEdit").value = provincias.nombre;
            $("#ProvinciaModal").modal("show");
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}

function ValidarEliminacion(provinciaID) {
    var elimina = confirm("¿Esta seguro que desea eliminar esta provincia?")
    if(elimina == true) {
        EliminarProvincia(provinciaID)
    }
}

function EliminarProvincia(provinciaID) {
    $.ajax({
        url: '../../Provincias/EliminarProvincia',
        data: { ProvinciaID: provinciaID },
        type: 'POST',
        dataType: 'json',

        success: function (eliminarProyecto) {
            ListadoDeProvincias();
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}
