import { createCheckoutSession } from '../services/paymentService';
import CartManager from '../models/CartManager';

const cartManager = new CartManager('cart.json', );

export const checkout = async (req, res) => {
  try {
    const customerEmail = req.body.customerEmail;
    const sessionId = await createCheckoutSession(customerEmail);
    
    cartManager.proceedToCheckout(); // Asumiendo que esto vacía el carrito y crea un ticket
    res.json({ sessionId });
  } catch (error) {
    res.status(500).json({ message: 'Error procesando el pago' });
  }
};
