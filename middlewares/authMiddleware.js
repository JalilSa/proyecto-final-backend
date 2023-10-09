
import * as TokenService from '../services/TokenService.js';

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = TokenService.verifyToken(token);

    if (!decodedToken) {
        return res.status(403).json({ message: 'Token inválido o expirado' });
    }

    req.user = decodedToken; // Ahora tienes acceso a la información del usuario en `req.user` para las siguientes rutas/middlewares
    next();
};
