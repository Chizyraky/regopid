import * as mongoose from 'mongoose';
import { Student } from '../student/student.model';
import { Lecturer } from './lecturer.model';

export const CourseSchema = new mongoose.Schema({
    course_name: { type: String, required: true },
    curriculum: { type: String },
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
        },
    ],
    lecturers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lecturer',
        },
    ],

});

export interface Course extends mongoose.Document {
    id: string;
    course_name: string;
    curriculum: string;
    students: Student[];
    lecturers: Lecturer[];
}
