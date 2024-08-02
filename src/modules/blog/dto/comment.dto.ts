import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsNumberString, IsOptional, Length } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @Length(10, 250)
  text: string;
  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  parentId: number;
  @ApiProperty()
  @IsNumberString()
  blogId: number;
}
