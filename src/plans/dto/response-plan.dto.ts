import { Expose, Transform, Type } from 'class-transformer';
import { PlanStatus } from '../../common/enums/status-plan.enum';

export class ExerciseResponseDto {
  @Expose()
  @Transform(({ obj }) => obj.workoutId.toString())
  workoutId: string;

  @Expose()
  order: number;

  @Expose()
  restTime: number;
}

export class SessionResponseDto {
  @Expose()
  sessionNumber: number;

  @Expose()
  targetDate: Date;

  @Expose()
  estimatedDuration: number;

  @Expose()
  caloriesBurned: number;

  @Expose()
  @Type(() => ExerciseResponseDto)
  exercises: ExerciseResponseDto[];

  @Expose()
  status: PlanStatus;
}

export class PlanResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  _id: string;

  @Expose()
  @Transform(({ obj }) => obj.userId.toString())
  userId: string;

  @Expose()
  currentWeek: number;

  @Expose()
  @Type(() => SessionResponseDto)
  sessions: SessionResponseDto[];

  @Expose()
  status: PlanStatus;

  @Expose()
  createdAt: Date;
}