import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';

@Component({
  selector: 'stupa-common-svg-msg',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './common-svg-msg.component.html',
  styleUrls: ['./common-svg-msg.component.scss']
})
export class CommonSvgMsgComponent {
  isSigned: boolean = false;
  constructor(
    private router: Router,
    public encyptDecryptService: EncyptDecryptService
  ) {
    if (
      localStorage.getItem('reqToken') !== 'undefined' &&
      localStorage.getItem('reqToken') !== null
    ) {
      this.isSigned = true;
    } else {
      this.isSigned = false;
    }
  }
  //#region how do we use
  // _pageMainTitle: any = 'No Event Has Been Created M';
  // _pageSubTitle: any = 'An Event Has Not Been Created To Move To This Section For Further Configuration M';
  // _buttonTitle: any = 'Create Event M';
  // eventClicked(){

  // }
  // <stupa-common-svg-msg [_buttonTitle]="_buttonTitle" [_pageMainTitle]="_pageMainTitle"
  // (eventClicked)="eventClicked()"  [_pageSubTitle]="_pageSubTitle"></stupa-common-svg-msg> 
  //#endregion

  @Input() _pageMainTitle: any = 'No Event Has Been Created';
  @Input() _pageSubTitle: any = 'An Event Has Not Been Created To Move To This Section For Further Configuration';
  @Input() _buttonTitle: any = 'Create Event';
  @Output() eventClicked = new EventEmitter<any>();
  @Input() _showButton: boolean = true;
  eventClick() {
    this.eventClicked.emit();

  }
  login() {
    this.router.navigate(['/account/login']);
  }
}
