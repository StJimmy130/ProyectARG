window.onload = ListadoDeProvincias();

function ListadoDeProvincias() {
    $.ajax({
        url: '../../Provincias/ListadoProvincias',
        data: {},
        type: 'POST',
        dataType: 'json',
        success: function (provincia) {

            $("#ProvinciaModal").modal("hide");
            LimpiarModal();

            let tabla = ``;

            $.each(provincia, function (index, provincias) {

                tabla += `
                    <tr>
                        <td>${provincias.nombre}</td>
                        <td class="text-center">
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
            document.getElementById("tbody").innerHTML = tabla;
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}

function LimpiarModal() {
    document.getElementById("ProvinciaID").value = 0;
    document.getElementById("ProvinciaNombre").value = "";

}

function NuevaProvincia() {
    $("#tituloModal").text("Nueva provincia");
}

function GuardarProvincia() {
    let proyectoID = document.getElementById("ProvinciaID").value;
    let nombre = document.getElementById("NombreProvinca").value;


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
        url: '../../Proyectos/ListadoProyectos',
        data: { ProvinciaID: provinciaID },
        type: 'POST',
        dataType: 'json',
        success: function (provincia) {
            let provincias = provincia[0];

            document.getElementById("ProvinciaID").value = provinciaID
            $("#tituloModal").text("Editar provinca");
            document.getElementById("NombreProvincia").value = provincias.nombre;
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
