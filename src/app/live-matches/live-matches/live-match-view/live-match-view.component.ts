import { Component, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { DateService } from 'src/app/services/DateChange/date.service';
import { VideosService } from 'src/app/services/Videos/videos.service';
import { LiveWebService } from 'src/app/services/liveWeb/live-web.service';
import { Observable, interval } from 'rxjs';
import { catchError, map, takeWhile } from 'rxjs/operators';
@Component({
  selector: 'stupa-live-match-view',
  templateUrl: './live-match-view.component.html',
  styleUrls: ['./live-match-view.component.scss']
})
export class LiveMatchViewComponent {
  //#region Variables
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
  _currentPlayBackId: any
  _liveMatchesList: any = [];
  _relatedMatchList: any = [];
  _relatedMatchDummyList: any = [];
  _totalLiveMatches: any;
  _currentPageNumber: number = 1;
  _playerAName: any;
  _playerBName: any;
  _showLoader: boolean = false;
  isShareLink: boolean = false;
  _viewCount: number = 0;
  intervalID: any;
  azureLoggerConversion: any = new Error();
  _allMatches: any = [];
  // interval$: Observable<number>;
  numberOfCallsMade = 0;
  numberOfCallWantToMada = 50;
  //#endregion
  constructor(public router: Router, private liveWeb: LiveWebService,
    private dateService: DateService, private videosService: VideosService, private azureLoggerService: MyMonitoringService) {
    this.viewStatus();
  }
  ngOnInit(): void {
    this.getLiveMatches();
    this.getStreamStats()
  }
  ngOnChanges(changes: SimpleChanges) {
    this.getLiveMatches()
  }
  //#region This will redirect you view video
  viewMatches(match_details: any) {
    this.router.navigate(['live-matches/live/view/' + match_details.playback_id])
    this.getLiveMatches()
  }
  //#endregion
  //#region This method is used for Get List of live videos.
  getLiveMatches() {
    this._showLoader = true;
    this.liveWeb.getGlobalAllMatches().subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._currentPlayBackId = window.location.href.split('/')[7]
        this._liveMatchesList = [];
        this._liveMatchesList = result.body.live_matches.filter((x: any) => x.playback_id == this._currentPlayBackId);
        this._playerAName = this._liveMatchesList[0]?.playerA;
        this._playerBName = this._liveMatchesList[0]?.playerB
        this.getLiveMatchesList();
      },
      error: (result: any) => {
        this._liveMatchesList = [];
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => {
        this.getStreamStats()
      },
    })
  }
  //#endregion
  //#region This method is used for Get recent matches list 
  getRecentMatches() {
    this._showLoader = true;
    this.videosService.getRecentMatches(this.dateService.fulldateFormatterInUTC(new Date()), this._currentPageNumber, this._liveMatchesList[0].event_id, this._liveMatchesList[0].event_id, this._liveMatchesList[0].event_id, 8).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._currentPlayBackId = window.location.href.split('/')[7]
        this._liveMatchesList = [];
        this._relatedMatchList = [];
        this._liveMatchesList = result.body[1].find((x: any) => x.playback_id == this._currentPlayBackId)
      },
      error: (result: any) => {
        this._liveMatchesList = [];
        this._relatedMatchList = [];
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    })
  }
  //#endregion
  //#region  This Method is used for get Live mathes With minumun 8 Videos
  getLiveMatchesList() {
    this._showLoader = true;
    this.liveWeb.getGlobalAllMatches().subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._currentPlayBackId = window.location.href.split('/')[7]
        this._relatedMatchList = [];
        this._totalLiveMatches = result.body.live_matches.length;
        this._relatedMatchList = result.body.live_matches;
        const index = this._relatedMatchList.findIndex((x: any) => x.playback_id == this._currentPlayBackId);
        this._relatedMatchList = result.body.live_matches;
        this._allMatches = this._relatedMatchList.splice(index, 1);

        //this.getStreamStats();
      },
      error: (result: any) => {
        this._relatedMatchList = [];
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    })
  }
  //#endregion
  //#region This method is just for pagination
  paginate(event: any) {
    this._currentPageNumber = event.page + 1;
    this.getLiveMatchesList();
  }
  //#endregion
  //#region with this method we are able to share link on various social media
  ShareLink() {
    this.isShareLink = true;
  }
  //#endregion
  //#region With this Method we are able to get view on live video
  getStreamStats() {
    // this._showLoader = true;
    if (this._currentPlayBackId != null && this._currentPlayBackId !== '' && this._currentPlayBackId !== undefined){
      this.videosService.getStreamStats(this._currentPlayBackId).subscribe({
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
    
  }
  //#endregion
  //#region method is used hit regressive API Calling
  viewStatus() {
    this.intervalID = interval(40000)
      .pipe(catchError(error => {
        return 'Sadak Singh Sher Gill';
      }),
        map(number => {
          this.numberOfCallsMade++;
          return this.numberOfCallsMade;
        }),
        takeWhile(number => number <= this.numberOfCallWantToMada)
      );

    this.intervalID = this.intervalID.subscribe((number: any) => {
      this.getStreamStats()
    });
    // this.intervalID = setInterval(() => {
    //   this.getStreamStats()
    // }, 5000);
  }
  //#endregion method is used hit regressive API Calling

  ngOnDestroy() {
    this.intervalID.unsubscribe();
  }
}
