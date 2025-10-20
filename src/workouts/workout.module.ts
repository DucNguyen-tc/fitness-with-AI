import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Workout, WorkoutSchema } from './workout.schema';
import { WorkoutController } from './workout.controller';
import { WorkoutService } from './workout.service';
import { MuscleGroupModule } from 'src/muscleGroup/muscleGroup.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Workout.name, schema: WorkoutSchema}]),
    MuscleGroupModule
  ], // Đăng ký schema với Mongoose
  controllers: [WorkoutController],
  providers: [WorkoutService],
})
export class WorkoutModule {}
