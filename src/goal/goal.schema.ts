import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';
import { Gender } from 'src/common/enums/gender.enum';

export type GoalDocument = HydratedDocument<Goal>; // Định nghĩa kiểu tài liệu cho GoalCategory

@Schema()
export class Goal {
  _id: Types.ObjectId; // Định nghĩa thuộc tính _id kiểu ObjectId

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: Gender })
  gender: Gender;

  @Prop({ required: true, ref: 'GoalCategory', type: Types.ObjectId })
  goalCategoryId: Types.ObjectId;

  @Prop({
    type: {
      weightChange: { type: Number, default: null },
      timeframe: { type: Number, default: null },
      bodyFatPercentage: { type: Number, default: null },
    },
    default: {},
  })
  targetMetrics: {
    weightChange?: number;
    timeframe?: number;
    bodyFatPercentage?: number;
  };
}

export const GoalSchema = SchemaFactory.createForClass(Goal); // Tạo schema từ class GoalCategory
