import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { Course } from '@app/models/course';
import { Lecturer } from '@app/models/lecturer';
import { ApiService } from '@app/services/api.service';
import { ValidateWhitespace } from '@app/shared/utilities/validators';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-course-dialog',
  templateUrl: './add-course-dialog.component.html',
  styleUrls: ['./add-course-dialog.component.scss']
})
export class AddCourseDialogComponent implements OnInit {
  courseForm: FormGroup;
  user: Lecturer;

  referencesUpdatedSuccessfully = new Subject<any>();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<AddCourseDialogComponent>,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getUser();

    this.courseForm = this.fb.group({
      name: this.fb.control('', [Validators.required, ValidateWhitespace]),
      // tslint:disable-next-line: max-line-length
      curriculum: this.fb.control(this.user?.hasOwnProperty('curriculum') ? this.user.curriculum : '', [Validators.required, ValidateWhitespace]),
      lecturer: this.fb.control(this.user?.names, [Validators.required, ValidateWhitespace]),
    });
  }

  getUser() {
    this.user = this.authService.getUser();
    this.authService.whoami().subscribe(
      res => {
        this.user = res;
      }
    );
  }

  onSubmit() {
    const course = new Course();
    course.course_name = this.courseForm.get('name').value;
    course.curriculum = this.courseForm.get('curriculum').value;
    course.lecturers_id = [];
    course.lecturers_id.push(this.user.id);
    console.log(course);

    this.apiService.createCourse(course).subscribe(
      (res) => {
        console.log(res);
        this.toastr.success('Course was successfuly created!', 'Success');
        this.dialogRef.close();
      },
      (err) => {
        console.log(err);
        this.toastr.error(err.error.message || 'Internal server error', 'Error Message', {
          closeButton: true
        });
      }
    );
  }

}
