import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidateWhitespace, MatchPasswordValidator, MustMatch } from '../shared/utilities/validators';
import { ApiService } from '@app/services/api.service';
import { Student } from '@app/models/student';
import { Lecturer } from '@app/models/lecturer';
import { AuthService } from '@app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lecturer',
  templateUrl: './lecturer.component.html',
  styleUrls: ['./lecturer.component.scss']
})
export class LecturerComponent implements OnInit {
  lecturerForm: FormGroup;
  passwordType = 'password';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.lecturerForm = this.fb.group({
      names: this.fb.control('', [Validators.required, ValidateWhitespace]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      passwords: this.fb.group({
        password: this.fb.control('', [Validators.required, ValidateWhitespace, Validators.minLength(5)]),
        repeat: this.fb.control('', [Validators.required, ValidateWhitespace]),
      }, {
        validator: MustMatch('password', 'repeat')
      })
    });
  }


  onSubmit() {
    const newLecturer = new Lecturer();
    newLecturer.names = this.lecturerForm.get('names').value;
    newLecturer.email = this.lecturerForm.get('email').value;
    newLecturer.password = this.lecturerForm.get('passwords').get('password').value;
    this.authService.register(newLecturer).subscribe(
      (sub) => {
        this.router.navigate(['lecturer/profile']);
      }
    );

  }

}

