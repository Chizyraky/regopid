import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import SimpleCrypto from "simple-crypto-js"

import { Student } from 'src/student/student.model';
import { Course } from 'src/models/course.model';
import { Model, QueryPopulateOptions } from 'mongoose';
import { StudentRO } from 'src/student/student.response.dto';
import { CourseRO } from 'src/dto/course.response.dto';
import { StudentDTO } from 'src/student/student.dto';
import { QrService } from '../services/qr.service';


@Injectable()
export class StudentService {

    private simpleCrypto: SimpleCrypto;
    constructor(
        @InjectModel('Student') private readonly studentModel: Model<Student>,
        @InjectModel('Course') private readonly courseModel: Model<Course>,
        private qrService: QrService,
    ) {
        this.simpleCrypto = new SimpleCrypto('secretKey');
    }

    async showAll(): Promise<StudentRO[]> {
        const students = await this.studentModel.find();
        return students.map(student => this.toResponseObject(student));
    }

    async register(data: StudentDTO): Promise<StudentRO> {
        const student = await this.studentModel.findOne({ studentId: data.studentId }).exec();
        Logger.log(student, 'Student');
        if (student) {
            throw new HttpException('User already exists.', HttpStatus.BAD_REQUEST);
        }
        const jsonStudent = JSON.stringify(data);
        const encryptedStudent = this.simpleCrypto.encrypt(jsonStudent);

        const newStudent = new this.studentModel({
            ...data,
            encryptedKey: encryptedStudent,
        });
        const result = await newStudent.save();
        Logger.log(result as StudentRO, 'Created Student')
        return this.toResponseObject(result);
    }


    private toResponseObject(student: Student): StudentRO {
        let courses;

        const studentRO: StudentRO = {
            id: student.id,
            names: student.names,
            email: student.email,
            studentId: student.studentId,
            curriculum: student.curriculum,
            encryptedKey: student.encryptedKey
        };

        if (typeof student.courses !== 'undefined') {
            const checkForCourse = student.courses.toString().split(':');
            if (checkForCourse.length > 2) {
                courses = student.courses.map((course): CourseRO =>
                    ({
                        id: course.id,
                        course_name: course.course_name,
                        curriculum: course.curriculum,
                    })
                );
                studentRO.courses = courses;
            }
        }

        console.log(studentRO);

        return studentRO;
    }
}
