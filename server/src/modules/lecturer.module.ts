import { LecturerService } from './../services/lecturer.service';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { LecturerSchema } from 'src/models/lecturer.model';
import { LecturerController } from 'src/controllers/lecturer.controller';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/auth/local.strategy';
import { AttendanceRecordSchema } from 'src/models/attendance.model';
import { StudentSchema } from 'src/student/student.model';
import { CourseSchema } from 'src/models/course.model';
import { CourseModule } from './course.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Lecturer', schema: LecturerSchema },
            { name: 'Student', schema: StudentSchema },
            { name: 'Course', schema: CourseSchema },
            { name: 'AttendanceRecord', schema: AttendanceRecordSchema },
        ]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secretOrPrivateKey: 'secret',
            signOptions: { expiresIn: '7d' },
        }),
        forwardRef(() => CourseModule),
    ],
    controllers: [LecturerController],
    providers: [
        LecturerService, LocalStrategy,
    ],
    exports: [LecturerService, PassportModule, LocalStrategy],
})
export class LecturerModule { }
