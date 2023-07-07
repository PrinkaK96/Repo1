import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { DateService } from 'src/app/services/DateChange/date.service';
import { VideosService } from 'src/app/services/Videos/videos.service';
import { HttpClient } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { LiveWebService } from 'src/app/services/liveWeb/live-web.service';

@Component({
  selector: 'stupa-recent-videos-view',
  templateUrl: './recent-videos-view.component.html',
  styleUrls: ['./recent-videos-view.component.scss']
})
export class RecentVideosViewComponent {
  //#region Varibles
  _skeleton: boolean = false;

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
  azureLoggerConversion: any;
  _currentEventId: any;
  data: any = [];
  _additionalUrl: any;
  liveFlag: any;
  roundDescription: any;
  categoryDescription: any;
  _allMatches: any = [];
  innerWidth: any
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  //#endregion
  constructor(public router: Router, private liveWeb: LiveWebService,
    private videosService: VideosService, private dateService: DateService, private http: HttpClient, private azureLoggerService: MyMonitoringService
  ) {
    this.innerWidth = window.innerWidth;

    // this.viewStatus();
  }

  ngOnInit(): void {
    this.data = localStorage.getItem('match_details');
    this.data = JSON.parse(this.data);
    this._additionalUrl = this.data.additional_url;
    this.liveFlag = localStorage.getItem('live-match');
    this.getRecentMatches()
  }
  //#region  This is method is  for view video
  viewMatches(match_details: any) {
    this.router.navigate(['live-matches/recent/view/' + match_details.playback_id]);
    //this.getRecentMatchesRelated(match_details);
    this.getRecentMatches()
  }
  //#endregion
  //#region Get Recent Mathes 
  getRecentMatches() {
    // this._showLoader = true;
    this._showLoader = true;
    this.liveWeb.getGlobalAllMatches().subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._assetPlaybackId = '';
        this._assetPlaybackId = window.location.href.split('/')[7]
        this._recentMatchesList = [];
        this._recentMatchesList = result.body.trending_matches.filter((x: any) => x.playback_id == this._assetPlaybackId);

        this._currentMatchId = this._recentMatchesList[0]?.match_id != undefined ? this._recentMatchesList[0]?.match_id : this.data.match_id;
        this._currentEventId = this._recentMatchesList[0]?.event_id != undefined ? this._recentMatchesList[0]?.event_id : this.data.event_id;
        this._viewCount = this._recentMatchesList[0]?.views != undefined ? this._recentMatchesList[0]?.views : this.data.views;
        this._playerAName = this._recentMatchesList[0]?.playerA != undefined ? this._recentMatchesList[0]?.playerA : this.data.playerA;
        this._playerBName = this._recentMatchesList[0]?.playerB != undefined ? this._recentMatchesList[0]?.playerB : this.data.playerB;
        this.roundDescription = this._recentMatchesList[0]?.round != undefined ? this._recentMatchesList[0]?.round : this.data.round;
        this.categoryDescription = this._recentMatchesList[0]?.category != undefined ? this._recentMatchesList[0]?.category : this.data.category;
        this._showLoader = false;
      },
      error: (result: any) => {
        this._recentMatchesList = [];
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => {
        this.updateMatchViews();
        this.getRemainingTrendingMatches()
      },
    })
  }
  //#endregion
  //#region Get Related Recent videos List 
  getRelaterdRecentMatches() {
    // this._showLoader = true;
    this._showLoader = true;

    this.videosService.getRecentMatchesListWithEvent_ID(this.dateService.fulldateFormatterInUTC(new Date()), this._currentPageNumber, 8, this.data.event_id).subscribe({
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
        this._recentRelatedMatchesList = [];
        this._relatedMatchDummyList = [];
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
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
    if (this.data.match_id !== undefined && this.data.match_id !== null) {
      this.videosService.updateMatchViews(this.data.event_id, this.data.match_id).subscribe({
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
  getRecentMatchesRelated(data: any) {
    // this._showLoader = true;
    this._showLoader = true;
    this.videosService.getRecentMatchesList(this.dateService.fulldateFormatterInUTC(new Date()), this._currentPageNumber, 4).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._assetPlaybackId = '';
        this._assetPlaybackId = window.location.href.split('/')[7]
        this._recentMatchesList = [];
        //this._recentMatchesList = result.body[1].filter((x: any) => x.asset_playback_id == this._assetPlaybackId);
        // this._currentMatchId = this.data.asset_playback_id!=null ? this._recentMatchesList[0]?.match_id : this.data.match_id;
        // this._currentEventId =  this.data.asset_playback_id!=null ? this._recentMatchesList[0]?.event_id : this.data.event_id;
        this._viewCount = data.views
        this._playerAName = data.match_details[0].participant_name;
        this._playerBName = data.match_details[1].participant_name;

        this._showLoader = false;
      },
      error: (result: any) => {
        this._recentMatchesList = [];
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => {
        this.updateMatchViews();
        this.getRelaterdRecentMatches();
      },
    })
  }
  getRemainingTrendingMatches() {
    // this._showLoader = true;
    this._showLoader = true;
    this.liveWeb.getGlobalAllMatches().subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._recentRelatedMatchesList = [];
        this._relatedMatchDummyList = [];
        this._totalLiveMatches = result.body.trending_matches.length;
        this._assetPlaybackId = window.location.href.split('/')[7]
        const index = result.body.trending_matches.findIndex((x: any) => x.playback_id == this._assetPlaybackId);
        this._recentRelatedMatchesList = result.body.trending_matches;
        this._allMatches = this._recentRelatedMatchesList.splice(index, 1);


      },
      error: (result: any) => {
        this._showLoader = false;
        this._recentRelatedMatchesList = [];
        this._relatedMatchDummyList = [];
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    })
  }

}
