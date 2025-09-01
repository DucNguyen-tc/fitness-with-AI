import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from 'src/accounts/account.schema';
import { CreateAccountDto } from './dto/creation-account.dto';
import { hashPassword } from 'src/common/utils/bcrypt.util';
import { Role } from 'src/common/enums/role.enum';


@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  //Kiểm tra và tạo tài khoản admin nếu chưa tồn tại (tự động khi khởi động ứng dụng)
  async onModuleInit() {
    const admin = await this.accountModel.findOne({ role: Role.ADMIN });
    if (!admin) {
      await this.accountModel.create({
        email: process.env.ADMIN_EMAIL,
        password: await hashPassword(process.env.ADMIN_PASSWORD!),
        name: process.env.ADMIN_NAME,
        role: Role.ADMIN,
        isActive: true,
      })
      console.log('Admin account created 😜');
    }
  }

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    //Kiểm tra email đã tồn tại
    const existingEmail = await this.accountModel.findOne({ email: createAccountDto.email });
    if (existingEmail) {
      throw new BadRequestException('Email đã tồn tại');
    }

    // Mã hóa mật khẩu trước khi lưu
    createAccountDto.password = await hashPassword(createAccountDto.password);
    const account = new this.accountModel(createAccountDto);
    return account.save();
  }

  async findAll(): Promise<Account[]> {
    return this.accountModel.find().exec();
  }

  async findOne(id: string): Promise<Account | null> {
    return this.accountModel.findById(id).exec();
  }

  async update(
    id: string,
    updateData: Partial<Account>,
  ): Promise<Account | null> {
    return this.accountModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Account | null> {
    return this.accountModel.findByIdAndDelete(id).exec();
  }
}
