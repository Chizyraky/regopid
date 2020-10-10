import { Student } from './student';
import { Lecturer } from './lecturer';

export class Course {
    id?: string;
    course_name: string;
    curriculum: string;
    students?: Student[];
    lecturers?: Lecturer[];
    lecturers_id?: string[];
}

export interface AttendanceDTO {
    encryptedKey: string;
    course_id: string;
}

export class Attendance {
    course_name: string;
    student_names: string;
    date: Date;
    attendance: boolean;
    student_curriculum: string;
}
