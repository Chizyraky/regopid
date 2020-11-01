import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorTailorModule } from '@ngneat/error-tailor';



@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
  ],
  providers: [
    AuthService,
  ]
})
export class AuthModule { }
