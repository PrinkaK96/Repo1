import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { DateService } from 'src/app/services/DateChange/date.service';
import { VideosService } from 'src/app/services/Videos/videos.service';
import { LiveWebService } from 'src/app/services/liveWeb/live-web.service';

@Component({
  selector: 'stupa-event-videos',
  templateUrl: './event-videos.component.html',
  styleUrls: ['./event-videos.component.scss']
})
export class EventVideosComponent {
  //#region variable
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
  _recentEventsList: any = [];
  @Output() isNoEvent = new EventEmitter<any>();
  azureLoggerConversion: any = new Error();
  innerWidth: any
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  //#endregion
  constructor(public router: Router, private azureLoggerService: MyMonitoringService, private liveWeb: LiveWebService,
    private videosService: VideosService, private dateService: DateService) {
    this.innerWidth = window.innerWidth;

  }
  ngOnInit(): void { this.getGlobalRecentEventMatches(); }


  getGlobalRecentEventMatches() {
    this._showLoader = true;
    this.liveWeb.getGlobalAllMatches().subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._recentEventsList = [];
        this._recentEventsList = result.body.recent_event_matches;
        this.isMatchesExist();
      },
      error: (result: any) => {
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg;
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this._recentEventsList = [];
        this.isMatchesExist();
      },
      complete: () => { },
    })
  }

  //#region With This method will get list if Recent live videos.
  getRecentStreamedEvents() {
    this._showLoader = true;
    this.videosService.getRecentStreamedEvents(this.dateService.fulldateFormatterInUTC(new Date()), this._currentPageNumber, 50).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._recentEventsList = [];
        this._recentEventsList = result.body[1]
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
  //#region this will redirect us for view list of videos
  viewRecent(matchDetails: any, event_matches: any) {
    localStorage.setItem('match_details', JSON.stringify(matchDetails))
    const home = 'live-match';
    localStorage.setItem('live-match', home);
    this.router.navigate(['live-matches/event-videos/view/' + matchDetails.playback_id + '/' + event_matches.event_id])
  }
  //#endregion
  isMatchesExist() {
    if (this._recentEventsList.length == 0) {
      this.isNoEvent.emit(true)
    } else {
      this.isNoEvent.emit(false)
    }
  }
  navigatetoEventsList(details: any) {
    localStorage.setItem('e_nm', details.event_name)
    this.router.navigate(['live-matches/event-videos/list/' + details.event_id])
  }

}
