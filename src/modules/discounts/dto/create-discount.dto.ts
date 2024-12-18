import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDiscountDto {
  @ApiProperty({ description: 'Name of the discount' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Discount value' })
  @IsNumber()
  @Min(0)
  value: number;

  @ApiProperty({ description: 'Start date of the discount', type: Date })
  @IsDate()
  @Type(() => Date)
  start_date: Date;

  @ApiProperty({ description: 'End date of the discount', type: Date })
  @IsDate()
  @Type(() => Date)
  end_date: Date;

  @ApiProperty({ description: 'Discount description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Discount code' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Maximum usage limit for the discount' })
  @IsNumber()
  @Min(0)
  usage_limit: number;
}