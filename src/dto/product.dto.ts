  // src/product/dto/create-product.dto.ts
  export class CreateProductDto {
    name!: string;
    description?: string;
    price!: number;
    stock!: number;
  }
  
  // src/product/dto/update-stock.dto.ts
  export class UpdateStockDto {
    stock!: number;
  }
  