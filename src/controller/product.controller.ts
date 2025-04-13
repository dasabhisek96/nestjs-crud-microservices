import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { ProductDAO } from '@/dao/product.dao';
import { CreateProductDto, UpdateStockDto } from '@/dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly ProductDAO: ProductDAO) {}

    @Post('addProduct')
    async addProduct(@Body() createProductDto: CreateProductDto) {
        try {
            const existingProduct = await this.ProductDAO.getProductByName(createProductDto.name);
            if (existingProduct) {
                return { message: 'Product already exists', product: existingProduct };
            }
            const product = await this.ProductDAO.addProduct(createProductDto);
            return { message: 'Product added successfully', product };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to add product: ${error.message}`);
            }
            throw new Error('Failed to add product due to an unknown error');
        }
    }

    @Get()
    async getAllProducts() {
        try {
            const products = await this.ProductDAO.getAllProducts();
            return { message: 'Products retrieved successfully', products };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to retrieve products: ${error.message}`);
            }
            throw new Error('Failed to retrieve products due to an unknown error');
        }
    }

    @Get(':id')
    async getProductById(@Param('id') id: string) {
        try {
            const product = await this.ProductDAO.getProductById(id);
            if (!product) {
                throw new Error('Product not found');
            }
            return { message: 'Product retrieved successfully', product };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to retrieve product: ${error.message}`);
            }
            throw new Error('Failed to retrieve product due to an unknown error');
        }
    }

    @Patch(':id/stock')
    async updateStock(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto) {
        try {
            const updatedProduct = await this.ProductDAO.updateStock(id, updateStockDto.stock);
            return { message: 'Stock updated successfully', updatedProduct };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to update stock: ${error.message}`);
            }
            throw new Error('Failed to update stock due to an unknown error');
        }
    }
    
    @Delete(':id')
    async deleteProduct(@Param('id') id: string) {
        try {
            const result = await this.ProductDAO.deleteProduct(id);
            if (!result) {
                throw new Error('Product not found');
            }
            return { message: 'Product deleted successfully' };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to delete product: ${error.message}`);
            }
            throw new Error('Failed to delete product due to an unknown error');
        }
    }

 
}
