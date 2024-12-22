
// src/modules/products/products.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseInterceptors,
  ClassSerializerInterceptor 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { CategoryStats } from './interfaces/category-stats.interface';

@ApiTags('Products')
@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully', type: Product })
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of all products', type: [Product] })
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Product details', type: Product })
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully', type: Product })
  update(
    @Param('id') id: string, 
    @Body() updateProductDto: UpdateProductDto
  ): Promise<Product> {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(+id);
  }

  @Get('analytics/category-stats')
  @ApiOperation({ summary: 'Get product statistics by category' })
  @ApiResponse({
      status: 200,
      description: 'Product statistics grouped by category',
      schema: {
          type: 'array',
          items: {
              type: 'object',
              properties: {
                  category: { type: 'string' },
                  product_count: { type: 'number' },
                  total_value: { type: 'number' },
                  average_price: { type: 'number' }
              }
          }
      }
  })
  async getCategoryStats(): Promise<CategoryStats[]> {
      return this.productsService.getCategoryStats();
  }
}

