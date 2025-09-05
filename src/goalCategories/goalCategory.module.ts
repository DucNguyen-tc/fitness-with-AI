import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoalCategory, GoalCategorySchema } from './goalCategory.schema';
import { GoalCategoryService } from './goalCategory.service';
import { GoalCategoryController } from './goalCategory.controller';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: GoalCategory.name, schema: GoalCategorySchema }]),
  ], // Đăng ký schema với Mongoose
  controllers: [GoalCategoryController],
  providers: [GoalCategoryService],
})
export class GoalCategoryModule {}
