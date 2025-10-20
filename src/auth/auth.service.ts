import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountService } from 'src/accounts/account.service';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from 'src/common/utils/bcrypt.util';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const account = await this.accountService.findByEmail(email);
    if (!account) {
      throw new UnauthorizedException('Sai email hoặc mật khẩu');
    }

    const passwordValid = await comparePassword(password, account.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Sai email hoặc mật khẩu');
    }

    const payload = {
      sub: account._id.toString(),
      email: account.email,
      name: account.name,
      role: account.role,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });

    await this.accountService.setRefreshToken(
      account._id.toString(),
      refreshToken,
    );
    return { accessToken, refreshToken };
  }

  async refreshToken(accountId: string, refreshToken: string) {
    // giải mã token để lấy payload
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.JWT_SECRET,
    });

    //Kiểm tra userId từ payload có khớp với userId truyền vào không
    if (payload.sub !== accountId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    //Kiểm tra refresh token có khớp với token trong database không
    const account = await this.accountService.getAccountIfRefreshTokenMatches(
      accountId,
      refreshToken,
    );

    console.log(account);

    const newPayload = {
      sub: account?._id.toString(),
      email: account?.email,
      name: account?.name,
      role: account?.role,
    };
    const accessToken = await this.jwtService.signAsync(newPayload, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return { accessToken };
  }

  async logout(accountId: string) {
    return this.accountService.removeRefreshToken(accountId);
  }
}
