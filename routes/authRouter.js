import express from 'express';
import { authenticate, isAuthenticated, isAdmin, isPremiumOrAdmin } from '../middlewares/authMiddleware.js';

const authRouter = express.Router();

authRouter.get('/checkToken', authenticate, (req, res) => {
    console.log("Token decodificado:", req.user);  // Para ver la información del usuario
    res.status(200).json({ message: 'Token válido' });
});

authRouter.get('/isAuthenticated', authenticate, isAuthenticated, (req, res) => {
    console.log("Usuario autenticado:", req.user);  // Para ver la información del usuario
    res.status(200).json({ message: 'Usuario autenticado' });
});

authRouter.get('/isAdmin', authenticate, isAdmin, (req, res) => {
    console.log("Usuario con rol:", req.user.role);  // Para ver el rol del usuario
    res.status(200).json({ message: 'Usuario es administrador' });
});

authRouter.get('/isPremiumOrAdmin', authenticate, isPremiumOrAdmin, (req, res) => {
    console.log("Usuario con rol:", req.user.role);  // Para ver el rol del usuario
    res.status(200).json({ message: 'Usuario es premium o administrador' });
});

export default authRouter;
