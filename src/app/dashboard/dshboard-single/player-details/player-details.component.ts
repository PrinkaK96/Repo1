import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'stupa-player-details',
  templateUrl: './player-details.component.html',
  styleUrls: ['./player-details.component.scss']
})
export class PlayerDetailsComponent implements OnInit {
   value1: string | undefined;
  //doc = "https://stupaprodsguscentral.blob.core.windows.net/cbtm/documents/SHRUTIAADHAR.pdf"
  showDialog: boolean = false;
  doc = ['../../../assets/icons/aadhar.jpg']
  @Input() data: any;
  constructor() { }

  ngOnInit(): void {
    this.data
  }
  closePopUp() {

  }
  openDialog() {
    this.showDialog = true;
  }
}
