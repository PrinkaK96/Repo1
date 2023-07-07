import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestServiceService } from 'src/app/services/AdminRequestService/request-service.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';

@Component({
  selector: 'stupa-dshboard-single',
  templateUrl: './dshboard-single.component.html',
  styleUrls: ['./dshboard-single.component.scss']
})
export class DshboardSingleComponent implements OnInit {
  //#region Here we are declaring Variables
  _skeleton: boolean = false;
  idies = [1, 2, 3];
  tables = [1, 2, 3, 1, 1, 1, 1];
  _playersList: any = [];
  _playersListCopy: any = [];
  _totalPendingUser: number = 10;
  _pending: any = '';
  event_id: any
  _showLoader: boolean = false;
  _searchByPlayerName: any = '';
  showDialog: boolean = false;
  _fieldData: any = [];
  _currenAcceptedPage: number = 1;
  _totalAcceptedUser: any = [];
  azureLoggerConversion: any = new Error();
  //#endregion Here we are declaring Variables
  constructor(private router: Router, private eventService: EventsService, private azureLoggerService: MyMonitoringService,
    private encyptDecryptService: EncyptDecryptService, private requestService: RequestServiceService,

  ) { }
  ngOnInit() {
    this.event_id = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))
    this.getAcceptedRequests();
  }
  goBack() {
    this.router.navigate(['/profile-menu']);
  }

  //#region API CALL to get list of players
  getPlayers() {
    //   this._showLoader = true;
    //  this._showLoader=true;
    this._showLoader = true
    this.eventService.getPlayers(null).subscribe({
      next: (data: any) => {
        // this._showLoader = false;
        this._showLoader = false;
        this._playersList = data.body;
        this._playersListCopy = data.body;

      },
      error: (result: any) => {
        // this._showLoader = false;
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => {
        // this._showLoader = false;
        this._showLoader = false;

      },
    });
  }
  //#endregion API CALL to get list of players

  //#region API CALL to get list of accepted entries
  getAcceptedRequests() {
    // this._showLoader = true;
    this._showLoader = true;
    const user_Id = 4;
    this._playersList = [];

    this.requestService.getRequestsByRoleId(user_Id, 'accepted', this._currenAcceptedPage).subscribe({
      next: (data: any) => {
        // this._showLoader = false;
        this._showLoader = false;
        this._playersList = data.body[1];
        this._playersListCopy = data.body[1];
        this._totalAcceptedUser = data.body[0];
        //this._getAcceptedUserList = data.body[1];
      },
      error: (result: any) => {
        // this._showLoader = false;
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)

      },
      complete: () => { },
    });
  }
  //#endregion  API CALL to get list of accepted entries

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

  //#region METHOD to get accepted entries on per page change(get paginated requests)
  paginate(event: any, type: string) {
    // this._currenPendingPage = event.page + 1;
    if (type === 'accepted') {
      this._currenAcceptedPage = event.page + 1;
      this.getAcceptedRequests();
    }

    //#endregion METHOD to get accepted entries on per page change(get paginated requests)
  }

  //#region method to search player by name, email or state
  searchPlayer() {
    this._playersList = this._playersListCopy.filter((item: any) => {
      return (
        item.name
          .toLowerCase()
          .includes(this._searchByPlayerName.toLowerCase()) ||
        item.email
          .toLowerCase()
          .includes(this._searchByPlayerName.toLowerCase()) ||
        item.state
          .toLowerCase()
          .includes(this._searchByPlayerName.toLowerCase())
      );
    });
  }
  //#endregion  method to search player by name, email or state


  //#region method to pass data to child component(stupa-player-details) to view details of players
  _showDetails(data: any) {
    this._fieldData = data;
    this.showDialog = true;
  }
  //#endregion method to pass data to child component(stupa-player-details) to view details of players

  //#region method to close popup
  closePopUp() {
    this.showDialog = false;
  }
  //#endregion method to close popup
}
