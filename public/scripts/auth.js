async function registerUser() {
    try {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const isPremium = document.getElementById('premium').checked;
        const role = isPremium ? 'premium' : 'normal';

        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, role })
        });

        const data = await response.json();

        if (response.ok) { // Verifica si el estado HTTP es 2xx (exitoso)
            alert('Registrado con éxito!');
            // Aquí puedes hacer una redirección o mostrar algún mensaje.
        } else {
            alert(data.message || 'Error al registrar');
        }
    } catch (error) {
        console.error('Error al registrar:', error);
        alert('Hubo un error al intentar registrar. Por favor, intenta de nuevo.');
    }
}

async function loginUser() {
    try {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) { // Verifica si el estado HTTP es 2xx (exitoso)
            // Guarda el token y el email en el local storage para futuras peticiones.
            localStorage.setItem('token', data.token);
            localStorage.setItem('userEmail', email); // Almacena el email en el localStorage
            window.location.href = "/pages/main.html";
        } else {
            alert(data.message || 'Error al hacer login');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Hubo un error al intentar iniciar sesión. Por favor, intenta de nuevo.');
    }
}
