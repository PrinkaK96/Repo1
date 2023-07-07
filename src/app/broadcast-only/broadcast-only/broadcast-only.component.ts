import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-broadcast-only',
  templateUrl: './broadcast-only.component.html',
  styleUrls: ['./broadcast-only.component.scss'],
  providers:[MessageService]
})
export class BroadcastOnlyComponent implements OnInit {
  _pageMainTitle: any = 'Under Development!';
  _pageSubTitle: any = 'We Will Get Back To you soon.';
  _buttonTitle: any = 'Create Matches';
  _tabIndex: number = 0;
  index: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.index=0;
  }
  eventClicked() {
    this.router.navigateByUrl('/home/organize');
  }
  getTabIndex(detail: any) {
    this._tabIndex = detail.index;
  }
  getliveMatchIndex(e:any){
    this.index = 1
  }
  getTournamentIndex(e:any){
    this.index = 0
  }
}
