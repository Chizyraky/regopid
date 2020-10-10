import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend-ng';
  currentUrl: string;
  loggedIn: boolean;
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.currentUrl = val.urlAfterRedirects;
        this.loggedIn = this.checkAuth();
        console.log(val);
      }
    });
  }


  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.loggedIn = this.checkAuth();
    console.log(this.router.url);
    console.log(this.checkAuth());
  }

  changeUrl(url: string) {
    this.currentUrl = url;
  }

  checkAuth() {
    return this.authService.authenticate();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.currentUrl = '/';
  }

}
