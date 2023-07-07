import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { VideosService } from 'src/app/services/Videos/videos.service';

@Component({
  selector: 'stupa-live-videos',
  templateUrl: './live-videos.component.html',
  styleUrls: ['./live-videos.component.scss'],
  providers:[MessageService]
})
export class LiveVideosComponent {
  @Output() tabIndex = new EventEmitter<number>();
  _skeleton:boolean=false
  two=[1,2];
  three=[1,1,1]
  event_id: any;
  _liveMatchesList: any = [];
  _liveMatchesListCopy: any = [];
  _showLoader: boolean = false;
  @Input() _tabIndex: any
  _showVideoOnFullScreen: boolean = false;
  _currentPlayBackId: any;
  _playerAName: any;
  _playerBName: any;
  _participantTypeName: any;
  _categoryName: any;
  azureLoggerConversion: any=new Error();
  _searchByPlayerName: any='';
  constructor(private encyptDecryptService: EncyptDecryptService, private router: Router, private videosService: VideosService,
    private azureLoggerService : MyMonitoringService, private messageService: MessageService) {
  }
  ngOnInit(): void {
    this.event_id = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this.getEventLiveMatches();
  }
  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const chng = changes[propName];
      const cur = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);
      // this.changeLog.push(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }
    this.getEventLiveMatches();
  }
  eventClicked() {
    this.router.navigateByUrl('/event/create-event');
  }
  getEventLiveMatches() {
    if (this.event_id != undefined || this.event_id != null) {
    this._showLoader = true;
    this.videosService.getEventLiveMatches(this.event_id).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._liveMatchesList = [];
        for (let i = 0; i < result.body.length; i++) {
          const videosDetails = {
            "match_id": result.body[i].match_id,
            "round_description": result.body[i].round_description,
            "playback_id": result.body[i].playback_id,
            "asset_playback_id": result.body[i].asset_playback_id,
            "participants": result.body[i].participants,
            "published": result.body[i].published,
            "thumbnail": 'https://image.mux.com/' + result.body[i].playback_id + '/thumbnail.png?width=214&height=121&fit_mode=pad'
          }
          this._liveMatchesList.push(videosDetails);
          this._liveMatchesListCopy.push(videosDetails);
        }
        // this._liveMatchesList = result.body;
      },
      error: (result: any) => {
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    });
  }
  }
  viewVideo(item: any) {
    this._currentPlayBackId = item.playback_id;
    this._showVideoOnFullScreen = true;
    this._playerAName = item.participants[0];
    this._playerBName = item.participants[1];
  }
  closePopUp() {
    this._showVideoOnFullScreen = false;
  }
  searchPlayer() {
    this._liveMatchesList = this._liveMatchesListCopy.filter((item: any) => {
      return (
        item.participants[0]
          .toLowerCase()
          .includes(this._searchByPlayerName.toLowerCase()) ||
        item.participants[1]
          .toLowerCase()
          .includes(this._searchByPlayerName.toLowerCase())
      );
    });
  }
  publishStreamedVideos(data:any , flag:any){
    if (this.event_id !== undefined && this.event_id !== null) {
      this.videosService.updateVideosStatus(this.event_id, data.match_id,flag).subscribe({
        next: (result: any) => {
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: flag===true ? 'Video published successfully' : 'Video unpublished successfully' ,
            life: 3000,
          });
          this.getEventLiveMatches();
        },
        error: (result: any) => { 
          this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      });
    }
}
}
