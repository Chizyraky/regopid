import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@app/services/api.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ValidateWhitespace, MustMatch } from '@app/shared/utilities/validators';
import { Lecturer } from '@app/models/lecturer';
import { AuthDTO } from '@app/models/authDTO';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  passwordType = 'password';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required, ValidateWhitespace, Validators.minLength(5)]),
    });
  }

  onSubmit() {
    const loginAuth = this.loginForm.getRawValue() as AuthDTO;
    this.authService.login(loginAuth).subscribe(
      (sub) => {
        this.router.navigate(['lecturer/profile']);
      }
    );

  }

}
