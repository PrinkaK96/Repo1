import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { SeeAllEventsService } from 'src/app/services/seeAll/see-all-events.service';

@Component({
  selector: 'stupa-all-ongoing',
  templateUrl: './all-ongoing.component.html',
  styleUrls: ['./all-ongoing.component.scss'],
  providers: [MessageService],
})
export class AllOngoingComponent implements OnInit {
  //#region Here we are declaring Variables
  _skeleton: boolean = false;
  three = [1, 1, 1]
  _sellAllOngoing: any = [];
  _updateEventOnView: any;
  isSigned: boolean = false;
  _eventId: any;
  _showLoader: boolean = false;
  _homeFlag: any = [];
  _sellAllOngoingCopy: any = [];
  azureLoggerConversion: any = new Error();
  constructor(
    private messageService: MessageService,
    private seeAllEvents: SeeAllEventsService,
    private router: Router,
    private encyptDecryptService: EncyptDecryptService,
    private route: ActivatedRoute,
    private azureLoggerService: MyMonitoringService
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
  //#endregion Here we are declaring Variables

  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    //this._eventId = this.encyptDecryptService.decryptUsingAES256(sessionStorage.getItem('event_id'));
    localStorage.removeItem('event_data');

    this.route.paramMap.subscribe(params => {
      this._homeFlag = params.get('id');
    });
    this.getEvents();

  }

  //#region API call to get all registration events
  getEvents() {
    if (this._homeFlag === 'organize') {
      // this._showLoader = true;
      this._showLoader = true;
      this.seeAllEvents.sellAllOngoing('ongoing_events').subscribe({
        next: (data: any) => {
          
          // this._showLoader = false;
          this._showLoader = false;
          this._sellAllOngoing = data.body;
          this._sellAllOngoingCopy = data.body;

        },
        error: (result: any) => {
          // this._showLoader = false;
          this._showLoader = false;
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => {

        }
      })
    }
    else {
      // this._showLoader = true;
      this._showLoader = true;
      this.seeAllEvents.sellAllOngoingAtHome('ongoing_events').subscribe({
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
        complete: () => {
          
        }
      })
    }
  }
  //#endregion API call to get all registration events


  //#region Method to navigate to create-event if user clicks on view from organize
  updateEvent(e: any) {
    this._updateEventOnView = e;
    //localStorage.setItem('event_data', JSON.stringify(this._updateEventOnView))


    const dd = this.encyptDecryptService.encryptUsingAES256(
      e.event_id.toString()
    );
    localStorage.setItem('event_id', dd);
    if (e.broadcast) {
      this.router.navigate(['/broadcasting']);
    } else {
      localStorage.setItem('navigationFrom', 'ongoing')
      this.router.navigate(['/event/create-event']);
    }
  }
  //#endregion Method to navigate to create-event if user clicks on view from organize

  //#region Method to search registration events 
  searchMatches() {
    this._sellAllOngoing = this._sellAllOngoingCopy.filter((item: any) => {
      return (
        item.event_name.toLowerCase().includes(this.searchedString.toLowerCase()));
    });
  }
  //#endregion Method to search registration events 

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
      localStorage.setItem('navigationFrom', 'ongoing')
      this.router.navigate(['/viewer/$/videos']);
    } else {
      localStorage.setItem('isBroadcast', 'false');
      localStorage.setItem('navigationFrom', 'ongoing')
      // this.router.navigate(['/viewer/$/fixture']);
      this.router.navigate(['/viewer/$/Event-Details']);
    }
  }
  //#endregion Method to navigate to home if user clicks on view from home
  checkStatus(data: any) {
    if (data.status_description === 'Verification Accepted') {
      return 'w-100 text-overflow _success'

    }
    else if (data.status_description === 'Unverified') {
      return 'w-100 text-overflow _unverified'
    }
    else if (data.status_description === 'Rejected') {
      return 'w-100 text-overflow _rejected'

    }
    else if (data.status_description === 'Pending') {
      return 'w-100 text-overflow _pending'

    }
    else {
      return 'w-100 text-overflow'

    }
  }
}
