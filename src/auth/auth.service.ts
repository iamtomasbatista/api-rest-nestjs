import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from './auth-payload.interface';
import { AuthCredentialsDto } from './dto/auth.credentials.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)           // 📝NestJS When the service initializes, we're gonna inject an UserRepository instance to userRepository parameter as an argument 
    private userRepository: UserRepository,     // 📝TS Coz userRepository is private, it becomes a class member
    private jwtService: JwtService              // 📝NestJS JwtService is exported by JwtModule
  ) {}  

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validateUserPassword(authCredentialsDto);      // 📝ES6 If you dont use the await operator, result will be equal to Promise 'Pending'

    if (!username) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
