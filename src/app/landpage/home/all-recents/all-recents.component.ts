import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { SeeAllEventsService } from 'src/app/services/seeAll/see-all-events.service';


@Component({
  selector: 'stupa-all-recents',
  templateUrl: './all-recents.component.html',
  styleUrls: ['./all-recents.component.scss'],
})
export class AllRecentsComponent {
  //#region Here we are declaring Variables
  _sellAllOngoing: any = [];
  _updateEventOnView: any;
  isSigned: boolean = false;
  _eventId: any;
  _showLoader: boolean = false;
  _homeFlag: any = '';
  _sellAllOngoingCopy: any = [];
  azureLoggerConversion: any = new Error();
  //#endregion Here we are declaring Variables

  constructor(
    private seeAllEvents: SeeAllEventsService,
    private router: Router,
    private encyptDecryptService: EncyptDecryptService,
    private route: ActivatedRoute,
    private azureLoggerService: MyMonitoringService,
  ) {
    if (
      localStorage.getItem('reqToken') !== 'undefined' &&
      localStorage.getItem('reqToken') !== null
    ) {
      this.isSigned = true;
    } else {
      this.isSigned = false;
    }
  }
  p: any;
  searchedString: any = '';
  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    localStorage.removeItem('event_data');
    this.route.paramMap.subscribe(params => {
      this._homeFlag = params.get('id');
    });
    this.getEvents();
  }
  //#region API call to get all recent events
  getEvents() {
    if (this._homeFlag === 'organize') {
      this._showLoader = true;
      this.seeAllEvents.sellAllOngoing('recent_events').subscribe({
        next: (data: any) => {
          this._showLoader = false;
          this._sellAllOngoing = data.body;
          this._sellAllOngoingCopy = data.body;
        },
        error: (result: any) => {
          this._showLoader = false;
          this.azureLoggerService.logTrace(result.error.msg)
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { }
      })
    }
    else {
      // this._showLoader = true;
      this._showLoader = true;
      this.seeAllEvents.sellAllOngoingAtHome('recent_events').subscribe({
        next: (data: any) => {
          // this._showLoader = false;
          this._showLoader = false;
          this._sellAllOngoing = data.body.filter((publish: any) => publish.published === true);
          this._sellAllOngoingCopy = data.body.filter((publish: any) => publish.published === true);
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { }
      })
    }
  }
  //#endregion API call to get all recent events

  //#region Method to navigate to create-event if user clicks on view from organize
  updateEvent(e: any) {
    this._updateEventOnView = e;
    //', JSON.stringify(this._updateEventOnView))


    const dd = this.encyptDecryptService.encryptUsingAES256(
      e.event_id.toString()
    );
    localStorage.setItem('event_id', dd);
    if (e.broadcast) {
      this.router.navigate(['/broadcasting']);
    } else {
      localStorage.setItem('navigationFrom', 'recent')
      this.router.navigate(['/event/create-event']);
    }

  }
  //#endregion Method to navigate to create-event if user clicks on view from organize

  //#region Method to search recent events 
  searchMatches() {
    this._sellAllOngoing = this._sellAllOngoingCopy.filter((item: any) => {
      return (
        item.event_name.toLowerCase().includes(this.searchedString.toLowerCase()));
    });
  }
  //#endregion Method to search recent events 

  //#region Method to navigate to home if user clicks on view from home
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
      localStorage.setItem('navigationFrom', 'recents')
      this.router.navigate(['/viewer/$/videos']);
    } else {
      localStorage.setItem('isBroadcast', 'false');
      localStorage.setItem('navigationFrom', 'recents')
      // this.router.navigate(['/viewer/$/fixture']);
      this.router.navigate(['/viewer/$/Event-Details']);
    }
  }
  //#endregion Method to navigate to home if user clicks on view from home
}
