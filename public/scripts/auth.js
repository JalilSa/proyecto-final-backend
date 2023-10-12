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

        if (response.ok) {
            alert('Registrado con éxito!');

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

        if (response.ok) {

            localStorage.setItem('token', data.token);
            localStorage.setItem('userEmail', email);
            window.location.href = "/pages/main.html";
        } else {
            alert(data.message || 'Error al hacer login');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Hubo un error al intentar iniciar sesión. Por favor, intenta de nuevo.');
    }
}
