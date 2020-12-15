import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '@app/auth/auth.service';
import { environment } from '@env/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(request.url);
    if (!request.url.includes('student') || !request.url.includes('auth')) {
      console.log(request.url);
      request = request.clone({
        headers: this.addExtraHeaders(request.headers)
      });
    }

    console.log(request);

    return next.handle(request).pipe(
      catchError(err => {
        this.toastr.error(err.error.message || 'Internal server error', 'Error Message', {
          closeButton: true
        });
        if (err instanceof HttpErrorResponse) {
          if (err.status === 400) {
            // Handle unauthorized error
            console.log('Unauthorized');
            console.log(err.message + ' ::: ' + err.status);
            // logout() user
          } else if (err.status === 500) {
            // Handler internal server error
            console.log('Server is not responding.');
            console.log(err.message + ' ::: ' + err.status);
            // alert("Try after some time.")
          }
          // ......
        }
        return new Observable<HttpEvent<any>>();
      })
    );
  }

  private addExtraHeaders(headers: HttpHeaders): HttpHeaders {
    if (!headers.has('Authorization')) {
      headers = headers.append('Authorization', 'Bearer ' + this.auth.getToken());
    }
    return headers;
  }
}



