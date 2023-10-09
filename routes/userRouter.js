import express from 'express';
import * as UserService from '../services/UserService.js';
import * as TokenService from '../services/TokenService.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const userRouter = express.Router();

userRouter.post('/register', async (req, res) => {
    try {
        const user = await UserService.registerUser(req.body);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

userRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserService.getUserByEmail(email);

        if (!user) {
            return res.status(401).json({ message: 'Email o contraseña incorrectos.' });
        }

        const isPasswordValid = await UserService.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email o contraseña incorrectos.' });
        }

        const token = TokenService.generateToken({ id: user._id, role: user.role });
        res.status(200).json({ token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export default userRouter;
