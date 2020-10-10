import { IsString, IsNotEmpty, IsEmail, IsOptional, IsDate } from 'class-validator';

export class StudentDTO {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    names: string;

    @IsNotEmpty()
    @IsString()
    curriculum: string;

    @IsNotEmpty()
    @IsString()
    studentId: string;

    @IsNotEmpty()
    @IsDate()
    dob: Date

}