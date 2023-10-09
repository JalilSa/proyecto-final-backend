import express from 'express';
import paymentController from '../controllers/paymentController.js';

const paymentRoutes = express.Router();

paymentRoutes.post('/checkout', paymentController.initiatePayment);

export default paymentRoutes;
