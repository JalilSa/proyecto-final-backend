import * as UserDAO from '../mongo/DAO/UserDAO.js';
import bcrypt from 'bcrypt';

export const registerUser = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    
    const user = await UserDAO.createUser(userData);
    return user;
};

export const getUserByEmail = async (email) => {
    return await UserDAO.findUserByEmail(email);
};

export const verifyPassword = async (inputPassword, storedHashedPassword) => {
    return await bcrypt.compare(inputPassword, storedHashedPassword);
};

export const createAdminUser = async () => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    try {
        const existingUser = await UserDAO.findUserByEmail(adminEmail);
        if (!existingUser) {
            const adminUserData = {
                username: 'admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            };
            await UserDAO.createUser(adminUserData);
            console.log('Usuario administrador creado.');
        } else {
            console.log('Usuario administrador ya existe.');
        }
    } catch (err) {
        console.log(`Error en createAdminUser: ${err.message}`);
    }
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


