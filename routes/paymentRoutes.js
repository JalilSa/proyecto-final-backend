import express from 'express';
import stripe from '../config/stripe.js';
import ProductDAO from '../mongo/DAO/productDAO.js';

const productDAO = new ProductDAO();


const paymentRoutes = express.Router();

paymentRoutes.post('/checkout', async (req, res) => {
    try {
        const cart = req.body.cart; 

        // Recuperar los productos usando sus IDs
        const productIds = cart.map(item => item.id);
        const products = await Promise.all(productIds.map(id => productDAO.getProductById(id)));

        // Adaptación de line_items para la nueva estructura de la API de Stripe
        const line_items = cart.map(item => {
            const product = products.find(p => p._id.toString() === item.id);

            if (!product) {
                console.error(`El producto con ID ${item.id} no se encontró en la base de datos.`);
                return null;
            }

            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.title,
                        description: product.description,
                        // puedes agregar imágenes si lo deseas: images: [product.imageURL],
                    },
                    unit_amount: product.price * 100, // el precio debe estar en centavos
                },
                quantity: item.quantity,
            };
        }).filter(Boolean); // Filtra elementos nulos o inválidos

        const PORT = process.env.PORT || 8080; 

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: line_items,
            mode: 'payment',
            success_url: `http://localhost:${PORT}/pages/success.html`,
            cancel_url: `http://localhost:${PORT}/pages/cancel.html`,
        });

        res.json({ success: true, sessionId: session.id });
    } catch (error) {
        console.error('Error al crear la sesión de Stripe:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default paymentRoutes;

