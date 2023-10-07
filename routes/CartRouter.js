import express from 'express';
import CartManager from '../models/CartManager.js';

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

export default cartRoutes;
