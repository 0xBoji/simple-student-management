import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Course } from '../../course/entities/course.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column({ type: 'date' })
  dob: Date;

  @OneToMany(() => Course, (course) => course.student, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  courses: Course[];
}