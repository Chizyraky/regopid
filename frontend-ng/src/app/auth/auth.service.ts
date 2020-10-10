import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lecturer } from '@app/models/lecturer';
import { map } from 'rxjs/operators';
import { AuthDTO } from '@app/models/authDTO';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authApi: string = environment.api_server + '/auth';
  private lecturerApi: string = environment.api_server + '/lecturer';

  constructor(private http: HttpClient) { }

  register(data: Lecturer): Observable<Lecturer> {
    return this.http.post<Lecturer>(this.authApi + '/register', data).pipe(
      map((response) => {
        localStorage.setItem('lecturer_id', response.id);
        localStorage.setItem('lecturer_names', response.names);
        localStorage.setItem('lecturer_email', response.email);
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('curriculum', response.curriculum ? response.curriculum : '');

        return response;
      })
    );
  }

  login(data: AuthDTO): Observable<Lecturer> {
    return this.http.post<Lecturer>(this.authApi + '/login', data).pipe(
      map((response) => {
        localStorage.setItem('lecturer_id', response.id);
        localStorage.setItem('lecturer_names', response.names);
        localStorage.setItem('lecturer_email', response.email);
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('curriculum', response.curriculum ? response.curriculum : '');
        console.log(response.access_token);

        return response;
      })
    );
  }

  whoami(): Observable<Lecturer> {
    return this.http.get<Lecturer>(this.lecturerApi + '/whoami');
  }

  getUser() {
    const user = new Lecturer();
    user.id = localStorage.getItem('lecturer_id');
    user.names = localStorage.getItem('lecturer_names');
    user.email = localStorage.getItem('lecturer_email');
    user.curriculum = localStorage.getItem('curriculum');

    return user;
  }

  logout() {
    this.deleteToken();
  }

  getToken() {
    const token = localStorage.getItem('token');
    return token;
  }

  deleteToken() {
    localStorage.clear();
  }

  authenticate(): boolean {
    if (this.getToken()) {
      return true;
    } else {
      return false;
    }
  }
}
