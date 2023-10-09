const products = [
    // Aquí, como ejemplo, te doy 2 productos. Puedes agregar más.
    { id: 1, name: "Producto 1", price: 100 },
    { id: 2, name: "Producto 2", price: 200 },
    // ... Agrega más si lo deseas
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
        const response = await fetch('/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Si estás usando autenticación con token:
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ productId })
        });

        const data = await response.json();
        if (data.success) {
            alert(`Producto con ID ${productId} añadido al carrito.`);
        } else {
            alert('Hubo un problema al añadir el producto al carrito.');
        }
    } catch (error) {
        alert('Error al comunicarse con el servidor.');
    }
}


async function proceedToCheckout(userEmail) {
    try {
        const response = await fetch('/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Si estás usando autenticación con token:
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ userEmail })
        });

        const data = await response.json();
        if (data.sessionId) {
            alert('Procediendo al checkout...');
            // Aquí podrías redireccionar al usuario a la página de pago de Stripe usando el sessionId.
        } else {
            alert('Hubo un problema al procesar el checkout.');
        }
    } catch (error) {
        alert('Error al comunicarse con el servidor.');
    }
}


async function displayCart() {
    const cartContainer = document.getElementById('cart-items');
    const cartTotalElem = document.getElementById('cart-total');

    let cart;
    try {
        const response = await fetch('../cart.json');  // Cambia esto por la ruta correcta a tu cart.json.
        cart = await response.json();
    } catch (error) {
        alert('Error al obtener el carrito.');
        return;
    }

    let total = 0;
    cartContainer.innerHTML = ''; // Limpiar el contenedor primero

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

// Llama a las funciones al cargar la página
displayProducts();
displayCart();
