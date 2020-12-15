import { Module } from '@nestjs/common';
import { CourseService } from 'src/services/course.service';
import { CourseController } from 'src/controllers/course.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseSchema } from 'src/models/course.model';
import { LecturerSchema } from 'src/models/lecturer.model';
import { StudentSchema } from 'src/student/student.model';
import { LecturerModule } from './lecturer.module';
import { AttendanceRecordSchema } from 'src/models/attendance.model';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Course', schema: CourseSchema },
            { name: 'Lecturer', schema: LecturerSchema },
            { name: 'Student', schema: StudentSchema },
            { name: 'AttendanceRecord', schema: AttendanceRecordSchema },
        ]),
        LecturerModule,
    ],
    controllers: [CourseController],
    providers: [CourseService],
    exports: [CourseService]
})
export class CourseModule { }
