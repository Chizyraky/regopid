import { Injectable, Logger, HttpStatus, HttpException, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import SimpleCrypto from "simple-crypto-js"

import { Model, QueryPopulateOptions } from 'mongoose';
import { Lecturer } from 'src/models/lecturer.model';
import { LecturerDTO, AuthDTO, AttendanceDTO, AttendanceRec } from 'src/dto/lecturer.dto';
import { LecturerRO } from 'src/dto/lecturer.response.dto';
import { CourseRO } from 'src/dto/course.response.dto';
import { Course } from 'src/models/course.model';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AttendanceRecord } from 'src/models/attendance.model';
import { Student } from 'src/student/student.model';
import * as bcrypt from 'bcryptjs';
import { StudentController } from 'src/student/student.controller';

@Injectable()
export class LecturerService {


    simpleCrypto: SimpleCrypto;
    constructor(
        @InjectModel('Lecturer') private readonly lecturerModel: Model<Lecturer>,
        @InjectModel('Student') private readonly studentModel: Model<Student>,
        @InjectModel('Course') private readonly courseModel: Model<Course>,
        @InjectModel('AttendanceRecord') private readonly attendanceRecord: Model<AttendanceRecord>,
        private readonly jwtService: JwtService,
    ) {
        this.simpleCrypto = new SimpleCrypto('secretKey');
    }

    async showAll(): Promise<LecturerRO[]> {
        const lecturers = await this.lecturerModel.find();
        return lecturers.map(lect => this.toResponseObject(lect));
    }

    async read(email: string) {
        const user = await this.lecturerModel.findOne({ email }, { password: 0 })
            .populate([
                {
                    path: 'courses',
                    model: 'Course',
                    select: 'course_name curriculum lecturers',
                    populate: {
                        path: 'students',
                        model: 'Student',
                        select: 'names studentId email'
                    },
                },
            ])
            .exec();
        Logger.log(user, 'USER');

        return this.toResponseObject(user);
    }

    async validateUser(data: AuthDTO) {
        const user = await this.lecturerModel.findOne({ email: data.email }).exec();
        Logger.log(user, 'Login User');

        if (!user) {
            throw new HttpException('No User Found.', HttpStatus.NOT_FOUND);
        }
        if (!user.comparePassword(data.password)) {
            throw new HttpException('Invalid Password!!', HttpStatus.BAD_REQUEST);
        }
        // await user.populate('ideas');
        const { password, ...result } = user;    // use a convenient ES6 spread operator
        // to strip the password property from the user object before returning it
        return this.toResponseObject(user);
    }

    async register(data: LecturerDTO): Promise<LecturerRO> {
        const lecturer = await this.lecturerModel.findOne({ email: data.email }).exec();
        if (lecturer) {
            throw new HttpException('User already exists.', HttpStatus.BAD_REQUEST);
        }
        const newLecturer = new this.lecturerModel({
            email: data.email,
            names: data.names,
            password: data.password,
        });
        const result = await newLecturer.save();
        Logger.log(result as LecturerRO, 'Created Lecturer')
        const payload = {
            email: result.email,
            sub: result.id
        };
        return {
            id: result.id,
            email: result.email,
            names: result.names,
            access_token: this.jwtService.sign(payload, { algorithm: 'HS256' }),
        } as LecturerRO;
    }

    async login(data: any): Promise<LecturerRO> {
        const user = await this.validateUser(data);
        // console.log(JSON.stringify(user));
        const payload = { email: user.email, sub: user.id };
        // console.log(JSON.stringify(payload));
        return {
            id: user.id,
            email: user.email,
            names: user.names,
            curriculum: user.curriculum,
            courses: user.courses,
            access_token: this.jwtService.sign(payload, { algorithm: 'HS256' }),
        } as LecturerRO;
    }

    async setAttendance(data: AttendanceDTO) {
        // const user = await this.lecturerModel.findOne({ email }).exec();

        const course = await this.courseModel.findOne({ _id: data.course_id }).populate('students').exec();
        if (!course) {
            throw new HttpException('Course doesn"t exist.', HttpStatus.BAD_REQUEST);
        }

        const studentJson = this.simpleCrypto.decrypt(data.encryptedKey);
        Logger.log(studentJson, 'Student Json: ');

        const student: Student = studentJson as Student;
        Logger.log(student, 'Student Object: ');

        if (!course.students.some(student => student.studentId === student.studentId)) {
            throw new HttpException('Student is not Registered.', HttpStatus.BAD_REQUEST);
        }

        const studentEntity = await this.studentModel.findOne({ studentId: student.studentId });
        const newAttendance = new this.attendanceRecord({
            course: course,
            student: studentEntity,
            date: new Date(),
            attended: true,
        });

        const result = await newAttendance.save();

        return result;
    }

    async getAttendance(course_id: string): Promise<AttendanceRec[]> {
        const course = await this.courseModel.findOne({ _id: course_id }).populate('students').exec();
        Logger.log(course_id, 'Data');
        Logger.log(course, 'Course');
        if (!course) {
            Logger.log(course_id, 'Data');
            Logger.log(course, 'Course');
            throw new HttpException('Course doesn"t exist.', HttpStatus.BAD_REQUEST);
        }
        const records = await this.attendanceRecord.find({ course: course });
        Logger.log(records, 'Records');
        const compRecords: AttendanceRec[] = [];
        for (let record of records) {
            const student = await this.studentModel.findOne({ _id: record.student });
            console.log(student);
            const newRec: AttendanceRec = new AttendanceRec();
            newRec.course_name = course.course_name;
            newRec.student_names = student.names;
            newRec.student_curriculum = student.curriculum;
            newRec.date = new Date(record.date);
            newRec.attendance = record.attended;
            compRecords.push(newRec);
        };
        console.log(compRecords);

        return compRecords;
    }

    private toResponseObject(lecturer: Lecturer): LecturerRO {
        let courses;

        const lecturerRO: LecturerRO = {
            id: lecturer.id,
            names: lecturer.names,
            email: lecturer.email,
            curriculum: lecturer.curriculum,
        };

        if (typeof lecturer.courses !== 'undefined') {
            const checkForCourse = lecturer.courses.toString().split(':');
            if (checkForCourse.length > 2) {
                Logger.log(lecturer.courses)
                courses = lecturer.courses.map((course): CourseRO =>
                    ({
                        id: course.id,
                        course_name: course.course_name,
                        curriculum: course.curriculum,
                        students: course.students,
                        lecturers_id: course.lecturers,
                    })
                );
                lecturerRO.courses = courses;
            }
        }

        return lecturerRO;
    }
}
