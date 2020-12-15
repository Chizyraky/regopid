import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { Attendance, AttendanceDTO, Course } from '@app/models/course';
import { ApiService } from '@app/services/api.service';
import { delay, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  attendanceList: Attendance[] = [];
  courses: Course[];
  displayedColumns: string[] = ['Date', 'Time', 'Name', 'Curriculum', 'Attended'];
  dataSource = new MatTableDataSource(this.attendanceList);
  courseIdControl = new FormControl('');

  selectedCourseId: string;
  showpop = true;
  studentEncryption: FormControl;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.apiService.getCoursesByLecturer().subscribe(res => {
      this.courses = res;
    });

    this.courseIdControl.valueChanges.pipe(
      tap(x => {
        console.log(x);
        this.apiService.getAttendance(x).subscribe(
          res => this.attendanceList = res
        );
      }
      ),
      // delay(20),
      // tap(() => this.dataSource = new MatTableDataSource(this.attendanceList)),
    );

    this.studentEncryption = this.fb.control('', [Validators.required]);

  }



  applyFilter(event: MatDatepickerInputEvent<Date>) {
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    const filterValue = event.value.toISOString().split('T')[0];
    this.dataSource.filter = filterValue;
  }

  onCourseChange() {
    console.log(this.courseIdControl.value);
    if (this.courseIdControl.value !== '') {
      this.apiService.getAttendance(this.courseIdControl.value).subscribe(
        res => {
          this.attendanceList = res;
          this.dataSource = new MatTableDataSource(this.attendanceList);
          console.log(res.map(x => new Date(x.date).toISOString()));
        },
      );
    }
  }

  getDate(data: Date) {
    const date = new Date(data);
    const today = date.getDate() + ' / ' + date.getUTCMonth() + ' / ' + date.getFullYear();
    return today;
  }

  getTime(data: Date) {
    const date = new Date(data);
    const time = date.getHours() + ' : ' + date.getMinutes();
    return time;
  }

  showPopup(courseID: string) {
    this.selectedCourseId = this.courseIdControl.value;
    this.showpop = false;
  }

  closePopup() {
    this.showpop = true;
    this.selectedCourseId = '';
  }

  registerAttendance($event) {
    const reg: AttendanceDTO = {
      course_id: this.selectedCourseId,
      encryptedKey: this.studentEncryption.value,
    };
    console.log(reg);
    this.apiService.setAttendance(reg).subscribe(
      res => {
        this.attendanceList = res;
        this.dataSource = new MatTableDataSource(this.attendanceList);
        this.toastr.success(`The attendance has been registered`, 'Success');
        this.studentEncryption = this.fb.control('', [Validators.required]);
        $event.target.value = '';
      }
    );

  }

  clearRecords() {
    this.attendanceList = [];
    this.dataSource = new MatTableDataSource(this.attendanceList);
  }


}
