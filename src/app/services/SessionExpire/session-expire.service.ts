import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessionExpireService {
  constructor(private router: Router) { }
  isSectionExpire(data: any): boolean {
    if (data !== 'Session Expired.') {
      return true;
    } else {
      localStorage.removeItem('reqToken');
      localStorage.clear();
      this.router.navigate(['/account/login']);
      return false;
    }
  }
}
