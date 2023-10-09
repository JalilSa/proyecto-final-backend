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

cartRoutes.post('/add', (req, res) => {
  // Aquí, agregarías el producto al carrito usando el CartManager
  // Por ejemplo:
  const productId = req.body.productId;
  cartManager.addItem({ id: productId, quantity: 1 });
  res.json({ success: true });
});


export default cartRoutes;
