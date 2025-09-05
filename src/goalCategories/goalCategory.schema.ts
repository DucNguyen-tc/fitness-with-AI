import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';


export type GoalCategoryDocument = HydratedDocument<GoalCategory>; // Định nghĩa kiểu tài liệu cho GoalCategory

@Schema()
export class GoalCategory {
  _id: Types.ObjectId; // Định nghĩa thuộc tính _id kiểu ObjectId

  @Prop({required: true, unique: true})
  code: string;

  @Prop({required: true})
  name: string;

  @Prop({required: true})
  description: string;

  @Prop()
  isActive: boolean;
}

export const GoalCategorySchema = SchemaFactory.createForClass(GoalCategory);  // Tạo schema từ class GoalCategory
