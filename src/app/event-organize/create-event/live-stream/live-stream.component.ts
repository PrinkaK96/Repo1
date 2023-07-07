import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';

@Component({
  selector: 'app-live-stream',
  templateUrl: './live-stream.component.html',
  styleUrls: ['./live-stream.component.scss'],
})
export class LiveStreamComponent implements OnInit {
  event: any;
  _quality1080: boolean = true;
  _quality720: boolean = false;
  __url = "";
  __url2 = "";
  @Output() tabIndex = new EventEmitter<number>();
  @Input() _tabIndex: any;
  constructor(private encyptDecryptService: EncyptDecryptService) { }

  selectImage(e: any) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.__url2 = event.target.result;
      }
    }
  }
  selectImage_1(e: any) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.__url = event.target.result;
      }
    }
  }

  ngOnInit(): void {
    this.event = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
  }
  ngOnChanges() {
    this.event = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
  }
  toCreateEvent(eventTab: number) { }
  eventClicked() {
    this.tabIndex.emit();
  }
  setChecked(qual: any) {
    if (qual == 1080) {
      this._quality1080 = true;
      this._quality720 = false;
    } else {
      this._quality1080 = false;
      this._quality720 = true;
    }
  }
  reset() {
    this._quality1080 = true;
    // alert("clicked");
    this.__url = "";
    this.__url2 = "";
  }
}
