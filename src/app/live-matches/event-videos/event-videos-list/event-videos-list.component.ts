import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { DateService } from 'src/app/services/DateChange/date.service';
import { VideosService } from 'src/app/services/Videos/videos.service';
import { LiveWebService } from 'src/app/services/liveWeb/live-web.service';

@Component({
  selector: 'stupa-event-videos-list',
  templateUrl: './event-videos-list.component.html',
  styleUrls: ['./event-videos-list.component.scss']
})
export class EventVideosListComponent {
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
  _liveMatchesList: any = [];
  _showLoader: boolean = false;
  _currentPageNumber: number = 1;
  _recentEventsList: any = [];
  azureLoggerConversion: any = new Error();
  _event_id: any;
  event_name: any;
  searchedString: any = ''
  _searchRecentEventMatches: any = [];
  _searchRecentEventMatchesCopy: any = [];
  innerWidth: any
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  //#endregion
  constructor(public router: Router, private videosService: VideosService, private dateService: DateService, private liveWeb: LiveWebService,
    private azureLoggerService: MyMonitoringService) {
    this.innerWidth = window.innerWidth;

  }
  ngOnInit(): void {
    this.getEventRecentMatches();
    this.event_name = localStorage.getItem('e_nm')
  }
  //#region This method is used for View video 
  viewMatches(match_details: any) {
    localStorage.setItem('match_details', JSON.stringify(match_details))
    const home = 'live-match-list';
    localStorage.setItem('live-match', home)
    this.router.navigate(['live-matches/event-videos/view/' + match_details.asset_playback_id + '/' + match_details.event_id])
  }
  //#endregion
  //#region This method is used for get list of recent live videos base on particular event
  getEventRecentMatches() {
    this._showLoader = true;
    this.liveWeb.getGlobalAllMatches().subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._recentEventsList = [];
        this._searchRecentEventMatches = result.body.recent_event_matches;
        this._event_id = window.location.href.split('/')[7];
        this._recentEventsList = result.body.recent_event_matches.filter((x: any) => x.event_id == this._event_id)[0].match_details;
        this._searchRecentEventMatchesCopy = result.body.recent_event_matches.filter((x: any) => x.event_id == this._event_id)[0].match_details
      },
      error: (result: any) => {
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this._recentEventsList = [];
      },
      complete: () => { },
    })
  }
  //#endregion

  paginate(event: any) {
    this._currentPageNumber = event.page + 1;
    this.getEventRecentMatches();
  }


  searchMatches() {
    this._recentEventsList = this._searchRecentEventMatchesCopy.filter((item: any) => {
      return (
        item.playerA.toLowerCase().includes(this.searchedString.toLowerCase()) ||
        item.playerB.toLowerCase().includes(this.searchedString.toLowerCase())
      );
    });
  }

}
