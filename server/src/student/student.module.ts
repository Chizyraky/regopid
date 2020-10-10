import { StudentService } from './student.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentSchema } from 'src/student/student.model';
import { CourseSchema } from 'src/models/course.model';
import { StudentController } from 'src/student/student.controller';
import { QrService } from 'src/services/qr.service';
import { AesGcmService, AesGcmModule } from '@nestrx/aes-gcm';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Student', schema: StudentSchema },
            { name: 'Course', schema: CourseSchema },
        ]),
    ],
    controllers: [StudentController],
    providers: [
        StudentService,
        QrService,
    ],
    exports: [StudentService],
})
export class StudentModule { }
