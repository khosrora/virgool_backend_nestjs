import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CreateBlogDto {
  @ApiPropertyOptional()
  slug: string;

  @ApiProperty({ example: '10' })
  @IsString()
  @IsNotEmpty()
  time_for_study: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(10, 250)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(10, 250)
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ nullable: true, format: 'binary' })
  image: File;
}
