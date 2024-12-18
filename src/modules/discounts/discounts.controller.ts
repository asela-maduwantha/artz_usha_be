import { 
    Controller, 
    Get, 
    Post, 
    Delete, 
    Body, 
    Param, 
    ParseIntPipe 
  } from '@nestjs/common';
  import { 
    ApiTags, 
    ApiOperation, 
    ApiResponse, 
    ApiParam 
  } from '@nestjs/swagger';
  import { DiscountsService } from './discounts.service';
  import { Discounts } from './entity/discounts.entity';
  import { CreateDiscountDto } from './dto/create-discount.dto';
  
  @ApiTags('Discounts')
  @Controller('discounts')
  export class DiscountsController {
    constructor(private readonly discountsService: DiscountsService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new discount' })
    @ApiResponse({ 
      status: 201, 
      description: 'The discount has been successfully created',
      type: Discounts 
    })
    async create(@Body() createDiscountDto: CreateDiscountDto): Promise<Discounts> {
      return this.discountsService.create(createDiscountDto);
    }
  
    @Get()
    @ApiOperation({ summary: 'Retrieve all discounts' })
    @ApiResponse({ 
      status: 200, 
      description: 'List of all discounts',
      type: [Discounts] 
    })
    async findAll(): Promise<Discounts[]> {
      return this.discountsService.findAll();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a specific discount by ID' })
    @ApiParam({ name: 'id', type: 'number', description: 'Discount ID' })
    @ApiResponse({ 
      status: 200, 
      description: 'The found discount',
      type: Discounts 
    })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Discounts> {
      return this.discountsService.findById(id);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a specific discount' })
    @ApiParam({ name: 'id', type: 'number', description: 'Discount ID' })
    @ApiResponse({ 
      status: 200, 
      description: 'The discount has been successfully deleted' 
    })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
      return this.discountsService.remove(id);
    }
  
    @Get('expired')
    @ApiOperation({ summary: 'Retrieve expired discounts' })
    @ApiResponse({ 
      status: 200, 
      description: 'List of expired discounts',
      type: [Discounts] 
    })
    async findExpired(): Promise<Discounts[]> {
      return this.discountsService.findExpired();
    }
  
    @Get('active')
    @ApiOperation({ summary: 'Retrieve active discounts' })
    @ApiResponse({ 
      status: 200, 
      description: 'List of active discounts',
      type: [Discounts] 
    })
    async findActive(): Promise<Discounts[]> {
      return this.discountsService.findActive();
    }
  }