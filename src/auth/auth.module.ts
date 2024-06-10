import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './JWT/jwt.strategy';
import { AuthController } from './auth.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow('JWT_SECRETY_KEY'),
        signOptions: {
          expiresIn: config.getOrThrow('JWT_EXPIRE_IN'),
        },
      }),
    }),
  ],
  providers: [AuthService, PrismaService, JwtStrategy],
  exports: [JwtModule, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
