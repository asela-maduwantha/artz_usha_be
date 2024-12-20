// src/modules/products/dto/customization-option.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateCustomizationOptionDto {
    @ApiProperty({ description: 'Option name' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Option type (color, size, material, text)' })
    @IsString()
    type: string;

    @ApiProperty({ description: 'Available values for the option', required: false })
    @IsOptional()
    @IsArray()
    available_values?: string[];

    @ApiProperty({ description: 'Minimum value for numeric options', required: false })
    @IsOptional()
    @IsNumber()
    min_value?: number;

    @ApiProperty({ description: 'Maximum value for numeric options', required: false })
    @IsOptional()
    @IsNumber()
    max_value?: number;

    @ApiProperty({ description: 'Additional price for this option' })
    @IsNumber()
    additional_price: number;

    @ApiProperty({ description: 'Whether this option is required' })
    @IsBoolean()
    is_required: boolean;
}