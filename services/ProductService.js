import ProductDAO from '../mongo/DAO/productDAO.js';
import { findUserById } from '../mongo/DAO/UserDAO.js'; 
import { sendEmail } from '../managers/mailManager.js';  
const productDAO = new ProductDAO();

export const addProductService = async (productData, userId) => {
    if (userId) {
        productData.owner = userId;
    } else {
        throw new Error("No se pudo establecer el propietario del producto");
    }
    console.log("Datos del producto a guardar:", productData);
    return await productDAO.addProduct(productData);
};

export const getAllProductsService = async () => {
    return await productDAO.getAllProducts();
};

export const getProductByIdService = async (productId) => {
    return await productDAO.getProductById(productId);
};

export const updateProductService = async (productId, updateData) => {
    return await productDAO.updateProduct(productId, updateData);
};

export const deleteProductService = async (productId) => {
    // Paso 1: Obtener el producto
    const product = await productDAO.getProductById(productId);
    if (!product) {
        throw new Error("Producto no encontrado");
    }

    // Paso 2: Obtener el usuario propietario
    const user = await findUserById(product.owner);
    if (!user) {
        throw new Error("Propietario del producto no encontrado");
    }

    // Paso 3: Enviar el correo
    const subject = "Notificación de eliminación de producto";
    const text = `Hola ${user.name}, lamentamos informarte que tu producto "${product.name}" ha sido eliminado.`;
    await sendEmail(user.email, subject, text);

    // Paso 4: Eliminar el producto
    return await productDAO.deleteProduct(productId);
};