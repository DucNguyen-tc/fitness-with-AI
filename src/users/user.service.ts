import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/creation-user.dto';
import { UserResponseDto } from './dto/response-user.dto';
import { plainToInstance } from 'class-transformer';
import { Account, AccountDocument } from 'src/accounts/account.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const account = await this.accountModel.findById(createUserDto.accountId).exec();
    if (!account) {
      throw new NotFoundException('Tài khoản người dùng không tồn tại');
    }
    const user = await this.userModel.findOne({ accountId: createUserDto.accountId }).exec();
    if (user) {
      throw new BadRequestException('Người dùng đã tạo profile');
    }
    const createdUser = new this.userModel(createUserDto);
    const savedUser = await createdUser.save();
    return plainToInstance(UserResponseDto, savedUser.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userModel.find().exec();
    return users.map((user) =>
      plainToInstance(UserResponseDto, user.toObject(), {
        excludeExtraneousValues: true,
      }),
    );
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    return plainToInstance(UserResponseDto, user.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, updateUserDto: CreateUserDto): Promise<UserResponseDto> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    return plainToInstance(UserResponseDto, updatedUser.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string): Promise<string> {
    await this.userModel.findByIdAndDelete(id).exec();
    return 'Xoá người dùng thành công';
  }

  //Lấy user theo accountId
  async findByAccountId(accountId: string): Promise<UserResponseDto> {
    const user = await this.userModel.findOne({ accountId }).exec();
    if (!user) {
      throw new NotFoundException('Tài khoản người dùng không tồn tại');
    }
    return plainToInstance(UserResponseDto, user.toObject(), {
      excludeExtraneousValues: true,
    });
  }
}