import { Body, Controller, Post, Get, Put, Param, Delete } from "@nestjs/common";
import { GoalCategoryService } from "./goalCategory.service";
import { CreateGoalCategoryDto } from "./dto/creation-goalCategory.dto";
import { Roles } from "src/auth/decorators/role.decorator";
import { Role } from "src/common/enums/role.enum";

@Controller('goal-categories')
export class GoalCategoryController {
    constructor(private readonly goalCategoryService: GoalCategoryService) {}

    @Post()
    @Roles(Role.ADMIN)
    create(@Body() createGoalCategoryDto: CreateGoalCategoryDto) {
        return this.goalCategoryService.create(createGoalCategoryDto);
    }

    @Get()
    findAll() {
        return this.goalCategoryService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.goalCategoryService.findOne(id);
    }

    @Put(':id')
    @Roles(Role.ADMIN)
    update(@Param('id') id: string, @Body() updateGoalCategoryDto: CreateGoalCategoryDto) {
        return this.goalCategoryService.update(id, updateGoalCategoryDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.goalCategoryService.remove(id);
    }

    @Post('is-active/:id')
    @Roles(Role.ADMIN)
    toggleActiveStatus(@Param('id') id: string) {
        // Logic to toggle the isActive status
        return this.goalCategoryService.toggleActiveStatus(id);
    }
}