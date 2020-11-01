import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { LecturerDTO } from './lecturer.dto';
import { LecturerRO } from './lecturer.response.dto';

export class CourseDTO {
    @IsOptional()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    course_name: string;

    @IsNotEmpty()
    @IsString()
    curriculum: string;

    @IsOptional()
    @IsArray()
    lecturers_id: string[];

    @IsOptional()
    @IsArray()
    lecturers: LecturerRO[];
}
