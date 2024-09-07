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
                        <td class="texto-recortado">${localidades.localidadNombre}</td>
                        <td class="texto-recortado">${localidades.provinciaNombre}</td>
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

$(document).ready(function () {
    // Cargar localidades cuando la página esté lista
    ListadoDeLocalidades();

    // Filtro de búsqueda
    $("#LocalidadNombre").on("keyup", function () {
        var searchQuery = $(this).val().toLowerCase();
        $("#tbodyLocalidades tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(searchQuery) > -1);
        });
    });
});


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
                icon.classList.add("succes-svg");
                icon.innerHTML = '<i class="bx bxs-check-circle"></i>';
        
                document.getElementById("alert-title").innerHTML = "Felicitaciones!!!";
                document.getElementById("alert-description").innerHTML = resultado;
                aceptar.style.display = "block";
                background.classList.add("success");
                alerta.classList.add("enter-alert");
        
                setTimeout(function () {
                  hiddenAlert();
                }, 3000);
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
    icon.innerHTML = '<i class="bx bxs-error-circle"></i>';
    icon.classList.add("alert-svg");
    titulo.innerHTML = "Atencion!!!";
    descripcion.innerHTML = `<label>¿Esta seguro que desea eliminar esta localidad?</label>`;
    aceptar.style.display = "block";
    background.classList.add("alert");
    alerta.classList.add("enter-alert");
    cancelar.setAttribute("onclick", `hiddenAlert()`);
    cancelar.style.display = "block";
    aceptar.setAttribute("onclick", `EliminarLocalidad(${localidadID})`);
  
  
    alerta.classList.add("enter-alert");
}

function EliminarLocalidad(localidadID) {
    $.ajax({
        url: '../../Localidades/EliminarLocalidad',
        data: { LocalidadID: localidadID },
        type: 'POST',
        dataType: 'json',

        success: function (eliminarLocalidad) {
            icon.innerHTML = '<i class="bx bxs-check-circle"></i>';
    icon.classList.add("succes-svg");
    titulo.innerHTML = "Hecho!";
    descripcion.innerHTML = `<label>Localidad eliminada con exito</label>`;
    aceptar.style.display = "block";
    aceptar.setAttribute("onclick", `hiddenAlert()`);
    background.classList.add("success");
            ListadoDeLocalidades();
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}