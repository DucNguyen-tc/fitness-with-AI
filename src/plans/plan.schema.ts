import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Status } from 'src/common/enums/status.enum';
import { DifficultyRating } from 'src/common/enums/difficulty-rating.enum';
import { AiAction } from 'src/common/enums/ai-action.enum';

export type PlanDocument = HydratedDocument<Plan>;

@Schema()
export class Exercise {
  @Prop({ type: Types.ObjectId, ref: 'Workout', required: true })
  workoutId: Types.ObjectId;

  @Prop({ required: true })
  order: number;

  @Prop({ required: true })
  restTime: number;

  @Prop({ required: true })
  workTime: number;
}

@Schema()
export class Session {
  @Prop({ required: true })
  sessionNumber: number;

  @Prop({ required: true })
  targetDate: Date;

  @Prop({ required: true })
  estimatedDuration: number;

  @Prop({ required: true })
  caloriesBurned: number;

  @Prop({ type: [Exercise], required: true })
  exercises: Exercise[];

  @Prop({ required: true, enum: Status })
  status: Status;
}

@Schema()
export class ProgressMetrics {
  @Prop()
  endOfWeekWeight: number;

  @Prop()
  endOfWeekBodyFat: string;
}

@Schema()
export class Progress {
  @Prop({ enum: DifficultyRating })
  difficultRating: DifficultyRating;

  @Prop({ type: ProgressMetrics })
  metrics: ProgressMetrics;

  @Prop()
  submittedAt: Date;
}

@Schema()
export class AIDecision {
  @Prop({ enum: AiAction })
  actionTaken: AiAction;

  @Prop({ type: Types.ObjectId, ref: 'Plan' })
  nextWeekPlanId: Types.ObjectId;
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

  @Prop({ required: true, enum: Status, default: Status.INCOMPLETE })
  status: Status;

  @Prop({ type: Progress })
  progress?: Progress;

  @Prop({ type: AIDecision })
  aiDecision?: AIDecision;

  @Prop()
  createdAt?: Date;
}
export const PlanSchema = SchemaFactory.createForClass(Plan);
