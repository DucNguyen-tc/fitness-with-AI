import {
  IsNotEmpty,
  IsMongoId,
  IsNumber,
  Min,
  IsString,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DifficultyRating } from 'src/common/enums/difficulty-rating.enum';
import { AiAction } from 'src/common/enums/ai-action.enum';
import { BodyFatPercentage } from 'src/common/enums/bodyFat-Percentage.enum';

class WeeklyMetricsDto {
  @IsNumber()
  @Min(0, { message: 'Cân nặng hiện tại phải ≥ 0' })
  currentWeight: number;

  @IsEnum(BodyFatPercentage, {
    message: 'Tỉ lệ mỡ cơ thể trước phải nằm trong các khoảng hợp lệ',
  })
  bodyFatPercentage: BodyFatPercentage;
}

export class CreateProcessDto {
  @IsNotEmpty()
  @IsMongoId({ message: 'userId phải là ObjectId hợp lệ' })
  userId: string;

  @IsNotEmpty()
  @IsMongoId({ message: 'planId phải là ObjectId hợp lệ' })
  planId: string;

  @ValidateNested()
  @Type(() => WeeklyMetricsDto)
  weeklyMetrics: WeeklyMetricsDto;

  @IsEnum(DifficultyRating, {
    message: 'Độ khó phải là EASY, MEDIUM hoặc HARD',
  })
  difficultRating: DifficultyRating;

  @IsEnum(AiAction, {
    message:
      'Hành động AI phải là MAINTAIN_DIFFICULTY, INCREASE_DIFFICULTY hoặc DECREASE_DIFFICULTY',
  })
  aiAction: AiAction;
}