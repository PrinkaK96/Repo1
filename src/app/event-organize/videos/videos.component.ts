import { Component, OnInit } from '@angular/core';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { VideosService } from 'src/app/services/Videos/videos.service';

@Component({
  selector: 'stupa-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {
  _eventId: any;
  _currentType: any;
  _tabIndex: any = 0;
  constructor(private encyptDecryptService: EncyptDecryptService, private videosService: VideosService) {

  }
  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
  }
  getTabIndex(tabIndex: any) {
    this._tabIndex = tabIndex.index;
  }

}
