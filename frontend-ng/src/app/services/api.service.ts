import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Student } from '../models/student';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Attendance, AttendanceDTO, Course } from '@app/models/course';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private api: string = environment.api_server;

  constructor(private http: HttpClient) { }

  createStudent(data: Student): Observable<Student> {
    return this.http.post<Student>(this.api + '/student', data);
  }

  createCourse(data: Course): Observable<Course> {
    console.log(data);
    return this.http.post<Course>(this.api + '/course', data);
  }

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.api + '/student');
  }

  registerStudent(data: AttendanceDTO) {
    return this.http.post<Course>(this.api + '/course/register', data);
  }

  getAttendance(course_id: string, date?: Date) {
    const daf = new HttpParams().set('course', course_id);
    // if (date) {
    //   params.set('date', date.toString());
    // }
    return this.http.get<Attendance[]>(this.api + '/lecturer/attendance', { params: daf });
  }

  setAttendance(data: AttendanceDTO) {
    return this.http.post<Attendance[]>(this.api + '/lecturer/attendance', data);
  }

  getLecturerCouses() {
    return this.http.get<Course[]>(this.api + '/lecturer/courses');
  }
}
