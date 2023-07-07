import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { DateService } from 'src/app/services/DateChange/date.service';
import { VideosService } from 'src/app/services/Videos/videos.service';

@Component({
  selector: 'stupa-wtt-star-cont',
  templateUrl: './wtt-star-cont.component.html',
  styleUrls: ['./wtt-star-cont.component.scss']
})
export class WttStarContComponent {
  //#region  Variable
  _commonOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    autoplay: false,
    touchDrag: false,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    margin: 25,
    autoWidth:true, 
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
  _liveMatchesList: any = [];
  _showLoader: boolean = false;
  _currentPageNumber: number = 1;
  _recentEventsList: any = [];
  _eventName: any;
  azureLoggerConversion: any= new Error();
  @Output() isNoWTT = new EventEmitter<any>();
  //#endregion
  constructor(public router: Router, private videosService: VideosService, private dateService: DateService,private azureLoggerService : MyMonitoringService) { }
  ngOnInit(): void { this.getRecentStreamedEvents(); }
  //#region  Get Recent Streamed Videos list
  getRecentStreamedEvents() {
    this._showLoader = true;
    this.videosService.getRecentStreamedEvents(this.dateService.fulldateFormatterInUTC(new Date()), this._currentPageNumber, 50).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._recentEventsList = result.body[1]
        if (result.body[1].length > 0) {
          this.getEventRecentMatches(result.body[1][0].event_id);
        }
      },
      error: (result: any) => {
        this._showLoader = false;
        this._recentEventsList = [];
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    })
  }
  //#endregion
  //#region Get Event Recent Matches 
  getEventRecentMatches(event_id: any) {
    this._showLoader = true;
    this.videosService.getEventRecentMatchesList(this.dateService.fulldateFormatterInUTC(new Date()), this._currentPageNumber, 50, event_id).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._recentEventsList = [];
        this._eventName = result.body[1][0].event_name;
        for (let i = 0; i < result.body[1].length; i++) {
          const fullDetail = {
            "match_id": result.body[1][i].match_id,
            "live": result.body[1][i].live,
            "is_active": result.body[1][i].is_active,
            "start_time": result.body[1][i].start_time,
            "end_time": result.body[1][i].end_time,
            "asset_playback_id": result.body[1][i].asset_playback_id,
            "event_id": result.body[1][i].event_id,
            "event_name": result.body[1][i].event_name,
            "round_description": result.body[1][i].round_description,
            "category_description": result.body[1][i].category_description,
            "match_details": result.body[1][i].match_details,
            "thumbnail": 'https://image.mux.com/' + result.body[1][i].asset_playback_id + '/thumbnail.png?width=214&height=121&fit_mode=pad',
            "category_id": result.body[1][i].category_id,
            "views": result.body[1][i].views == null || result.body[1][i].views == '' ? 0 : result.body[1][i].views,
          }
          this._recentEventsList.push(fullDetail)
        }
        this.isMatchesExist();
      },
      error: (result: any) => {
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this._recentEventsList = [];
        this.isMatchesExist();
      },
      complete: () => { },
    })
  }
  //#endregion
  //#region This will redirect us view page
  viewRecent(matchDetails: any) {
    this.router.navigate(['live-matches/wtt-star/view/' + matchDetails.asset_playback_id]);
  }
  //#endregion

  isMatchesExist() {
    if (this._recentEventsList.length == 0) {
      this.isNoWTT.emit(true)
    } else {
      this.isNoWTT.emit(false)
    }
  }
}
