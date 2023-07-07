import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  value1: string | undefined;
  //doc = "https://stupaprodsguscentral.blob.core.windows.net/cbtm/documents/SHRUTIAADHAR.pdf"
  showDialog: boolean = false;
  doc = ['../../../assets/icons/aadhar.jpg']
  @Input() data: any;
  constructor() { }

  ngOnInit(): void {
  }
  closePopUp() {

  }
  openDialog(link: any) {
    window.open(link);
    // this.showDialog = true;
  }

}
