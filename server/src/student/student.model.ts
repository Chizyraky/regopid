import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { MongooseModule } from '@nestjs/mongoose';
import { Course } from '../models/course.model';

export const StudentSchema = new mongoose.Schema({
    dob: { type: Date, required: true },
    curriculum: { type: String },
    email: { type: String, required: true, unique: true },
    names: { type: String, required: true },
    studentId: { type: String, required: true, unique: true },
    encryptedKey: { type: String, required: true },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
        }
    ]
});

StudentSchema.method('compareEncryption', function (encryption: string): boolean {
    if (bcrypt.compareSync(encryption, this.encryptedKey)) { return true; }
    return false;
});

export interface Student extends mongoose.Document {
    id: string;
    dob: Date;
    curriculum: string;
    email: string;
    names: string;
    studentId: string;
    encryptedKey: string;
    courses?: Course[];
}