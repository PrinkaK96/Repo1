import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  favIcon: any = document.querySelector('#appIcon');
  banners: boolean = false;
  footer: boolean = false;
  innerWidth: any
  constructor(private router: Router) {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit(): void {
  }
  currentMangemanet(managementName: any) {
    if (managementName == 'banners') {
      this.router.navigate(['/admin/player']);
    } else if (managementName == 'footer') {
      this.router.navigate(['/admin/club']);
    }
  }
  goback() {

    this.banners = false;
    this.footer = false;

  }


}
