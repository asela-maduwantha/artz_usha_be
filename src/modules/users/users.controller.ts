import {
  Controller,
  Get,
  Param,
  Delete,
  Body,
  Post,
  BadRequestException,
  ParseIntPipe
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from './enums/user-role.enum';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile/:userId')  // Added :userId parameter to route
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  @ApiResponse({ status: 400, description: 'Invalid user ID' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'userId', type: 'number', description: 'User ID' })
  async getProfile(@Param('userId', new ParseIntPipe({ 
    errorHttpStatusCode: 400,
    exceptionFactory: (error) => {
      throw new BadRequestException('User ID must be a valid number');
    }
  })) userId: number) {
    return this.usersService.findById(userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of users' })
  async getAllUsers() {
      return this.usersService.getAllUsers();
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  async deleteUser(@Param('id') id: number) {
      return this.usersService.deleteUser(id);
  }
}