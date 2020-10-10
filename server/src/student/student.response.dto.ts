import { CourseRO } from "../dto/course.response.dto";


export class StudentRO {
    id?: string;
    email: string;
    names: string;
    studentId: string;
    dob?: Date;
    curriculum?: string;
    courses?: CourseRO[];
    encryptedKey?: string;
}

export class StudentDTO {
    email: string;
    names: string;
    studentId: string;
    dob?: Date;
    curriculum?: string;
    courses?: CourseRO[];
}