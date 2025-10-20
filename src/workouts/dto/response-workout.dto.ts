import { Expose, Transform, Type } from 'class-transformer';
import { DifficultyLevel } from '../../common/enums/difficulty-level.enum';

export class WorkoutResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  _id: string;

  @Expose()
  name: string;

  @Expose()
@Transform(({ obj }) => obj.muscleGroups.map((group: any) => group.name))
muscleGroups: string[];

  @Expose()
  difficulty: DifficultyLevel;

  @Expose()
  instructions: string[];

  @Expose()
  imageURL?: string;

  @Expose()
  mediaURL?: string;

  @Expose()
  caloriesBurnedPerMinute: number;
}