import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, Length } from 'class-validator';
import { Gender } from '../enum/gender.enum';

export class ProfileDto {
  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @Length(3, 100)
  nick_name: string;
  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @Length(10, 200)
  bio: string;
  @IsOptional()
  @ApiPropertyOptional({ nullable: true, format: 'binary' })
  image_profile: string;
  @IsOptional()
  @ApiPropertyOptional({ nullable: true, format: 'binary' })
  bg_profile: string;
  @ApiPropertyOptional({ nullable: true, enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;
  @IsOptional()
  @ApiPropertyOptional({ nullable: true, example: '2024-07-25T14:58:31.033Z' })
  birthday: Date;
  @IsOptional()
  @ApiPropertyOptional({ nullable: true })
  linkdin_profile: string;
}
