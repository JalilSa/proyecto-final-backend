import jwt from 'jsonwebtoken';

const SECRET_KEY = 'YOUR_SECRET_KEY';  

export const generateToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role  
    };

    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });  
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (err) {
        console.log('Error verifying JWT:', err);
        return null;
    }
};
