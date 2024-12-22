import { 
    Controller, 
    Get, 
    Post, 
    Delete, 
    Body, 
    Param, 
    ParseIntPipe,
    Patch 
  } from '@nestjs/common';
  import { 
    ApiTags, 
    ApiOperation, 
    ApiResponse, 
    ApiParam 
  } from '@nestjs/swagger';
  import { OrdersService } from './orders.service';
  import { Orders } from './entity/orders.entity';
  import { CreateOrderDto } from './dto/create-order.dto';
  import { OrderStatus } from './enums/order-status.enum';
  
  @ApiTags('Orders')
  @Controller('orders')
  export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new order with customizations' })
    @ApiResponse({
        status: 201,
        description: 'The order has been successfully created with customizations',
        type: Orders
    })
    async create(@Body() createOrderDto: CreateOrderDto): Promise<Orders> {
        return this.ordersService.create(createOrderDto);
    }
  
    @Get()
    @ApiOperation({ summary: 'Retrieve all orders' })
    @ApiResponse({ 
      status: 200, 
      description: 'List of all orders',
      type: [Orders] 
    })
    async findAll(): Promise<Orders[]> {
      return this.ordersService.findAll();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a specific order by ID' })
    @ApiParam({ name: 'id', type: 'number', description: 'Order ID' })
    @ApiResponse({ 
      status: 200, 
      description: 'The found order',
      type: Orders 
    })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Orders> {
      return this.ordersService.findById(id);
    }
  
    @Get('user/:userId')
    @ApiOperation({ summary: 'Retrieve orders for a specific user' })
    @ApiParam({ name: 'userId', type: 'number', description: 'User ID' })
    @ApiResponse({ 
      status: 200, 
      description: 'List of orders for the specified user',
      type: [Orders] 
    })
    async findByUser(@Param('userId', ParseIntPipe) userId: number): Promise<Orders[]> {
      return this.ordersService.findByUser(userId);
    }
  
    @Get('status/:status')
    @ApiOperation({ summary: 'Retrieve orders by status' })
    @ApiParam({ 
      name: 'status', 
      enum: OrderStatus, 
      description: 'Order status' 
    })
    @ApiResponse({ 
      status: 200, 
      description: 'List of orders with the specified status',
      type: [Orders] 
    })
    async findByStatus(@Param('status') status: OrderStatus): Promise<Orders[]> {
      return this.ordersService.findByStatus(status);
    }
  
    @Patch(':id/status')
    @ApiOperation({ summary: 'Update order status' })
    @ApiParam({ name: 'id', type: 'number', description: 'Order ID' })
    @ApiResponse({ 
      status: 200, 
      description: 'The order status has been updated',
      type: Orders 
    })
    async updateStatus(
      @Param('id', ParseIntPipe) id: number,
      @Body('status') status: OrderStatus
    ): Promise<Orders> {
      return this.ordersService.updateStatus(id, status);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a specific order' })
    @ApiParam({ name: 'id', type: 'number', description: 'Order ID' })
    @ApiResponse({ 
      status: 200, 
      description: 'The order has been successfully deleted' 
    })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
      return this.ordersService.remove(id);
    }


    @Get('analytics/most-ordered')
    @ApiOperation({ summary: 'Get most ordered products analytics' })
    @ApiResponse({
        status: 200,
        description: 'List of most ordered products with analytics',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    product_id: { type: 'number' },
                    product_name: { type: 'string' },
                    total_orders: { type: 'number' },
                    total_quantity: { type: 'number' },
                    total_revenue: { type: 'number' }
                }
            }
        }
    })
    async getMostOrderedProducts() {
        return this.ordersService.getMostOrderedProducts();
    }
    
  }