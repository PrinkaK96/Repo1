import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { SeeAllEventsService } from 'src/app/services/seeAll/see-all-events.service';


@Component({
  selector: 'stupa-all-registration',
  templateUrl: './all-registration.component.html',
  styleUrls: ['./all-registration.component.scss'],
  providers: [MessageService],
})
export class AllRegistrationComponent {
  //#region Here we are declaring Variables
  _sellAllOngoing: any = [];
  _updateEventOnView: any;
  isSigned: boolean;
  event_id: number = 0;
  _isRegister: boolean = false;
  _eventId: any;
  searchedString: any = '';
  _homeFlag: any = [];
  _sellAllOngoingCopy: any = [];
  azureLoggerConversion: any = new Error();
  p: any;
  _showLoader: boolean = false;
  //#endregion Here we are declaring Variables
  constructor(
    private azureLoggerService: MyMonitoringService,
    private seeAllEvents: SeeAllEventsService,
    private router: Router,
    private route: ActivatedRoute,
    private encyptDecryptService: EncyptDecryptService) {
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
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.route.paramMap.subscribe(params => {
      this._homeFlag = params.get('id');
    });
    this.getRegistrationEvents()
  }
  //#region Method to navigate to create-event if user clicks on view from organize
  updateEvent(e: any) {
    this._updateEventOnView = e;
    this._showLoader = true;
    const dd = this.encyptDecryptService.encryptUsingAES256(
      e.event_id.toString()
    );
    localStorage.setItem('event_id', dd);
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))
    if (e.broadcast) {
      this.router.navigate(['/broadcasting']);
    } else {
      localStorage.setItem('navigationFrom', 'registration')
      this.router.navigate(['/event/create-event']);
    }
    this._showLoader = false;
  }
  //#endregion Method to navigate to create-event if user clicks on view from organize

  navigateToRegisteration(data: any) {
    this._updateEventOnView = data;
    const dd = this.encyptDecryptService.encryptUsingAES256(
      data.event_id.toString()
    );
    localStorage.setItem('event_id', dd);
    this.event_id = data.event_id;
    this._isRegister = true;
  }
  //#region Method to search registration events 
  searchMatches() {
    this._sellAllOngoing = this._sellAllOngoingCopy.filter((item: any) => {
      return (
        item.event_name.toLowerCase().includes(this.searchedString.toLowerCase()));
    });
  }

  //#endregion Method to search registration events 

  //#region API call to get all registration events
  getRegistrationEvents() {
    if (this._homeFlag === 'organize') {
      this._showLoader = true;
      this.seeAllEvents.sellAllOngoing('register_events').subscribe({
        next: (data: any) => {
          this._showLoader = false;
          this._sellAllOngoing = data.body;
          this._sellAllOngoingCopy = data.body;
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg;
          this.azureLoggerService.logException(this.azureLoggerConversion);
        },
        complete: () => {

        }
      })
    }
    else {
      this._showLoader = true;
      this.seeAllEvents.sellAllOngoingAtHome('register_events').subscribe({
        next: (data: any) => {
          this._showLoader = false;
          this._sellAllOngoing = data.body.filter((publish: any) => publish.published == true);
          this._sellAllOngoingCopy = data.body.filter((publish: any) => publish.published == true);
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { }
      })
      localStorage.removeItem('event_data')
    }
  }
  //#endregion API call to get all registration events

  viewerHome(e: any) {
    localStorage.removeItem('eventDetailsForViewer')
    localStorage.setItem('eventDetailsForViewer', JSON.stringify(e));
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    const dd = this.encyptDecryptService.encryptUsingAES256(
      e.event_id.toString()
    );
    localStorage.setItem('event_id', dd);
    if (e.broadcast) {
      localStorage.setItem('isBroadcast', 'true');
      localStorage.setItem('navigationFrom', 'registration')
      this.router.navigate(['/viewer/$/videos']);
    } else {
      localStorage.setItem('isBroadcast', 'false');
      localStorage.setItem('navigationFrom', 'registration')
      // this.router.navigate(['/viewer/$/fixture']);
      this.router.navigate(['/viewer/$/Event-Details']);
    }
  }
}
