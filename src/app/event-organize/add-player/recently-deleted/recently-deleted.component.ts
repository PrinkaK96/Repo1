import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'stupa-recently-deleted',
  templateUrl: './recently-deleted.component.html',
  styleUrls: ['./recently-deleted.component.scss'],
  providers: [MessageService]
})
export class RecentlyDeletedComponent implements OnInit {
  @Input() _currentParticipantId: any = '';
  @Input() _categoryId: any;
  @Output() landPage = new EventEmitter<any>();
  _skeleton: boolean = false;
  idies = [1, 2, 3, 4];
  tables = [1, 2, 3, 4, 5, 6, 7];
  _playerList: any = [];
  _eventId: any;
  _showLoader: boolean = false;
  _players: any = [];
  _playersCopy: any = [];
  _teamList: any = [];
  _teamListCopy: any = [];
  _doubleList: any = [];
  _doubleListCopy: any = [];
  _mixDoubleList: any = [];
  _mixDoubleListCopy: any = [];
  _searchByPlayerName: any = '';
  _searchByTeamName: any = '';
  azureLoggerConversion: any = new Error()
  constructor(
    private encyptDecryptService: EncyptDecryptService,
    private azureLoggerService: MyMonitoringService,
    private eventsService: EventsService,
    private messageService: MessageService) {
  }
  goBackLandPage() {
    this.landPage.emit(false);
  }
  ngOnInit(): void { }
  ngOnChanges(changes: SimpleChanges) {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this.getPlayerList();
  }
  getPlayerList() {
    this._showLoader = true;
    if (this._eventId !== undefined && this._eventId !== null &&
      this._currentParticipantId !== undefined && this._currentParticipantId !== null && this._categoryId !== undefined && this._categoryId !== null) {
      this.eventsService.getEventRegisteredParticipants(this._eventId, this._currentParticipantId, this._categoryId).subscribe({
        next: (result: any) => {
          if (this._currentParticipantId == 1) {
            this._players = [];
            this._playersCopy = [];
            this._showLoader = false;
            for (let i = 0; i < result.body.length; i++) {
              const data = {
                "user_id": result.body[i].event_participant_details[0].user_id,
                "name": result.body[i].participant_name,
                "email": result.body[i].event_participant_details[0].email,
                "gender_id": result.body[i].event_participant_details[0].gender_id,
                "isSelected": false,
                "club": result.body[i].club,
                "points": result.body[i].points == null ? 0 : result.body[i].points,
                "state": result.body[i].event_participant_details[0].state,
                "participant_id": result.body[i].participant_id,
                "rating": result.body[i].rating,
                "license": result.body[i].event_participant_details[0].license,
              }
              this._players.push(data);
              this._playersCopy.push(data);
            }
          } else if (this._currentParticipantId == 2) {
            this._showLoader = false;
            this._teamList = []
            this._teamListCopy = [];
            this._teamList = result.body;
            this._teamListCopy = result.body;
          } else if (this._currentParticipantId == 3) {
            this._showLoader = false;
            this._doubleList = []
            this._doubleListCopy = [];
            this._doubleList = result.body;
            this._doubleListCopy = result.body;
          } else if (this._currentParticipantId == 4) {
            this._showLoader = false;
            this._mixDoubleList = []
            this._mixDoubleListCopy = [];
            this._mixDoubleList = result.body;
            this._mixDoubleListCopy = result.body;
          }
        },
        error: (result: any) => {
          this._players = [];
          this._playersCopy = [];
          this._teamList = []
          this._teamListCopy = []
          this._mixDoubleList = []
          this._mixDoubleListCopy = [];
          this._doubleList = []
          this._doubleListCopy = [];
          this._showLoader = false;
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      });
    }

  }
  searchPlayer() {
    this._players = this._playersCopy.filter((item: any) => {
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
  searchTeam() {
    this._teamList = this._teamListCopy.filter((item: any) => {
      return (
        item.participant_name
          .toLowerCase()
          .includes(this._searchByTeamName.toLowerCase()) ||
        item.email
          .toLowerCase()
          .includes(this._searchByTeamName.toLowerCase())
      );
    });
  }
  removeEventRegisteredParticipants(users: any) {
    this.eventsService.removeEventRegisteredParticipants(this._eventId, users.participant_id, true).subscribe({
      next: (result: any) => {
        this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: result.body.msg, life: 3000 });
        this.getPlayerList();
      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this.messageService.add({ key: 'bc', severity: 'info', summary: 'Info', detail: result.error.msg, life: 3000 });
        this.getPlayerList();
      },
      complete: () => { },
    });
  }
}
