import { Controller, Post, Body, Get, Patch, Delete, Param } from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto, ProgressDto } from './dto/creation-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  create(@Body() createDto: CreatePlanDto) {
    return this.planService.create(createDto);
  }

  @Get()
  findAll() {
    return this.planService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planService.findOne(id);
  }

  @Patch(':planId/sessions/:sessionId')
  async updateSessionStatus(
    @Param('planId') planId: string,
    @Param('sessionId') sessionId: string,
    @Body() body: { status: string, targetDate: Date },
  ) {
    return this.planService.updateSessionStatus(planId, sessionId, body.status, body.targetDate);
  }

  @Public()
  @Patch(':id/progress')
  async updateProgress(
    @Param('id') planId: string,
    @Body() progressDto: ProgressDto,
  ) {
    return await this.planService.updateProgress(planId, progressDto);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planService.remove(id);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.planService.findByUser(userId);
  }

  @Public()
  @Post('/create-initial/:userId')
  async createInitialPlan(@Param('userId') userId: string) {
    // 1. GỌI AI ĐỂ LẤY ID
    // userData là toàn bộ profile + goals mà user mới nhập
    const recommendedPlanId = await this.planService.getInitialPlanFromAI(userId);

    // 2. LẤY CHI TIẾT PLAN TỪ DATABASE
    // Sau khi có plan_id, bạn dùng nó để truy vấn collection 'plans'
    // const planDetails = await this.planCollectionService.findById(recommendedPlanId);
    
    // (Chỗ này bạn có thể phải "sao chép" planDetails,
    // gán userId mới của người dùng, weekNumber = 1,
    // và lưu một bản mới vào collection 'plans' cho user mới này)

    // 3. TRẢ KẾ HOẠCH VỀ CHO REACTJS
    // return planDetails; // (Hoặc bản plan mới đã sao chép)
    return { planId: recommendedPlanId }; // Trả về ID để test
  }
}