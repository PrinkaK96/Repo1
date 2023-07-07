import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { DateService } from 'src/app/services/DateChange/date.service';
import { VideosService } from 'src/app/services/Videos/videos.service';
import * as FileSaver from 'file-saver';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
@Component({
  selector: 'stupa-wtt-star-matches-view',
  templateUrl: './wtt-star-matches-view.component.html',
  styleUrls: ['./wtt-star-matches-view.component.scss']
})
export class WttStarMatchesViewComponent { //#region Varibles
  _commonOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    autoplay: false,
    touchDrag: false,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    margin: 25,
    navText: [
      '<i class="pi pi-chevron-left"></i>',
      '<i class="pi pi-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 4,
      },
    },
    nav: false,
  };
  _currentPageNumber: number = 1;
  _showLoader: boolean = false;
  _recentMatchesList: any = [];
  _recentRelatedMatchesList: any = [];
  _assetPlaybackId: any;
  _playerAName: any;
  _playerBName: any;
  _relatedMatchDummyList: any = [];
  _totalLiveMatches: any;
  isShareLink: boolean = false;
  intervalID: any;
  _viewCount: number = 0;
  _currentMatchId: any = '';
  azureLoggerConversion: any= new Error();
  _currentEventId: any;
  //#endregion
  constructor(public router: Router, private videosService: VideosService, private dateService: DateService,private azureLoggerService : MyMonitoringService) {
    // this.viewStatus();
  }

  ngOnInit(): void { this.getRecentMatches(); }
  //#region  This is method is  for view video
  viewMatches(match_details: any) {
    this.router.navigate(['live-matches/wtt-star/view/' + match_details.asset_playback_id]);
    this.getRecentMatches();
  }
  //#endregion
  //#region Get Recent Mathes 
  getRecentMatches() {
    this._showLoader = true;
    this.videosService.getRecentMatchesList(this.dateService.fulldateFormatterInUTC(new Date()), this._currentPageNumber, 4).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._assetPlaybackId = '';
        this._assetPlaybackId = window.location.href.split('/')[7]
        this._recentMatchesList = [];
        this._recentMatchesList = result.body[1].filter((x: any) => x.asset_playback_id == this._assetPlaybackId);
        this._viewCount = this._recentMatchesList[0].views;
        this._currentMatchId = this._recentMatchesList[0].match_id;
        this._currentEventId =  this._recentMatchesList[0].event_id;
        this._playerAName = this._recentMatchesList[0].match_details[0]?.participant_name;
        this._playerBName = this._recentMatchesList[0].match_details[1]?.participant_name;
        this.updateMatchViews();
        this.getRelaterdRecentMatches();
      },
      error: (result: any) => {
        this._viewCount = 0;
        this._recentMatchesList = [];
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    })
  }
  //#endregion
  //#region Get Related Recent videos List 
  getRelaterdRecentMatches() {
    this._showLoader = true;
    this.videosService.getRecentMatchesList(this.dateService.fulldateFormatterInUTC(new Date()), this._currentPageNumber, 8).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._recentRelatedMatchesList = [];
        this._relatedMatchDummyList = [];
        this._totalLiveMatches = result.body[0];
        if (result.body[1].filter((x: any) => x.asset_playback_id != this._assetPlaybackId).length > 0) {
          this._relatedMatchDummyList = result.body[1].filter((x: any) => x.asset_playback_id != this._assetPlaybackId)
          for (let i = 0; i < this._relatedMatchDummyList.length; i++) {
            const fullDetail = {
              "match_id": this._relatedMatchDummyList[i].match_id,
              "live": this._relatedMatchDummyList[i].live,
              "is_active": this._relatedMatchDummyList[i].is_active,
              "start_time": this._relatedMatchDummyList[i].start_time,
              "end_time": this._relatedMatchDummyList[i].end_time,
              "asset_playback_id": this._relatedMatchDummyList[i].asset_playback_id,
              "event_id": this._relatedMatchDummyList[i].event_id,
              "event_name": this._relatedMatchDummyList[i].event_name,
              "round_description": this._relatedMatchDummyList[i].round_description,
              "category_description": this._relatedMatchDummyList[i].category_description,
              "match_details": this._relatedMatchDummyList[i].match_details,
              "thumbnail": 'https://image.mux.com/' + this._relatedMatchDummyList[i].asset_playback_id + '/thumbnail.png?width=214&height=121&fit_mode=pad',
              "category_id": this._relatedMatchDummyList[i].category_id,
              "views": this._relatedMatchDummyList[i].views == null || this._relatedMatchDummyList[i].views == '' ? 0 : this._relatedMatchDummyList[i].views,
            }
            this._recentRelatedMatchesList.push(fullDetail)
          }
        }
      },
      error: (result: any) => {
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this._recentRelatedMatchesList = [];
        this._relatedMatchDummyList = [];
      },
      complete: () => { },
    })
  }
  //#endregion
  //#region  This method is just for pagination
  paginate(event: any) {
    this._currentPageNumber = event.page + 1;
    this.getRecentMatches();
  }
  //#endregion
  //#region Share Link On Social Media App
  ShareLink() {
    this.isShareLink = true;
  }
  //#endregion
  ngOnDestroy() {
    clearInterval(this.intervalID);
  }
  //#region Method us used for get views
  getStreamStats() {
    this.videosService.getStreamStats(this._assetPlaybackId).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._viewCount = result.body.data[0].views;
      },
      error: (result: any) => {
        this._viewCount = 0;
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    })
  }
  //#endregion Method us used for get views
  //#region method is used hit regressive API Calling
  viewStatus() {
    this.intervalID = setInterval(() => {
      this.getStreamStats()
    }, 5000);
  }
  //#endregion method is used hit regressive API Calling
  //#region method is used for download video
  downloadVideo() {
    const url = 'https://stream.mux.com/' + this._assetPlaybackId + '.m3u8';
    FileSaver.saveAs(url);
  }
  //#endregion method is used for download video
  //#region Method us used for update view in DB
  updateMatchViews() {
    if (this._currentMatchId !== undefined && this._currentMatchId !== null) {
      this.videosService.updateMatchViews(this._currentEventId,this._currentMatchId).subscribe({
        next: (result: any) => {
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      })
    }

  }
  //#endregion Method us used for update view in DB
}
