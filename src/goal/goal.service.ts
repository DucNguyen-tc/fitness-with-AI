import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Goal, GoalDocument } from './goal.schema';
import { Model } from 'mongoose';
import { CreateGoalDto } from './dto/creation-goal.dto';
import { GoalResponseDto } from './dto/response-goal.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GoalService {
  constructor(@InjectModel(Goal.name) private goal: Model<GoalDocument>) {}

  async create(createGoalDto: CreateGoalDto): Promise<GoalResponseDto> {
    const createdGoal = new this.goal({
      ...createGoalDto,
      isActive: true, // Mặc định khi tạo mới sẽ là active
    });
    const saved = await createdGoal.save();
    return plainToInstance(GoalResponseDto, saved.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async findAll(): Promise<GoalResponseDto[]> {
    const goals = await this.goal.find().exec();
    return goals.map((goal) =>
      plainToInstance(GoalResponseDto, goal.toObject(), {
        excludeExtraneousValues: true,
      }),
    );
  }

  async findOne(id: string): Promise<GoalResponseDto> {
    const goal = await this.goal.findById(id).exec();
    if (!goal) {
      throw new NotFoundException('Mục tiêu không tồn tại');
    }
    return plainToInstance(GoalResponseDto, goal.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string): Promise<String> {
    await this.goal.findByIdAndDelete(id).exec();
    return 'Xoá mục tiêu thành công';
  }

  async update(
    id: string,
    updateGoalDto: CreateGoalDto,
  ): Promise<GoalResponseDto> {
    const updatedGoal = await this.goal
      .findByIdAndUpdate(id, updateGoalDto, { new: true })
      .exec();
    if (!updatedGoal) {
      throw new NotFoundException('Mục tiêu không tồn tại');
    }
    return plainToInstance(GoalResponseDto, updatedGoal.toObject(), {
      excludeExtraneousValues: true,
    });
  }
}
