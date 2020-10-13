import { Controller, Body, Get, Post, UseGuards, forwardRef, Inject, Logger, Param, Query } from '@nestjs/common';
import { LecturerService } from 'src/services/lecturer.service';
import { StudentDTO } from 'src/student/student.dto';
import { StudentRO } from 'src/student/student.response.dto';
import { LecturerDTO, AuthDTO, AttendanceDTO, AttendanceRec } from 'src/dto/lecturer.dto';
// import { AuthGuard } from 'src/shared/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Lecturer } from 'src/shared/lecturer.decorator';
import { AuthService } from 'src/auth/auth.service';
import { LecturerRO } from 'src/dto/lecturer.response.dto';
import { AuthGuard } from '@nestjs/passport';
import { map } from 'rxjs/operators';
import { CourseRO } from 'src/dto/course.response.dto';

@Controller('api')
export class LecturerController {

    constructor(
        private lecturerService: LecturerService,
        private readonly jwtService: JwtService,
        // @Inject(forwardRef(() => AuthService))
        // private readonly authService: AuthService,
    ) { }

    @Post('auth/register')
    async registerLecturers(@Body() data: LecturerDTO): Promise<LecturerRO> {
        console.log('register');
        const res = await this.lecturerService.register(data);
        return res;
    }

    @Post('auth/login')
    async loginLecturers(@Body() data: AuthDTO): Promise<LecturerRO> {
        console.log('login');
        console.log(process.env.SECRET);
        const res = await this.lecturerService.login(data);
        return res;
    }

    @Get()
    @UseGuards()
    async getAllLecturers() {
        return await this.lecturerService.showAll();
    }

    @Get('lecturer/whoami')
    @UseGuards(AuthGuard())
    async showMe(@Lecturer('email') email) {
        Logger.log(email);
        return await this.lecturerService.read(email);
    }

    @Post('lecturer/attendance')
    @UseGuards(AuthGuard())
    async setAttendance(@Lecturer('email') email, @Body() data: AttendanceDTO) {
        await this.lecturerService.setAttendance(data);
        return this.lecturerService.getAttendance(data.course_id);
    }

    @Get('lecturer/attendance')
    @UseGuards(AuthGuard())
    async getAttendance(@Query('course') course_id: string): Promise<AttendanceRec[]> {
        console.log(course_id);
        return await this.lecturerService.getAttendance(course_id);
    }

    @Get('lecturer/courses')
    @UseGuards(AuthGuard())
    async getCourses(@Lecturer('email') email): Promise<CourseRO[]> {
        const lecturer = await this.lecturerService.read(email);
        return lecturer.courses;
    }

}
