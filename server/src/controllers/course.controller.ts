import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { identity } from 'rxjs';
import { CourseDTO } from 'src/dto/course.dto';
import { AttendanceDTO } from 'src/dto/lecturer.dto';
import { CourseService } from 'src/services/course.service';
import { Lecturer } from 'src/shared/lecturer.decorator';

@Controller('api/course')
export class CourseController {

    constructor(
        private courseService: CourseService,
        // @Inject(forwardRef(() => AuthService))
        // private readonly authService: AuthService,
    ) { }

    @Get()
    @UseGuards(AuthGuard())
    async getById(@Lecturer('id') id) {
        return this.courseService.getAllCourseById(id);
    }

    @Post()
    @UseGuards(AuthGuard())
    async create(@Lecturer('email') email, @Body() data: CourseDTO) {
        return this.courseService.create(email, data);
    }

    @Post('register')
    @UseGuards(AuthGuard())
    async registerStudent(@Body() data: AttendanceDTO) {
        return await this.courseService.registerStudent(data);
    }

    @Post('addLecturer')
    @UseGuards(AuthGuard())
    async addLecturer(@Body() data: CourseDTO) {
        Logger.log(data, 'CourseDTO Object: ');
        return await this.courseService.addLecturer(data);
    }


}
