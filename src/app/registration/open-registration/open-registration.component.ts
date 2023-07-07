import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { SeeAllEventsService } from 'src/app/services/seeAll/see-all-events.service';

@Component({
  selector: 'stupa-open-registration',
  templateUrl: './open-registration.component.html',
  styleUrls: ['./open-registration.component.scss'],
  providers: [MessageService],
})
export class OpenRegistrationComponent {
  _showLoader: boolean = false;
  _skeleton: boolean = false;
  _sellAllOngoing: any = [];
  _updateEventOnView: any;
  isSigned: boolean;
  _isRegister: boolean = false;
  event_id: number = 0;
  searchedString: any = '';
  _homeFlag: any = [];
  _sellAllOngoingCopy: any = [];
  _eventId: any = '';
  _tokenDetails: any;
  _noPermission: boolean = false;
  azureLoggerConversion: any = new Error;
  constructor(private messageService: MessageService, private route: ActivatedRoute, private azureLoggerService: MyMonitoringService,
    private seeAllEvents: SeeAllEventsService, private router: Router, private encyptDecryptService: EncyptDecryptService,private eventsService: EventsService) {
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

  ngOnInit(): void {
    localStorage.removeItem('event_data');
    this.route.paramMap.subscribe(params => {
      this._homeFlag = params.get('id');
    });
    this.getEvents();
  }

  getEvents() {

    if (this._homeFlag === 'organize') {
      // this._skeleton=true;
     this._showLoader = true;
      this.seeAllEvents.sellAllOngoingAtHome('register_events').subscribe({
        next: (data: any) => {
          this.openPopUp();
          // this._skeleton=false;
         this._showLoader = false;
          this._sellAllOngoing = data.body.filter((publish: any) => publish.published == true);
          this._sellAllOngoingCopy = data.body.filter((publish: any) => publish.published == true);

        },
        error: (result: any) => {
          // this._skeleton=false;
         this._showLoader = false;
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => {

        }
      })
    }
    else {
      // this._skeleton=true;
     this._showLoader = true;
      this.seeAllEvents.sellAllOngoingAtHome('register_events').subscribe({
        next: (data: any) => {
          // this._skeleton=false;
         this._showLoader = false;
          this._sellAllOngoing = data.body.filter((publish: any) => publish.published == true);
          this._sellAllOngoingCopy = data.body.filter((publish: any) => publish.published == true);

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
  updateEvent(e: any) {
    this._updateEventOnView = e;
    // localStorage.setItem('event_data', JSON.stringify(this._updateEventOnView))
    this.router.navigate(['/event/create-event']);

  }
  clearSearch() {
    this._noPermission = false;
    this.searchedString = '';
    this._sellAllOngoing = this._sellAllOngoingCopy
  }
  navigateToRegisteration(data: any) {
    this._tokenDetails = localStorage.getItem('reqToken')
    atob(this._tokenDetails.split('.')[1])
    if (data.role_registration.includes(JSON.parse(atob(this._tokenDetails.split('.')[1])).role_id)) {
      this._updateEventOnView = data;
      const dd = this.encyptDecryptService.encryptUsingAES256(data.event_id.toString());
      localStorage.setItem('event_id', dd);
      this.event_id = data.event_id;
      this._isRegister = true;
      const eventName = this.encyptDecryptService.encryptUsingAES256(data.event_name);
      localStorage.setItem('ev_nm', eventName);
      this.router.navigate(['/registration/register']);
    } else {
      this._noPermission = true;
    }
    this.updateCategoryRegistrationByLastDate(data.event_id)
    //routerLink="/registration/register"

  }
  searchMatches() {
    this._sellAllOngoing = this._sellAllOngoingCopy.filter((item: any) => {
      return (
        item.event_name.toLowerCase().includes(this.searchedString.toLowerCase()));
    });
  }
  viewerHome(e: any) {
    localStorage.removeItem('eventDetailsForViewer')
    localStorage.setItem('eventDetailsForViewer', JSON.stringify(e));
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    const dd = this.encyptDecryptService.encryptUsingAES256(
      e.event_id.toString()
    );
    localStorage.setItem('event_id', dd);
    // this.router.navigate(['/viewer/$/fixture']);
    this.router.navigate(['/viewer/$/Event-Details']);
  }
  openPopUp() {

    this.messageService.add({
      key: 'bc',
      severity: 'info',
      summary: '',
      detail: "To proceed with registration process. Make sure your browser pop-ups are not blocked.",
      life: 4000,
    });
  }
  updateCategoryRegistrationByLastDate(event_id:any){
    this.eventsService.get_reg_last_date(this.event_id).subscribe({
      next: (result: any) => {
        const msg = result.body.msg;
      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    })
  }
}
