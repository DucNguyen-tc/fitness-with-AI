import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AccountModule } from 'src/accounts/account.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema}]),
    AccountModule
  ], // Đăng ký schema với Mongoose
  controllers: [UserController],
  providers: [UserService],
  exports: [MongooseModule]
})
export class UserModule {}
