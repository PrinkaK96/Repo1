import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { SeeAllEventsService } from 'src/app/services/seeAll/see-all-events.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { BannerManagementService } from '../../admin/banner-management/banner-management.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  _imagePublished: any;
  _videoSlider = {
    loop: false,
    mouseDrag: true,
    autoplay: false,
    // autoplayTimeout: 1000,
    // autoplayHoverPause: true,
    // autoplaySpeed: 1000,
    touchDrag: false,
    pullDrag: true,
    dots: false,
    margin: 15,
    navSpeed: 700,
    navText: [
      '<i class="pi pi-chevron-left"></i>',
      '<i class="pi pi-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 2,
      },
      400: {
        items: 3,
      },
      740: {
        items: 3,
      },
      940: {
        items: 3,
      },
    },
    nav: true,
  };
  headerImageSlider: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    autoHeight: false,
    navSpeed: 700,
    navText: ['', ''],
    autoplay: true,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 1,
      },
    },
    nav: false,
  };
  _recentEventsSlider = {
    loop: false,
    mouseDrag: true,
    autoplay: false,
    touchDrag: false,
    pullDrag: true,
    dots: false,
    margin: 15,
    navSpeed: 700,
    navText: [
      '<i class="pi pi-chevron-left"></i>',
      '<i class="pi pi-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 1,
      },
    },
    nav: true,
  };
  _upComingEvent: any = [];
  _registerEvent: any = [];
  _ongoingEvents: any = [];
  isSigned: boolean;
  _showLoader: boolean = false;
  _recentEvents = []
  _upComingLength: any;
  _eventId: any;
  _recentEvent: any = [];
  azureLoggerConversion: any = new Error();

  constructor(
    private bannerService: BannerManagementService,
    private eventsService: EventsService,
    private azureLoggerService: MyMonitoringService,
    private encyptDecryptService: EncyptDecryptService,
    private router: Router) {
    if (
      localStorage.getItem('reqToken') !== 'undefined' &&
      localStorage.getItem('reqToken') !== null
    ) {
      this.isSigned = true;
    } else {
      this.isSigned = false;
    }
  }

  ngOnInit(): void {
    this.getPublish();
    this.getEventsArrayWise();
    localStorage.removeItem('event_data');
    localStorage.removeItem('event_id')
  }

  getPublish() {
    this.bannerService.getPublish().subscribe
      ({
        next: (res: any) => {
          this._imagePublished = res.body.published.map((urlImg: any) => urlImg.url).slice(0, 5);
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      });
  }

  getEventsArrayWise() {
    this._showLoader = true;
    this.eventsService.getEventsinArrayHome().subscribe(
      {
        next: (result: any) => {
          this._showLoader = false;
          this._upComingEvent = result.body.upcoming_events[1];
          this._registerEvent = result.body.register_events[1];
          this._ongoingEvents = result.body.ongoing_events[1];
          this._recentEvent = result.body.recent_events[1];
        },
        error: (result) => {
          this._showLoader = false;
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => {
          this._showLoader = false;
        }
      }
    );
  }

  updateEvent(e: any) {
    localStorage.removeItem('eventDetailsForViewer')
    localStorage.setItem('eventDetailsForViewer', JSON.stringify(e));
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    const dd = this.encyptDecryptService.encryptUsingAES256(
      e.event_id.toString()
    );
    localStorage.setItem('event_id', dd);
    if (e.broadcast) {
      localStorage.setItem('isBroadcast', 'true');
      this.router.navigate(['/viewer/$/videos']);
    } else {
      localStorage.setItem('isBroadcast', 'false');
      // this.router.navigate(['/viewer/$/fixture']);
      this.router.navigate(['/viewer/$/Event-Details']);
    }
    const flag = 'home';
    localStorage.removeItem('_homeFlag')
    localStorage.setItem('_homeFlag', flag);
  }
  OngoingseeALL() {
    this.router.navigate(['/home/all-ongoing-events', 'home']);
  }
  upcomingSeeALL() {
    this.router.navigate(['home/all-upcoming-events', 'home']);
  }
  registerOpen() {
    this.router.navigate(['/home/all-registrations', 'home']);
  }
  recentOpen() {
    this.router.navigate(['/home/all-recent', 'home']);
  }
}
