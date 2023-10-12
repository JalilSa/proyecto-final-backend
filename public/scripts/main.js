const products = [
    { id: 1, name: "Producto 1", price: 100 },
    { id: 2, name: "Producto 2", price: 200 },
    // ... puedes agregar más productos si lo deseas
];
const userEmail = localStorage.getItem('userEmail');

       

function displayProducts() {
    const productsContainer = document.getElementById('products');
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.innerHTML = `
            <h3>${product.name}</h3>
            <p>Precio: $${product.price}</p>
            <button onclick="addToCart(${product.id})">Agregar al carrito</button>
        `;
        productsContainer.appendChild(productDiv);
    });
}





async function addToCart(productId) {
    try {
        const response = await fetch('/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ productId })
        });

        const data = await response.json();
        
        if (response.ok) {
            if (data.success) {
                alert(`Producto con ID ${productId} añadido al carrito.`);
                displayCart();  // Actualizar la vista del carrito.
            } else {
                // Mostrar el mensaje de error del servidor, si está disponible.
                alert(data.message || 'Hubo un problema al añadir el producto al carrito.');
            }
        } else {
            throw new Error(data.message || 'Respuesta no exitosa del servidor');
        }
    } catch (error) {
        alert(`Error al comunicarse con el servidor: ${error.message}`);
    }
}

async function proceedToCheckout(userEmail) {
    try {
        const response = await fetch('/cart/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ userEmail })
        });

        const data = await response.json();

        if (response.ok) {
            if (data.sessionId) {
                alert('Procediendo al checkout...');
                // Aquí podrías redireccionar al usuario a la página de pago de Stripe usando el sessionId.
            } else {
                // Mostrar el mensaje de error del servidor, si está disponible.
                alert(data.message || 'Hubo un problema al procesar el checkout.');
            }
        } else {
            throw new Error(data.message || 'Respuesta no exitosa del servidor');
        }
    } catch (error) {
        alert(`Error al comunicarse con el servidor: ${error.message}`);
    }
}

async function displayCart() {
    const cartContainer = document.getElementById('cart-items');
    const cartTotalElem = document.getElementById('cart-total');

    let cart;
    try {
        // Nota: Asegúrate de que esta ruta apunte al lugar correcto de tu archivo cart.json.
        const response = await fetch('../cart.json');  
        if (response.ok) {
            cart = await response.json();
        } else {
            throw new Error('Respuesta no exitosa al obtener el carrito');
        }
    } catch (error) {
        alert('Error al obtener el carrito.');
        return;
    }

    let total = 0;
    cartContainer.innerHTML = ''; 

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        const product = products.find(p => p.id === item.id);
        const itemPrice = product ? product.price * item.quantity : 0;

        itemDiv.innerHTML = `
            <h4>${product ? product.name : 'Producto no encontrado'}</h4>
            <p>Cantidad: ${item.quantity}</p>
            <p>Precio: $${itemPrice}</p>
        `;
        cartContainer.appendChild(itemDiv);

        total += itemPrice;
    });

    cartTotalElem.textContent = total;
}
document.getElementById('accessEditorButton').addEventListener('click', async () => {
    console.log("Inicio de la función checkUserRoleAndLoadButton");
    
    try {
        console.log("Antes de hacer la petición fetch");
        
        const token = localStorage.getItem('token');

        const response = await fetch('/api/isPremiumOrAdmin', {
            headers: {
                'Authorization': 'Bearer ' + token
            },
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('No tiene permisos para acceder al editor de productos');
        }
        console.log("Usuario-Premium o admin confirmado!");
        window.location.href = 'producteditor.html';
        
        console.log("Después de hacer la petición fetch");
    } catch (error) {
        console.error('Error:', error);
        alert('Acceso denegado'); // Muestra una notificación de "acceso denegado"
    }
});

// Llama a las funciones al cargar la página
displayProducts();
displayCart();



