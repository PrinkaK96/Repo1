import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  banners: boolean = false;
  footer: boolean = false;
  innerWidth: any
  constructor(private router: Router) {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit(): void { }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  currentMangemanet(managementName: any) {
    if (managementName == 'banners') {
      this.router.navigate(['/admin/banner']);
    } else if (managementName == 'footer') {
      this.router.navigate(['/admin/footer']);
    }
  }
  goback() {

    this.banners = false;
    this.footer = false;

  }
}
