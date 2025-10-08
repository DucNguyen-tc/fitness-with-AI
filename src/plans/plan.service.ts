import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Plan, PlanDocument } from './plan.schema';
import { Model } from 'mongoose';
import { CreatePlanDto } from './dto/creation-plan.dto';
import { PlanResponseDto } from './dto/response-plan.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PlanService {
  constructor(
    @InjectModel(Plan.name)
    private readonly planModel: Model<PlanDocument>,
  ) {}

  async create(createDto: CreatePlanDto): Promise<PlanResponseDto> {
    const createdPlan = new this.planModel(createDto);
    const savedPlan = await createdPlan.save();
    return plainToInstance(PlanResponseDto, savedPlan.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async findAll(): Promise<PlanResponseDto[]> {
    const plans = await this.planModel.find().exec();
    return plans.map((plan) =>
      plainToInstance(PlanResponseDto, plan.toObject(), {
        excludeExtraneousValues: true,
      }),
    );
  }

  async findOne(id: string): Promise<PlanResponseDto> {
    const plan = await this.planModel.findById(id).exec();
    if (!plan) {
      throw new NotFoundException('Không tìm thấy lộ trình tập');
    }
    return plainToInstance(PlanResponseDto, plan.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, updateDto: CreatePlanDto): Promise<PlanResponseDto> {
    const updatedPlan = await this.planModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!updatedPlan) {
      throw new NotFoundException('Không tìm thấy lộ trình để cập nhật');
    }
    return plainToInstance(PlanResponseDto, updatedPlan.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string): Promise<string> {
    await this.planModel.findByIdAndDelete(id).exec();
    return 'Xoá lộ trình tập thành công';
  }
}