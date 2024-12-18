import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Discounts } from './entity/discounts.entity';
import { CreateDiscountDto } from './dto/create-discount.dto';

@Injectable()
export class DiscountsService {
  constructor(
    @InjectRepository(Discounts)
    private discountsRepository: Repository<Discounts>,
  ) {}

  async create(createDiscountDto: CreateDiscountDto): Promise<Discounts> {
    const discount = this.discountsRepository.create({
      ...createDiscountDto,
      current_usage: 0
    });
    return this.discountsRepository.save(discount);
  }

  async findAll(): Promise<Discounts[]> {
    return this.discountsRepository.find();
  }

  async findById(id: number): Promise<Discounts> {
    const discount = await this.discountsRepository.findOne({ where: { id } });
    if (!discount) {
      throw new NotFoundException(`Discount with ID ${id} not found`);
    }
    return discount;
  }

  async remove(id: number): Promise<void> {
    const result = await this.discountsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Discount with ID ${id} not found`);
    }
  }

  async findExpired(): Promise<Discounts[]> {
    const currentDate = new Date();
    return this.discountsRepository.find({
      where: {
        end_date: LessThan(currentDate)
      }
    });
  }

  async findActive(): Promise<Discounts[]> {
    const currentDate = new Date();
    return this.discountsRepository.find({
      where: {
        start_date: LessThan(currentDate),
        end_date: MoreThan(currentDate)
      }
    });
  }
}