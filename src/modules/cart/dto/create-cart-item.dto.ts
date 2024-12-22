import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CustomizationData, CustomizationValue } from '../interfaces/customization.interface';

class CustomizationValueDto implements CustomizationValue {
  @ApiProperty({ description: 'Unique identifier for the customization option' })
  id: string;

  @ApiProperty({ description: 'Selected value for the customization option' })
  value: any;
}

export class CreateCartItemDto {
  @ApiProperty({ description: 'Product ID' })
  @IsNumber()
  productId: number;

  @ApiProperty({ description: 'Quantity of the product', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Customization options for the product',
    example: {
      size: { id: '123', value: 'large' },
      color: { id: '456', value: 'red' }
    }
  })
  @IsObject()
  @ValidateNested()
  @Type(() => CustomizationValueDto)
  customization_data: CustomizationData;
}
