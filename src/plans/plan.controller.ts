import { Controller, Post, Body, Get, Put, Delete, Param } from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/creation-plan.dto';

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

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: CreatePlanDto) {
    return this.planService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planService.remove(id);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.planService.findByUser(userId);
  }
}