import * as UserDAO from '../mongo/DAO/UserDAO.js';
import bcrypt from 'bcrypt';
import { sendEmail } from '../managers/mailManager.js';

export const registerUser = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    return await UserDAO.createUser(userData);
};

export const getUserByEmail = UserDAO.findUserByEmail;

export const verifyPassword = async (inputPassword, storedHashedPassword) => {
    return await bcrypt.compare(inputPassword, storedHashedPassword);
};

export const createAdminUser = async () => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const existingUser = await UserDAO.findUserByEmail(adminEmail);

    if (!existingUser) {
        await UserDAO.createUser({
            username: 'admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });
        console.log('Usuario administrador creado.');
    } else {
        console.log('Usuario administrador ya existe.');
    }
};

export const getAllServiceUsers = UserDAO.getAllUsers;

export const deleteInactiveUsers = async (thresholdDate) => {
    const usersToBeDeleted = await UserDAO.getUsersToBeDeleted(thresholdDate);
    const deletedUsers = await UserDAO.deleteUsersByLastLogin(thresholdDate);
    
    for (let user of usersToBeDeleted) {
        await sendEmail(user.email, 'Cuenta eliminada', 'Tu cuenta fue eliminada por inactividad.');
    }

    return deletedUsers.deletedCount;
};

export const deleteUser = async (userId) => {
    const user = await UserDAO.findUserById(userId);  // Aquí es donde hicimos la corrección.

    if (!user) throw new Error("Usuario no encontrado");
    if (user.role === 'admin') throw new Error("No se puede eliminar el usuario admin");
    
    await UserDAO.deleteUserById(userId);
    return user;
};


export const changeUserRole = UserDAO.flipRole;

export const getAdminId = async () => {
    const admin = await UserDAO.findUserByEmail(process.env.ADMIN_EMAIL);
    if (!admin) throw new Error('Administrador no encontrado.');
    return admin._id;
};

export const createDummyUsers = async () => {
    try {
        const currentDate = new Date();
        const dummyUsers = [
            {
                name: "dummy1",
                email: "dummy1@dummy.com",
                password: await bcrypt.hash("passwordDummy1", 10),
                lastLogin: new Date(currentDate - 1 * 24 * 60 * 60 * 1000) 
            },
            {
                name: "dummy2",
                email: "dummy2@dummy.com",
                password: await bcrypt.hash("passwordDummy2", 10),
                lastLogin: new Date(currentDate - 3 * 24 * 60 * 60 * 1000)
            }
        ];

        for (const user of dummyUsers) {
            await UserDAO.createUser(user);
        }
        console.log('Usuarios dummy creados con éxito.');

    } catch (error) {
        console.error("Error al crear usuarios dummy:", error.message);
    }
};

