import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as config from 'config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from './user.repository';

const jwtConfig = config.get('jwt');

@Module({
  imports: [                                                   
    PassportModule.register({ defaultStrategy: 'jwt' }),      
    JwtModule.register({                                      
      secret: process.env.JWT_SECRET || jwtConfig.secret,                                 
      signOptions: {
        expiresIn: jwtConfig.expiresIn        
      }
    }),
    TypeOrmModule.forFeature([UserRepository])      // 📝NestJS creates the correspondly table in the DB at this time
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy    
  ],
  exports: [
    JwtStrategy,      // 📝NestJS we export JwtStrategy and PassportModule so others modules can use the strategy to guard its endpoints
    PassportModule
  ]
})
export class AuthModule {}
