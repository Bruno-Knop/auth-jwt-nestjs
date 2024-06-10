import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AuthSignUpDto {
  @ApiProperty({ type: String, description: 'Usuario' })
  @IsString()
  @IsNotEmpty()
  public username: string;

  @ApiProperty({ type: String, description: 'Senha' })
  @IsString()
  @IsNotEmpty()
  public password: string;

  @ApiProperty({ type: Number, description: 'Permissões' })
  @IsNumber()
  @IsNotEmpty()
  public profileId: number;
}

export class AuthSignInDto {
  @ApiProperty({ type: String, description: 'Usuario' })
  @IsString()
  @IsNotEmpty()
  public username: string;

  @ApiProperty({ type: String, description: 'Senha' })
  @IsString()
  @IsNotEmpty()
  public password: string;
}

export class AuthRefreshDto {
  @ApiProperty({ type: String, description: 'Refresh Token' })
  @IsString()
  @IsNotEmpty()
  public refreshToken: string;
}
