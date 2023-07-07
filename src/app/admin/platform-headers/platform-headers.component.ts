import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'stupa-platform-headers',
  templateUrl: './platform-headers.component.html',
  styleUrls: ['./platform-headers.component.scss']
})
export class PlatformHeadersComponent {
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
    if (managementName == 'live-setup') {
      this.router.navigate(['/admin/live-setup']);
    } else if (managementName == 'home') {
      this.router.navigate(['/admin/live-setup']);
    }
  }
  goback() {

    this.banners = false;
    this.footer = false;

  }
}
