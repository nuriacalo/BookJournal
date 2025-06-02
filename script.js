document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const usuario = document.getElementById('username').value;
            const contrasena = document.getElementById('password').value;

            const usuarioValido = 'Nuria';
            const contrasenaValida = '1234';

            if (usuario === usuarioValido && contrasena === contrasenaValida) {
                window.location.href = 'book.html';
            } else {
                alert('Usuario o contraseña incorrectos');
            }
        });
    }
});