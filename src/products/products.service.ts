import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as IsUUID } from 'uuid';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate } from 'class-validator';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productsRepository.create(createProductDto);
      await this.productsRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBExecption(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    console.log({paginationDto});
    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.productsRepository.find({
      take: limit,
      skip: offset,
      //TODO: relations
    });
    return products;
  }

  async findOne(term: string) {
    let product: Product | null;;
    if(IsUUID(term)){
      product = await this.productsRepository.findOneBy({ id: term });
    }else{
      product = await this.productsRepository.findOneBy({ slug: term });

    }
    if (!product)
      throw new BadRequestException(`Product with id ${term} not found`);
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id.toString());
    await this.productsRepository.remove(product);
    return `This action removes a #${id} product`;
  }

  private handleDBExecption(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error , please check server logs :(',
    );
  }
}
