import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth.credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {     // ❓NestJS These methods dont have the async keyword. Why? Maybe the decorator are doing that work!  
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {      // 🤓 We dont validate the body of the request coz if we are being attacked, we will provide the attacker with information like Password too weak.
    return this.authService.signIn(authCredentialsDto);                                           // If we will interested in validate just the username, we will need to create another DTO
  }

}