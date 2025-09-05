import { IsEmail, MinLength, IsNotEmpty} from 'class-validator';

export class CreateAccountDto {

  @IsEmail({}, { message: 'Email không đúng định dạng'})
  email: string;

  @MinLength(4, { message: 'Password phải có ít nhất 4 ký tự'})
  password: string;

  @IsNotEmpty({ message: 'Name không được để trống'})
  name: string;

}