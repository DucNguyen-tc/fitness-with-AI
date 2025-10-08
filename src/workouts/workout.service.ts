import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Workout, WorkoutDocument } from './workout.schema';
import { Model } from 'mongoose';
import { CreateWorkoutDto } from './dto/creation-workout.dto';
import { WorkoutResponseDto } from './dto/response-workout.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class WorkoutService {
  constructor(
    @InjectModel(Workout.name)
    private readonly workoutModel: Model<WorkoutDocument>,
  ) {}

  async create(createDto: CreateWorkoutDto): Promise<WorkoutResponseDto> {
    const createdWorkout = new this.workoutModel(createDto);
    const savedWorkout = await createdWorkout.save();
    return plainToInstance(WorkoutResponseDto, savedWorkout.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async findAll(): Promise<WorkoutResponseDto[]> {
    const workouts = await this.workoutModel.find().exec();
    return workouts.map((workout) =>
      plainToInstance(WorkoutResponseDto, workout.toObject(), {
        excludeExtraneousValues: true,
      }),
    );
  }

  async findOne(id: string): Promise<WorkoutResponseDto> {
    const workout = await this.workoutModel.findById(id).exec();
    if (!workout) {
      throw new NotFoundException('Bài tập không tồn tại');
    }
    return plainToInstance(WorkoutResponseDto, workout.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    updateDto: CreateWorkoutDto,
  ): Promise<WorkoutResponseDto> {
    const updatedWorkout = await this.workoutModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!updatedWorkout) {
      throw new NotFoundException('Không tìm thấy bài tập để cập nhật');
    }
    return plainToInstance(WorkoutResponseDto, updatedWorkout.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string): Promise<string> {
    await this.workoutModel.findByIdAndDelete(id).exec();
    return 'Xoá bài tập thành công';
  }
}