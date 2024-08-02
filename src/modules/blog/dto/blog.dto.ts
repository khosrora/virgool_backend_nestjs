import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, Length } from 'class-validator';

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

  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  categories: string[] | string;
}

export class UpdateBlogDto extends PartialType(CreateBlogDto) {}

export class FilterBlogDto {
  category: string;
  search: string;
}
