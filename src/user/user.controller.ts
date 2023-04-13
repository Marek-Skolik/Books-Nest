import { Controller, Get, Param, ParseUUIDPipe, Delete, UseGuards, NotFoundException } from '@nestjs/common';
import { UsersService } from './user.service';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/')
  getAll() {
    return this.usersService.getAll();
  }

  @Get('/:id')
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.getById(id);
  }

  @Get('/:email')
  getByEmail(@Param('email') email: string) {
    return this.usersService.getByEmail(email);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  @UseGuards(JwtAuthGuard)
  public async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    if (!(await this.usersService.getById(id)))
      throw new NotFoundException('User not found');
    await this.usersService.deleteById(id);
    return { success: true };
  }
}
