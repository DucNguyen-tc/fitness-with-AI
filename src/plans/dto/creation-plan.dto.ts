import {
  IsNotEmpty,
  IsEnum,
  IsNumber,
  Min,
  ValidateNested,
  IsDateString,
  IsArray,
  ArrayMinSize,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PlanStatus } from '../../common/enums/status-plan.enum';

class ExerciseDto {
  @IsNotEmpty()
  @IsMongoId({ message: 'workoutId phải là ObjectId hợp lệ' })
  workoutId: string;

  @IsNumber()
  @Min(1, { message: 'Thứ tự bài tập phải ≥ 1' })
  order: number;

  @IsNumber()
  @Min(0, { message: 'Thời gian nghỉ phải ≥ 0 giây' })
  restTime: number;
}

class SessionDto {
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

  @IsEnum(PlanStatus, {
    message: 'Trạng thái phải là INCOMPLETE hoặc COMPLETED',
  })
  status: PlanStatus;
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

  @IsEnum(PlanStatus, {
    message: 'Trạng thái phải là INCOMPLETE hoặc COMPLETED',
  })
  status: PlanStatus;
}
