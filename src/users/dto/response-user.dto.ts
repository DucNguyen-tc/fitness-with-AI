import { Expose, Transform, Type } from 'class-transformer';
import { Gender } from 'src/common/enums/gender.enum';
import { ActivityLevel } from 'src/common/enums/activity-level.enum';
import { FitnessLevel } from 'src/common/enums/fitness-level.enum';
import { TimeFrame } from 'src/common/enums/time-frame.enum';
import { BodyFatPercentage } from 'src/common/enums/bodyFat-Percentage.enum';

class ProfileResponseDto {
  @Expose()
  gender: Gender;

  @Expose()
  age: number;

  @Expose()
  height: number;

  @Expose()
  weight: number;

  @Expose()
  bmi: number;

  @Expose()
  bodyFatPercentageBefore: BodyFatPercentage;

  @Expose()
  activityLevel: ActivityLevel;

  @Expose()
  fitnessLevel: FitnessLevel;
}

class GoalsResponseDto {
  @Expose()
  bodyFatPercentageAfter: BodyFatPercentage;

  @Expose()
  weightGoal: number;

  @Expose()
  timeFrame: TimeFrame;
}

export class UserResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  _id: string;

  @Expose()
  @Transform(({ obj }) => obj.accountId.toString())
  accountId: string;

  @Expose()
  @Type(() => ProfileResponseDto)
  profile: ProfileResponseDto;

  @Expose()
  @Type(() => GoalsResponseDto)
  goals: GoalsResponseDto;
}