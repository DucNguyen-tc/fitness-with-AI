import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Workout, WorkoutDocument } from './workout.schema';
import { MuscleGroup, MuscleGroupDocument } from 'src/muscleGroup/muscleGroup.schema';
import { Model } from 'mongoose';
import { CreateWorkoutDto } from './dto/creation-workout.dto';
import { WorkoutResponseDto } from './dto/response-workout.dto';
import { plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';

@Injectable()
export class WorkoutService {
  constructor(
    @InjectModel(Workout.name)
    private readonly workoutModel: Model<WorkoutDocument>,

    @InjectModel(MuscleGroup.name)
    private readonly muscleGroupModel: Model<MuscleGroupDocument>,
  ) {}

  async create(createDto: CreateWorkoutDto): Promise<WorkoutResponseDto> {
  const muscleGroupIds = createDto.muscleGroups;

  const existingGroups = await this.muscleGroupModel.find({
    _id: { $in: muscleGroupIds },
  }).select('_id');

  const existingIds = existingGroups.map(group => group._id.toString());
  const missingIds = muscleGroupIds.filter(id => !existingIds.includes(id.toString()));

  if (missingIds.length > 0) {
    throw new NotFoundException(`Các muscleGroup sau không tồn tại: ${missingIds.join(', ')}`);
  }

  const workoutData = {
    ...createDto,
    muscleGroups: muscleGroupIds.map(id => new Types.ObjectId(id)),
  };

  const createdWorkout = new this.workoutModel(workoutData);
  const savedWorkout = await createdWorkout.save();
const populatedWorkout = await this.workoutModel
  .findById(savedWorkout._id)
  .populate('muscleGroups', 'name')
  .exec();

return plainToInstance(WorkoutResponseDto, populatedWorkout?.toObject(), {
  excludeExtraneousValues: true,
});
}

  async findAll(): Promise<WorkoutResponseDto[]> {
    const workouts = await this.workoutModel.find()
    .populate('muscleGroups', 'name')
    .exec();
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

  // Tìm kiếm bài tập theo nhóm cơ
  async findByMuscleGroup(query: string): Promise<WorkoutResponseDto[]> {
  let muscleGroup: MuscleGroupDocument | null = null;

    muscleGroup = await this.muscleGroupModel.findOne({ name: query }).exec();

  if (!muscleGroup) {
    throw new NotFoundException(`Không tìm thấy nhóm cơ với giá trị: ${query}`);
  }

  const workouts = await this.workoutModel
    .find({ muscleGroups: muscleGroup._id })
    .populate('muscleGroups', 'name')
    .exec();

  return workouts.map((workout) =>
    plainToInstance(WorkoutResponseDto, workout.toObject(), {
      excludeExtraneousValues: true,
    }),
  );
}
}

