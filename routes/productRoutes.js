import express from 'express';
import ProductDAO from '../mongo/DAO/productDAO.js';

const productRouter = express.Router();
const productDAO = new ProductDAO();

productRouter.post('/api/products', async (req, res) => {
    try {
        const productData = req.body;
        const product = await productDAO.addProduct(productData);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productRouter.get('/api/products', async (req, res) => {
    try {
        const products = await productDAO.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productRouter.get('/api/products/:id', async (req, res) => {
    try {
        const product = await productDAO.getProductById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productRouter.put('/api/products/:id', async (req, res) => {
    try {
        const updatedProduct = await productDAO.updateProduct(req.params.id, req.body);

        if (updatedProduct) {
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productRouter.delete('/api/products/:id', async (req, res) => {
    try {
        await productDAO.deleteProduct(req.params.id);
        res.json({ message: 'Producto eliminado correctamente.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default productRouter;
