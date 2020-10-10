import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocalStrategy } from 'src/auth/local.strategy';
import { AuthService } from 'src/auth/auth.service';
import { PassportModule } from '@nestjs/passport/dist/passport.module';
import { LecturerModule } from '../modules/lecturer.module';
import { LecturerService } from 'src/services/lecturer.service';
import { StudentModule } from '../student/student.module';
import { StudentService } from 'src/student/student.service';
import { CourseDTO } from 'src/dto/course.dto';
import { CourseModule } from 'src/modules/course.module';

@Module({
    imports: [
        forwardRef(() => LecturerModule),
        JwtModule.register({
            secret: process.env.SECRET,
            signOptions: { expiresIn: '7d' },
        }),
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    providers: [
        AuthService, LocalStrategy
    ],
    exports: [AuthService, PassportModule],
})
export class AuthModule { }
