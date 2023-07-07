import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { DateService } from 'src/app/services/DateChange/date.service';
import { VideosService } from 'src/app/services/Videos/videos.service';

@Component({
  selector: 'stupa-wtt-star-matches-list',
  templateUrl: './wtt-star-matches-list.component.html',
  styleUrls: ['./wtt-star-matches-list.component.scss']
})
export class WttStarMatchesListComponent {
  //#region Variable
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
  _eventName: any
  azureLoggerConversion: any= new Error();
  //#endregion
  constructor(public router: Router, private videosService: VideosService, private dateService: DateService,private azureLoggerService : MyMonitoringService) { }

  ngOnInit(): void {
    this.getRecentAllMatches();
  }
  //#region This method is used for Get Recent Matches List
  getRecentAllMatches() {
    this._showLoader = true;
    this.videosService.getRecentMatchesList(this.dateService.fulldateFormatterInUTC(new Date()), this._currentPageNumber, 9999999).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._recentRelatedMatchesList = [];
        this._relatedMatchDummyList = [];
        this._totalLiveMatches = result.body[0];
        this._relatedMatchDummyList = result.body[1]
        this._eventName = result.body[1][0].event_name;
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
      },
      error: (result: any) => {
        this._recentRelatedMatchesList = [];
        this._relatedMatchDummyList = [];
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    })
  }
  //#endregion
  //#region This method is used for View video 
  viewMatches(match_details: any) {
    this.router.navigate(['live-matches/wtt-star/view/' + match_details.asset_playback_id])
  }
  //#endregion
}
