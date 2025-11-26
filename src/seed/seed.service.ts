import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/data';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.createUsers();
    await this.createProducts(adminUser);
    return 'SEED executed';
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async createUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];

    seedUsers.forEach(user => {
      return users.push(this.userRepository.create(user));
    });
    const dbUser = await this.userRepository.save(users);
    return dbUser[0];
  }

  private async createProducts(adminUser: User) {
    await this.productsService.deleteAllProducts();
    // Logic to create products
    const products = initialData.products;

    const insertPromises: Promise<any>[] = [];

    products.forEach(product => {
      return insertPromises.push(this.productsService.create(product, adminUser));
    })

    await Promise.all(insertPromises);
    return true;
  }
}
