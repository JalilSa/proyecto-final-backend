import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cartRoutes from './routes/CartRouter.js';
import paymentRoutes from './routes/paymentRoutes.js';
import userRouter from './routes/userRouter.js';
import { connectDB } from './mongo/database.js';
import cors from 'cors';

// Configuración de dotenv para manejar variables de entorno
dotenv.config();


const app = express();
connectDB();
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(express.json());


// Rutas
app.use('/cart', cartRoutes);
app.use('/payment', paymentRoutes);
app.use('/api/users', userRouter);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;