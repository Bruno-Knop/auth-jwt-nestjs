import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthRefreshDto, AuthSignInDto, AuthSignUpDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guard/jwt.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  @ApiBody({ type: AuthSignUpDto })
  signUp(@Body() body: AuthSignUpDto) {
    const { username, password, profileId } = body;
    return this.authService.signUp(username, password, profileId);
  }

  @Post('signIn')
  @ApiBody({ type: AuthSignInDto })
  signIn(@Body() body: AuthSignInDto) {
    const { username, password } = body;
    return this.authService.signIn(username, password);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: AuthRefreshDto })
  refresh(@Body() body: AuthRefreshDto) {
    const { refreshToken } = body;
    return this.authService.refresh(refreshToken);
  }
}
