import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'stupa-official-list',
  templateUrl: './official-list.component.html',
  styleUrls: ['./official-list.component.scss'],
  providers: [MessageService],
})
export class OfficialListComponent implements OnInit {
  //#region 

  @Input() _tabIndex: any;
  _showDialog: boolean = false;
  _showOfficial: boolean = false
  _officialList: any = [];
  _officialListCopy: any = [];
  _officialRecentDeletedList: any = [];
  _officialRecentDeletedListCopy: any = [];
  _importOfficialList: any = [];
  _importOfficialListCopy: any = [];
  _showLoader: boolean = false;
  _searchByPlayerNameD: any = '';
  _searchByPlayerName: any = '';
  _eventId: any = 0;
  azureLoggerConversion: any = new Error()
  _officialForm: any = FormGroup;
  _isSubmit: boolean = false;
  _eventOfficial: any = [];
  _showMessage: boolean = false;
  //#endregion
  constructor(private encyptDecryptService: EncyptDecryptService, private azureLoggerService: MyMonitoringService,
    private eventsService: EventsService,
    private messageService: MessageService, private formBuilder: FormBuilder) {
    this.loadOfficialForm();
  }

  ngOnInit(): void {
    this._tabIndex = 0
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))
    this.getEventOfficial(true);
    this.getEventRecentOfficial(false);
  }
  ngOnChanges() {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))
    this.getEventOfficial(true);
    this.getEventRecentOfficial(false);
  }
  //#region ( With this method we are open add official page)
  openAddOfficial() {
    this._showOfficial = true
  }
  //#endregion
  //#region (With this we are opening base langpage)
  landPage(data: any) {
    this._showOfficial = data;
    this.getEventOfficial(true);
  }
  //#endregion
  //#region (Getting List of official for recent Tab)
  getEventRecentOfficial(state: any) {
    if (this._eventId != undefined) {
      this._showLoader = true
      this.eventsService.getEventOfficial(this._eventId, state).subscribe({
        next: (result: any) => {
          this._showLoader = false
          this._officialRecentDeletedList = [];
          this._officialRecentDeletedListCopy = [];
          this._officialRecentDeletedList = result.body;
          this._officialRecentDeletedListCopy = result.body;
        },
        error: (result) => {
          this._showLoader = false
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      })
    }
  }
  //#endregion
  //#region (This Method is use for get data base on selected tab)
  tabSelection(data: any) {
    this._tabIndex = data.index;
    this._searchByPlayerNameD = '';
    this._searchByPlayerName = '';
    if (data.index == 0) {
      this.getEventOfficial(true);
    } else {
      this.getEventRecentOfficial(false);
    }
  }
  //#endregion 
  //#region (This method is used for remove officials)
  removeOfficial(details: any) {
    this._showLoader = true

    const data = {
      "official_user_ids": [
        details.user_id
      ]
    }
    this.eventsService.removeOfficial(this._eventId, data).subscribe({
      next: (result: any) => {
        this._showLoader = false
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: result.body.msg,
          life: 3000,
        });
        this.getEventOfficial(true);
        this.getEventRecentOfficial(false);
      },
      error: (result) => {
        this._showLoader = false
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    })
  }
  //#endregion 
  //#region (This method is used for add officail in current selected event)
  addEventOfficial(details: any) {
    const data = {
      "official_user_id": details.user_id,
      "name": details.name,
      "email": details.email
    }
    const finalData = {
      officials: [data]
    }
    this._showLoader = true
    this.eventsService.addEventOfficial(this._eventId, finalData).subscribe({
      next: (result: any) => {
        this._showLoader = false
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: result.body.msg,
          life: 3000,
        });
        this._officialList = [];
        this._officialList = [];
        this._officialListCopy = result.body;
        this._officialList = result.body;
        this.getEventOfficial(false)
        this.getEventRecentOfficial(false);
      },
      error: (result) => {
        this._showLoader = false
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Something went wrong.',
          detail: result.error.msg,
          life: 3000,
        });
      },
      complete: () => { },
    })
  }
  //#endregion 
  //#region (This method is used for import officails into event)
  importMembers() {
    this._showLoader = true
    this.eventsService.getOfficialList(this._eventId).subscribe({
      next: (result: any) => {
        this._showLoader = false
        this._importOfficialList = [];
        this._importOfficialList = result.body;
        this._importOfficialListCopy = result.body;
        this._showDialog = true;
      },
      error: (result) => {
        this._showLoader = false
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    })
  }
  //#endregion
  //#region (This method is used for search in player list)
  searchPlayer() {
    this._officialList = this._officialListCopy.filter((item: any) => {
      return (
        item.name
          .toLowerCase()
          .includes(this._searchByPlayerName.trim().toLowerCase()) ||
        item.email
          .toLowerCase()
          .includes(this._searchByPlayerName.trim().toLowerCase())
      );
    });
  }
  //#endregion
  //#region (This method is used for search in player list)
  searchRecentDelatedPlayer() {
    this._officialRecentDeletedList = this._officialRecentDeletedListCopy.filter((item: any) => {
      return (
        item.name
          .toLowerCase()
          .includes(this._searchByPlayerNameD.toLowerCase()) ||
        item.email
          .toLowerCase()
          .includes(this._searchByPlayerNameD.toLowerCase())
      );
    });
  }
  //#endregion
  Close() {
    this.getEventOfficial(true);
    this.getEventRecentOfficial(false);
  }


  //#region Create Official/umpire for sweden
  AddOfficial() {
    this._isSubmit = true;
    if (this._officialForm.valid) {
      this._showMessage = true;
      this.eventsService.createOfficial(this._eventId, this._officialForm.controls.officialName.value, this._officialForm.controls.officialEmail.value).subscribe({
        next: (result: any) => {
          this._tabIndex = 0
          this.resetForm();
          this.getEventOfficial(true);
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: 'Official Created Successfully.',
            life: 3000,
          });
        },
        error: (result: any) => {
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: result.msg,
            life: 3000,
          });
        },
        complete: () => { },
      });
    }
  }

  getEventOfficial(state: any) {
    if (this._eventId != undefined || this._eventId != null) {
      this._showLoader = true
      this.eventsService.getEventOfficial(this._eventId, state).subscribe({
        next: (result: any) => {
          this._showLoader = false
          this._officialList = [];
          this._officialListCopy = [];
          this._officialList = result.body;
          this._officialListCopy = result.body;
        },
        error: (result) => {
          this._showLoader = false
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      })
    }
  }
  resetForm() {
    this._isSubmit = false;
    this._officialForm.reset();
    this._showMessage = false;
  }
  loadOfficialForm() {
    this._officialForm = this.formBuilder.group({
      officialName: new FormControl('', Validators.compose([Validators.required])),
      officialEmail: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      officialPhoto: new FormControl(''),
    });
  }
}
