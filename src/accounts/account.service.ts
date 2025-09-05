import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from 'src/accounts/account.schema';
import { CreateAccountDto } from './dto/creation-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { hashPassword } from 'src/common/utils/bcrypt.util';
import { Role } from 'src/common/enums/role.enum';
import { ResponseAccountDto } from './dto/response-account.dto';
import { plainToInstance } from 'class-transformer';

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
      });
      console.log('Admin account created 😜');
    }
  }

  async create(
    createAccountDto: CreateAccountDto,
  ): Promise<ResponseAccountDto> {
    const existingEmail = await this.accountModel.findOne({
      email: createAccountDto.email,
    });
    if (existingEmail) {
      throw new BadRequestException('Email đã tồn tại');
    }

    const hashedPassword = await hashPassword(createAccountDto.password);
    const account = new this.accountModel({
      ...createAccountDto,
      password: hashedPassword,
      role: Role.USER,
      isActive: true,
    });
    const saved = await account.save();

    return plainToInstance(ResponseAccountDto, saved.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async findAll(): Promise<ResponseAccountDto[]> {
    const accounts = await this.accountModel.find().exec();
    const plainAccounts = accounts.map((acc) => acc.toObject());

    return plainToInstance(ResponseAccountDto, plainAccounts, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string): Promise<ResponseAccountDto | null> {
    const response = await this.accountModel.findById(id).exec();
    if (!response) throw new NotFoundException('Tài khoản không tồn tại');
    return plainToInstance(ResponseAccountDto, response?.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    updateData: UpdateAccountDto,
  ): Promise<ResponseAccountDto | null> {
    const response = await this.accountModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!response) throw new NotFoundException('Tài khoản không tồn tại');
    return plainToInstance(ResponseAccountDto, response?.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string) {
    this.accountModel.findByIdAndDelete(id).exec();
    return 'Deleted Successfully';
  }

  async findByEmail(email: string): Promise<Account | null> {
    return this.accountModel.findOne({ email }).exec();
  }

  async setRefreshToken(accountId: string, refreshToken: string) {
    return await this.accountModel
      .findByIdAndUpdate(accountId, { refreshToken });
  }

  async getAccountIfRefreshTokenMatches(accountId: string, refreshToken: string) {
    const account = await this.accountModel.findById(accountId);
    if (!account || !account.refreshToken) throw new NotFoundException('Account not found');

    if (account.refreshToken !== refreshToken) throw new UnauthorizedException('Refresh token does not match');

    return account;
  }

  async removeRefreshToken(accountId: string) {
    await this.accountModel.updateOne(
      { _id: accountId },
      { $set: { refreshToken: null } },
    );
  }
}
