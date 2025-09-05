import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @MinLength(4, { message: 'Password phải có ít nhất 4 ký tự' })
  password: string;
}
