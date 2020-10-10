import { Course } from './course';

export class Student {
    id?: string;
    email: string;
    names: string;
    studentId: string;
    curriculum: string;
    dob: Date;
    courses?: Course[];
    encryptedKey?: string;
}
