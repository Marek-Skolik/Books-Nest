import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './user.service';

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
}
