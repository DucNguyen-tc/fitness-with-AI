import { IsEmail, MinLength, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class UpdateAccountDto {
  @IsOptional()
  @IsEmail({}, { message: 'Email không đúng định dạng'})
  email: string;
  @IsOptional()
  @MinLength(4, { message: 'Password phải có ít nhất 4 ký tự'})
  password: string;
  @IsOptional()
  @IsNotEmpty({ message: 'Name không được để trống'})
  name: string;

  @IsBoolean({ message: 'isActive phải là giá trị boolean'})
  isActive: boolean;
}