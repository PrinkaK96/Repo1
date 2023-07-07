import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { SessionExpireService } from 'src/app/services/SessionExpire/session-expire.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'app-event-organiz',
  templateUrl: './event-organiz.component.html',
  styleUrls: ['./event-organiz.component.scss'],
})
export class EventOrganizComponent implements OnInit {
  innerWidth: any;
  _ongoingEvents: any = [];
  _upComingEvent: any = [];
  _registerEvent: any = [];
  _updateEventOnView: any;
  _homeToEvent: any;
  _showLoader: boolean = false;
  event_id: number = 0;
  _isRegister: boolean = false;
  _permissions: boolean = false;
  _recentEvent: any = [];
  azureLoggerConversion: any = new Error();
  _incompleteEvent: any = [];
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  constructor(
    private eventsService: EventsService,
    private azureLoggerService: MyMonitoringService,
    private encyptDecryptService: EncyptDecryptService,
    private router: Router,
    private sessionExpireService: SessionExpireService) {
    this.innerWidth = window.innerWidth;
    if (localStorage.getItem('perm')?.includes('5')) {
      this._permissions = true;
    } else {
      this._permissions = false;
    }
  }

  _videoSlider = {
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
  _eventId: any = 0;
  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );

    this.getEventsArrayWise();
  }
  ngOnChanges() {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );

    this.getEventsArrayWise();
  }
  element = document.getElementById('demo');


  getEventsArrayWise() {
    this._showLoader = true;
    this.eventsService.getEventsinArray().subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._upComingEvent = result.body.upcoming_events[1];
        this._registerEvent = result.body.register_events[1];
        this._ongoingEvents = result.body.ongoing_events[1];
        this._recentEvent = result.body.recent_events[1];
        this._incompleteEvent = result.body.incomplete_events[1];
      },
      error: (result) => {
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        setTimeout(() => {
          this.sessionExpireService.isSectionExpire(result.error.msg)
        }, 2000);
      },
      complete: () => {
      },
    });
  }

  updateEvent(e: any) {
    this._updateEventOnView = e;
    this._homeToEvent = this._updateEventOnView;
    const dd = this.encyptDecryptService.encryptUsingAES256(
      e.event_id.toString()
    );
    localStorage.setItem('event_id', dd);
    this._eventId = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    if (e.broadcast) {
      this.router.navigate(['/broadcasting']);
    } else {
      localStorage.setItem('navigationFrom', 'ongoingOrganize')
      this.router.navigate(['/event/create-event']);
    }

  }
  removeEventId() {
    localStorage.removeItem('_unSavedEventDetails');
    localStorage.removeItem('event_data');
    localStorage.removeItem('event_id');
    localStorage.removeItem('_tabIndex');
    localStorage.removeItem('data');
  }
  eventClicked() {
    this.router.navigateByUrl('/event/create-event');
  }
  navigateToRegisteration(data: any) {
    this._updateEventOnView = data;
    const dd = this.encyptDecryptService.encryptUsingAES256(
      data.event_id.toString()
    );
    localStorage.setItem('event_id', dd);
    this.router.navigate(['/open-reg']);
    this.event_id = data.event_id;
    this._isRegister = true;
  }
  allOngoingEvent() {
    this.router.navigate(['/home/all-ongoing-events', 'organize']);
  }
  upcomingSeeALL() {
    this.router.navigate(['home/all-upcoming-events', 'organize']);
  }
  registerOpen() {
    this.router.navigate(['/home/all-registrations', 'organize']);
  }
  recentOpen() {
    this.router.navigate(['/home/all-recent', 'organize']);
  }
  allIncompletedEvent() {
    this.router.navigate(['/home/all-incompleted']);
  }
  checkStatus(data: any) {
    if (data.status_description === 'Verification Accepted') {
      return 'w-100 text-overflow _success';
    }
    else if (data.status_description === 'Unverified') {
      return 'w-100 text-overflow _unverified';
    }
    else if (data.status_description === 'Rejected') {
      return 'w-100 text-overflow _rejected';

    }
    else if (data.status_description === 'Pending') {
      return 'w-100 text-overflow _pending';
    }
    else {
      return 'w-100 text-overflow';
    }
  }
}
