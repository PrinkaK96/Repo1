import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SeeAllEventsService } from 'src/app/services/seeAll/see-all-events.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
@Component({
  selector: 'stupa-all-upcoming',
  templateUrl: './all-upcoming.component.html',
  styleUrls: ['./all-upcoming.component.scss'],
  providers: [MessageService],
})
export class AllUpcomingComponent {
  //#region Here we are declaring Variables
  _skeleton: boolean = true;
  _sellAllOngoing: any = [];
  _updateEventOnView: any;
  isSigned: boolean;
  event: any
  _showLoader: boolean = false;
  searchedString: any = '';
  _homeFlag: any = "";
  _sellAllOngoingCopy: any = [];
  azureLoggerConversion: any = new Error();
  //#endregion Here we are declaring Variables

  constructor(private encyptDecryptService: EncyptDecryptService, private azureLoggerService: MyMonitoringService,
    private seeAllEvents: SeeAllEventsService, private router: Router, private route: ActivatedRoute) {
    if (
      localStorage.getItem('reqToken') !== 'undefined' &&
      localStorage.getItem('reqToken') !== null
    ) {
      this.isSigned = true;
    } else {
      this.isSigned = false;
    }
    this.event = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))
  }
  p: any;
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this._homeFlag = params.get('id');
    });
    localStorage.removeItem('event_data');
    this.getEvents();
  }

  //#region API call to get all upcoming events
  getEvents() {
    if (this._homeFlag === 'organize') {
      this._showLoader = true;
      this.seeAllEvents.sellAllOngoing('upcoming_events').subscribe({
        next: (data: any) => {
          this._showLoader = false;
          this._sellAllOngoing = data.body;
          this._sellAllOngoingCopy = data.body;

        },
        error: (result: any) => {
          this._showLoader = false;
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () =>{
          
        }
      })
    }
    else {
      this._showLoader = true;
      this.seeAllEvents.sellAllOngoingAtHome('upcoming_events').subscribe({
        next: (data: any) => {
          this._showLoader = false;
          this._sellAllOngoing = data.body.filter((publish: any) => publish.published == true);
          this._sellAllOngoingCopy = data.body.filter((publish: any) => publish.published == true);
        },
        error: (result: any) => {
          this._showLoader = false;
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => {
        }
      })
    }
  }
  //#endregion API call to get all upcoming events

  //#region Method to navigate to create-event if user clicks on view from organize
  updateEvent(e: any) {
    this._showLoader = true;
    this._updateEventOnView = e;
    const dd = this.encyptDecryptService.encryptUsingAES256(
      e.event_id.toString()
    );
    localStorage.setItem('event_id', dd);
    this.event = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))
    if (e.broadcast) {
      this.router.navigate(['/broadcasting']);
    } else {
      localStorage.setItem('navigationFrom', 'upcoming')
      this.router.navigate(['/event/create-event']);
    }
    this._showLoader = false;
  }
  //#endregion Method to navigate to create-event if user clicks on view from organize

  //#region Method to search upcoming events 
  searchMatches() {
    this._sellAllOngoing = this._sellAllOngoingCopy.filter((item: any) => {
      return (
        item.event_name.toLowerCase().includes(this.searchedString.toLowerCase()));
    });
  }
  //#endregion Method to search upcoming events 

  //#region Method to navigate to home if user clicks on view from home
  viewerHome(e: any) {
    localStorage.removeItem('eventDetailsForViewer')
    localStorage.setItem('eventDetailsForViewer', JSON.stringify(e));
    this.event = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    const dd = this.encyptDecryptService.encryptUsingAES256(
      e.event_id.toString()
    );
    localStorage.setItem('event_id', dd);
    if (e.broadcast) {
      localStorage.setItem('isBroadcast', 'true');
      localStorage.setItem('navigationFrom', 'upcoming')
      this.router.navigate(['/viewer/$/videos']);
    } else {
      localStorage.setItem('isBroadcast', 'false');
      localStorage.setItem('navigationFrom', 'upcoming')
      // this.router.navigate(['/viewer/$/fixture']);
      this.router.navigate(['/viewer/$/Event-Details']);
    }
  }
  //#endregion Method to navigate to home if user clicks on view from home
}
