import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MuscleGroupDocument = HydratedDocument<MuscleGroup>;

@Schema()
export class MuscleGroup {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  name: string; // Ví dụ: "CHEST"

  @Prop({ required: true })
  displayName: string; // Ví dụ: "Ngực"

  @Prop({ required: true})
  imageURL: string;

  @Prop({ required: true })
  description: string; // Ví dụ: "Các bài tập cho nhóm cơ ngực"
}

export const MuscleGroupSchema = SchemaFactory.createForClass(MuscleGroup);