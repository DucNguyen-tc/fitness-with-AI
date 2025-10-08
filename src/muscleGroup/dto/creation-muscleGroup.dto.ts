import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateMuscleGroupDto {
  @IsNotEmpty({ message: 'Tên nhóm cơ không được để trống' })
  @IsString()
  name: string; // Ví dụ: "CHEST"

  @IsNotEmpty({ message: 'Tên hiển thị không được để trống' })
  @IsString()
  displayName: string; // Ví dụ: "Ngực"

  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  @IsString()
  description: string; // Ví dụ: "Các bài tập cho nhóm cơ ngực"

  @IsUrl({}, { message: 'imageURL phải là một đường dẫn hợp lệ', each: false })
  imageURL: string;
}