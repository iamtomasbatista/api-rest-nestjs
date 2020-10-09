import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from './user.repository';

@Module({
  imports: [                                                   
    PassportModule.register({ defaultStrategy: 'jwt' }),      // 💻 All this config objects must be located in other place 
    JwtModule.register({                                      // 💻 Follow Mosh Node.js technique to manage sensitive using environment variables
      secret: 'topSecret',                                    // 📝NestJS JwtModule exports a JwtService
      signOptions: {
        expiresIn: 3600        
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
