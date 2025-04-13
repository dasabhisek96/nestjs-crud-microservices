
import {ProductController} from './../../src/controller/product.controller';
import  {ProductDAO}  from './../../src/dao/product.dao';
import  AppDataSource  from './../../src/entities/data-source';
import { jest, describe, it, expect, beforeEach, afterAll, beforeAll } from '@jest/globals';
import {
productRequestObj,
bulkProductCreatePayload,
} from './../constant/product.constant';

beforeAll(async () => {
    await AppDataSource.initialize(); 
});

afterAll(async () => {
    await AppDataSource.destroy(); 
});
  

describe('ProductController', () => {
    let productController: ProductController;
    let productDAO: jest.Mocked<ProductDAO>;

    let mockProductRequestObj: typeof productRequestObj;
    let mockBulkProductCreatePayload: typeof bulkProductCreatePayload;

    beforeEach(() => {
       mockProductRequestObj = { ...productRequestObj };
       mockBulkProductCreatePayload = { ...bulkProductCreatePayload };

       productDAO = {
        getProductByName: jest.fn(),
        addProduct: jest.fn(),
        getAllProducts: jest.fn(),
        getProductById: jest.fn(),
        updateStock: jest.fn(),
        deleteProduct: jest.fn(),
        updateProduct: jest.fn(),
        } as unknown as jest.Mocked<ProductDAO>;

        productController = new ProductController(productDAO);
    });

    describe('addProduct', () => {
        it('should add a product successfully', async () => {
            productDAO.getProductByName.mockResolvedValue(null);
            productDAO.addProduct.mockResolvedValue(productRequestObj);

            const response = await productController.addProduct(productRequestObj);

            expect(productDAO.getProductByName).toHaveBeenCalledWith(productRequestObj.name);
            expect(productDAO.addProduct).toHaveBeenCalledWith(productRequestObj);
            expect(response).toEqual({
            message: 'Product added successfully',
            product: productRequestObj,
        });

        it('should return error if product name is missing', async () => {
            const invalidProduct = { ...productRequestObj, name: '' };
            await expect(productController.addProduct(invalidProduct)).rejects.toThrow(
                'Failed to add product: Product name is required'
            );
        });

        it('should return error if product price is missing', async () => {
            const invalidProduct = { ...productRequestObj, price: NaN };
            await expect(productController.addProduct(invalidProduct)).rejects.toThrow(
                'Failed to add product: Product price is required'
            );
        });

        it('should return error if product category is missing', async () => {
            const invalidProduct = { ...productRequestObj, category: '' };
            await expect(productController.addProduct(invalidProduct)).rejects.toThrow(
                'Failed to add product: Product category is required'
            );
        });

        it('should return error if product description is missing', async () => {
            const invalidProduct = { ...productRequestObj, description: '' };
            await expect(productController.addProduct(invalidProduct)).rejects.toThrow(
                'Failed to add product: Product description is required'
            );
        });

        it('should return error if product stock is missing', async () => {
            const invalidProduct = { ...productRequestObj, stock: NaN };
            await expect(productController.addProduct(invalidProduct)).rejects.toThrow(
                'Failed to add product: Product stock is required'
            );
        });

        it('should return error if product already exists', async () => {
            productDAO.getProductByName.mockResolvedValue(productRequestObj);
    
            const response = await productController.addProduct(productRequestObj);
    
            expect(response).toEqual({
                message: 'Product already exists',
                product: productRequestObj,
            });
        });
    });

    describe('getAllProducts', () => {
        it('should retrieve all products successfully', async () => {
            productDAO.getAllProducts.mockResolvedValue(bulkProductCreatePayload.products);
    
            const response = await productController.getAllProducts();
    
            expect(productDAO.getAllProducts).toHaveBeenCalled();
            expect(response).toEqual({
                message: 'Products retrieved successfully',
                products: bulkProductCreatePayload.products,
            });
        });

        it('should return error if no products found', async () => {
            productDAO.getAllProducts.mockResolvedValue([]);
    
            const response = await productController.getAllProducts();
    
            expect(productDAO.getAllProducts).toHaveBeenCalled();
            expect(response).toEqual({
                message: 'No products found',
                products: [],
            });
        });

        it('should return error if retrieval fails', async () => {
            productDAO.getAllProducts.mockRejectedValue(new Error('Database error'));
    
            await expect(productController.getAllProducts()).rejects.toThrow(
                'Failed to retrieve products: Database error'
            );
        });

        it('should return error if retrieval fails due to unknown error', async () => {
            productDAO.getAllProducts.mockRejectedValue(new Error('Unknown error'));
    
            await expect(productController.getAllProducts()).rejects.toThrow(
                'Failed to retrieve products due to an unknown error'
            );
        });

        it('should return error if retrieval fails due to unknown error', async () => {
            productDAO.getAllProducts.mockRejectedValue(new Error('Unknown error'));
    
            await expect(productController.getAllProducts()).rejects.toThrow(
                'Failed to retrieve products due to an unknown error'
            );
        });
    });

    describe('getProductById', () => {
        it('should retrieve a product by ID successfully', async () => {
            productDAO.getProductById.mockResolvedValue(productRequestObj);
    
            const response = await productController.getProductById(productRequestObj.id);
    
            expect(productDAO.getProductById).toHaveBeenCalledWith(productRequestObj.id);
            expect(response).toEqual({
                message: 'Product retrieved successfully',
                product: productRequestObj,
            });
        });
    
        it('should return error if product not found', async () => {
            productDAO.getProductById.mockResolvedValue(null);
    
            await expect(productController.getProductById('invalid-id')).rejects.toThrow(
                'Product not found'
            );
        });
    });
    

    describe('updateStock', () => {
        it('should update stock successfully', async () => {
            const updatedStock = 50;
            const updatedProduct = { ...productRequestObj, stock: updatedStock };
            productDAO.updateStock.mockResolvedValue(updatedProduct);
    
            const response = await productController.updateStock(productRequestObj.id, { stock: updatedStock });
    
            expect(productDAO.updateStock).toHaveBeenCalledWith(productRequestObj.id, updatedStock);
            expect(response).toEqual({
                message: 'Stock updated successfully',
                updatedProduct,
            });
        });
    
        it('should return error if stock update fails', async () => {
            productDAO.updateStock.mockRejectedValue(new Error('Update failed'));
    
            await expect(
                productController.updateStock('invalid-id', { stock: 10 })
            ).rejects.toThrow('Failed to update stock: Update failed');
        });
    });
    

    describe('deleteProduct', () => {
        it('should delete a product successfully', async () => {
            productDAO.deleteProduct.mockResolvedValue(true);
    
            const response = await productController.deleteProduct(productRequestObj.id);
    
            expect(productDAO.deleteProduct).toHaveBeenCalledWith(productRequestObj.id);
            expect(response).toEqual({ message: 'Product deleted successfully' });
        });
    
        it('should return error if product not found', async () => {
            productDAO.deleteProduct.mockResolvedValue(false);
    
            await expect(productController.deleteProduct('invalid-id')).rejects.toThrow(
                'Product not found'
            );
        });
    });

    

});







describe('deleteProduct', () => {
    it('should delete a product successfully', async () => {
        productDAO.deleteProduct.mockResolvedValue(true);

        const response = await productController.deleteProduct(productRequestObj.id);

        expect(productDAO.deleteProduct).toHaveBeenCalledWith(productRequestObj.id);
        expect(response).toEqual({ message: 'Product deleted successfully' });
    });

    it('should return error if product not found', async () => {
        productDAO.deleteProduct.mockResolvedValue(false);

        await expect(productController.deleteProduct('invalid-id')).rejects.toThrow(
            'Product not found'
        );
    });
});
});