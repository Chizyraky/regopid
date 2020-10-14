import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AuthService } from '@app/auth/auth.service';
import { AddCourseDialogComponent } from '@app/dialogs/add-course-dialog/add-course-dialog.component';
import { AttendanceDTO, Course } from '@app/models/course';
import { Lecturer } from '@app/models/lecturer';
import { Student } from '@app/models/student';
import { ApiService } from '@app/services/api.service';

@Component({
  selector: 'app-lecturer-profile',
  templateUrl: './lecturer-profile.component.html',
  styleUrls: ['./lecturer-profile.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class LecturerProfileComponent implements OnInit {

  user: Lecturer;
  dialogRef: MatDialogRef<AddCourseDialogComponent>;
  @ViewChild('encryption') encryptionElement: ElementRef;
  @ViewChild('popup') popupElement: ElementRef;
  studentEncryption: FormControl;
  selectedCourseId: string;
  showpop = true;

  dataSource: Course[];
  columnsToDisplay = ['course_name', 'curriculum'];
  expandedElement: Course | null;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private readonly dialog: MatDialog,
    private fb: FormBuilder,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    this.getUser();

  }

  getUser() {
    this.authService.whoami().subscribe(
      res => {
        this.user = res;
        console.log(this.user);
        this.dataSource = res.courses;
        // this.expandedElement = res.courses.
      }
    );

    this.studentEncryption = this.fb.control('', [Validators.required]);
  }

  showCoursesDialog() {
    this.dialogRef = this.dialog
      .open(AddCourseDialogComponent, {
        // minHeight: 460,
        // minWidth: 505,
        height: '470px',
        width: '420px',
        // disableClose: true,
        closeOnNavigation: false,
      });
    this.dialogRef.componentInstance.referencesUpdatedSuccessfully.subscribe(result => {
      // this.getCatalog(null);
    });

    this.dialogRef.afterClosed().subscribe(result => {
      this.getUser();
      console.log(`Dialog result: ${result}`); // Pizza!
      console.log(this.user); // Pizza!
    });
  }

  showPopup(courseID: string) {
    this.selectedCourseId = courseID;
    this.showpop = false;
  }

  closePopup() {
    this.showpop = true;
    this.selectedCourseId = '';
  }

  registerStudent() {
    const reg: AttendanceDTO = {
      course_id: this.selectedCourseId,
      encryptedKey: this.studentEncryption.value,
    };
    console.log(reg);
    this.apiService.registerStudent(reg).subscribe(
      res => {
        console.log(res);
        this.studentEncryption = this.fb.control('', [Validators.required]);
      }
    );

  }

}
