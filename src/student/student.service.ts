import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const student = this.studentRepository.create(createStudentDto);
    return await this.studentRepository.save(student);
  }

  async findAll(): Promise<Student[]> {
    return await this.studentRepository.find({
      relations: ['courses'],
    });
  }

  async findOne(id: number): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: ['courses'],
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  async findByName(name: string): Promise<Student[]> {
    return await this.studentRepository.find({
      where: { name: Like(`%${name}%`) },
      relations: ['courses'],
    });
  }

  async update(id: number, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id);
    Object.assign(student, updateStudentDto);
    return await this.studentRepository.save(student);
  }

  async remove(id: number): Promise<void> {
    const student = await this.findOne(id);
    await this.studentRepository.remove(student);
  }

  async calculateAverageScore(id: number) {
    const student = await this.findOne(id);
    if (!student.courses || student.courses.length === 0) {
      return {
        average: 0,
        grade: 'N/A',
        totalCourses: 0,
      };
    }

    const totalScore = student.courses.reduce(
      (sum, course) => sum + Number(course.score),
      0,
    );
    const average = totalScore / student.courses.length;

    let grade = 'F';
    if (average >= 9) grade = 'A';
    else if (average >= 8) grade = 'B';
    else if (average >= 7) grade = 'C';
    else if (average >= 5) grade = 'D';

    return {
      average: Number(average.toFixed(2)),
      grade,
      totalCourses: student.courses.length,
    };
  }
}