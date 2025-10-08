import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PlanStatus } from 'src/common/enums/status-plan.enum';

export type PlanDocument = HydratedDocument<Plan>;

@Schema()
export class Exercise {
  @Prop({ type: Types.ObjectId, ref: 'Workout', required: true })
  workoutId: Types.ObjectId;

  @Prop({ required: true })
  order: number;

  @Prop({ required: true })
  restTime: number; // giây
}

@Schema()
export class Session {
  @Prop({ required: true })
  sessionNumber: number;

  @Prop({ required: true })
  targetDate: Date;

  @Prop({ required: true })
  estimatedDuration: number; // phút

  @Prop({ required: true })
  caloriesBurned: number;

  @Prop({ type: [Exercise], required: true })
  exercises: Exercise[];

  @Prop({ required: true, enum: PlanStatus, default: PlanStatus.INCOMPLETE })
  status: PlanStatus;
}

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Plan {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  currentWeek: number;

  @Prop({ type: [Session], required: true })
  sessions: Session[];

  @Prop({ required: true, enum: PlanStatus, default: PlanStatus.INCOMPLETE })
  status: PlanStatus;

  @Prop()
  createdAt?: Date;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
