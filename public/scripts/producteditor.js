
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
