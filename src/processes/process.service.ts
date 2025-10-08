import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Process, ProcessDocument } from './process.schema';
import { Model } from 'mongoose';
import { CreateProcessDto } from './dto/creation-process.dto';
import { ProcessResponseDto } from './dto/response-process.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProcessService {
  constructor(
    @InjectModel(Process.name)
    private readonly processModel: Model<ProcessDocument>,
  ) {}

  async create(createDto: CreateProcessDto): Promise<ProcessResponseDto> {
    const createdProcess = new this.processModel(createDto);
    const savedProcess = await createdProcess.save();
    return plainToInstance(ProcessResponseDto, savedProcess.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async findAll(): Promise<ProcessResponseDto[]> {
    const processes = await this.processModel.find().exec();
    return processes.map((process) =>
      plainToInstance(ProcessResponseDto, process.toObject(), {
        excludeExtraneousValues: true,
      }),
    );
  }

  async findOne(id: string): Promise<ProcessResponseDto> {
    const process = await this.processModel.findById(id).exec();
    if (!process) {
      throw new NotFoundException('Không tìm thấy tiến độ');
    }
    return plainToInstance(ProcessResponseDto, process.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, updateDto: CreateProcessDto): Promise<ProcessResponseDto> {
    const updatedProcess = await this.processModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!updatedProcess) {
      throw new NotFoundException('Không tìm thấy tiến độ để cập nhật');
    }
    return plainToInstance(ProcessResponseDto, updatedProcess.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string): Promise<string> {
    await this.processModel.findByIdAndDelete(id).exec();
    return 'Xoá tiến độ thành công';
  }
}