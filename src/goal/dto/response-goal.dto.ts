import { Gender } from 'src/common/enums/gender.enum';
import { Expose, Transform } from 'class-transformer';

class TargetMetricsResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  _id: string;

  @Expose()
  weightChange?: number;

  @Expose()
  timeframe?: number;

  @Expose()
  bodyFatPercentage?: number;
}

export class GoalResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  _id: string;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  gender: Gender;

  @Expose()
  goalCategoryId: string;

  @Expose()
  targetMetrics?: TargetMetricsResponseDto;

  @Expose()
  isActive: boolean;
}
