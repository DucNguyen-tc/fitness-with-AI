import { IsEmail, MinLength, IsNotEmpty, IsBoolean } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class CreateAccountDto {

  @IsEmail({}, { message: 'Email không đúng định dạng'})
  email: string;

  @MinLength(4, { message: 'Password phải có ít nhất 4 ký tự'})
  password: string;

  @IsNotEmpty({ message: 'Name không được để trống'})
  name: string;

  @IsBoolean()
  isActive: boolean = true;
  role: Role = Role.USER;
}