import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MuscleGroup, MuscleGroupSchema } from './muscleGroup.schema';
import { MuscleGroupService } from './muscleGroup.service';
import { MuscleGroupController } from './muscleGroup.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MuscleGroup.name, schema: MuscleGroupSchema }]),
  ], // Đăng ký schema với Mongoose
  controllers: [MuscleGroupController],
  providers: [MuscleGroupService],
  exports: [MongooseModule]
})
export class MuscleGroupModule {}
