import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { AccountService } from './account.service';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';


@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  
  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.accountService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateAccountDto) {
    return this.accountService.update(id, body);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.accountService.remove(id);
  }
}
