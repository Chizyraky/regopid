import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class CourseDTO {
    @IsNotEmpty()
    @IsString()
    course_name: string;

    @IsNotEmpty()
    @IsString()
    curriculum: string;

    @IsNotEmpty()
    @IsArray()
    lecturers_id: string[];
}
