import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from "./dto/auth.credentials.dto";
import { User } from "./user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;      // 📍ES6 Object Destructuring
    
    const user = new User();      // 💻 Create a constructor in User entity 
    user.username = username;     // const user = new User({ username, password }) Looks more elegant
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);     // Try the await inside de function!!!

    try {
      await user.save();            // 📝NestJS returns the proper status even when we are not explicitly returning anything
    } catch (error) {
      if (error.code === '23505') {   // 📝Postgres 23505 is the Postgres error code for unique_violation. https://www.postgresql.org/docs/12/errcodes-appendix.html
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();     // 📝NestJS 500 Error
      }
    }    
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;      // 📍ES6 Object Destructuring
    const user = await this.findOne({ username });     // 📍ES6 Property Value Shorthand

    if (user && await user.validatePassword(password)) {
      return user.username;   
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

}