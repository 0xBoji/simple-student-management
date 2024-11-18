import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
  } from '@nestjs/common';
  import { CourseService } from './course.service';
  import { CreateCourseDto } from './dto/create-course.dto';
  import { UpdateCourseDto } from './dto/update-course.dto';
  
  @Controller('courses')
  export class CourseController {
    constructor(private readonly courseService: CourseService) {}
  
    @Post()
    create(@Body() createCourseDto: CreateCourseDto) {
      return this.courseService.create(createCourseDto);
    }
  
    @Get('student/:studentId')
    findByStudent(
      @Param('studentId') studentId: string,
      @Query('name') name?: string,
      @Query('minScore') minScore?: number,
      @Query('maxScore') maxScore?: number,
    ) {
      if (name) {
        return this.courseService.findByNameAndStudent(+studentId, name);
      }
      if (minScore !== undefined && maxScore !== undefined) {
        return this.courseService.findByScoreRange(+studentId, minScore, maxScore);
      }
      return this.courseService.findByStudent(+studentId);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
      return this.courseService.update(+id, updateCourseDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.courseService.remove(+id);
    }
  }