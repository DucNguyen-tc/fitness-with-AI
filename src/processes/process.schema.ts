import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { DifficultyRating } from 'src/common/enums/difficulty-rating.enum';
import { AiAction } from 'src/common/enums/ai-action.enum';
import { BodyFatPercentage } from 'src/common/enums/bodyFat-Percentage.enum';

export type ProcessDocument = HydratedDocument<Process>;

@Schema()
export class WeeklyMetrics {
  @Prop({ required: true })
  currentWeight: number;

  @Prop({ enum: BodyFatPercentage, required: true })
  bodyFatPercentage: BodyFatPercentage; // Ví dụ: "8-12%"
}

@Schema({ timestamps: { updatedAt: true, createdAt: false } })
export class Process {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Plan', required: true })
  planId: Types.ObjectId;

  @Prop({ type: WeeklyMetrics, required: true })
  weeklyMetrics: WeeklyMetrics;

  @Prop({ required: true, enum: DifficultyRating })
  difficultRating: DifficultyRating;

  @Prop({ required: true, enum: AiAction })
  aiAction: AiAction;

  @Prop()
  updatedAt?: Date;
}

export const ProcessSchema = SchemaFactory.createForClass(Process);