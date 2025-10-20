import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Plan, PlanSchema } from './plan.schema';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Plan.name, schema: PlanSchema}]),
    UserModule
  ], // Đăng ký schema với Mongoose
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}
