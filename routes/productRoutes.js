import express from 'express';
import { 
    addProductService,
    getAllProductsService,
    getProductByIdService,
    updateProductService,
    deleteProductService 
} from '../services/ProductService.js';
import {authenticate, isAdmin} from "../middlewares/authMiddleware.js"

const productRouter = express.Router();

productRouter.post('/api/products', authenticate, async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const product = await addProductService(req.body, userId);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productRouter.get('/api/products', async (req, res) => {
    try {
        const products = await getAllProductsService();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productRouter.get('/api/products/:id', async (req, res) => {
    try {
        const product = await getProductByIdService(req.params.id);
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
        const updatedProduct = await updateProductService(req.params.id, req.body);
        if (updatedProduct) {
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productRouter.delete('/api/products/:id', authenticate, isAdmin, async (req, res) => {
    try {
        await deleteProductService(req.params.id);
        res.json({ message: 'Producto eliminado correctamente.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default productRouter;
