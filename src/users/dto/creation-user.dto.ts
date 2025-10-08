import {
  IsNotEmpty,
  IsEnum,
  IsNumber,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Gender } from 'src/common/enums/gender.enum';
import { ActivityLevel } from 'src/common/enums/activity-level.enum';
import { FitnessLevel } from 'src/common/enums/fitness-level.enum';
import { TimeFrame } from 'src/common/enums/time-frame.enum';
import { BodyFatPercentage } from 'src/common/enums/bodyFat-Percentage.enum';

export class ProfileDto {
  @IsNotEmpty({ message: 'Giới tính không được để trống' })
  @IsEnum(Gender, { message: 'Giới tính phải là "Nam" hoặc "Nữ"' })
  gender: Gender;

  @IsNumber()
  @Min(11, { message: 'Tuổi phải lớn hơn 10' })
  @Max(90, { message: 'Tuổi phải nhỏ hơn hoặc bằng 90' })
  age: number;

  @IsNumber()
  @Min(100, { message: 'Chiều cao phải lớn hơn 100' })
  @Max(250, { message: 'Chiều cao phải nhỏ hơn hoặc bằng 250' })
  height: number;

  @IsNumber()
  @Min(21, { message: 'Cân nặng phải lớn hơn 20' })
  @Max(150, { message: 'Cân nặng phải nhỏ hơn hoặc bằng 150' })
  weight: number;

  @IsNumber()
  @Min(1, { message: 'BMI phải lớn hơn 0' })
  bmi: number;

  @IsEnum(BodyFatPercentage, {
    message: 'Tỉ lệ mỡ cơ thể trước phải nằm trong các khoảng hợp lệ',
  })
  bodyFatPercentageBefore: BodyFatPercentage;

  @IsEnum(ActivityLevel, {
    message: 'Mức độ hoạt động không hợp lệ',
  })
  activityLevel: ActivityLevel;

  @IsEnum(FitnessLevel, {
    message: 'Trình độ thể chất không hợp lệ',
  })
  fitnessLevel: FitnessLevel;
}

export class GoalsDto {
  @IsEnum(BodyFatPercentage, {
    message: 'Tỉ lệ mỡ cơ thể sau phải nằm trong các khoảng hợp lệ',
  })
  bodyFatPercentageAfter: BodyFatPercentage;

  @IsNumber()
  @Min(1, { message: 'Cân nặng mục tiêu phải lớn hơn 0' })
  weightGoal: number;

  @IsEnum(TimeFrame, {
    message: 'Thời gian phải là 8, 10 hoặc 12 tuần',
  })
  timeFrame: TimeFrame;
}

export class CreateUserDto {
  @IsNotEmpty({ message: 'accountId không được để trống' })
  accountId: string;

  @ValidateNested()
  @Type(() => ProfileDto)
  profile: ProfileDto;

  @ValidateNested()
  @Type(() => GoalsDto)
  goals: GoalsDto;
}