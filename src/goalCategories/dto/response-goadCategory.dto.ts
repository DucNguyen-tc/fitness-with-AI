import { Expose, Transform } from 'class-transformer';

export class ResponseGoalCategoryDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  id: string;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  description: boolean;

  @Expose()
  isActive: boolean;
}
