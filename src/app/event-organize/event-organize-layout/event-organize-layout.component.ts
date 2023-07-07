import { Component, HostListener, OnInit, SimpleChanges } from '@angular/core';
import { NavigationEnd, Event, Router } from '@angular/router';

@Component({
  selector: 'app-event-organize-layout',
  templateUrl: './event-organize-layout.component.html',
  styleUrls: ['./event-organize-layout.component.scss']
})
export class EventOrganizeLayoutComponent implements OnInit {
  _isCreateEvent: boolean = false;
  _display: boolean = false;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  constructor(private router: Router) {
    
    this.innerWidth = window.innerWidth;
  }
  ngOnInit(): void {
   }
   ngOnChanges(changes: SimpleChanges) {
    
    for (const propName in changes) {
      const chng = changes[propName];
      const cur = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);
      // this.changeLog.push(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }
  }
  innerWidth: any;
  toLoginForm() {
    localStorage.removeItem('reqToken');
    localStorage.clear();
    //sessionStorage.clear()
    this.router.navigate(['/account/login']);
  }
  CreateEvent() {
    this._isCreateEvent = true;
  }
  isFirstScreen(data: any) {
    this._isCreateEvent = false
  }
}
