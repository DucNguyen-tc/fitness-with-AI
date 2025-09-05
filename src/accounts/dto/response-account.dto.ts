import { Expose, Transform } from 'class-transformer';

export class ResponseAccountDto {

  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  id: string;
  
  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  isActive: boolean;

  @Expose()
  @Transform(({ obj }) => obj.role.toString())
  role: string;
}


//Expose: Chỉ định các trường được phép xuất hiện trong DTO
//Transform: Chuyển đổi giá trị của trường role từ enum sang chuỗi để dễ đọc hơn