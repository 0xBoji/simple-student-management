import { IsString, IsNumber, IsNotEmpty, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ example: 'Mathematics' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 8.5, minimum: 0, maximum: 10 })
  @IsNumber()
  @Min(0)
  @Max(10)
  score: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  student_id: number;
}