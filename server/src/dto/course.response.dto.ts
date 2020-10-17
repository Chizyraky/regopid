import { StudentRO } from "../student/student.response.dto";
import { LecturerRO } from "./lecturer.response.dto";

export class CourseRO {
    id: string;
    course_name: string;
    curriculum?: string;
    students?: StudentRO[];
    lecturers?: LecturerRO[];
    lecturers_id?: any[];
}
