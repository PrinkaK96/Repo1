import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { DateService } from 'src/app/services/DateChange/date.service';
import { VideosService } from 'src/app/services/Videos/videos.service';

@Component({
  selector: 'stupa-event-more-videos',
  templateUrl: './event-more-videos.component.html',
  styleUrls: ['./event-more-videos.component.scss']
})
export class EventMoreVideosComponent {
  //#region variable
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
  _liveMatchesList: any = [];
  _showLoader: boolean = false;
  _currentPageNumber: number = 1;
  _recentEventsList: any = [];
  @Output() isNoEvent = new EventEmitter<any>();
  azureLoggerConversion: any = new Error();
  _totalLiveMatches: any;
  innerWidth: any
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  //#endregion
  constructor(public router: Router, private azureLoggerService: MyMonitoringService,
    private videosService: VideosService, private dateService: DateService) {
      this.innerWidth = window.innerWidth;

     }
  ngOnInit(): void { this.getRecentStreamedEvents(); }
  //#region With This method will get list if Recent live videos.
  getRecentStreamedEvents() {
    this._showLoader = true;
    this.videosService.getRecentStreamedEvents(this.dateService.fulldateFormatterInUTC(new Date()), this._currentPageNumber, 12).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._recentEventsList = [];
        this._totalLiveMatches = result.body[0];
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
  viewRecent(matchDetails: any) {
    this.router.navigate(['live-matches/event-videos/list/' + matchDetails.event_id])
  }
  //#endregion
  isMatchesExist() {
    if (this._recentEventsList.length == 0) {
      this.isNoEvent.emit(true)
    } else {
      this.isNoEvent.emit(false)
    }
  }
  paginate(event: any) {
    this._currentPageNumber = event.page + 1;
    this.getRecentStreamedEvents();
  }
}
