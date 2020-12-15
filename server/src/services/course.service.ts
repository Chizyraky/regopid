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
import { StudentRO } from 'src/student/student.response.dto';

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

    async getAllCourseById(id: any) {
        const courses = await this.courseModel.find({ lecturers: { $in : [id]}})
        .populate([
            {
                path: 'students',
                model: 'Student',
                select: 'studentId email names',
            },
            {
                path: 'lecturers',
                model: 'Lecturer',
                select: 'id email names',
            }
        ]
        );

        Logger.log(courses.map( course => this.toResponseObject(course)), 'courses related to this Id');
        return courses.map( course => this.toResponseObject(course));
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
        Logger.log(result, 'Saved new course');
        user.courses.push(result);
        Logger.log( await user.save(), 'Saved Lecturer');
        // await user.save();

        return result as CourseRO;
    }

    async addLecturer(data: CourseDTO) {
        const course = await this.courseModel.findOne({ course_name: data.course_name })
        .populate('lecturers')
        .exec();
        Logger.log(course, 'course');

        const courseLecturers = course.lecturers
        .map(lect => lect.id);

        Logger.log(courseLecturers, 'lecturers id');
        let newLecturerId = data.lecturers.map(lect => lect.id).filter(lect => courseLecturers.indexOf(lect) < 0)[0];
        Logger.log(newLecturerId, 'New LEcturer ID');
        const newLecturer = await this.lecturerModel.findOne({ _id: newLecturerId }).exec();
        Logger.log(newLecturer, 'New Lecturer');
        if (!newLecturer) {
            throw new HttpException('Lecturer doesn"t exist.', HttpStatus.BAD_REQUEST);
        }

        newLecturer.courses.push(course);
        Logger.log(newLecturer, 'Edited New Lecturer');
        course.lecturers.push(newLecturer);
        Logger.log(course, 'Edited course');
        Logger.log(await newLecturer.save(), 'Saved lecturer' );
        Logger.log(await course.save(), 'Saved course' );

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
        studentEntity.courses.push(course);
        await studentEntity.save();

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

    public toResponseObject(course: Course): CourseRO {
        let lecturers;
        let students;

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
        if (typeof course.students !== 'undefined') {
            const checkForCourse = course.students.toString().split(':');
            if (checkForCourse.length > 2) {
                students = course.students.map((student): StudentRO =>
                ({
                    names: student.names,
                    email: student.email,
                    studentId: student.studentId,
                })
                );
                courseRO.students = students;
            } else {
                courseRO.students = course.students;
            }
        }
        console.log(courseRO);

        return courseRO;
    }
}
