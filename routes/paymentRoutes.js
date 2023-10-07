import express from 'express';
import paymentController from '../controllers/paymentController.js';

const router = express.Router();

router.post('/checkout', paymentController.initiatePayment);

export default router;
