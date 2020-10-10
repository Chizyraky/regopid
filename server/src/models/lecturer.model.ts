import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Course } from './course.model';

export const LecturerSchema = new mongoose.Schema({
    curriculum: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: true },
    names: { type: String, required: true },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
        }
    ]

});

LecturerSchema.pre<Lecturer>('save', function (next) {
    const lecturer = this;
    // only hash the password if it has been modified (or is new)
    if (!lecturer.isModified('password')) {
        return next();
    }
    lecturer.password = bcrypt.hashSync(lecturer.password, 10);
    next();
});

LecturerSchema.method('comparePassword', function (password: string): boolean {
    if (bcrypt.compareSync(password, this.password)) { return true; }
    return false;
});

export interface Lecturer extends mongoose.Document {
    id: string;
    email: string;
    password: string;
    names: string;
    curriculum: string;
    courses: Course[];

    comparePassword(password: string): boolean;

}