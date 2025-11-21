import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/data';

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
    const products = initialData.products;

    const insertPromises: Promise<any>[] = [];

    products.forEach(product => {
      return insertPromises.push(this.productsService.create(product));
    })

    await Promise.all(insertPromises);
    return true;
  }
}
