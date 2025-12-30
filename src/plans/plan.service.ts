import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Plan, PlanDocument } from './plan.schema';
import { Model } from 'mongoose';
import { CreatePlanDto, ProgressDto } from './dto/creation-plan.dto';
import { PlanResponseDto } from './dto/response-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { plainToInstance } from 'class-transformer';
import { UserDocument, User } from 'src/users/user.schema';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Status } from 'src/common/enums/status.enum';

@Injectable()
export class PlanService {
  private readonly aiApiUrl = 'http://127.0.0.1:5001';
  constructor(
    @InjectModel(Plan.name) private readonly planModel: Model<PlanDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly httpService: HttpService,
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

  async updateSessionStatus( // Cập nhật trạng thái của session trong 1 plan
    planId: string,
    sessionId: string,
    status: string,
    targetDate: Date,
  ) {
    // ✅ Cập nhật session cụ thể
    const updatedPlan = await this.planModel.findOneAndUpdate(
      { _id: planId, 'sessions._id': sessionId },
      {
        $set: {
          'sessions.$.status': status,
          'sessions.$.targetDate': targetDate,
        },
      },
      { new: true },
    );

    if (!updatedPlan) {
      throw new NotFoundException(
        'Không tìm thấy plan hoặc session để cập nhật',
      );
    }

    // ✅ Kiểm tra nếu tất cả session đều COMPLETED
    const allCompleted = updatedPlan.sessions.every(
      (s) => s.status === 'COMPLETED',
    );

    if (allCompleted && updatedPlan.status !== 'COMPLETED') {
      updatedPlan.status = Status.COMPLETED;
      await updatedPlan.save();
      console.log(`✅ Plan ${planId} đã hoàn thành toàn bộ buổi tập!`);
    }

    return updatedPlan;
  }

  async updateProgress(
    planId: string,
    progressData: ProgressDto,
  ): Promise<PlanDocument> { // <-- Thay đổi kiểu trả về
    const plan = await this.planModel.findById(planId);
    if (!plan) throw new NotFoundException('Không tìm thấy plan tương ứng');
    
    // Sửa lỗi: Nếu user gửi feedback 2 lần
    if (plan.progress && plan.progress.difficultRating) {
        throw new BadRequestException('Plan này đã được gửi feedback rồi!');
    }

    // 1. LƯU FEEDBACK VÀO PLAN (Tuần 1)
    // (Mình thêm submittedAt để hoàn thiện)
    const progressToSave = { ...progressData, submittedAt: new Date() };
    const updatedPlan = await this.planModel.findByIdAndUpdate(
      planId,
      // Ghi chú: Logic updateSessionStatus của bạn đã tự set plan.status = 'COMPLETED'
      // Nếu chưa, bạn nên set status ở đây
      { $set: { progress: progressToSave, status: Status.COMPLETED } },
      { new: true },
    );

    if (!updatedPlan) {
      throw new NotFoundException(`Không tìm thấy kế hoạch với ID: ${planId}`);
    }

    // 2. KÍCH HOẠT GIAI ĐOẠN 2: GỌI AI ĐỂ TẠO PLAN MỚI (Tuần 2)
    // Chúng ta gọi hàm mới ở Bước 1
    const newWeekPlan = await this.triggerAiUpdate(
      updatedPlan.userId.toString(), // Lấy userId từ plan
      updatedPlan.currentWeek,     // Lấy currentWeek (ví dụ: 1)
    );

    // 3. TRẢ VỀ PLAN MỚI (TUẦN 2) CHO FRONTEND
    // Frontend (ReactJS) sẽ nhận được plan tuần 2 và hiển thị nó
    return newWeekPlan;
  }

  // gửi dữ liệu sang AI, trả về plan mỚI (tuần 2)
  async triggerAiUpdate(
    userId: string,
    currentWeekNumber: number,
  ): Promise<PlanDocument> { // Trả về Plan MỚI (Tuần 2)
    try {
      const endpoint = `${this.aiApiUrl}/update-plan`;
      const payload = { userId, currentWeekNumber };
      
      console.log(`Đang gọi AI để cập nhật plan cho user: ${userId}, tuần: ${currentWeekNumber}`);

      // 1. Gửi request POST đến server Flask
      const response = await firstValueFrom(
        this.httpService.post(endpoint, payload),
      );

      // 2. Python (Giai đoạn 2) đã tự động tạo và LƯU plan mới vào DB
      // Nó trả về toàn bộ document plan mới đó
      
      // 3. Biến đổi kết quả (plain object) về Mongoose Document
      // (Nếu bạn không cần, có thể return response.data trực tiếp)
      const newPlan = new this.planModel(response.data);

      if (!newPlan) {
        throw new Error('AI trả về dữ liệu plan mới không hợp lệ.');
      }

      // Trả về plan mới (Tuần 2)
      return newPlan.toObject() as PlanDocument;

    } catch (error) {
      console.error('Lỗi khi gọi AI service (update):', error.message);
      throw new Error('Không thể cập nhật lộ trình từ AI.');
    }
  }

  async remove(id: string): Promise<string> {
    await this.planModel.findByIdAndDelete(id).exec();
    return 'Xoá lộ trình tập thành công';
  }

  async findByUser(userId: string): Promise<any[]> {
    const plans = await this.planModel.find({ userId }).exec();
    return plans.map((plan) => plan.toObject());
  }

  // Tạo mới plan tuần 1 khi user vừa tạo profile
 async getInitialPlanFromAI(userId: string): Promise<PlanDocument> {
    try {
      const endpoint = `${this.aiApiUrl}/initial-plan`;

      // Lấy profile và goals của user hiện tại
      const user = await this.userModel.findById(userId).exec();
      
      if (!user) {
        throw new Error(`Không tìm thấy User với ID: ${userId}`);
      }

      const userData = user.toObject();

      // Chuẩn bị payload để gửi và LOG ra kiểm tra
      const payload = {
        profile: userData.profile,
        goals: userData.goals,
      };

      console.log('🚀 Đang gửi Payload sang AI:', JSON.stringify(payload, null, 2));

      // 1. GỌI AI ĐỂ LẤY TOÀN BỘ CẤU TRÚC PLAN (FULL JSON)
      const response = await firstValueFrom(
        this.httpService.post(endpoint, payload),
      );

      console.log('🚀 AI trả về data:', JSON.stringify(response.data, null, 2));

      // XỬ LÝ DỮ LIỆU TRẢ VỀ
      // Dựa vào log, Python trả về: { "recommended_plan_id": { sessions: [...] } }
      // Nên chúng ta cần lấy giá trị bên trong key này.
      let templateData = response.data;

      if (templateData && templateData.recommended_plan_id) {
        templateData = templateData.recommended_plan_id;
      }

      // Kiểm tra dữ liệu trả về có hợp lệ không
      if (!templateData || !templateData.sessions) {
        console.error('Dữ liệu không hợp lệ nhận được:', templateData);
        throw new Error('AI không trả về dữ liệu sessions hợp lệ.');
      }

      // 2. KHÔNG CẦN TRUY VẤN DATABASE ĐỂ TÌM TEMPLATE NỮA

      // 3. XỬ LÝ DỮ LIỆU TỪ AI ĐỂ TẠO PLAN MỚI

      // 3a. Map lại mảng sessions để đảm bảo đúng schema và reset trạng thái
      const newSessions = templateData.sessions.map((session) => {
        return {
          sessionNumber: session.sessionNumber,
          estimatedDuration: session.estimatedDuration,
          caloriesBurned: session.caloriesBurned,
          
          // Map exercises: Dữ liệu từ Python trả về workoutId dạng string
          // Mongoose sẽ tự động cast string này thành ObjectId khi save()
          exercises: session.exercises.map((ex) => ({
             workoutId: ex.workoutId,
             order: ex.order,
             workTime: ex.workTime,
             restTime: ex.restTime,
             // Lưu ý: Không cần tạo _id ở đây, MongoDB sẽ tự tạo cho từng sub-document
          })),

          status: 'INCOMPLETE', // Set trạng thái mặc định
          targetDate: null,     // Set null để User tự chọn ngày bắt đầu hoặc FE tự tính
        };
      });

      // 3b. Tạo document Plan mới
      const newPlan = new this.planModel({
        userId: userId,     // Gán User sở hữu
        currentWeek: 1,
        status: 'INCOMPLETE',
        
        // Dữ liệu từ AI
        sessions: newSessions, 
        
        // (Tùy chọn) Lưu lại tên Template AI đã chọn để debug sau này
        // aiDecision: { templateName: templateData.ai_generated_label }, 
        
        progress: null,
      });

      // 4. LƯU VÀO DATABASE
      return await newPlan.save();

    } catch (error) {
      // LOG CHI TIẾT LỖI TỪ AI SERVICE (QUAN TRỌNG)
      if (error.response) {
         console.error('❌ Lỗi từ AI Service (Data):', error.response.data);
         console.error('❌ Lỗi từ AI Service (Status):', error.response.status);
      } else {
         console.error('❌ Lỗi hệ thống:', error.message);
      }
      
      // Ném lỗi ra để Controller bắt được
      throw new Error(`Không thể lấy lộ trình từ AI: ${error.message}`);
    }
}
}
