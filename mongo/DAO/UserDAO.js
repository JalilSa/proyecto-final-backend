import UserModel from '../models/User.js';

export const createUser = async (userData) => {
    return await UserModel.create(userData);
};

export const findUserByEmail = async (email) => {
    return await UserModel.findOne({ email: email });
};

export const updateLastLogin = async (userId, date) => {
    return await UserModel.findByIdAndUpdate(userId, { lastLogin: date });
};

export const getAllUsers = async () => {
    return await UserModel.find({}, 'name email role');
};

export const deleteUsersByLastLogin = async (thresholdDate) => {
    return await UserModel.deleteMany({ lastLogin: { $lt: thresholdDate } });
};

export const deleteUserById = async (userId) => {
    return await UserModel.findByIdAndDelete(userId);
};


export const flipRole = async (userId) => {
    const user = await UserModel.findById(userId);
    
    if (!user) {
        throw new Error("Usuario no encontrado");
    }

    if (user.role === "admin") {
        throw new Error("No se puede editar un admin");
    }

    user.role = user.role === "normal" ? "premium" : "normal";
    await user.save();

    return user.role;
};


export const getUsersToBeDeleted = async (thresholdDate) => {
    return await UserModel.find({ lastLogin: { $lt: thresholdDate } });
};

export const findUserById = async (userId) => {
    return await UserModel.findById(userId);
};
