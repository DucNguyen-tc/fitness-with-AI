import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { AccountService } from 'src/accounts/account.service';
import { CreateAccountDto } from 'src/accounts/dto/creation-account.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-auth.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private accountService: AccountService,
    private authService: AuthService,
  ) {}

  @Public()
  @Post('register')
  create(@Body() body: CreateAccountDto) {
    return this.accountService.create(body);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto.email, loginDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  refreshToken(
    @Body('userId') userId: string,
    @Body('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshToken(userId, refreshToken);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Body('userId') userId: string) {
    return this.authService.logout(userId);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
