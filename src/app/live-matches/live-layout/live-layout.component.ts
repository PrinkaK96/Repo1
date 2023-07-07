import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { DateService } from 'src/app/services/DateChange/date.service';
import { VideosService } from 'src/app/services/Videos/videos.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { LiveWebService } from 'src/app/services/liveWeb/live-web.service';
import { SeeAllEventsService } from 'src/app/services/seeAll/see-all-events.service';

@Component({
  selector: 'app-live-layout',
  templateUrl: './live-layout.component.html',
  styleUrls: ['./live-layout.component.scss'],
})
export class LiveLayoutComponent implements OnInit {
  showSkeletons:boolean= false  
  __skeletons=[1,1,1,1,1,1,1,1];
  _infoSkeleton=[1]
  _pageMainTitle: any = 'No Live!';
  _pageSubTitle: any = 'We Will Get Back To you soon.';
  _buttonTitle: any = 'Create Matches';
  isNoLive: boolean = false;
  isNoEvent: boolean = false;
  isNoWTT: boolean = false;
  isNoRecent: boolean = false;
  azureLoggerConversion: any;
  _skeleton: boolean = false;
  _isAPICallingCompleted: boolean = false;
  searchedString: any = '';
  _searchedEvents: any;
  first = 0;
  _currenAcceptedPage: number = 1;
  _searchedEventsLength: any = [];
  _commonOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    autoplay: false,
    touchDrag: false,
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
  showSearchedEvents: boolean = false;
  _showLoader: boolean = false;
  _showVideo: boolean = false;
  _assetPlayBackId: any;
  _currentMatch: any;
  _additionalUrl: any;
  _playerA: string = '';
  _playerB: string = '';
  _category: string = '';
  _round: string = '';
  _views: string = '';
  _eventName: string = '';
  innerWidth: any
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  constructor(private router: Router, private eventsService: EventsService, private liveWeb: LiveWebService,
    private dateService: DateService, private videosService: VideosService, private azureLoggerService: MyMonitoringService) { 
      this.innerWidth = window.innerWidth;

    }

  ngOnInit(): void {
    this.getGlobalRecentEventMatches()

  }
  eventClicked() {
    this.router.navigateByUrl('/home/organize');
  }

  //#region Method to search all events 
  searchMatches() {
    this.showSearchedEvents = true;
    this.getEventsonSearch();
  }
  //#endregion Method to search all events 

  getEventsonSearch() {
    this._showLoader = true;
    this.liveWeb.searchMatches(this.searchedString, this._currenAcceptedPage).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        
        this._searchedEventsLength = result[0].match_count;
        this._searchedEvents = result[0].match_details;


      },
      error: (result: any) => {
        this._showLoader = false;

      },
      complete: () => {
        
      }
    })
  }

  //#region get paginated requests of events
  paginate(event: any) {
    this.first = event.first;
    this._currenAcceptedPage = event.page + 1;
    this.getEventsonSearch();
  }
  //#endregion get paginated requests of events

  showMatchesLayout() {
    if (this.searchedString != '' || this.searchedString != null || this.searchedString != undefined) {
      this.showSearchedEvents = true
    }
    else {
      this.showSearchedEvents = false
    }
  }
  backToLiveMatch() {
    this.searchedString = '';
    this.showSearchedEvents = false
  }

  getGlobalRecentEventMatches() {
    this.showSkeletons= true
    this._isAPICallingCompleted = true;
    this.liveWeb.getGlobalAllMatches().subscribe({
      next: (result: any) => {
        this.showSkeletons = false;
        this.isNoLive = result.body.live_matches.length > 0 ? true : false;
        this.isNoEvent = result.body.recent_event_matches.length > 0 ? true : false;
        this.isNoRecent = result.body.trending_matches.length > 0 ? true : false;
        this._isAPICallingCompleted = false;

      },
      error: (result: any) => {
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg;
        this.azureLoggerService.logException(this.azureLoggerConversion);
        this._isAPICallingCompleted = false;

      },
      complete: () => { },
    })
  }
  viewVideo(item: any) {
    this._showVideo = true;
    this._currentMatch = JSON.stringify(item);
    this._assetPlayBackId = item.asset_playback_id != null ? item.asset_playback_id : item.playback_id;
    this._additionalUrl = item.additional_url != null ? item.additional_url : '';
    this._playerA = item.playerA;
    this._playerB = item.playerB;
    this._round = item.round;
    this._category = item.category
    this._views = item.views != null ? item.views : 0;
   this._eventName = item.event_name;
   this.updateMatchViews(item.event_id,item.match_id)
  }
  closeFullScreen() {
    this._showVideo = false
  }
  updateMatchViews(event_id:any,match_id:any) {
    if (match_id !== undefined && match_id !== null) {
      this.videosService.updateMatchViews(event_id, match_id).subscribe({
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
}
