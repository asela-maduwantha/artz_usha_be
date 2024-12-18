// src/auth/auth.controller.ts
import { 
    Controller, 
    Post, 
    Body, 
    UseGuards, 
    Request 
  } from '@nestjs/common';
  import { 
    ApiTags, 
    ApiOperation, 
    ApiResponse 
  } from '@nestjs/swagger';
  import { AuthService } from './auth.service';
  import { SignupDto } from './dto/signup.dto';
  import { SigninDto } from './dto/signin.dto';
  
  @ApiTags('Authentication')
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @Post('signup')
    @ApiOperation({ summary: 'User Signup' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async signup(@Body() signupDto: SignupDto) {
      return this.authService.signup(signupDto);
    }
  
    @Post('signin')
    @ApiOperation({ summary: 'User Signin' })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async signin(@Body() signinDto: SigninDto) {
      return this.authService.signin(
        signinDto.email, 
        signinDto.password
      );
    }
  }