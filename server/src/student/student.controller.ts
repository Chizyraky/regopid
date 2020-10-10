import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { StudentService } from 'src/student/student.service';
import { StudentDTO } from 'src/student/student.dto';
import { StudentRO } from 'src/student/student.response.dto';

@Controller('api/student')
export class StudentController {

    constructor(private studentService: StudentService) {
    }

    @Get()
    getAllStudents(): string {
        // return await this.studentService.showAll();
        return 'Oranges';
    }

    @Post()
    async registerStudent(@Body() data: StudentDTO): Promise<StudentRO> {
        console.log('Ok')
        return await this.studentService.register(data);
    }



}
