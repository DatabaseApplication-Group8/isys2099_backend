import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PrismaService } from 'prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import {ConfigService, ConfigModule} from '@nestjs/config'
import { LocalStrategy } from './passport/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './passport/jwt.strategy';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRED'),
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
