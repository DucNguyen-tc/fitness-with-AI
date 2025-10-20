import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from 'src/accounts/account.schema';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
  ], // Đăng ký schema với Mongoose
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService, MongooseModule], // Export AccountService để có thể sử dụng ở module khác
})
export class AccountModule {}
