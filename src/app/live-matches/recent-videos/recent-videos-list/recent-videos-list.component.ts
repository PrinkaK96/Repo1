import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { DateService } from 'src/app/services/DateChange/date.service';
import { VideosService } from 'src/app/services/Videos/videos.service';
import { LiveWebService } from 'src/app/services/liveWeb/live-web.service';

@Component({
  selector: 'stupa-recent-videos-list',
  templateUrl: './recent-videos-list.component.html',
  styleUrls: ['./recent-videos-list.component.scss']
})
export class RecentVideosListComponent {
  //#region Variable
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
  azureLoggerConversion: any = new Error();
  p: any;
  _recentRelatedMatchesListCopy: any = [];
  searchedString: any = ''
  innerWidth: any
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  //#endregion
  constructor(public router: Router, private liveWeb: LiveWebService,
    private videosService: VideosService, private dateService: DateService, private azureLoggerService: MyMonitoringService) {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.getRecentAllMatches();
  }
  //#region This method is used for Get Recent Matches List
  getRecentAllMatches() {
    this._showLoader = true;
    this._showLoader = true;
    this.liveWeb.getGlobalAllMatches().subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._recentRelatedMatchesList = [];
        this._relatedMatchDummyList = [];
        this._totalLiveMatches = result.body.trending_matches.length;
        this._recentRelatedMatchesList = result.body.trending_matches;
        this._recentRelatedMatchesListCopy = result.body.trending_matches;




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
    localStorage.setItem('match_details', JSON.stringify(match_details))
    const home = 'live-match-list';
    localStorage.setItem('live-match', home);

    if (match_details.is_live == null && match_details.asset_playback_id != null && match_details.additional_url == null) {
      this.router.navigate(['live-matches/recent/view/' + match_details.asset_playback_id])
    }
    else if (match_details.is_live == null && match_details.additional_url != null) {
      this.router.navigate(['live-matches/recent/view/' + match_details.additional_url])
    }
    else {
      this.router.navigate(['live-matches/recent/view/' + match_details.playback_id])
    }
  }
  //#endregion
  paginate(event: any) {
    this._currentPageNumber = event.page + 1;
    this.getRecentAllMatches();
  }
  searchMatches() {
    this._recentRelatedMatchesList = this._recentRelatedMatchesListCopy.filter((item: any) => {
      return (
        item.playerA.toLowerCase().includes(this.searchedString.toLowerCase()) ||
        item.playerB.toLowerCase().includes(this.searchedString.toLowerCase()) ||
        item.event_name.toLowerCase().includes(this.searchedString.toLowerCase())
      );
    });
  }
}
