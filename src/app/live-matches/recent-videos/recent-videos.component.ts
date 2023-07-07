import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { DateService } from 'src/app/services/DateChange/date.service';
import { VideosService } from 'src/app/services/Videos/videos.service';
import { LiveWebService } from 'src/app/services/liveWeb/live-web.service';

@Component({
  selector: 'stupa-recent-videos',
  templateUrl: './recent-videos.component.html',
  styleUrls: ['./recent-videos.component.scss']
})
export class RecentVideosComponent {
  //#region Variables
  _skeleton: boolean = false;
  _commonOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    autoplay: false,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    margin: 25,
    autoWidth: true,
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
  _recentMatchesList: any = [];
  @Output() isNoRecent = new EventEmitter<any>();
  azureLoggerConversion: any;
  //#endregion
  constructor(public router: Router, private liveWeb: LiveWebService,
    private videosService: VideosService, private dateService: DateService, private azureLoggerService: MyMonitoringService,
  ) { }
  ngOnInit(): void {
    this.getGlobalTrendingMatches();
  }
  //#region This Method is used for Get recent Matches list
  getRecentMatches() {
    // this._showLoader = true;
    this._showLoader = true;
    this.videosService.getRecentMatchesList(this.dateService.fulldateFormatterInUTC(new Date()), this._currentPageNumber, 50).subscribe({
      next: (result: any) => {
        // this._showLoader = false;
        this._showLoader = false;
        this._recentMatchesList = [];
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
          this._recentMatchesList.push(fullDetail)
        }
        this.isMatchesExist();
      },
      error: (result: any) => {
        // this._showLoader = false;
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this._recentMatchesList = [];
        this.isMatchesExist();
      },
      complete: () => { },
    })
  }
  //#endregion
  //#region this will redirect us on view video page
  viewRecent(matchDetails: any) {
    localStorage.setItem('event_id', matchDetails.event_id)
    localStorage.setItem('match_details', JSON.stringify(matchDetails))
    const home = 'live-match';
    localStorage.setItem('live-match', home);
    if (matchDetails.is_live == false && matchDetails.asset_playback_id != null && matchDetails.additional_url == null) {
      this.router.navigate(['live-matches/recent/view/' + matchDetails.asset_playback_id])
    }
    else if (matchDetails.is_live == false && matchDetails.additional_url != null) {
      this.router.navigate(['live-matches/recent/view/' + matchDetails.additional_url])
    }
    else {
      this.router.navigate(['live-matches/recent/view/' + matchDetails.playback_id])
    }
  }
  //#endregion
  isMatchesExist() {
    if (this._recentMatchesList.length == 0) {
      this.isNoRecent.emit(true)
    } else {
      this.isNoRecent.emit(false)
    }
  }

  getGlobalTrendingMatches() {
    this._showLoader = true;
    this.liveWeb.getGlobalAllMatches().subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._recentMatchesList = [];
        this._recentMatchesList = result.body.trending_matches;
        this.isMatchesExist();
      },
      error: (result: any) => {
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this._recentMatchesList = [];
        this.isMatchesExist();
      },
      complete: () => { },
    })
  }
}
