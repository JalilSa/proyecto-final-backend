import { createCheckoutSession } from '../services/paymentService.js';

async function initiatePayment(req, res) {
  try {
    const sessionId = await paymentService.checkoutAndPay(req.body.customerEmail);
    res.json({ sessionId });
  } catch (error) {
    res.status(500).json({ message: 'Error procesando el pago' });
  }
}

export default {
  initiatePayment
};
