import { Expose, Transform, Type } from 'class-transformer';
import { DifficultyLevel } from '../../common/enums/difficulty-level.enum';
import { WorkoutTime } from '../../common/enums/workout-time.enum';

export class WorkoutResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  _id: string;

  @Expose()
  name: string;

  @Expose()
  @Transform(({ obj }) => obj.muscleGroups.map((id: any) => id.toString()))
  muscleGroups: string[];

  @Expose()
  difficulty: DifficultyLevel;

  @Expose()
  time: WorkoutTime;

  @Expose()
  instructions: string[];

  @Expose()
  imageURL?: string;

  @Expose()
  mediaURL?: string;

  @Expose()
  caloriesBurnedPerMinute: number;
}