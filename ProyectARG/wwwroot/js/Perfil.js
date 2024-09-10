window.onload = getInfo();

function getInfo() {
    let usuarioID = document.getElementById("UsuarioID").value;
    $.ajax({
        url: "../../Perfiles/GetInformacion",
        data: {usuarioID: usuarioID},
        type: "POST",
        dataType: "json",
        success: function (data) {
            console.log(data);
            $("#nombre").val(data.nombre);
            $("#phone").val(data.nroTelefono);
            $("#instagram").val(data.instagram);
            $("#facebook").val(data.facebook);
            $("#whatsapp").val(data.whatsapp);
        },
        error: function (xhr, status) {
            console.log("Disculpe, existió un problema al cargar el listado");
        },
    });
}

function ActualizarInformacion() {
    let usuarioID = document.getElementById("UsuarioID").value;
    let nombre = $("#nombre").val();
    let phone = $("#phone").val();
    let instagram = $("#instagram").val();
    let facebook = $("#facebook").val();
    let whatsapp = $("#whatsapp").val();
    $.ajax({
        url: "../../Perfiles/UpdateInformacion",
        data: {
            UsuarioID: usuarioID,
            Nombre: nombre,
            NroTelefono: phone,
            Instagram: instagram,
            Facebook: facebook,
            Whatsapp: whatsapp,
        },
        type: "POST",
        dataType: "json",
        success: function (data) {
            console.log(data);
        },
        error: function (xhr, status) {
            console.log("Disculpe, existió un problema al cargar el listado");
        },
    });
}