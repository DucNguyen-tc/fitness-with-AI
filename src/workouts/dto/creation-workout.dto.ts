import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsArray,
  ArrayMinSize,
  IsUrl,
  IsNumber,
  Min,
} from 'class-validator';
import { DifficultyLevel } from '../../common/enums/difficulty-level.enum';
import { WorkoutTime } from '../../common/enums/workout-time.enum';

export class CreateWorkoutDto {
  @IsNotEmpty({ message: 'Tên bài tập không được để trống' })
  @IsString()
  name: string;

  @IsArray({ message: 'muscleGroups phải là một mảng ObjectId' })
  @ArrayMinSize(1, { message: 'Phải có ít nhất một nhóm cơ' })
  @IsString({ each: true })
  muscleGroups: string[];

  @IsNotEmpty({ message: 'Độ khó không được để trống' })
  @IsEnum(DifficultyLevel, {
    message: 'Độ khó phải là BEGINNER, INTERMEDIATE hoặc ADVANCED',
  })
  difficulty: DifficultyLevel;

  @IsNotEmpty({ message: 'Thời gian không được để trống' })
  @IsEnum(WorkoutTime, {
    message: 'Thời gian phải là 30, 60 hoặc 90 giây',
  })
  time: WorkoutTime;

  @IsArray({ message: 'instructions phải là một mảng chuỗi' })
  @ArrayMinSize(1, { message: 'Phải có ít nhất một bước hướng dẫn' })
  @IsString({ each: true })
  instructions: string[];

  @IsUrl({}, { message: 'imageURL phải là một đường dẫn hợp lệ', each: false })
  imageURL: string;

  @IsUrl({}, { message: 'mediaURL phải là một đường dẫn hợp lệ', each: false })
  mediaURL: string;

  @IsNumber({}, { message: 'caloriesBurnedPerMinute phải là số' })
  @Min(0, { message: 'caloriesBurnedPerMinute phải lớn hơn hoặc bằng 0' })
  caloriesBurnedPerMinute: number;
}