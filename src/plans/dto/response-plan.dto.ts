import { Expose, Type } from 'class-transformer';
import { Types } from 'mongoose';

export class ExerciseResponseDto {
  @Expose()
  workoutId: Types.ObjectId;

  @Expose()
  order: number;

  @Expose()
  restTime: number;

  @Expose()
  workTime: number;
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
  status: string;
}

export class ProgressMetricsResponseDto {
  @Expose()
  endOfWeekWeight: number;

  @Expose()
  endOfWeekBodyFat: string;
}

export class ProgressResponseDto {
  @Expose()
  difficultRating: string;

  @Expose()
  @Type(() => ProgressMetricsResponseDto)
  metrics: ProgressMetricsResponseDto;

  @Expose()
  submittedAt: Date;
}

export class AIDecisionResponseDto {
  @Expose()
  actionTaken: string;

  @Expose()
  nextWeekPlanId: Types.ObjectId;
}

export class PlanResponseDto {
  @Expose()
  _id: Types.ObjectId;

  @Expose()
  userId: Types.ObjectId;

  @Expose()
  currentWeek: number;

  @Expose()
  status: string;

  @Expose()
  @Type(() => SessionResponseDto)
  sessions: SessionResponseDto[];

  @Expose()
  @Type(() => ProgressResponseDto)
  progress?: ProgressResponseDto;

  @Expose()
  @Type(() => AIDecisionResponseDto)
  aiDecision?: AIDecisionResponseDto;

  @Expose()
  createdAt?: Date;
}