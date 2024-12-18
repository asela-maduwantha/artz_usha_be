// src/modules/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductFeature } from './entities/product-feature.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductFeature)
    private productFeatureRepository: Repository<ProductFeature>,
  ) {}

  // Create a new product
  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Create a new product instance
    const product = this.productRepository.create({
      name: createProductDto.name,
      description: createProductDto.description,
      price: createProductDto.price,
      category: createProductDto.category,
      img_url: createProductDto.img_url,
      is_customizable: createProductDto.is_customizable,
      is_active: createProductDto.is_active,
    });
  
    // Save the product first to get its ID
    const savedProduct = await this.productRepository.save(product);
  
    // Handle features separately
    if (createProductDto.features && createProductDto.features.length > 0) {
      const features = createProductDto.features.map((feature) =>
        this.productFeatureRepository.create({
          ...feature,
          product: savedProduct, // Associate the product with the feature
        })
      );
  
      await this.productFeatureRepository.save(features); // Save all features
    }
  
    // Fetch the saved product with features for consistency
    return this.productRepository.findOne({
      where: { id: savedProduct.id },
      relations: ['features'],
    });
  }
  

  // Get all products
  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ 
      relations: ['features'] 
    });
  }

  // Get product by ID
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ 
      where: { id }, 
      relations: ['features'] 
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  // Update a product
  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    // First, find the existing product
    const existingProduct = await this.productRepository.findOne({ 
      where: { id },
      relations: ['features'] 
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Handle features update
    if (updateProductDto.features) {
      // Remove existing features
      await this.productFeatureRepository.delete({ product: existingProduct });

      // Create and associate new features
      const newFeatures = updateProductDto.features.map(feature => 
        this.productFeatureRepository.create({
          ...feature,
          product: existingProduct
        })
      );

      existingProduct.features = await this.productFeatureRepository.save(newFeatures);
    }

    // Update other product fields
    this.productRepository.merge(existingProduct, updateProductDto);

    return this.productRepository.save(existingProduct);
  }

  // Delete a product
  async remove(id: number): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productRepository.remove(product);
  }
}
