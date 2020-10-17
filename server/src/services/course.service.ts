import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import SimpleCrypto from 'simple-crypto-js';
import { CourseDTO } from 'src/dto/course.dto';
import { CourseRO } from 'src/dto/course.response.dto';
import { AttendanceDTO } from 'src/dto/lecturer.dto';
import { LecturerRO } from 'src/dto/lecturer.response.dto';
import { AttendanceRecord } from 'src/models/attendance.model';
import { Course } from 'src/models/course.model';
import { Lecturer } from 'src/models/lecturer.model';
import { Student } from 'src/student/student.model';

@Injectable()
export class CourseService {

    private simpleCrypto: SimpleCrypto;
    constructor(
        @InjectModel('Course') private readonly courseModel: Model<Course>,
        @InjectModel('Lecturer') private readonly lecturerModel: Model<Lecturer>,
        @InjectModel('Student') private readonly studentModel: Model<Student>,
        @InjectModel('AttendanceRecord') private readonly attendanceRecordModel: Model<AttendanceRecord>,
    ) {
        this.simpleCrypto = new SimpleCrypto('secretKey');
    }

    async create(email: string, data: CourseDTO): Promise<CourseRO> {
        const user = await this.lecturerModel.findOne({ email }).exec();
        const course = await this.courseModel.findOne({ course_name: data.course_name }).exec();

        if (course) {
            throw new HttpException('Course already exists.', HttpStatus.BAD_REQUEST);
        }

        const newCourse = new this.courseModel({
            course_name: data.course_name,
            curriculum: data.curriculum,
        });
        newCourse.lecturers.push(user);

        const result = await newCourse.save();
        user.courses.push(result);
        await user.save();

        return result as CourseRO;
    }

    async addLecturer(data: CourseDTO) {
        const course = await this.courseModel.findOne({ course_name: data.course_name }).populate('lecturers').exec();

        const lecturers = course.lecturers.map(lect => lect.id);
        let newLecturerId = data.lecturers_id.filter(id => !lecturers.includes(id))[0];
        Logger.log(newLecturerId, 'New LEcturer ID');
        const newLecturer = await this.lecturerModel.findOne({ _id: newLecturerId }).exec();

        if (!newLecturer) {
            throw new HttpException('Lecturer doesn"t exist.', HttpStatus.BAD_REQUEST);
        }

        newLecturer.courses.push(course);
        course.lecturers.push(newLecturer);
        await newLecturer.save();
        await course.save();

        return course as CourseRO;
    }

    async registerStudent(data: AttendanceDTO) {
        const course = await this.courseModel.findOne({ _id: data.course_id }).populate('students').exec();
        if (!course) {
            throw new HttpException('Course doesn"t exist.', HttpStatus.BAD_REQUEST);
        }

        const studentJson = this.simpleCrypto.decrypt(data.encryptedKey);
        //Logger.log(studentJson, 'Student Json: ');

        const student: Student = studentJson as Student;
        //Logger.log(student, 'Student Object: ');

        if (course.students.some(obj => obj.studentId === student.studentId)) {
            throw new HttpException('Student is already Registered.', HttpStatus.BAD_REQUEST);
        }

        const studentEntity = await this.studentModel.findOne({ studentId: student.studentId });

        course.students.push(studentEntity);
        const result = await course.save();

        return this.toResponseObject(result);
    }

    async setAttendance(data: AttendanceDTO) {
        const course = await this.courseModel.findOne({ _id: data.course_id }).populate('students').exec();
        if (!course) {
            throw new HttpException('Course doesn"t exist.', HttpStatus.BAD_REQUEST);
        }

        const studentJson = this.simpleCrypto.decrypt(data.encryptedKey);
        //Logger.log(studentJson, 'Student Json: ');

        const student: Student = studentJson as Student;
        //Logger.log(student, 'Student Object: ');

        const studentEntity = await this.studentModel.findOne({ studentId: student.studentId });
    }



    // async getCourses(email: string) {
    //     const course = await this.courseModel.find({ 'lecturers._id':  }).populate('students').exec();


    // }

    private toResponseObject(course: Course): CourseRO {
        let lecturers;

        const courseRO: CourseRO = {
            id: course.id,
            course_name: course.course_name,
            curriculum: course.curriculum,
        };

        if (typeof course.lecturers !== 'undefined') {
            const checkForCourse = course.lecturers.toString().split(':');
            if (checkForCourse.length > 2) {
                lecturers = course.lecturers.map((lecturer): LecturerRO =>
                    ({
                        id: lecturer.id,
                        names: lecturer.names,
                        email: lecturer.email,
                        curriculum: lecturer.curriculum,
                    })
                );
                courseRO.lecturers = lecturers;
            } else {
                courseRO.lecturers_id = course.lecturers;
            }
        }
        console.log(courseRO);

        return courseRO;
    }
}
