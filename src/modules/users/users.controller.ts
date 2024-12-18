// src/users/users.controller.ts
import { 
    Controller, 
    Get, 
    Param, 
    Delete, 
    UseGuards, 
    Req 
  } from '@nestjs/common';
  import { 
    ApiTags, 
    ApiOperation, 
    ApiResponse, 
    ApiBearerAuth 
  } from '@nestjs/swagger';
  import { UsersService } from './users.service';
  import { AuthGuard } from '@nestjs/passport';
  import { Roles } from '../../common/decorators/roles.decorator';
  import { Role } from './enums/user-role.enum';
  
  @ApiTags('Users')
  @Controller('users')
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user profile' })
    @ApiResponse({ status: 200, description: 'User profile retrieved' })
    async getProfile(@Req() req) {
      return this.usersService.findById(req.user.id);
    }
  
    @Get()
    @UseGuards(AuthGuard('jwt'))
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all users (Admin only)' })
    @ApiResponse({ status: 200, description: 'List of users' })
    async getAllUsers() {
      return this.usersService.getAllUsers();
    }
  
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete user (Admin only)' })
    @ApiResponse({ status: 200, description: 'User deleted' })
    async deleteUser(@Param('id') id: number) {
      return this.usersService.deleteUser(id);
    }
  }