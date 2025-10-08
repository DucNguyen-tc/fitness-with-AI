import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';
import { Gender } from 'src/common/enums/gender.enum';
import { ActivityLevel } from 'src/common/enums/activity-level.enum';
import { FitnessLevel } from 'src/common/enums/fitness-level.enum';
import { TimeFrame } from 'src/common/enums/time-frame.enum';
import { BodyFatPercentage } from 'src/common/enums/bodyFat-Percentage.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Account' })
  accountId: Types.ObjectId;

  @Prop({
    type: {
      gender: { type: String, enum: Gender, required: true },
      age: { type: Number, required: true },
      height: { type: Number, required: true },
      weight: { type: Number, required: true },
      bmi: { type: Number, require: true }, // hệ thống tự tính
      bodyFatPercentageBefore: { type: String, enum: BodyFatPercentage, require: true }, // dạng chuỗi "15-20%"
      activityLevel: { type: String, enum: ActivityLevel, required: true },
      fitnessLevel: { type: String, enum: FitnessLevel, required: true },
    },
    required: true,
  })
  profile: {
    gender: Gender;
    age: number;
    height: number;
    weight: number;
    bmi: number;
    bodyFatPercentageBefore: BodyFatPercentage;
    activityLevel: ActivityLevel;
    fitnessLevel: FitnessLevel;
  };

  @Prop({
    type: {
      bodyFatPercentageAfter: { type: String, enum: BodyFatPercentage, required: true }, // dạng chuỗi "10-15%"
      weightGoal: { type: Number, required: true },
      timeFrame: { type: Number, enum: TimeFrame, required: true },
    },
    required: true,
  })
  goals: {
    bodyFatPercentageAfter: BodyFatPercentage;
    weightGoal: number;
    timeFrame: TimeFrame;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
