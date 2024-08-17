const body = document.querySelector("body"),
    nav = document.querySelector("nav"),
    modeToggle = document.querySelector(".dark-light"),
    searchToggle = document.querySelector(".searchToggle"),
    sidebarOpen = document.querySelector(".sidebarOpen"),
    siderbarClose = document.querySelector(".siderbarClose");
let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark-mode") {
    body.classList.add("dark");
}
// js code to toggle dark and light mode
modeToggle.addEventListener("click", () => {
    modeToggle.classList.toggle("active");
    body.classList.toggle("dark");
    // js code to keep user selected mode even page refresh or file reopen
    if (!body.classList.contains("dark")) {
        localStorage.setItem("mode", "light-mode");
    } else {
        localStorage.setItem("mode", "dark-mode");
    }
});
// js code to toggle search box
searchToggle.addEventListener("click", () => {
    searchToggle.classList.toggle("active");
});

// Write your JavaScript code.
//   js code to toggle sidebar
sidebarOpen.addEventListener("click", () => {
    nav.classList.add("active");
});
body.addEventListener("click", (e) => {
    let clickedElm = e.target;
    if (
        !clickedElm.classList.contains("sidebarOpen") &&
        !clickedElm.classList.contains("menu")
    ) {
        nav.classList.remove("active");
    }
});

// Función para mostrar la pantalla de carga
function showLoadingScreen() {
    document.getElementById('loading-screen').style.display = 'flex';
}

// Función para ocultar la pantalla de carga
function hideLoadingScreen() {
    document.getElementById('loading-screen').style.display = 'none';
}
const alerta = document.getElementById("alert");
const icon = document.getElementById("alert-icon");
const titulo = document.getElementById("alert-title");
const descripcion = document.getElementById("alert-description");
const aceptar = document.getElementById("btn-aceptar");
const cancelar = document.getElementById("btn-cancelar");
const background = document.getElementById("background");
function hiddenAlert() {
    
    alerta.classList.add("exit-alert");
    setTimeout(function() {
        alerta.classList.remove("enter-alert");
        titulo.innerHTML = ""
        descripcion.innerHTML = ""
        aceptar.style.display = "none";
        cancelar.style.display = "none";
        icon.classList.remove("success", "denied");
        icon.innerHTML = ""
        alerta.classList.remove("exit-alert");
        background.classList.remove("success", "denied");
    }, 300);
}