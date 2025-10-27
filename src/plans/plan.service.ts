import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Plan, PlanDocument } from './plan.schema';
import { Model } from 'mongoose';
import { CreatePlanDto } from './dto/creation-plan.dto';
import { PlanResponseDto } from './dto/response-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { plainToInstance } from 'class-transformer';
import { UserDocument, User } from 'src/users/user.schema';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PlanService {
  private readonly aiApiUrl = 'http://127.0.0.1:5001';
  constructor(
    @InjectModel(Plan.name) private readonly planModel: Model<PlanDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly httpService: HttpService
  ) {}

  async create(createDto: CreatePlanDto): Promise<PlanResponseDto> {
    const createdPlan = new this.planModel(createDto);
    const savedPlan = await createdPlan.save();
    return plainToInstance(PlanResponseDto, savedPlan.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async findAll(): Promise<PlanResponseDto[]> {
    const plans = await this.planModel.find().exec();
    return plans.map((plan) =>
      plainToInstance(PlanResponseDto, plan.toObject(), {
        excludeExtraneousValues: true,
      }),
    );
  }

  async findOne(id: string): Promise<PlanResponseDto> {
    const plan = await this.planModel.findById(id).exec();
    if (!plan) {
      throw new NotFoundException('Không tìm thấy lộ trình tập');
    }
    return plainToInstance(PlanResponseDto, plan.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, updateDto: UpdatePlanDto): Promise<PlanResponseDto> {
    const updatedPlan = await this.planModel.findByIdAndUpdate(
      id,
      { $set: updateDto }, // ⚡ chỉ update field có trong DTO
      { new: true },
    );

    if (!updatedPlan) {
      throw new NotFoundException('Không tìm thấy lộ trình để cập nhật');
    }

    return plainToInstance(PlanResponseDto, updatedPlan.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async updateSessionStatus(planId: string, sessionId: string, status: string) {
    const updatedPlan = await this.planModel.findOneAndUpdate(
      { _id: planId, 'sessions._id': sessionId },
      { $set: { 'sessions.$.status': status } },
      { new: true },
    );

    console.log("session", sessionId);
    console.log("plan", planId);
    console.log("status", status);

    if (!updatedPlan) {
      throw new NotFoundException('Không tìm thấy plan hoặc session để cập nhật');
    }

    return updatedPlan;
  }

  async remove(id: string): Promise<string> {
    await this.planModel.findByIdAndDelete(id).exec();
    return 'Xoá lộ trình tập thành công';
  }

  // async findByUser(userId: string): Promise<PlanResponseDto[]> {
  //   const plans = await this.planModel.find({ userId }).exec();
  //   return plans.map((plan) =>
  //     plainToInstance(PlanResponseDto, plan.toObject(), {
  //       excludeExtraneousValues: true,
  //     }),
  //   );
  // }

  async findByUser(userId: string): Promise<any[]> {
  const plans = await this.planModel.find({ userId }).exec();
  return plans.map((plan) => plan.toObject());
}


  async getInitialPlanFromAI(userId: string): Promise<PlanDocument> {
    try {
      const endpoint = `${this.aiApiUrl}/initial-plan`;

      // Lấy profile và goals của user
      const user = await this.userModel.findById(userId).exec();
      const userData = user?.toObject();
      
      // 1. GỌI AI ĐỂ LẤY ID BẢN MẪU
      // Gửi profile và goals của user mới cho AI
      const response = await firstValueFrom(
        this.httpService.post(endpoint, {
          profile: userData?.profile,
          goals: userData?.goals,
        }),
      );

      // AI trả về ID của plan mẫu (ví dụ: '68fa5b39bb727480c221d64b')
      const recommendedPlanId = response.data.recommended_plan_id;

      // 2. TÌM BẢN MẪU GỐC TRONG MONGODB
      const templatePlan = await this.planModel.findById(recommendedPlanId).exec();

      if (!templatePlan) {
        throw new Error('Không tìm thấy kế hoạch mẫu (template) trong database!');
      }

      // 3. TẠO BẢN SAO MỚI (COPY) VÀ SỬA ĐỔI
      
      // 3a. Sửa đổi mảng 'sessions' theo yêu cầu (targetDate = rỗng, status = INCOMPLETE)
      // Chúng ta dùng .map() để tạo một mảng sessions MỚI
      const newSessions = templatePlan.sessions.map(session => {
        return {
          sessionNumber: session.sessionNumber,
          estimatedDuration: session.estimatedDuration,
          caloriesBurned: session.caloriesBurned,
          exercises: session.exercises, // Copy mảng exercises y hệt
          status: 'INCOMPLETE', // <-- Đặt lại status cho user mới
          targetDate: null, // <-- SET VỀ RỖNG (null) NHƯ BẠN MUỐN
        };
      });

      // 3b. Tạo document plan MỚI bằng Mongoose Model
      const newPlan = new this.planModel({
        userId: userId, // <-- GÁN ID CỦA USER MỚI
        currentWeek: 1,
        status: 'INCOMPLETE', // <-- SET LẠI STATUS CHO PLAN CHÍNH
        sessions: newSessions, // <-- GÁN mảng sessions đã sửa đổi
        
        // 2 trường này để rỗng, vì đây là plan mới
        progress: null, 
        aiDecision: null,
      });

      // 4. LƯU PLAN MỚI VÀO DATABASE
      // MongoDB sẽ tự động tạo _id mới cho plan này
      return await newPlan.save();

    } catch (error) {
      console.error('Lỗi khi gọi AI hoặc tạo plan:', error.message);
      throw new Error('Không thể lấy được lộ trình từ AI.');
    }
  }
}