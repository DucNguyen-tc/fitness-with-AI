import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Goal, GoalSchema } from './goal.schema';
import { GoalService } from './goal.service';
import { GoalController } from './goal.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Goal.name, schema: GoalSchema }]),
  ], // Đăng ký schema với Mongoose
  controllers: [GoalController],
  providers: [GoalService],
})
export class GoalModule {}
