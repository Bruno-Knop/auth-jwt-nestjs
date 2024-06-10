import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { PrismaService } from 'prisma/prisma.service';
import { Result } from 'src/shared/dtos/result.dto';
import { promisify } from 'util';
import { JwtPayload } from './JWT/jwt.interface';

const scrypt = promisify(_scrypt);

const refreshTokens = [];

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async signUp(username: string, password: string, profileId: number) {
    const existUser = await this.prisma.user.findUnique({
      where: { username },
    });

    if (existUser) {
      return new BadRequestException('Username is exist!');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const saltAndHash = `${salt}.${hash.toString('hex')}`;

    const user = await this.prisma.user.create({
      data: {
        username,
        password: saltAndHash,
        profileId,
      },
    });

    const { password: _, ...result } = user;
    return new Result(true, '', result);
  }

  async signIn(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      select: {
        id: true,
        username: true,
        password: true,
        profile: {
          select: {
            description: true,
            permission: {
              select: {
                view: true,
                insert: true,
                update: true,
                delete: true,
                admin: true,
                formId: true,
              },
            },
          },
        },
      },
      where: {
        username,
      },
    });

    if (!user) {
      return new UnauthorizedException('Invalid Credentials!');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash != hash.toString('hex')) {
      return new UnauthorizedException('Invalid Credentials!');
    }

    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      role: user.profile.description.toLowerCase(),
    };

    const accessToken = await this.jwtService.signAsync(
      { ...payload, type: 'access' },
      { expiresIn: '60s' },
    );

    const refreshToken = await this.jwtService.signAsync(
      { ...payload, type: 'refresh' },
      { expiresIn: '1h' },
    );

    refreshTokens.push({ value: refreshToken });

    return new Result(true, 'Logged is Successfully', {
      accessToken,
      refreshToken,
    });
  }

  async refresh(refreshToken: string) {
    const storedToken = refreshTokens.find((tk) => tk.value === refreshToken);
    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = this.jwtService.verify<JwtPayload>(refreshToken);
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }
    console.log(payload);

    const user = await this.prisma.user.findUnique({
      select: {
        id: true,
        username: true,
        password: true,
        profile: {
          select: {
            description: true,
          },
        },
      },
      where: {
        id: payload.id,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newPayload: JwtPayload = {
      id: user.id,
      username: user.username,
      role: user.profile.description,
    };

    const newAccessToken = this.jwtService.sign(
      { ...newPayload, type: 'access' },
      { expiresIn: '60s' },
    );

    const newRefreshToken = this.jwtService.sign(
      { ...newPayload, type: 'refresh' },
      { expiresIn: '1h' },
    );

    storedToken.value = newRefreshToken;

    return new Result(true, 'Token refresh is sucessfully', {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  }
}
