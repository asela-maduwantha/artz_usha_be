import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const validationOptions = {
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  exceptionFactory: (errors: ValidationError[]) => {
    const formattedErrors = errors.map(error => ({
      property: error.property,
      constraints: error.constraints ? Object.values(error.constraints) : []
    }));

    throw new BadRequestException({
      message: 'Validation Failed',
      errors: formattedErrors
    });
  }
};

export const createValidationPipe = () => new ValidationPipe(validationOptions);