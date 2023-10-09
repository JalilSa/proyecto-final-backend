import * as UserDAO from '../mongo/DAO/UserDAO.js';
import bcrypt from 'bcrypt';


export const registerUser = async (userData) => {
    // Cifrar la contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    
    const user = await UserDAO.createUser(userData);
    return user;
};

export const getUserByEmail = async (email) => {
    return await UserDAO.findUserByEmail(email);
};

// Función adicional para verificar contraseñas
export const verifyPassword = async (inputPassword, storedHashedPassword) => {
    return await bcrypt.compare(inputPassword, storedHashedPassword);
};
