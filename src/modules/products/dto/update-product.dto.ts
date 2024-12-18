import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

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
}