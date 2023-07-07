import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
@Component({
  selector: 'stupa-import-member-dialog',
  templateUrl: './import-member-dialog.component.html',
  styleUrls: ['./import-member-dialog.component.scss'],
  providers: [MessageService],
})
export class ImportMemberDialogComponent implements OnInit, OnChanges {
  //#region (Variabale)
  _officialList: any = [];
  _showLoader: boolean = false;
  _eventId: any = 0;
  _officialListCopy: any = [];
  _searchTeams: any = '';
  azureLoggerConversion: any = new Error()
  @Input() _importOfficialList: any = [];
  @Input() _importOfficialListCopy: any = [];
  @Output() getOfficial = new EventEmitter<any>();
  _showToast: boolean = false;
  _toastSubHeading: any;
  _toastHeading: any = '';
  _toastSeverity: any = ' ';
  //#endregion
  constructor(
    private eventsService: EventsService,
    private encyptDecryptService: EncyptDecryptService,
    private azureLoggerService: MyMonitoringService) {

  }
  ngOnChanges(changes: SimpleChanges) {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))
  }
  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))
  }
  //#region (Getting officail List)
  getOfficialList() {
    this.eventsService.getOfficialList(this._eventId).subscribe({
      next: (result: any) => {
        this._officialList = result.body;
        this._officialListCopy = result.body;
      },
      error: (result) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    })
  }
  //#endregion
  //#region  (With This method we are adding officail in event)
  addEventOfficial(details: any) {
    const data = {
      "official_user_id": details.user_id,
      "name": details.name,
      "email": details.email
    }
    const finalData = {
      officials: [data]
    }
    this.eventsService.addEventOfficial(this._eventId, finalData).subscribe({
      next: (result: any) => {
        this._officialList = result.body;
        this.getOfficial.emit();
        this._toastSeverity = 'success'
        this._toastHeading = 'Imported'
        this._toastSubHeading = result.body.msg
        this._showToast = true
        const lifeTime = setInterval(() => {
          this._showToast = false
          clearInterval(lifeTime)
        }, 3000);
      },
      error: (result) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this._officialList = [];
      },
      complete: () => { },
    })
  }
  //#endregion
  //#region (With this method we are Searching teams)
  findTeams() {
    this._importOfficialList = this._importOfficialListCopy.filter((item: any) => {
      return (
        item.name
          .toLowerCase()
          .includes(this._searchTeams.toLowerCase()) ||
        item.email
          .toLowerCase()
          .includes(this._searchTeams.toLowerCase())
      );
    });
  }
  //#region 
}
