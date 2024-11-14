
document.addEventListener('DOMContentLoaded', function () {
    // Elementos del formulario de Registro
    const registerNameInput = document.querySelector('#registerForm input[name="Input.Nombre"]');
    const registerEmailInput = document.querySelector('#registerForm input[name="Input.Email"]');
    const registerPasswordInput = document.querySelector('#registerForm input[name="Input.Password"]');
    const registerConfirmPasswordInput = document.querySelector('#registerForm input[name="Input.ConfirmPassword"]');

    const registerNameError = document.getElementById('span-nombre');
    const registerEmailError = document.getElementById('span-email');
    const registerPasswordError = document.getElementById('span-password');
    const registerConfirmPasswordError = document.getElementById('span-confirm-password');

    // Verificamos que todos los elementos existan antes de seguir
    if (!registerNameInput || !registerEmailInput || !registerPasswordInput || !registerConfirmPasswordInput ||
        !registerNameError || !registerEmailError || !registerPasswordError || !registerConfirmPasswordError) {
        console.error('Algunos elementos del formulario de registro no fueron encontrados.');
        return;
    }

    console.log('Script de registro cargado correctamente');

    // Validación del nombre en tiempo real
    registerNameInput.addEventListener('input', function () {
        const nameValue = registerNameInput.value;

        if (nameValue.trim() === '') {
            registerNameError.textContent = 'El nombre no puede estar vacío';
            registerNameError.style.display = 'block';
            registerNameInput.classList.remove('valid');
            registerNameInput.classList.add('error');
        } else {
            registerNameError.textContent = '';
            registerNameError.style.display = 'none';
            registerNameInput.classList.remove('error');
            registerNameInput.classList.add('valid');
        }
    });

    // Validación del email en tiempo real
    registerEmailInput.addEventListener('input', function () {
        const emailValue = registerEmailInput.value;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(emailValue)) {
            registerEmailError.textContent = 'Email inválido';
            registerEmailError.style.display = 'block';
            registerEmailInput.classList.remove('valid');
            registerEmailInput.classList.add('error');
        } else {
            registerEmailError.textContent = '';
            registerEmailError.style.display = 'none';
            registerEmailInput.classList.remove('error');
            registerEmailInput.classList.add('valid');
        }
    });

    // Validación de la contraseña en tiempo real
    registerPasswordInput.addEventListener('input', function () {
        const passwordValue = registerPasswordInput.value;
        if (passwordValue.trim() === '' || passwordValue.length < 8) {
            registerPasswordError.textContent = 'La contraseña no puede estar vacía';
            registerPasswordError.style.display = 'block';
            registerPasswordInput.classList.remove('valid');
            registerPasswordInput.classList.add('error');
        } else {
            registerPasswordError.textContent = '';
            registerPasswordError.style.display = 'none';
            registerPasswordInput.classList.remove('error');
            registerPasswordInput.classList.add('valid');
        }
    });

    // Validación de la confirmación de la contraseña en tiempo real
    registerConfirmPasswordInput.addEventListener('input', function () {
        const passwordValue = registerPasswordInput.value;
        const confirmPasswordValue = registerConfirmPasswordInput.value;

        if (confirmPasswordValue !== passwordValue) {
            registerConfirmPasswordError.textContent = 'Las contraseñas no coinciden';
            registerConfirmPasswordError.style.display = 'block';
            registerConfirmPasswordInput.classList.remove('valid');
            registerConfirmPasswordInput.classList.add('error');
        } else {
            registerConfirmPasswordError.textContent = '';
            registerConfirmPasswordError.style.display = 'none';
            registerConfirmPasswordInput.classList.remove('error');
            registerConfirmPasswordInput.classList.add('valid');
        }
    });
});