import * as UserService from '../services/UserService.js';
import * as TokenService from '../services/TokenService.js';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserService.getUserByEmail(email);
        const currentDate = new Date();

        if (!user) {
            return res.status(401).json({ message: 'Email o contraseña incorrectos.' });
        }

        const isPasswordValid = await UserService.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email o contraseña incorrectos.' });
        }
        //Manegar last login
        await UserDAO.updateLastLogin(user._id, currentDate);
        // Generar un token para el usuario
        const token = TokenService.generateToken(user);
        res.json({
            message: 'Inicio de sesión exitoso',
            user: {
                id: user._id,
                email: user.email,
                role: user.role  
            },
            token
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
