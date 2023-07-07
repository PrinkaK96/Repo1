import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class IsStateFedService implements CanActivate {
  constructor() { }
  canActivate(): boolean {
    if (environment.isStateFed) {
      return true;
    } else {
      return false;
    }
  }
}
