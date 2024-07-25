import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Length } from 'class-validator';
import { AuthMethod } from '../enums/method.enum';
import { AuthType } from '../enums/type.enum';

export class AuthDto {
  @IsString()
  @ApiProperty()
  @Length(3, 100)
  username: string;
  @IsEnum(AuthType)
  @ApiProperty({ enum: AuthType })
  type: string;
  @IsEnum(AuthMethod)
  @ApiProperty({ enum: AuthMethod })
  method: AuthMethod;
}

export class CheckOtpDto {
  @IsString()
  @ApiProperty()
  code: string;
}
