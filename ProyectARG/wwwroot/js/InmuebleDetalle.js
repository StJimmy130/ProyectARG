// Selecciona la imagen principal usando un selector adecuado
const main_img = document.querySelector('#mainImage');  // Usando ID o .main-img si es una clase

// Selecciona todas las miniaturas
const miniaturas = document.querySelectorAll('.miniatura');

miniaturas.forEach(thumb => {
    thumb.addEventListener('click', function(){
        // Remueve la clase 'active' de la miniatura actualmente activa
        const active = document.querySelector('.active');
        if (active) {
            active.classList.remove('active');
        }

        // Añade la clase 'active' a la miniatura clickeada
        this.classList.add('active');

        // Cambia la imagen principal por la imagen de la miniatura clickeada
        main_img.src = this.src;
    });
});
