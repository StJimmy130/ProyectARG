
    // Elementos del formulario de Login
    const loginEmailInput = document.querySelector('#account input[name="Input.Email"]');
    const loginPasswordInput = document.querySelector('#account input[name="Input.Password"]');

    const loginEmailError = document.getElementById('span-email');
    const loginPasswordError = document.getElementById('span-password');

    console.log('Script cargado correctamente');

    // Validación del email en tiempo real
    loginEmailInput.addEventListener('input', function () {
        const emailValue = loginEmailInput.value;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        console.log('Validando email:', emailValue);

        if (!emailPattern.test(emailValue)) {
            loginEmailError.textContent = 'Email inválido';
            loginEmailError.style.display = 'block';  // Aseguramos que se muestre el error
        } else {
            loginEmailError.textContent = '';
            loginEmailError.style.display = 'none';  // Ocultamos el error si está bien
        }
    });

    // Validación de la contraseña en tiempo real
    loginPasswordInput.addEventListener('input', function () {
        const passwordValue = loginPasswordInput.value;

        console.log('Validando contraseña:', passwordValue);

        if (passwordValue.trim() === '') {
            loginPasswordError.textContent = 'La contraseña no puede estar vacía';
            loginPasswordError.style.display = 'block';  // Mostramos el error
        } else {
            loginPasswordError.textContent = '';
            loginPasswordError.style.display = 'none';  // Ocultamos el error si está bien
        }
    });

