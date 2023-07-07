import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sample-view',
  templateUrl: './sample-view.component.html',
  styleUrls: ['./sample-view.component.scss']
})
export class SampleViewComponent implements OnInit {

  constructor() { }
  icons = [
    '../../../../assets/admin/footerManagement/facebook.png',
    '../../../../assets/admin/footerManagement/twitter.png',
    '../../../../assets/admin/footerManagement/linkedin.png',
    '../../../../assets/admin/footerManagement/youtube.png',
  ]
  text =[
    'Term and Conditions',
    'Privacy Policy',
    'Terms of Use',
    'Term and Conditions',
  ]

  ngOnInit(): void {
  }

}
