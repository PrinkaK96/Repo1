import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { RequestServiceService } from 'src/app/services/AdminRequestService/request-service.service';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { ProfileMenuService } from 'src/app/services/ProfileMenu/profile-menu.service';
import { SessionExpireService } from 'src/app/services/SessionExpire/session-expire.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'stupa-event-verification',
  templateUrl: './event-verification.component.html',
  styleUrls: ['./event-verification.component.scss'],
  providers: [MessageService, ConfirmationDialogService],
})
export class EventVerificationComponent {
  _skeleton: boolean = false;
  id = [1, 2, 3]
  tables = [1, 2, 3, 1, 1, 1, 1]
  cols: any = [];
  showDialog: boolean = false;
  showAcceptDialog: boolean = false;
  showRejectionDialog: boolean = false;
  innerWidth: any;
  _getPendingUserList: any = [];
  _getAcceptedUserList: any = [];
  _getRejectedUserList: any = [];
  _fieldData: any = [];
  _currentType: any = [];
  _pending: any = '';
  _accepted: any = '';
  _rejected: any = '';
  _isSearching: boolean = true;
  _totalPendingUser: any = "";
  _totalAcceptedUser: any = "";
  _totalRejectedUser: any = "";
  _currenPendingPage: number = 1;
  _currenAcceptedPage: number = 1;
  _currenRejectedPage: number = 1;
  _rejectionMsg: any = '';
  _currentRoleId: any;
  _currentUserId: any;
  token_id: any
  _responseData: any = [];
  _showLoader: boolean = false;
  azureLoggerConversion: any = new Error();
  _tabIndex = 0;
  first: number = 0;
  _currentEventId: any;
  _eventId: any;
  _passData: boolean = false;
  _currentEventID: any;
  constructor(
    private eventRequestService: ProfileMenuService,
    private requestService: RequestServiceService,
    private confirmationDialogService: ConfirmationDialogService,
    private messageService: MessageService,
    private router: Router,
    private azureLoggerService: MyMonitoringService,
    private eventsService: EventsService,
    private sessionExpireService: SessionExpireService,
  ) {
    this.innerWidth = window.innerWidth;
  }
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  ngOnInit(): void {

    this.getPendingEventRequests();
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'email', header: 'Email' },
      { field: 'country', header: 'Country' },
      { field: 'role', header: 'Roles' },
      { field: 'detail', header: 'Detail' },
      { field: 'Action', header: 'Action' },
    ];
  }
  openDialog(data: any) {
    localStorage.setItem('event_id', data.event_id);
    this._fieldData = data;
    this.showDialog = true;
    this._passData = true;
  }

  closePopUp() {
    this.showDialog = false;
  }
  getPendingEventRequests() {
    this._showLoader = true;;
    this._getPendingUserList = [];
    this.eventRequestService.getEventByVerificationStatus('pending', this._currenPendingPage).subscribe({
      next: (data: any) => {
        this._getPendingUserList = [];
        this._showLoader = false;;
        this._totalPendingUser = data.body.count;
        this._getPendingUserList = data.body.requests;
        this._isSearching = false;
      },
      error: (result: any) => {
        this._showLoader = false;;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Info',
          detail: result.error.msg,
          life: 3000,
        });
      },
      complete: () => {
        this._showLoader = false;;
      },
    });
  }
  getAcceptedRequests() {
    this._showLoader = true;;
    const user_Id = 4;
    this._getAcceptedUserList = [];
    this.eventRequestService.getEventByVerificationStatus('accepted', this._currenAcceptedPage).subscribe({
      next: (data: any) => {
        this._getAcceptedUserList = [];
        this._showLoader = false;;
        this._totalAcceptedUser = data.body.count;
        this._getAcceptedUserList = data.body.requests;
      },
      error: (result: any) => {
        this._showLoader = false;;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Info',
          detail: result.error.msg,
          life: 3000,
        });
      },
      complete: () => { },
    });
  }
  getRejectedRequests() {
    this._showLoader = true;
    this._getRejectedUserList = [];
    this.eventRequestService.getEventByVerificationStatus('rejected', this._currenRejectedPage).subscribe({
      next: (data: any) => {
        this._getRejectedUserList = [];
        this._showLoader = false;;
        this._totalRejectedUser = data.body.count;
        this._getRejectedUserList = data.body.requests;
      },
      error: (result: any) => {
        this._showLoader = false;;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Info',
          detail: result.error.msg,
          life: 3000,
        });
      },
      complete: () => { },
    });
  }
  getRequestsWithSearch(type: any, seachText: any) {
    this._currentType = type;
    this._showLoader = true;;
    this.eventRequestService.getEventsonSearcch(seachText, type, 1).subscribe({
      next: (data: any) => {
        this._isSearching = false;
        this._showLoader = false;
        if (this._currentType == 'pending') {
          this._getPendingUserList = [];
          this._totalPendingUser = data.body.count;
          this._getPendingUserList = data.body.requests;
        } else if (this._currentType == 'accepted') {
          this._getAcceptedUserList = [];
          this._totalAcceptedUser = data.body.count;
          this._getAcceptedUserList = data.body.requests;
        } else if (this._currentType == 'rejected') {
          this._getRejectedUserList = [];
          this._totalRejectedUser = data.body.count;
          this._getRejectedUserList = data.body.requests;
        }
      },
      error: (result: any) => {
        this._showLoader = false;;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Info',
          detail: result.error.msg,
          life: 3000,
        });
      },
      complete: () => { },
    });
  }
  //#region Accepting Request
  acceptRequest(detail: any, type: any) {
    this.confirmationDialogService
      .confirm(
        'Please confirm..',
        'Are you sure you want to accept this event request?'
      )
      .then((confirmed) => {
        if (confirmed) {
          this._showLoader = true;
          var updatedData = {
            "verification_message": "",
            "status_id": 9
          }
          //this.eventsService.updateEvent(updatedData,detail.event_id).subscribe({
          const msg = 'Event Verified Successfully.'  
          this.eventRequestService.updateVerificationStatusEvent(detail.event_id, updatedData , msg).subscribe({
            next: (result: any) => {
              this._showLoader = false;;
              this.messageService.add({
                key: 'bc',
                severity: 'success',
                summary: 'Success',
                detail: result.body.msg,
                life: 3000,
              });

              if (type === 'pending') {
                this.getPendingEventRequests();
              }
              else {
                this.getRejectedRequests()
              }
            },
            error: (result: any) => {
              this._showLoader = false;;
              this.azureLoggerConversion = result.error.msg
              this.azureLoggerService.logException(this.azureLoggerConversion)
              this.messageService.add({
                key: 'bc',
                severity: 'error',
                summary: 'Info',
                detail: result.error.msg,
                life: 3000,
              });
            },
            complete: () => { },
          });
        } else {
        }
      })
      .catch(() => { });
  }
  //#endregion Accept Request End
  currentTab(data: any) {
    this._tabIndex = data.index;
    if (data.index == 0) {
      this.getPendingEventRequests();
    } else if (data.index == 1) {
      this.getAcceptedRequests();
    } else if (data.index == 2) {
      this.getRejectedRequests();
    }
  }
  rejectRequest(data: any, tabName: any) {
    this._currentEventID = data.event_id
    this._currentRoleId = data.role_id;
    this._currentUserId = data.user_id;
    this._currentEventId = data.event_id;
    if (tabName == 'pending') {
      this.showRejectionDialog = true;
      this.showAcceptDialog = false;
    } else if (tabName == 'accepted') {
      this.showAcceptDialog = true;
      this.showRejectionDialog = false;
    }
  }
  closeRejectionPopUp() {
    this.showRejectionDialog = false;
    this.showAcceptDialog = false;
  }
  sendRejectionMail() {
    this.showRejectionDialog = false;
  }
  customSort(event: any) {
    event.data.sort((data1: any, data2: any) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return event.order * result;
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }
  isAdmin() {
    this.token_id = localStorage.getItem('admToken')
    if (this.token_id !== null) {
      const responseData = JSON.parse(
        atob(this.token_id.split('.')[1])
      );
      this._responseData.push(responseData);
      if (this._responseData[0].role_id == 4) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }

  }
  paginate(event: any, type: string) {
    if (type === 'pending') {
      this.first = event.first;
      this._currenPendingPage = event.page + 1;
      this.getPendingEventRequests();
    }
    if (type === 'accepted') {
      this.first = event.first;
      this._currenAcceptedPage = event.page + 1;
      this.getAcceptedRequests();
    }
    if (type === 'rejected') {
      this.first = event.first;
      this._currenRejectedPage = event.page + 1;
      this.getRejectedRequests();
    }
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
  }
  rejectRequestByMessage(type: any) {
    this._showLoader = true;;
    this.eventRequestService
      .getEventByVerificationStatus('rejected', this._currenRejectedPage)
      .subscribe({
        next: (data: any) => {
          this._rejectionMsg = '';
          this._showLoader = false;;

          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: data.body.msg,
            life: 3000,
          });
          if (type === 'pending') {
            this.getPendingEventRequests();
          }
          else {
            this.getAcceptedRequests()
          }

          this.showAcceptDialog = false;
        },
        error: (result: any) => {
          this._showLoader = false;;
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'Info',
            detail: result.error.msg,
            life: 3000,
          });
        },
        complete: () => { },
      });
  }
  updaterejectRequest(type: any, user: any) {
    this._showLoader = true;
    var updatedData;
    if (type == "accepted") {
      updatedData = {
        "verification_message": this._rejectionMsg,
        "status_id": 10
      }
    } else if (type == "pending") {
      updatedData = {
        "verification_message": this._rejectionMsg,
        "status_id": 10
      }
    }
    if (this._rejectionMsg.length > 50) {
      //this.eventsService.updateEvent(updatedData,detail.event_id).subscribe({""
      const msg = 'Event Rejected Successfully.'
      this.eventRequestService.updateVerificationStatusEvent(this._currentEventID, updatedData,msg).subscribe({

        next: (result: any) => {
          this._showLoader = false;
          this.showRejectionDialog = false;
          this.showAcceptDialog = false;
          this._rejectionMsg = '';
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: result.body.msg,
            life: 3000,
          });

          if (type === 'pending') {
            this.getPendingEventRequests();
          }
          else {
            this.getAcceptedRequests()
          }
        },
        error: (result: any) => {
          this._showLoader = false;;
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'Info',
            detail: result.error.msg,
            life: 3000,
          });
        },
        complete: () => { },
      });
    }
    else {
      this._showLoader = false;
      this.messageService.add({
        key: 'bc',
        severity: 'error',
        summary: 'Info',
        detail: 'Minimum 50 Word Required',
        life: 3000,
      });
    }
  }
}

