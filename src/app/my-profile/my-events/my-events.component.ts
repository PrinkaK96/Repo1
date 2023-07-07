import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { SeeAllEventsService } from 'src/app/services/seeAll/see-all-events.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { ProfileMenuService } from "../../services/ProfileMenu/profile-menu.service"
import { log } from 'util';

@Component({
  selector: 'stupa-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss']
})
export class MyEventsComponent {
  //#region Variable Declaration Start

  _buttonTitle: any = 'Create Matches';
  _updateEventOnView: any;
  _showLoader: boolean = false;
  event_id: number = 0;
  _permissions: boolean = false;
  _pageMainTitle = 'Forbidden!';
  _pageSubTitle = 'You do not have Permission for this Particular Module.'
  allEvents: any = [];
  p: any;
  _allEventsCopy: any = [];
  searchedString: any = '';
  azureLoggerConversion: any = new Error();
  _tabIndex = 0;
  _currenPendingPage: number = 1;
  _getAcceptedUserList: any = [];
  _getPendingUserList: any = [];
  _getRejectedUserList: any = [];
  _totalAcceptedUser: any = [];
  _totalPendingUser: any = [];
  _totalRejectedUser: any = [];
  _role_id: any;
  _visible: boolean = false;
  rejectionMessage: any;
  _pending: any = '';
  _accepted: any = '';
  _rejected: any = '';
  _currentType: any = [];
  _currenRejectedPage: number = 1;
  _isAPICallingCompleted:boolean = false
  _currenAcceptedPage: number = 1;
  //#region Variable Declaration Start

  constructor(private eventsService: EventsService, private seeAllEvents: SeeAllEventsService, private profileMenuService: ProfileMenuService,
    private encyptDecryptService: EncyptDecryptService, private router: Router, private azureLoggerService: MyMonitoringService) {
    if (localStorage.getItem('perm')?.includes('5')) {
      this._permissions = true;
    }
    else {
      this._permissions = false;
    }
    this.pending();
  }
  _eventId: any = 0;
  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getAllEvents();
    this._role_id = localStorage.getItem('rl');
  }
  ngOnChanges() {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getAllEvents();
  }

  //#region API call to get all  events of the user
  getAllEvents() {
    this._showLoader = true;
    this.seeAllEvents.getPlayerParticipatedEvents().subscribe({
      next: (data: any) => {
        this._showLoader = false;
        this.allEvents = data.body;
        this._allEventsCopy = data.body

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
  //#endregion API call to get all  events of the user


  //#region method to navigate to the screen where user can view its fixture,results,etc
  // storing variable flag in LocalStorage because we are using same component and to navigate back to the respective parent
  updateEvent(eventDetails: any) {
    // this._eventId = this.encyptDecryptService.decryptUsingAES256(eventDetails.event_id);
    const dd = this.encyptDecryptService.encryptUsingAES256(
      eventDetails.event_id.toString()
    );
    localStorage.setItem('event_id', dd);
    this.router.navigate(['/event/create-event']);
  }
  //#endregion method to navigate to the screen where user can view its fixture,results,etc
  // storing variable flag in LocalStorage because we are using same component and to navigate back to the respective parent



  //#region method to search event by name
  
  //#endregion method to search event by name
  currentTab(data: any) {
    this._tabIndex = data.index;
    if (data.index == 0) {
      this._totalPendingUser =[]
      this._getPendingUserList=[]
      this.pending();
    } else if (data.index == 1) {
      this._getAcceptedUserList = [];
      this._getAcceptedUserList=[]
      this.accepted();
    } else if (data.index == 2) {
      this._totalRejectedUser=[]
      this._getRejectedUserList=[]
      this.rejected();
    }
  }


  pending() {
    this._isAPICallingCompleted = true;
    this.profileMenuService.myEvents("pending", this._currenPendingPage,'').subscribe({
      next: (data: any) => {
        this._isAPICallingCompleted = false;
        this._totalPendingUser =[]
        this._getPendingUserList=[]
        this._totalPendingUser = data.body.count;
        this._getPendingUserList = data.body.requests;
      },
      error: (result: any) => {
        this._isAPICallingCompleted = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    })
  }
  accepted() {
    
    this.profileMenuService.myEvents("accepted", this._currenAcceptedPage,'').subscribe({
      next: (data: any) => {
        this._getAcceptedUserList = [];
        this._getAcceptedUserList=[]
        this._totalAcceptedUser = data.body.count;
        this._getAcceptedUserList = data.body.requests;
      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    })
  }
  rejected() {
    this.profileMenuService.myEvents('rejected', this._currenRejectedPage,'').subscribe({
      next: (data: any) => {
        this._totalRejectedUser=[]
        this._getRejectedUserList=[]
        this._totalRejectedUser = data.body.count;
        this._getRejectedUserList = data.body.requests;
      },
      error: (result: any) => {
        this._showLoader = false;;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    })
  }
  getrole() {
    alert(this._role_id)
  }
  openPopUP(data: any) {
    this.rejectionMessage = data.verification_message;
    this._visible = true;
  }
  getRequestsWithSearch(type: any, searchText: any) {
    this._currentType = type;
    this.profileMenuService.myEvents(type, 1, searchText)
      .subscribe({
        next: (data: any) => {
          if (this._currentType == 'pending') {
            this._totalPendingUser=[];
            this._getPendingUserList=[]
            this._totalPendingUser = data.body.count;
            this._getPendingUserList = data.body.requests;
          } else if (this._currentType == 'accepted') {
            this._totalAcceptedUser=[]
            this._getAcceptedUserList =[]
            this._totalAcceptedUser = data.body.count;
            this._getAcceptedUserList = data.body.requests;
          } else if (this._currentType == 'rejected') {
            this._totalRejectedUser=[]
            this._getRejectedUserList=[]
            this._totalRejectedUser = data.body.count;
            this._getRejectedUserList = data.body.requests;
          }
        },
        error: (result: any) => {  
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
          // this.messageService.add({
          //   key: 'bc',
          //   severity: 'error',
          //   summary: 'Info',
          //   detail: result.error.msg,
          //   life: 3000,
          // });
        },
        complete: () => { },
      });
  }
  paginate(event: any, type: string) {
    if (type === 'pending') {
      this._currenPendingPage = event.page + 1;
      this.pending();
    }
    if (type === 'accepted') {
      this._currenAcceptedPage = event.page + 1;
      this.accepted();
    }
    if (type === 'rejected') {
      this._currenRejectedPage = event.page + 1;
      this.rejected();
    }
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
  }
}

