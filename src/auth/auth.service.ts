import {
  Injectable,
  Dependencies,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service'; 
import { comparePasswordHelper } from 'src/helpers/util';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findByEmail(username);
    if (!user) {
      throw new UnauthorizedException('Invalid Email');
    }
    const isValidPassword = await comparePasswordHelper(pass, user.pw);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid Password');
    }
    return user;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
