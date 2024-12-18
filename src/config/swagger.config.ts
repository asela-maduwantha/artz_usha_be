import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('ArtzByUsha E-Commerce API')
    .setDescription('Comprehensive API documentation for Handcrafts E-Commerce Platform')
    .setVersion('1.0')
    .addTag('Auth', 'Authentication and User Management')
    .addTag('Products', 'Product Catalog and Management')
    .addTag('Orders', 'Order Processing and Tracking')
    .addTag('Discounts', 'Discount and Promotion Management')
    .addTag('Users', 'User Profile and Preferences')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT Token',
        in: 'header',
      },
      'JWT-auth' // This name is used to apply the authentication to specific endpoints
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Setup Swagger UI
  SwaggerModule.setup('api', app, document, {
    explorer: true,
    swaggerOptions: {
      filter: true,
      displayRequestDuration: true,
      defaultModelsExpandDepth: -1, // Hide schemas by default
      syntaxHighlight: {
        activate: true,
        theme: 'monokai'
      }
    }
  });
};