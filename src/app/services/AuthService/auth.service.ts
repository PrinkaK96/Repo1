import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  constructor(private router: Router,private cookie :CookieService) { }

  canActivate(): boolean {
    if (localStorage.getItem("admToken")) {
      return true;
    } else {
      this.router.navigate(['/account/login']);
      localStorage.clear();
      return false;
    }
    // if (this.cookie.get("admToken")) {
    //   return true;
    // } else {
    //   this.router.navigate(['/account/login']);
    //   this.cookie.deleteAll();
    //   return false;
    // }
  }
}
