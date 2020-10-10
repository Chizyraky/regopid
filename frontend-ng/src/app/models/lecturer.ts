import { Course } from './course';

export class Lecturer {
    id?: string;
    email: string;
    names: string;
    password: string;
    curriculum?: string;
    courses?: Course[];
    access_token?: string;
}
