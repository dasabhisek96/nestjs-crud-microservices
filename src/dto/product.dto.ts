  
  export class CreateProductDto {
    name!: string;
    description?: string;
    price!: number;
    stock!: number;
  }
  
  
  export class UpdateStockDto {
    stock!: number;
  }
  