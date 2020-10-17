import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentComponent } from './student/student.component';
import { LecturerComponent } from './lecturer/lecturer.component';
import { LecturerProfileComponent } from './lecturer/lecturer-profile/lecturer-profile.component';
import { LoginComponent } from './auth/login/login.component';
import { AttendanceComponent } from './lecturer/attendance/attendance.component';
import { AllStudentsComponent } from './student/all-students/all-students.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'student', component: StudentComponent },
  { path: 'student/all', component: AllStudentsComponent },
  // { path: '**', redirectTo: 'student' },
  { path: 'lecturer', component: LecturerComponent },
  { path: 'lecturer/profile', component: LecturerProfileComponent },
  { path: 'lecturer/attendance', component: AttendanceComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
