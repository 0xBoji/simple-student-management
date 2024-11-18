import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { StudentService } from '../student/student.service';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly studentService: StudentService,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const student = await this.studentService.findOne(createCourseDto.student_id);
    const course = this.courseRepository.create({
      ...createCourseDto,
      student,
    });
    return await this.courseRepository.save(course);
  }

  async findByStudent(studentId: number): Promise<Course[]> {
    return await this.courseRepository.find({
      where: { student_id: studentId },
      relations: ['student'],
    });
  }

  async findByNameAndStudent(
    studentId: number,
    name: string,
  ): Promise<Course[]> {
    return await this.courseRepository.find({
      where: {
        student_id: studentId,
        name: Like(`%${name}%`),
      },
      relations: ['student'],
    });
  }

  async findByScoreRange(
    studentId: number,
    minScore: number,
    maxScore: number,
  ): Promise<Course[]> {
    return await this.courseRepository.find({
      where: {
        student_id: studentId,
        score: Between(minScore, maxScore),
      },
      relations: ['student'],
    });
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['student'],
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    Object.assign(course, updateCourseDto);
    return await this.courseRepository.save(course);
  }

  async remove(id: number): Promise<void> {
    const course = await this.courseRepository.findOne({
      where: { id },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    await this.courseRepository.remove(course);
  }
}