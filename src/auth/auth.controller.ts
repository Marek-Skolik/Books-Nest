import { Controller, Post, Body, UseGuards, Request, Response, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './register.auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
    register(@Body() registrationData: RegisterDTO) {
      return this.authService.register(registrationData);
  };

  @UseGuards(JwtAuthGuard)
  @Delete('logout')
  async logout(@Response() res) {
    res.clearCookie('auth', { httpOnly: true });
    res.send({
      message: 'success',
    });
  }
}
