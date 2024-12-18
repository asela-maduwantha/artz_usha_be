import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductFeatureDto {
  @ApiProperty({ description: 'Feature tag' })
  @IsString()
  tag: string;

  @ApiProperty({ description: 'Feature description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Feature icon' })
  @IsString()
  icon: string;
}

export class CreateProductDto {
  @ApiProperty({ description: 'Product name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Product description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Product price' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Product Image' })
  @IsString()
  img_url: string;

  @ApiProperty({ description: 'Product category' })
  @IsString()
  category: string;

  @ApiProperty({ description: 'Is product customizable', default: false })
  @IsBoolean()
  is_customizable: boolean;

  @ApiProperty({ description: 'Is product active', default: true })
  @IsBoolean()
  is_active: boolean;

  @ApiProperty({ 
    description: 'Product features', 
    type: [CreateProductFeatureDto],
    required: false 
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProductFeatureDto)
  features?: CreateProductFeatureDto[];
}