import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteAuthService implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): boolean {
    // if (localStorage.getItem("memberStatus") == 'YES' && localStorage.getItem("rl")!= '7') {
    if (localStorage.getItem("memberStatus") == 'YES') {
      return true;
    } else {
      this.router.navigate(['/home/buy-membership']);
      return false;
    }
  }

}
