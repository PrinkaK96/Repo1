import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CheckRoutePermissionService implements CanActivate{

  constructor(private router: Router) { }
  canActivate(): boolean {
    if (localStorage.getItem("reqToken")) {
      if(localStorage.getItem('mem') != null){
        return true;
      }
      return true;
    } else {
      this.router.navigate(['/account/login']);
      localStorage.clear();
      return false;
    }
   
  }
}
