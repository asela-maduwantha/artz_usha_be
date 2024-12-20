import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

// Update DTO for Product Features
export class UpdateProductFeatureDto {
  @ApiPropertyOptional({ description: 'Feature ID' })
  @IsOptional()
  id?: number;

  @ApiPropertyOptional({ description: 'Feature tag' })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({ description: 'Feature description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Feature icon' })
  @IsOptional()
  @IsString()
  icon?: string;
}

// New DTO for Customization Options Update
export class UpdateCustomizationOptionDto {
  @ApiPropertyOptional({ description: 'Option ID' })
  @IsOptional()
  id?: number;

  @ApiPropertyOptional({ description: 'Option name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Option type (color, size, material, text)' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ description: 'Available values for the option' })
  @IsOptional()
  @IsArray()
  available_values?: string[];

  @ApiPropertyOptional({ description: 'Minimum value for numeric options' })
  @IsOptional()
  @IsNumber()
  min_value?: number;

  @ApiPropertyOptional({ description: 'Maximum value for numeric options' })
  @IsOptional()
  @IsNumber()
  max_value?: number;

  @ApiPropertyOptional({ description: 'Additional price for this option' })
  @IsOptional()
  @IsNumber()
  additional_price?: number;

  @ApiPropertyOptional({ description: 'Whether this option is required' })
  @IsOptional()
  @IsBoolean()
  is_required?: boolean;
}

// Main Update Product DTO
export class UpdateProductDto {
  @ApiPropertyOptional({ description: 'Product name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Product description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Product price' })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ description: 'Product Image URL' })
  @IsOptional()
  @IsString()
  img_url?: string;

  @ApiPropertyOptional({ description: 'Product category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Is product customizable' })
  @IsOptional()
  @IsBoolean()
  is_customizable?: boolean;

  @ApiPropertyOptional({ description: 'Is product active' })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({ 
    description: 'Product features', 
    type: [UpdateProductFeatureDto] 
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductFeatureDto)
  features?: UpdateProductFeatureDto[];

  @ApiPropertyOptional({ 
    description: 'Product customization options', 
    type: [UpdateCustomizationOptionDto] 
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateCustomizationOptionDto)
  customization_options?: UpdateCustomizationOptionDto[];
}