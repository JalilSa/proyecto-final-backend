
document.getElementById('productForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    console.log("Formulario de producto enviado");
    
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = parseFloat(document.getElementById('price').value);
    const thumbnail = document.getElementById('thumbnail').value;
    const code = document.getElementById('code').value;
    const stock = parseInt(document.getElementById('stock').value);

    console.log("Datos del formulario obtenidos:", { title, description, price, thumbnail, code, stock });

    try {
        console.log("Haciendo petición fetch a /api/products con método POST");

        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ title, description, price, thumbnail, code, stock })
        });

        console.log("Respuesta recibida:", response);

        const data = await response.json();
        console.log("Datos recibidos del servidor:", data);

        if (response.ok) {
            alert('Producto agregado con éxito');
        } else {
            console.error("Error en la respuesta:", data.message);
            alert(`Error: ${data.message || 'No se pudo agregar el producto'}`);
        }
    } catch (error) {
        console.error("Error en el try-catch:", error);
        alert('Error al comunicarse con el servidor');
    }
});



//// EDICION
document.addEventListener('DOMContentLoaded', async function() {
    // Verificar si el usuario es admin
    try {
        const response = await fetch('/api/isAdmin', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            // Si es administrador, mostrar botón para cargar productos
            const loadProductsBtn = document.createElement('button');
            loadProductsBtn.innerText = 'Cargar Productos';
            loadProductsBtn.onclick = loadProducts;

            document.body.appendChild(loadProductsBtn);
        }
    } catch (error) {
        console.error('Error al verificar si el usuario es administrador:', error);
    }
});

async function loadProducts() {
    try {
        console.log("Haciendo petición fetch a /api/products con método GET");

        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No se encontró token en el almacenamiento local');
        }

        const response = await fetch('/api/products', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Error al cargar productos');
        }

        const products = await response.json();

        const tbody = document.getElementById('productsTableBody');
        tbody.innerHTML = '';
        for (let product of products) {
            let row = tbody.insertRow();
            row.insertCell(0).innerHTML = product.title;
            row.insertCell(1).innerHTML = product.description;
            row.insertCell(2).innerHTML = product.price;

            let deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = 'Eliminar';
            deleteBtn.onclick = () => deleteProduct(product._id);
            row.appendChild(deleteBtn);
        }
    } catch (error) {
        console.error('Error al cargar productos:', error.message);
    }
}

async function deleteProduct(productId) {
    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al eliminar el producto');
        }

        alert('Producto eliminado con éxito');
        loadProducts(); // Recargar la lista de productos
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        alert('Error al eliminar el producto. Por favor, intente de nuevo.');
    }
}


