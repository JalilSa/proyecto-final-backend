import express from 'express';
import * as UserService from '../services/UserService.js';
import * as TokenService from '../services/TokenService.js';
import { authenticate, isAdmin } from '../middlewares/authMiddleware.js';
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

        const token = TokenService.generateToken({ _id: user._id, role: user.role });


        // Modificar la respuesta para enviar el token y el userId
        res.status(200).json({ token, userId: user._id.toString() });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


userRouter.get('/getusers', authenticate, isAdmin, async (req, res) => {
    try {
        const users = await UserService.getAllServiceUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});





userRouter.delete('/deleteusers', authenticate, isAdmin, async (req, res) => {
    try {
        const currentDate = new Date();
        const thresholdDate = new Date(currentDate - 2 * 24 * 60 * 60 * 1000);
        console.log("Fecha umbral para eliminar usuarios:", thresholdDate);

        const deletedCount = await UserService.deleteInactiveUsers(thresholdDate);
        res.json({ message: `Eliminados ${deletedCount} usuarios por inactividad.` });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



userRouter.delete('/:userId', authenticate, isAdmin, async (req, res) => {
    try {
        await UserService.deleteUser(req.params.userId);
        res.json({ message: "Usuario eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

userRouter.put('/:userId/role', authenticate, isAdmin, async (req, res) => {
    try {
        const updatedRole = await UserService.changeUserRole(req.params.userId);
        res.json({ message: `Rol del usuario cambiado a ${updatedRole}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

userRouter.get('/adminId', async (req, res) => {
    try {
        const adminId = await UserService.getAdminId();
        res.status(200).json({ adminId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export default userRouter;
