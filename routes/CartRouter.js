import express from 'express';
import CartManager from '../managers/CartManager.js';

const cartRoutes = express.Router();
const cartManager = new CartManager('cart.json', 'productManagerInstance');


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
