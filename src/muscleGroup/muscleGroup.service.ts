import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MuscleGroup, MuscleGroupDocument } from './muscleGroup.schema';
import { Model } from 'mongoose';
import { CreateMuscleGroupDto } from './dto/creation-muscleGroup.dto';
import { MuscleGroupResponseDto } from './dto/response-muscleGroup.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MuscleGroupService {
  constructor(
    @InjectModel(MuscleGroup.name)
    private readonly muscleGroupModel: Model<MuscleGroupDocument>,
  ) {}

  async create(
    createDto: CreateMuscleGroupDto,
  ): Promise<MuscleGroupResponseDto> {
    const created = new this.muscleGroupModel(createDto);
    const saved = await created.save();
    return plainToInstance(MuscleGroupResponseDto, saved.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async findAll(): Promise<MuscleGroupResponseDto[]> {
    const list = await this.muscleGroupModel.find().exec();
    return list.map((item) =>
      plainToInstance(MuscleGroupResponseDto, item.toObject(), {
        excludeExtraneousValues: true,
      }),
    );
  }

  async findOne(id: string): Promise<MuscleGroupResponseDto> {
    const found = await this.muscleGroupModel.findById(id).exec();
    if (!found) {
      throw new NotFoundException('Nhóm cơ không tồn tại');
    }
    return plainToInstance(MuscleGroupResponseDto, found.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    updateDto: CreateMuscleGroupDto,
  ): Promise<MuscleGroupResponseDto> {
    const updated = await this.muscleGroupModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException('Không tìm thấy nhóm cơ để cập nhật');
    }
    return plainToInstance(MuscleGroupResponseDto, updated.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string): Promise<string> {
    await this.muscleGroupModel.findByIdAndDelete(id).exec();
    return 'Xoá nhóm cơ thành công';
  }
}