import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @ApiProperty()
  title: string;
  @ApiPropertyOptional()
  priority: number;
}

