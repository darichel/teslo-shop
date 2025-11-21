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
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Product, ProductImage } from './entities';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImagesRepository: Repository<ProductImage>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto;
      const product = this.productsRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.productImagesRepository.create({ url: image }),
        ),
      });
      await this.productsRepository.save(product);
      return { ...product, images };
    } catch (error) {
      this.handleDBExecption(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    console.log({ paginationDto });
    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.productsRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      }
    });

    return products.map((product) => ({
      ...product,
      images: product.images?.map((image) => image.url) || [],
    }));
  }

  async findOne(term: string) {
    let product: Product | null;
    if (IsUUID(term)) {
      product = await this.productsRepository.findOneBy({ id: term });
    } else {
      //product = await this.productsRepository.findOneBy({ slug: term });
      const queryBuilder = this.productsRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('UPPER(title) =:title OR slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'image')
        .getOne();
    }
    if (!product)
      throw new BadRequestException(`Product with id ${term} not found`);
    return product;
  }

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images?.map((image) => image.url) || [],
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepository.preload({
      id: id,
      ...updateProductDto,
      images: [],
    });
    if (!product)
      throw new BadRequestException(`Product with id ${id} not found`);

    try {
      await this.productsRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBExecption(error);
    }
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
