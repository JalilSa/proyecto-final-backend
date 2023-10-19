

const userEmail = localStorage.getItem('userEmail');
const stripe = Stripe('pk_test_51Ny0irLDEwk8ODfEtWfVcKbQRsJyAxQ97XAahcKcfB8yc3oJNNOisbBIpbYFQ3MWuG7UIQ3c1Zj4XjDTIGOyOmQp00NwgVc9dE'); //clave publicable
let products = [];

///////////////////////////////////////////////////////////////////////
//AUTH/////////////////////////////////////////////////////////////////
async function isCurrentUserAdmin() {
    try {
        const token = localStorage.getItem('token');
        
        const response = await fetch('/api/isAdmin', {
            headers: {
                'Authorization': 'Bearer ' + token
            },
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            if (data.message === 'Usuario es administrador') {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('Error al verificar si el usuario es administrador:', error);
        return false;
    }
}
localStorage.setItem('cart', JSON.stringify([]));

///////////////////////////////////////////////////////////////////////
//PRODUCTS/////////////////////////////////////////////////////////////////
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
async function getProductDetails(productId) {
    try {
        const response = await fetch(`/api/products/${productId}`);

        if (!response.ok) {
            throw new Error('Error al obtener los detalles del producto.');
        }

        const productData = await response.json();
        return productData;
    } catch (error) {
        console.error('Error al obtener los detalles del producto:', error);
        return null;
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
                <button onclick="addToCart('${product._id}', '${product.owner}')">Agregar al carrito</button>

            `;
            productsContainer.appendChild(productDiv);
        });
    } catch (error) {
        console.error('Error al mostrar productos:', error);
    }
}


async function addToCart(productId) {
    // Verifica si el usuario actual es administrador
    const isAdmin = await isCurrentUserAdmin();
    
    if (isAdmin) {
        alert('El administrador no puede realizar compras.');
        return; 
    }

    // Obtén los detalles del producto 
    const productData = await getProductDetails(productId); 

    if (!productData) {
        alert('Error al obtener los detalles del producto.');
        return;
    }

    const currentUserId = localStorage.getItem('userId');
    console.log('currentUserId:', currentUserId);
    console.log('productData.owner:', productData.owner);
    
    if (productData.owner === currentUserId) {
        alert('No puedes agregar tu propio producto al carrito.');
        return;
    }
    
    const cartString = localStorage.getItem('cart');

    const cart = cartString ? JSON.parse(cartString) : [];
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






async function proceedToCheckout() {
    // Obtiene el carrito desde localStorage
    const cartString = localStorage.getItem('cart');
    const cart = cartString ? JSON.parse(cartString) : [];

    try {
        const response = await fetch('/payment/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ cart })
        });

        const data = await response.json();
        
        if(data.success) {
            // Redirigir al cliente a la página de pago de Stripe
            stripe.redirectToCheckout({
                sessionId: data.sessionId
            }).then((result) => {
                if (result.error) {
                    // Muestra el error al usuario si hay uno
                    alert(result.error.message);
                }
            });
        } else {
            // Manejar errores
            console.error('Error al procesar el pago:', data.error);
            alert('Hubo un problema al procesar tu pago. Por favor intenta de nuevo.');
        }
    } catch(error) {
        console.error('Error:', error);
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


