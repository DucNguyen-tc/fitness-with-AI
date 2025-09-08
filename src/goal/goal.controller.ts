import { Controller, Post, Body, Get, Put, Delete, Param } from "@nestjs/common";
import { CreateGoalDto } from "./dto/creation-goal.dto";
import { GoalService } from "./goal.service";

@Controller('goal')
export class GoalController {
    constructor(private readonly goalService: GoalService) {}

    @Post()
    create(@Body() createGoalDto: CreateGoalDto) {
        return this.goalService.create(createGoalDto);
    }

    @Get()
    findAll() {
        return this.goalService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.goalService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateGoalDto: CreateGoalDto) {
        return this.goalService.update(id, updateGoalDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.goalService.remove(id);
    }
}