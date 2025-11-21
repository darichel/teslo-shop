import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  async runSeed() {
    
    await this.createProducts();
    
    return 'SEED executed';
  }
  
  private async createProducts() {
    await this.productsService.deleteAllProducts();
    // Logic to create products
    
    return true;
  }
}
