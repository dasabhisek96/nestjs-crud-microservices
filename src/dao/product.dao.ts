import { Product } from '@/entities/product.entity';
import AppDataSource from '@/entities/data-source';
import  redisClient  from '@/middleware/redis.client'; // Make sure this is the correct path
import 'reflect-metadata';

export class ProductDAO {
    private cacheTTL = 60; // in seconds, you can adjust

    async addProduct(payload: Partial<Product>) {
        try {
            const productRepository = AppDataSource.getRepository(Product);
            const product = productRepository.create(payload);
            const saved = await productRepository.save(product);

            // Invalidate cache
            await redisClient.del('products:all');

            return saved;
        } catch (error: any) {
            console.error(`[ProductDAO_addProduct] Error:`, error);
            throw new Error(error?.message || 'Failed to add product');
        }
    }

    async getProductById(id: string) {
        const cacheKey = `product:${id}`;
        try {
            const cached = await redisClient.get(cacheKey);
            if (cached) return JSON.parse(cached);

            const productRepository = AppDataSource.getRepository(Product);
            const product = await productRepository.findOne({ where: { id } });

            if (product) {
                await redisClient.setex(cacheKey, this.cacheTTL, JSON.stringify(product));
            }

            return product;
        } catch (error: any) {
            console.error(`[ProductDAO_getProductById] Error:`, error);
            throw new Error(error?.message || 'Failed to get product');
        }
    }

    async updateProduct(id: string, payload: Partial<Product>) {
        try {
            const productRepository = AppDataSource.getRepository(Product);
            await productRepository.update(id, payload);

            // Invalidate cache
            await redisClient.del(`product:${id}`);
            await redisClient.del('products:all');

            return await this.getProductById(id);
        } catch (error: any) {
            console.error(`[ProductDAO_updateProduct] Error:`, error);
            throw new Error(error?.message || 'Failed to update product');
        }
    }

    async deleteProduct(id: string) {
        try {
            const productRepository = AppDataSource.getRepository(Product);
            const result = await productRepository.delete(id);

            // Invalidate cache
            await redisClient.del(`product:${id}`);
            await redisClient.del('products:all');

            return result.affected ? true : false;
        } catch (error: any) {
            console.error(`[ProductDAO_deleteProduct] Error:`, error);
            throw new Error(error?.message || 'Failed to delete product');
        }
    }

    async getAllProducts() {
        const cacheKey = 'products:all';
        try {
            const cached = await redisClient.get(cacheKey);
            if (cached) return JSON.parse(cached);

            const productRepository = AppDataSource.getRepository(Product);
            const products = await productRepository.find();

            await redisClient.setex(cacheKey, this.cacheTTL, JSON.stringify(products));

            return products;
        } catch (error: any) {
            console.error(`[ProductDAO_getAllProducts] Error:`, error);
            throw new Error(error?.message || 'Failed to get all products');
        }
    }

    async updateStock(id: string, stock: number) {
        try {
            const productRepository = AppDataSource.getRepository(Product);
            await productRepository.update(id, { stock });

            // Invalidate cache
            await redisClient.del(`product:${id}`);
            await redisClient.del('products:all');

            return await this.getProductById(id);
        } catch (error: any) {
            console.error(`[ProductDAO_updateStock] Error:`, error);
            throw new Error(error?.message || 'Failed to update stock');
        }
    }

    async getProductByName(name: string) {
        const cacheKey = `product:name:${name}`;
        try {
            const cached = await redisClient.get(cacheKey);
            if (cached) return JSON.parse(cached);

            const productRepository = AppDataSource.getRepository(Product);
            const product = await productRepository.findOne({ where: { name } });

            if (product) {
                await redisClient.setex(cacheKey, this.cacheTTL, JSON.stringify(product));
            }

            return product;
        } catch (error: any) {
            console.error(`[ProductDAO_getProductByName] Error:`, error);
            throw new Error(error?.message || 'Failed to get product by name');
        }
    }
}
























