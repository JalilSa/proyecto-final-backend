import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cartRoutes from './routes/CartRouter.js';
import paymentRoutes from './routes/paymentRoutes.js';
import userRouter from './routes/userRouter.js';
import authRouter from './routes/authRouter.js';
import {connectDB } from './mongo/database.js';
import productRouter from './routes/productRoutes.js';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';

// Configuración de dotenv 
dotenv.config();
const PORT = process.env.PORT || 5000;


//config de app
const app = express();
connectDB();
app.use(session({
  secret: 'tu_clave_secreta',
  resave: false,
  saveUninitialized: false
}));
const frontendOrigin = `http://localhost:${PORT}`;
app.use(cors({
  origin: frontendOrigin,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
      done(err, user);
  });
});


// Rutas
app.use('/cart', cartRoutes);
app.use('/payment', paymentRoutes);
app.use('/api/users', userRouter);
app.use('/api', authRouter);
app.use('/', productRouter);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;