import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Course } from '@app/models/course';
import { ApiService } from '@app/services/api.service';

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
  ) { }

  ngOnInit(): void {
    this.newCourse = this.data.course;

  }

  onSubmit() {
    this.newCourse.lecturers_id.push(this.lecturer.value);
    this.apiService.addLecturerToCourse(this.newCourse).subscribe(
      res => {
        this.dialogRef.close();
      }
    );
  }

}
