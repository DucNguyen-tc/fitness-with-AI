import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { GoalCategory, GoalCategoryDocument } from "./goalCategory.schema";
import { Model } from "mongoose";
import { CreateGoalCategoryDto } from "./dto/creation-goalCategory.dto";
import { ResponseGoalCategoryDto } from "./dto/response-goadCategory.dto";
import { plainToInstance } from 'class-transformer';
import { NotFoundError } from "rxjs";

@Injectable() // Đánh dấu lớp này là một provider có thể được tiêm vào các lớp khác
export class GoalCategoryService {
    constructor(
        @InjectModel(GoalCategory.name) private goalCategoryModel: Model<GoalCategoryDocument>, // Inject the GoalCategory model
    ){}

    async create(createGoalCategoryDto: CreateGoalCategoryDto): Promise<ResponseGoalCategoryDto> {
        const createdGoalCategory = new this.goalCategoryModel({
            ...createGoalCategoryDto,
            isActive: true, // Mặc định khi tạo mới sẽ là active
        });
        const savedGoalCategory = await createdGoalCategory.save();
        return plainToInstance(ResponseGoalCategoryDto, savedGoalCategory.toObject(), {
            excludeExtraneousValues: true,
        });
    }

    async findAll(): Promise<ResponseGoalCategoryDto[]> {
        const goalCategories = await this.goalCategoryModel.find().exec();
        return plainToInstance(ResponseGoalCategoryDto, goalCategories.map(gc => gc.toObject()), {
            excludeExtraneousValues: true,
        });
    }

    async findOne(id: string): Promise<ResponseGoalCategoryDto> {
        const goalCategory = await this.goalCategoryModel.findById(id).exec();
        if (!goalCategory) {
            throw new NotFoundException('GoalCategory not found');
        }
        return plainToInstance(ResponseGoalCategoryDto, goalCategory.toObject(), {
            excludeExtraneousValues: true,
        });
    }

    async remove(id: string): Promise<String> {
        const result = await this.goalCategoryModel.findByIdAndDelete(id).exec();
        return 'Deleted successfully';
    }

    async update(id: string, updateGoalCategoryDto: CreateGoalCategoryDto): Promise<ResponseGoalCategoryDto> {
        const updatedGoalCategory = await this.goalCategoryModel.findByIdAndUpdate(
            id,
            updateGoalCategoryDto,
            { new: true } // Trả về document đã được cập nhật
        ).exec();
        if (!updatedGoalCategory) {
            throw new NotFoundException('GoalCategory not found');
        }
        return plainToInstance(ResponseGoalCategoryDto, updatedGoalCategory.toObject(), {
            excludeExtraneousValues: true,
        });
    }

    async toggleActiveStatus(id: string): Promise<ResponseGoalCategoryDto> {
        const goalCategory = await this.goalCategoryModel.findById(id).exec();
        if (!goalCategory) {
            throw new NotFoundException('GoalCategory not found');
        }
        goalCategory.isActive = !goalCategory.isActive;
        const savedGoalCategory = await goalCategory.save();
        return plainToInstance(ResponseGoalCategoryDto, savedGoalCategory.toObject(), {
            excludeExtraneousValues: true,
        });
    }
}