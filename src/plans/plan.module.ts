import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Plan, PlanSchema } from './plan.schema';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Plan.name, schema: PlanSchema}]),
  ], // Đăng ký schema với Mongoose
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}
