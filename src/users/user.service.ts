import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/creation-user.dto';
import { UserResponseDto } from './dto/response-user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
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
}