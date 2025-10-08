import { Expose, Transform, Type } from 'class-transformer';
import { DifficultyRating } from 'src/common/enums/difficulty-rating.enum';
import { AiAction } from 'src/common/enums/ai-action.enum';
import { BodyFatPercentage } from 'src/common/enums/bodyFat-Percentage.enum';

export class WeeklyMetricsResponseDto {
  @Expose()
  currentWeight: number;

  @Expose()
  bodyFatPercentage: BodyFatPercentage;
}

export class ProcessResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  _id: string;

  @Expose()
  @Transform(({ obj }) => obj.userId.toString())
  userId: string;

  @Expose()
  @Transform(({ obj }) => obj.planId.toString())
  planId: string;

  @Expose()
  @Type(() => WeeklyMetricsResponseDto)
  weeklyMetrics: WeeklyMetricsResponseDto;

  @Expose()
  difficultRating: DifficultyRating;

  @Expose()
  aiAction: AiAction;

  @Expose()
  updatedAt: Date;
}