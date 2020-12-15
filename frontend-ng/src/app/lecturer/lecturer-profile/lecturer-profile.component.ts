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
import { AddLecturerDialogComponent } from '@app/dialogs/add-lecturer-dialog/add-lecturer-dialog.component';
import { ToastrService } from 'ngx-toastr';

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
  addLecturerRef: MatDialogRef<AddLecturerDialogComponent>;
  @ViewChild('encryption') encryptionElement: ElementRef;
  @ViewChild('popup') popupElement: ElementRef;
  studentEncryption: FormControl;
  selectedCourseId: string;
  showpop = true;

  dataSource: Course[];
  columnsToDisplay = ['course_name', 'curriculum'];
  expandedElement: Course | null;

  lecturersList: Lecturer[];

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private readonly dialog: MatDialog,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getUser();
    this.getAllLecturers();
    this.studentEncryption = this.fb.control('', [Validators.required]);
  }

  getUser() {
    this.apiService.getCoursesByLecturer().subscribe(
      (res: Course[]) => {
        this.dataSource = res;
        console.log(this.dataSource);
      },
      (err) => {
        this.toastr.error(err.error.message || 'Internal server error', 'Error Message', {
        closeButton: true
      });
    }
    );

    this.authService.whoami().subscribe(
      res => {
        this.user = res;
        console.log(this.user);
        // this.dataSource = res.courses;
        // console.log(this.dataSource);
        // this.expandedElement = res.courses.
      }
    );

    
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
      res => {;
        this.toastr.success('Student successfuly registered!', 'Success');
        this.studentEncryption = this.fb.control('', [Validators.required]);
      }
    );

  }

  getAllLecturers() {
    this.apiService.getAllLecturers().subscribe(
      res => {
        this.lecturersList = res;
        console.log(res);
      },
      err => {
        this.toastr.error(err.error.message || 'Internal server error', 'Error Message', {
          closeButton: true
        });
      }
    )
  }

  showAddLecturerDialog(courseData: Course) {
    this.addLecturerRef = this.dialog
      .open(AddLecturerDialogComponent, {
        height: '300px',
        width: '420px',
        closeOnNavigation: false,
        data: {
          lecturers: this.lecturersList,
          course: courseData,
          user: this.user,
        }
      });
  }

}
