import { IsString, IsNotEmpty } from 'class-validator';

export class LecturerDTO {
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    names: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export class AuthDTO {
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export class AttendanceRec {
    course_name: string;
    student_names: string;
    date: Date;
    attendance: boolean;
    student_curriculum: string;
}

export class AttendanceDTO {
    @IsNotEmpty()
    @IsString()
    encryptedKey: string;

    @IsNotEmpty()
    @IsString()
    course_id: string;
}