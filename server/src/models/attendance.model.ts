import * as mongoose from 'mongoose';
import { Student } from '../student/student.model';
import { Course } from './course.model';

export const AttendanceRecordSchema = new mongoose.Schema({
    student:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    date: { type: mongoose.Schema.Types.Date, required: true },
    attended: { type: Boolean, required: true },

});

export interface AttendanceRecord extends mongoose.Document {
    id: string;
    student: Student;
    course: Course;
    date: Date;
    attended: boolean;
}
