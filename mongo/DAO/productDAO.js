import Product from '../models/product.js';  

class ProductDAO {
    async addProduct(productData) {
        const product = new Product(productData);
        return await product.save();
    }

    async getProductById(id) {
        return await Product.findById(id).exec();
    }

    async getAllProducts(options = {}) {
        return await Product.find(options).exec();
    }

    async updateProduct(id, productData) {
        return await Product.findByIdAndUpdate(id, productData, { new: true }).exec();
    }

    async deleteProduct(id) {
        return await Product.findByIdAndDelete(id).exec();
    }
}

export default ProductDAO;
