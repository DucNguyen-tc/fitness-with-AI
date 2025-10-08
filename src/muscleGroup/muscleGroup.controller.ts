import { Controller, Post, Body, Get, Put, Delete, Param } from '@nestjs/common';
import { MuscleGroupService } from './muscleGroup.service';
import { CreateMuscleGroupDto } from './dto/creation-muscleGroup.dto';

@Controller('muscle-group')
export class MuscleGroupController {
  constructor(private readonly muscleGroupService: MuscleGroupService) {}

  @Post()
  create(@Body() createDto: CreateMuscleGroupDto) {
    return this.muscleGroupService.create(createDto);
  }

  @Get()
  findAll() {
    return this.muscleGroupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.muscleGroupService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: CreateMuscleGroupDto) {
    return this.muscleGroupService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.muscleGroupService.remove(id);
  }
}