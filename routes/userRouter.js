import express from 'express';
import * as UserService from '../services/UserService.js';
import * as TokenService from '../services/TokenService.js';
import { authenticate, isAdmin } from '../middlewares/authMiddleware.js';
import { getAllUsers, deleteUsersByLastLogin, deleteUserById, flipRole, getUsersToBeDeleted} from '../mongo/DAO/UserDAO.js';
import { sendEmail } from '../managers/mailManager.js';
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

userRouter.get('/getusers', authenticate, isAdmin, async (req, res) => {
    try {
        const users = await getAllUsers();
        console.log("Usuarios recuperados:");
        res.status(200).json(users);
    } catch (error) {
        console.error("Error al recuperar usuarios:", error);
        res.status(500).json({ message: "Error al recuperar usuarios" });
    }
})




userRouter.delete('/deleteusers', authenticate, async (req, res) => {
    try {
        const currentDate = new Date();
        const thresholdDate = new Date(currentDate - 2 * 24 * 60 * 60 * 1000); // 2 días atrás

        // Obtener los correos electrónicos de los usuarios que serán eliminados antes de eliminarlos.
        const usersToBeDeleted = await getUsersToBeDeleted(thresholdDate);

        const deletedUsers = await deleteUsersByLastLogin(thresholdDate);

        // Enviar correos electrónicos a los usuarios eliminados.
        for (let user of usersToBeDeleted) {
            await sendEmail(user.email, 'Cuenta eliminada', 'Tu cuenta fue eliminada por inactividad.');
        }

        res.json({ message: `Eliminados ${deletedUsers.deletedCount} usuarios por inactividad.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



userRouter.delete('/:userId', authenticate, isAdmin, async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await deleteUserById(userId);
        
        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }
        
        res.json({ message: "Usuario eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

userRouter.put('/:userId/role', authenticate, isAdmin, async (req, res) => {
    try {
        const userId = req.params.userId;
        const updatedRole = await flipRole(userId);
        res.json({ message: `Rol del usuario cambiado a ${updatedRole}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default userRouter;
