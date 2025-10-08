import { Expose, Transform } from 'class-transformer';

export class MuscleGroupResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  _id: string;

  @Expose()
  name: string; // Ví dụ: "CHEST"

  @Expose()
  displayName: string; // Ví dụ: "Ngực"

  @Expose()
  imageURL?: string;

  @Expose()
  description: string; // Ví dụ: "Các bài tập cho nhóm cơ ngực"
}