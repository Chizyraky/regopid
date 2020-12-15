import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { StudentComponent } from './student/student.component';
import { MaterialModule } from './material/material.module';
import { ApiService } from './services/api.service';
import { NwbAllModule } from '@wizishop/ng-wizi-bulma';
import { MatNativeDateModule } from '@angular/material/core';
import { LecturerComponent } from './lecturer/lecturer.component';
import { AuthModule } from './auth/auth.module';
import { ErrorTailorModule } from '@ngneat/error-tailor';
import { LecturerProfileComponent } from './lecturer/lecturer-profile/lecturer-profile.component';
import { TokenInterceptor } from './shared/token.interceptor';
import { AddCourseDialogComponent } from './dialogs/add-course-dialog/add-course-dialog.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { QrDialogComponent } from './dialogs/qr-dialog/qr-dialog.component';
import { AttendanceComponent } from './lecturer/attendance/attendance.component';
import { AddLecturerDialogComponent } from './dialogs/add-lecturer-dialog/add-lecturer-dialog.component';
import { AllStudentsComponent } from './student/all-students/all-students.component';

@NgModule({
  declarations: [
    AppComponent,
    StudentComponent,
    LecturerComponent,
    LecturerProfileComponent,
    AddCourseDialogComponent,
    QrDialogComponent,
    AttendanceComponent,
    AddLecturerDialogComponent,
    AllStudentsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ErrorTailorModule.forRoot({
      errors: {
        useValue: {
          required: 'This field is required',
          minlength: ({ requiredLength, actualLength }) =>
            `Expect ${requiredLength} but got ${actualLength}`,
          email: 'Please insert valid email',
          invalidAddress: error => `Address isn't valid`,
          match: 'Passwords do not match',
          trimmed: 'Please insert valid text',
          mustMatch: 'Passwords do not match',
        }
      }
    }),
    AuthModule,
    MatNativeDateModule,
    MaterialModule,
    NwbAllModule,
    NgxQRCodeModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
  }),
  ],
  providers: [
    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [AddCourseDialogComponent, QrDialogComponent],
})
export class AppModule { }
