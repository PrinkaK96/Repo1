import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer-management',
  templateUrl: './footer-management.component.html',
  styleUrls: ['./footer-management.component.scss']
})
export class FooterManagementComponent implements OnInit {

  constructor(private router:Router) { }
  goback(){
    this.router.navigate(['/admin/settings'])
  }
  ngOnInit(): void {
  }

}
