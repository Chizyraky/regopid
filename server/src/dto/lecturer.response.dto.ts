import { CourseRO } from "./course.response.dto";


export class LecturerRO {
    id: string;
    email: string;
    names: string;
    curriculum?: string;
    courses?: CourseRO[];
    access_token?: string;
}