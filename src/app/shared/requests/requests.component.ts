import { Component, OnInit } from '@angular/core';
import { RequestServiceService } from '../../services/AdminRequestService/request-service.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
  providers: [MessageService, ConfirmationDialogService],
})
export class RequestsComponent implements OnInit {
  _skeleton:boolean=false;
  id=[1,2,3]
  tables=[1,2,3,1,1,1,1]
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
  _AcceptMsg: any = '';
  _currentRoleId: any;
  _currentUserId: any;
  token_id: any
  _responseData: any = [];
  _showLoader: boolean = false;
  azureLoggerConversion: any = new Error();
  _tabIndex = 0;
  first: number = 0;
  constructor(
    private requestService: RequestServiceService,
    private confirmationDialogService: ConfirmationDialogService,
    private messageService: MessageService,
    private router: Router,
    private azureLoggerService: MyMonitoringService
  ) {
    this.innerWidth = window.innerWidth;
  }
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  ngOnInit(): void {
  
    this.getPendingRequests();
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
    this._fieldData = data;
    this.showDialog = true;
  }
  closePopUp() {
    this.showDialog = false;
  }
  getPendingRequests() {
    this._showLoader = true;;
    this._getPendingUserList = [];
    const user_Id = 4;
    this.requestService.getRequests(user_Id, 'pending', this._currenPendingPage).subscribe({
      next: (data: any) => {
        this._getPendingUserList = [];
        this._showLoader = false;;
        this._totalPendingUser = data.body[0];
        this._getPendingUserList = data.body[1];
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
    this.requestService.getRequests(user_Id, 'accepted', this._currenAcceptedPage).subscribe({
      next: (data: any) => {
        this._getAcceptedUserList = [];
        this._showLoader = false;;
        this._totalAcceptedUser = data.body[0];
        this._getAcceptedUserList = data.body[1];
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
    this._showLoader = true;;
    const user_Id = 4;
    this._getRejectedUserList = [];
    this.requestService.getRequests(user_Id, 'rejected', 1).subscribe({
      next: (data: any) => {
        this._getRejectedUserList = [];
        this._showLoader = false;;
        this._totalRejectedUser = data.body[0];
        this._getRejectedUserList = data.body[1];
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
    const user_Id = 4;
    this.requestService
      .getRequestsWithSearch(user_Id, type, 1, seachText)
      .subscribe({
        next: (data: any) => {
          this._isSearching = false;
          this._showLoader = false;;
          if (this._currentType == 'pending') {
            this._getPendingUserList= [];
            this._getPendingUserList = data.body[1];
          } else if (this._currentType == 'accepted') {
            this._getAcceptedUserList=[];
            this._getAcceptedUserList = data.body[1];
          } else if (this._currentType == 'rejected') {
            this._getRejectedUserList = [];
            this._getRejectedUserList = data.body[1];
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
  acceptRequest(detail: any,type:any) {
    this.confirmationDialogService
      .confirm(
        'Please confirm..',
        'Are you sure you want to accept this invitation?'
      )
      .then((confirmed) => {
        if (confirmed) {
          this._showLoader = true;;
          const data = {
            user_id: detail.user_id,
            role_id: detail.role_id,
            verified: true,
          };
          this.requestService
            .updateRequests(detail.user_id, detail.role_id, true,this._AcceptMsg)
            .subscribe({
              next: (result: any) => {
                this._showLoader = false;
                this._AcceptMsg="Request Accepted successfully"
                this.messageService.add({
                 
                  key: 'bc',
                  severity: 'success',
                  summary: 'Success',
                  detail: this._AcceptMsg,
                  life: 3000,
                });

                    if(type=== 'pending'){
                this.getPendingRequests();
              }
              else{
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
      this.getPendingRequests();
    } else if (data.index == 1) {
      this.getAcceptedRequests();
    } else if (data.index == 2) {
      this.getRejectedRequests();
    }
  }
  rejectRequest(data: any, tabName: any) {
    this._currentRoleId = data.role_id;
    this._currentUserId = data.user_id;
    if (tabName == 'pending') {

      this.showRejectionDialog = true;
      this.showAcceptDialog = false;
    }
    else {
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
  //     event.data.sort((data1:any, data2:any) => {
  //         let value1 = data1[event.field];
  //         let value2 = data2[event.field];
  //         let result = null;

  //         if (value1 == null && value2 != null)
  //             result = -1;
  //         else if (value1 != null && value2 == null)
  //             result = 1;
  //         else if (value1 == null && value2 == null)
  //             result = 0;
  //         else if (typeof value1 === 'string' && typeof value2 === 'string')
  //             result = value1.localeCompare(value2);
  //         else
  //             result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

  //         return (event.order * result);
  //     });
  // }
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
    }else{
      return true;
    }

  }
  paginate(event: any, type: string) {
    this.first=event.first;
    if (type === 'pending') {
      this._currenPendingPage = event.page + 1;
      this.getPendingRequests();
    }
    if (type === 'accepted') {
      this._currenAcceptedPage = event.page + 1;
      this.getAcceptedRequests();
    }
    if (type === 'rejected') {
      this._currenRejectedPage = event.page + 1;
      this.getRejectedRequests();
    }
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
  }
  rejectRequestByMessage(type:any) {

    this._showLoader = true;;
    this.requestService
      .rejectWithMessage(this._currentUserId, this._currentRoleId, false, this._rejectionMsg)
      .subscribe({
        next: (data: any) => {
          this._rejectionMsg = 'Event Rejected successfully. ';
          this._showLoader = false;
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: this._rejectionMsg,
            life: 3000,
          });
          if(type=== 'pending'){
            this.getPendingRequests();
          }
          else{
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
}
