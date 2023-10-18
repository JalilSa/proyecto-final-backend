

const userEmail = localStorage.getItem('userEmail');

let products = [];

async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        
        if (!response.ok) {
            throw new Error('Error al obtener los productos');
        }

        products = await response.json();
    } catch (error) {
        console.error('Error al obtener productos:', error);
    }
}

async function displayProducts() {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';

    try {
        await fetchProducts();

        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.innerHTML = `
                <h3>${product.title}</h3>  
                <p>Precio: $${product.price}</p>
                <button onclick="addToCart('${product._id}')">Agregar al carrito</button>
            `;
            productsContainer.appendChild(productDiv);
        });
    } catch (error) {
        console.error('Error al mostrar productos:', error);
    }
}



function addToCart(productId) {
    // Intenta obtener el carrito del localStorage
    const cartString = localStorage.getItem('cart');
    
    // Convierte el carrito a un objeto (o usa un array vacío si el carrito no existe)
    const cart = cartString ? JSON.parse(cartString) : [];

    // Busca el producto en el carrito
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        // Si el producto ya está en el carrito, incrementa la cantidad
        cartItem.quantity++;
    } else {
        // Si el producto no está en el carrito, agrégalo con cantidad 1
        cart.push({ id: productId, quantity: 1 });
    }

    // Guarda el carrito actualizado en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    alert(`Producto con ID ${productId} añadido al carrito.`);
    displayCart();
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

    // Obtiene los productos antes de procesar el carrito
    await fetchProducts();

    // Intenta obtener el carrito del localStorage
    const cartString = localStorage.getItem('cart');

    // Convierte el carrito a un objeto (o usa un array vacío si el carrito no existe)
    const cart = cartString ? JSON.parse(cartString) : [];

    let total = 0;
    cartContainer.innerHTML = ''; 

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        const product = products.find(p => p._id === item.id);
        const itemPrice = product ? product.price * item.quantity : 0;

        itemDiv.innerHTML = `
            <h4>${product ? product.title : 'Producto no encontrado'}</h4> <!-- Cambiamos name por title -->
            <p>Cantidad: ${item.quantity}</p>
            <p>Precio: $${itemPrice}</p>
        `;
        cartContainer.appendChild(itemDiv);

        total += itemPrice;
    });

    cartTotalElem.textContent = `Total: $${total}`;  // Agregamos el prefijo "Total: $" para que sea más claro el propósito de este elemento.
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
        alert('Acceso denegado');
    }
});
async function checkIfAdminAndLoadButton() {
    try {
        const response = await fetch('/api/isAdmin', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            credentials: 'include'
        });

        if (response.ok) {
            displayUserEditorButton();
        }
    } catch (error) {
        console.error('Error al verificar el rol del usuario:', error);
    }
}

function displayUserEditorButton() {
    const container = document.getElementById('userEditorButtonContainer');
    const btn = document.createElement('button');
    btn.innerText = 'Ir al Editor de Usuarios';
    btn.onclick = () => window.location.href = 'usereditor.html';
    container.appendChild(btn);
}

// Llama a las funciones al cargar la página
displayProducts();
displayCart();
checkIfAdminAndLoadButton();


