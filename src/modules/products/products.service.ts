// src/modules/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductFeature } from './entities/product-feature.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CustomizationOption } from './entities/customization-option.entity';
import { CategoryStats } from './interfaces/category-stats.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductFeature)
    private productFeatureRepository: Repository<ProductFeature>,
    @InjectRepository(CustomizationOption)
    private customizationOptionRepository: Repository<CustomizationOption>,
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
  


    if (createProductDto.customization_options && createProductDto.is_customizable) {
      const customizationOptions = createProductDto.customization_options.map((option) =>
          this.customizationOptionRepository.create({
              ...option,
              product: savedProduct,
          })
      );

      await this.customizationOptionRepository.save(customizationOptions);
  }

  return this.productRepository.findOne({
      where: { id: savedProduct.id },
      relations: ['features', 'customization_options'],
  });
  }
  

  // Get all products
  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ 
      relations: ['features', 'customization_options'] 
    });
  }

  // Get product by ID
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ 
      where: { id }, 
      relations: ['features', 'customization_options'] // Add customization_options
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
      relations: ['features', 'customization_options'] // Add customization_options
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
  
    // Handle customization options update
    if (updateProductDto.customization_options) {
      // Remove existing customization options
      await this.customizationOptionRepository.delete({ product: existingProduct });
  
      // Create and associate new customization options
      const newOptions = updateProductDto.customization_options.map(option => 
        this.customizationOptionRepository.create({
          ...option,
          product: existingProduct
        })
      );
  
      existingProduct.customization_options = await this.customizationOptionRepository.save(newOptions);
    }
  
    // Update other product fields
    this.productRepository.merge(existingProduct, updateProductDto);
  
    return this.productRepository.save(existingProduct);
  }

  // Delete a product
  async remove(id: number): Promise<void> {
    const product = await this.productRepository.findOne({ 
      where: { id },
      relations: ['features', 'customization_options']
    });
  
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  
    // Delete related entities first
    await this.productFeatureRepository.delete({ product });
    await this.customizationOptionRepository.delete({ product });
  
    // Then delete the product
    await this.productRepository.remove(product);
  }

  async getCategoryStats(): Promise<CategoryStats[]> {
    const stats = await this.productRepository
        .createQueryBuilder('product')
        .select([
            'product.category as category',
            'COUNT(product.id) as product_count',
            'SUM(product.price) as total_value',
            'ROUND(AVG(product.price), 2) as average_price'
        ])
        .where('product.is_active = :isActive', { isActive: true })
        .groupBy('product.category')
        .orderBy('product_count', 'DESC')
        .getRawMany();

    // Calculate overall totals
    const totalStats = await this.productRepository
        .createQueryBuilder('product')
        .select([
            '"All Categories" as category',
            'COUNT(product.id) as product_count',
            'SUM(product.price) as total_value',
            'ROUND(AVG(product.price), 2) as average_price'
        ])
        .where('product.is_active = :isActive', { isActive: true })
        .getRawOne();

    // Combine category-wise stats with total stats
    return [totalStats, ...stats].map(stat => ({
        category: stat.category,
        product_count: parseInt(stat.product_count),
        total_value: parseFloat(stat.total_value),
        average_price: parseFloat(stat.average_price)
    }));
}

}
