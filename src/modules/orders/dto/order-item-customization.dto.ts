import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class OrderItemCustomizationDto {
  @ApiProperty({
    description: 'ID of the customization option',
    example: 456
  })
  @IsNumber()
  customization_option_id: number;

  @ApiProperty({
    description: 'Selected value for the customization',
    example: 'Blue'
  })
  @IsString()
  selected_value: string;
}
