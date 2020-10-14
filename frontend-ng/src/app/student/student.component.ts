import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidateWhitespace } from '../shared/utilities/validators';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { Student } from '@app/models/student';
import { ApiService } from '@app/services/api.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { QrDialogComponent } from '@app/dialogs/qr-dialog/qr-dialog.component';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  dialogRef: MatDialogRef<QrDialogComponent>;
  studentForm: FormGroup;

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value: string;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private readonly dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      names: this.fb.control('', [Validators.required, ValidateWhitespace]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      studentId: this.fb.control('', [Validators.required, ValidateWhitespace]),
      curriculum: this.fb.control('', [Validators.required, ValidateWhitespace]),
      dob: this.fb.control('', [Validators.required]),
    });
  }

  get date() { return this.studentForm.get('dob').value; }

  dateChange() {
    console.log(this.studentForm.get('dob').value);

  }

  onSubmit() {
    const newStudent = this.studentForm.getRawValue() as Student;
    console.log(newStudent);
    this.apiService.createStudent(newStudent).subscribe(
      (response) => {
        console.log(response);
        this.value = response.encryptedKey;
        this.showCoursesDialog();
      }
    );
  }

  showCoursesDialog() {
    this.dialogRef = this.dialog
      .open(QrDialogComponent, {
        height: '40%',
        width: '30%',
        closeOnNavigation: true,
        disableClose: false,
        data: this.value,
      });
    this.dialogRef.componentInstance.referencesUpdatedSuccessfully.subscribe(result => {
      // this.getCatalog(null);
    });

    this.dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`); // Pizza!
    });
  }

}
