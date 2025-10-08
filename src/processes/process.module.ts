import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Process, ProcessSchema } from './process.schema'; 
import { ProcessController } from './process.controller';
import { ProcessService } from './process.service'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Process.name, schema: ProcessSchema}]),
  ], // Đăng ký schema với Mongoose
  controllers: [ProcessController],
  providers: [ProcessService],
})
export class ProcessModule {}
