import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Course } from '@app/models/course';
import { Lecturer } from '@app/models/lecturer';
import { ApiService } from '@app/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-lecturer-dialog',
  templateUrl: './add-lecturer-dialog.component.html',
  styleUrls: ['./add-lecturer-dialog.component.scss']
})
export class AddLecturerDialogComponent implements OnInit {

  newCourse: Course;
  lecturer = new FormControl('', Validators.required);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<AddLecturerDialogComponent>,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.newCourse = this.data.course;

  }

  onSubmit() {
    const lect = this.lecturer.value as Lecturer;
    this.newCourse.lecturers.push(lect);
    this.apiService.addLecturerToCourse(this.newCourse).subscribe(
      res => {
        this.toastr.success(`${lect.names} has been added as a lecturer to ${this.newCourse.course_name}.`, 'Success!');
        this.dialogRef.close();
      }
    );
  }

  optionDisabled(food: any) {
    return this.newCourse.lecturers.some(x => x.names === food.names);
  }

}
