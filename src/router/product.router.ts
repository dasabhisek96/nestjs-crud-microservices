import express from 'express';
import { ProductController } from '../controller/product.controller';
import { ProductDAO } from '../dao/product.dao';

const router = express.Router();

const productDAO = new ProductDAO();
const productController = new ProductController(productDAO);

const addProduct = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const body = req.body;

        productController.addProduct(body)
            .then((response: any) => {
                res.status(201).json({
                    status: 201,
                    message: 'Product created successfully',
                    data: response,
                });
            })
            .catch((error: unknown) => {
                console.error('Error while creating product:', error);
                next(error);
            });
    } catch (error: any) {
        next(error);
    }
};

const getAllProducts = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        productController.getAllProducts()
            .then((response: any) => {
                res.status(200).json({
                    status: 200,
                    message: 'Products retrieved successfully',
                    data: response,
                });
            })
            .catch((error: unknown) => {
                console.error('Error while retrieving products:', error);
                next(error);
            });
    } catch (error: any) {
        next(error);
    }
};

const getProduct = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const id = req.params.id;
        productController.getProductById(id)
            .then((response: any) => {
                res.status(200).json({
                    status: 200,
                    message: 'Product retrieved successfully',
                    data: response,
                });
            })
            .catch((error: unknown) => {
                console.error('Error while retrieving product:', error);
                next(error);
            });
    } catch (error: any) {
        next(error);
    }
};

const updateStock = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const id = req.params.id;
        const body = req.body;

        productController.updateStock(id, body)
            .then((response: any) => {
                res.status(200).json({
                    status: 200,
                    message: 'Product updated successfully',
                    data: response,
                });
            })
            .catch((error: unknown) => {
                console.error('Error while updating product:', error);
                next(error);
            });
    } catch (error: any) {
        next(error);
    }
};

const deleteProduct = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const id = req.params.id;

        productController.deleteProduct(id)
            .then((response: any) => {
                res.status(200).json({
                    status: 200,
                    message: 'Product deleted successfully',
                    data: response,
                });
            })
            .catch((error: unknown) => {
                console.error('Error while deleting product:', error);
                next(error);
            });
    } catch (error: any) {
        next(error);
    }
};

router.post('/', addProduct);
router.get('/:id', getProduct);
router.patch('/:id', updateStock);
router.delete('/:id', deleteProduct);
router.get('/', getAllProducts);
export {addProduct, getAllProducts, getProduct, updateStock, deleteProduct};
export default router;