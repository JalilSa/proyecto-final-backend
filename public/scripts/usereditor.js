async function loadUsers() {
    try {
        console.log("Haciendo petición fetch a /api/users/getusers con método GET");

        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No se encontró token en el almacenamiento local');
        }

        const response = await fetch('/api/users/getusers', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        if (!response.ok) {
            // Puedes ajustar los mensajes de error según el código de estado HTTP
            switch (response.status) {
                case 401:
                    throw new Error('Token no válido');
                case 403:
                    throw new Error('No tienes permisos de administrador');
                default:
                    throw new Error('No tiene permisos para acceder al editor de users');
            }
        }

        const users = await response.json();

        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = '';
        for (let user of users) {
            let row = tbody.insertRow();
            row.insertCell(0).innerHTML = user.name;
            row.insertCell(1).innerHTML = user.email;
            row.insertCell(2).innerHTML = user.role;
            
            let actionsCell = row.insertCell(3);
            const dropdownContainer = document.createElement('div');
            dropdownContainer.className = 'dropdown-container';

            const selectRole = document.createElement('select');
            ['normal', 'premium'].forEach(role => {
                let option = document.createElement('option');
                option.value = role;
                option.text = role;
                if(user.role === role) option.selected = true;
                selectRole.appendChild(option);
            });

            selectRole.onchange = () => {
                updateUserRole(user._id, selectRole.value);
            };

            dropdownContainer.appendChild(selectRole);
            actionsCell.appendChild(dropdownContainer);

            let deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = 'Eliminar';
            deleteBtn.onclick = () => deleteUser(user._id);
            actionsCell.appendChild(deleteBtn);
        }
    } catch (error) {
        console.error('Error al cargar usuarios:', error.message);
    }
}

async function deleteInactiveUsers() {
    try {
        const response = await fetch('/api/users/deleteusers', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al eliminar usuarios inactivos');
        }

        alert('Usuarios inactivos eliminados con éxito');
        loadUsers(); // Recargar la lista de usuarios
    } catch (error) {
        console.error('Error al eliminar usuarios inactivos:', error);
        alert('Error al eliminar usuarios inactivos. Por favor, intente de nuevo.');
    }
}


async function updateUserRole(userId, newRole) {
    try {
        const response = await fetch(`/api/users/${userId}/role`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ role: newRole })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Rol actualizado con éxito');
            loadUsers();  // Refresca la lista de usuarios
        } else {
            console.error("Error en la respuesta:", data.message);
            alert(`Error: ${data.message || 'No se pudo actualizar el rol'}`);
        }
    } catch (error) {
        console.error("Error en el try-catch:", error);
        alert('Error al comunicarse con el servidor');
    }
}


async function deleteUser(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al eliminar el usuario');
        }

        alert('Usuario eliminado con éxito');
        loadUsers(); // Recargar la lista de usuarios
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        alert('Error al eliminar el usuario. Por favor, intente de nuevo.');
    }
}

