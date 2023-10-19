
import * as TokenService from '../services/TokenService.js';

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('Autenticando...');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = TokenService.verifyToken(token);
    req.user = decodedToken; 
    console.log("Token decodificado:", decodedToken);
    

    if (!decodedToken) {
        return res.status(403).json({ message: 'Token inválido o expirado' });
    }

    req.user = decodedToken; 
    next();
};

export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('Acceso no autorizado');
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    res.status(403).send('Acceso denegado');
};

export const isPremiumOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'premium')) {
        return next();
    }
    res.status(403).send('Acceso denegado');
    console.log('Verificando si es premium o admin...');
    console.log('Usuario:', req.user);
};

