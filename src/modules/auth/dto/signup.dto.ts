import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsString, IsOptional } from 'class-validator';

export class SignupDto {
    @ApiProperty()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    address?: string;
}
