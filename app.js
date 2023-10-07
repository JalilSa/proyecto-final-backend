import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cartRoutes from './routes/CartRouter.js';
 

// Configuración de dotenv para manejar variables de entorno
dotenv.config();

const app = express();

// Middleware para analizar el cuerpo de las peticiones POST
app.use(bodyParser.json());
app.use(express.json());
// Rutas
app.use('/cart', cartRoutes);
app.use('/payment', paymentRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;