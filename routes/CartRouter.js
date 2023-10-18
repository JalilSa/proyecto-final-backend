import express from 'express';
import CartManager from '../managers/CartManager.js';

const cartRoutes = express.Router();
const cartManager = new CartManager('cart.json', 'productManagerInstance');

cartRoutes.post('/checkout', async (req, res) => {
  try {
    const sessionId = await cartManager.checkoutAndPay(req.body.customerEmail);
    res.json({ sessionId });
  } catch (error) {
    res.status(500).json({ message: 'Error procesando el pago' });
  }
});

// cartRoutes.post('/add', (req, res) => {
//   const productId = req.body.productId;
//   cartManager.addItem({ id: productId, quantity: 1 });
//   res.json({ success: true });
// });

cartRoutes.post('/add', (req, res) => {
  const productId = req.body.productId;
  
  console.log(`Producto con ID: ${productId} recibido exitosamente.`);
  
  res.json({ message: `Producto con ID: ${productId} recibido en el servidor.` });
});

cartRoutes.get('/', async (req, res) => {
  try {
      const cartItems = await cartManager.getCartItems(); // Asume que tienes una función así en tu CartManager
      res.json(cartItems);
  } catch (error) {
      res.status(500).json({ message: 'Error al obtener los artículos del carrito' });
  }
});


export default cartRoutes;
