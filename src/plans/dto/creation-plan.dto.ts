import {
  IsNotEmpty,
  IsMongoId,
  IsNumber,
  Min,
  IsDateString,
  IsEnum,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Status } from 'src/common/enums/status.enum';
import { DifficultyRating } from 'src/common/enums/difficulty-rating.enum';
import { AiAction } from 'src/common/enums/ai-action.enum';

export class ExerciseDto {
  @IsNotEmpty()
  @IsMongoId({ message: 'workoutId phải là ObjectId hợp lệ' })
  workoutId: string;

  @IsNumber()
  @Min(1, { message: 'Thứ tự bài tập phải ≥ 1' })
  order: number;

  @IsNumber()
  @Min(0, { message: 'Thời gian nghỉ phải ≥ 0 giây' })
  restTime: number;

  @IsNumber()
  @Min(0, { message: 'Thời gian nghỉ phải ≥ 0 giây' })
  workTime: number;
}

export class SessionDto {
  @IsNumber()
  @Min(1, { message: 'Số buổi tập phải ≥ 1' })
  sessionNumber: number;

  @IsDateString({}, { message: 'Ngày mục tiêu phải là định dạng ISO' })
  targetDate: string;

  @IsNumber()
  @Min(1, { message: 'Thời lượng ước tính phải ≥ 1 phút' })
  estimatedDuration: number;

  @IsNumber()
  @Min(0, { message: 'Lượng calo tiêu thụ phải ≥ 0' })
  caloriesBurned: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'Phải có ít nhất một bài tập trong buổi' })
  @ValidateNested({ each: true })
  @Type(() => ExerciseDto)
  exercises: ExerciseDto[];

  @IsEnum(Status, {
    message: 'Trạng thái buổi tập phải là COMPLETE, PENDING hoặc SKIPPED',
  })
  status: Status;
}

export class ProgressMetricsDto {
  @IsOptional()
  @IsNumber()
  endOfWeekWeight?: number;

  @IsOptional()
  @IsString()
  endOfWeekBodyFat?: string;
}

export class ProgressDto {
  @IsEnum(DifficultyRating, {
    message: 'Đánh giá độ khó phải là EASY, MEDIUM hoặc HARD',
  })
  difficultRating: DifficultyRating;

  @ValidateNested()
  @Type(() => ProgressMetricsDto)
  metrics: ProgressMetricsDto;

  @IsDateString({}, { message: 'Ngày gửi feedback phải là định dạng ISO' })
  submittedAt: string;
}

export class AIDecisionDto {
  @IsEnum(AiAction, {
    message: 'Hành động AI phải là INCREASE, DECREASE hoặc MAINTAIN_DIFFICULTY',
  })
  actionTaken: AiAction;

  @IsMongoId({ message: 'nextWeekPlanId phải là ObjectId hợp lệ' })
  nextWeekPlanId: string;
}

export class CreatePlanDto {
  @IsNotEmpty()
  @IsMongoId({ message: 'userId phải là ObjectId hợp lệ' })
  userId: string;

  @IsNumber()
  @Min(1, { message: 'Tuần hiện tại phải ≥ 1' })
  currentWeek: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'Phải có ít nhất một buổi tập' })
  @ValidateNested({ each: true })
  @Type(() => SessionDto)
  sessions: SessionDto[];

  @IsEnum(Status, {
    message: 'Trạng thái kế hoạch phải là ACTIVE, COMPLETED hoặc CANCELLED',
  })
  status: Status;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProgressDto)
  progress?: ProgressDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AIDecisionDto)
  aiDecision?: AIDecisionDto;
}