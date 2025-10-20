import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { DifficultyLevel } from '../common/enums/difficulty-level.enum';

export type WorkoutDocument = HydratedDocument<Workout>;


@Schema()
export class Workout {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [Types.ObjectId], ref: 'MuscleGroup', required: true })
  muscleGroups: Types.ObjectId[];

  @Prop({ required: true, enum: DifficultyLevel })
  difficulty: DifficultyLevel;

  @Prop({ type: [String], required: true })
  instructions: string[];

  @Prop({ required: true })
  imageURL: string;

  @Prop({ required: true })
  mediaURL: string;

  @Prop({ required: true, min: 0 })
  caloriesBurnedPerMinute: number;
}

export const WorkoutSchema = SchemaFactory.createForClass(Workout);