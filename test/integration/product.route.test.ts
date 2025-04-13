  import {addProduct,getAllProducts,getProduct,updateStock,deleteProduct} from './../../src/router/product.router';
  import * as productController from './../../src/controller/product.controller';
  import { jest, describe, it, expect, beforeEach } from '@jest/globals';
  describe('Product Router Integration (No Supertest)', () => {
    let req: any;
    let res: any;
    let next: jest.Mock;
  
    beforeEach(() => {
      req = {};
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });
  
    // ✅ Positive Test Cases
  
    it('should add a product', async () => {
      req.body = { name: 'Product 1', price: 100, stock: 50 };
  
      await addProduct(req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Product created successfully',
        data: expect.anything(),
      }));
    });
  
    it('should get all products', async () => {
      await getAllProducts(req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Products retrieved successfully',
        data: expect.anything(),
      }));
    });
  
    it('should get a product by id', async () => {
      req.params = { id: 'valid-id' };
  
      await getProduct(req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Product retrieved successfully',
        data: expect.anything(),
      }));
    });
  
    it('should update stock of a product', async () => {
      req.params = { id: 'valid-id' };
      req.body = { stock: 100 };
  
      await updateStock(req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Product updated successfully',
        data: expect.anything(),
      }));
    });
  
    it('should delete a product', async () => {
      req.params = { id: 'valid-id' };
  
      await deleteProduct(req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Product deleted successfully',
        data: expect.anything(),
      }));
    });
  
    // ❌ Negative Test Cases
  
    it('should call next on addProduct error (missing body)', async () => {
      req.body = undefined;  // no body
  
      await addProduct(req, res, next);
  
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  
    it('should call next on getProduct error (missing id)', async () => {
      req.params = {};  // no id
  
      await getProduct(req, res, next);
  
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  
    it('should call next on updateStock error (missing body)', async () => {
      req.params = { id: 'some-id' };
      req.body = undefined;  // no body
  
      await updateStock(req, res, next);
  
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  
    it('should call next on deleteProduct error (missing id)', async () => {
      req.params = {};  // no id
  
      await deleteProduct(req, res, next);
  
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  
  });
  