import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ImageDto {
  @ApiProperty({ format: 'binary' })
  image: string;
  @IsString()
  @ApiProperty()
  name: string;
  @IsOptional()
  @ApiPropertyOptional()
  alt: string;
}
