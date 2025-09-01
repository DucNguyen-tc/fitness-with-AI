import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/common/enums/role.enum';


export type AccountDocument = HydratedDocument<Account>; // Định nghĩa kiểu tài liệu cho Account

@Schema()
export class Account {
  @Prop({required: true, unique: true})
  email: string;

  @Prop({required: true})
  password: string;

  @Prop({required: true})
  name: string;

  @Prop()
  isActive: boolean;

  @Prop({enum: Role}) // Chỉ định rằng thuộc tính này sử dụng enum Role
  role: Role; // Sử dụng enum Role cho thuộc tính role
}

export const AccountSchema = SchemaFactory.createForClass(Account);  // Tạo schema từ class Account
