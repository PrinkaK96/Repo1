import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Event, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit {
  supportLanguages = ['English', 'Portuguese'];
  constructor(
    private router: Router,
    private translateService: TranslateService
  ) {
    this.innerWidth = window.innerWidth;
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  containerMenu: any;
  innerWidth: any;
  displaySidebar: any;
  url: any;
  toggleFunction() {
    this.containerMenu = document.getElementById('containerMenu');
    this.containerMenu?.classList.toggle('openMenu');
  }
  closeToggle() {
    this.containerMenu?.classList.remove('openMenu');
  }

  toLoginForm() {
    localStorage.removeItem('reqToken');
    localStorage.clear();
    this.router.navigate(['/account/login']);
  }

  display = false;

  ngOnInit(): void { }
  closeSide(data: any) {
    this.display = data;
  }
  selectLang(lang: string) {
    this.translateService.use(lang);
  }
  createEvent() {
    this.url = localStorage.getItem('admToken')?.toString();
    localStorage.setItem('reqToken', this.url);
    this.router.navigate(['/home/organize']);
    localStorage.setItem('isAdmin', 'true');
  }
}
