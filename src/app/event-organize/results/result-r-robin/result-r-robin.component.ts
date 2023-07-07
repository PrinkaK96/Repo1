import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { ProfileLettersService } from 'src/app/services/ProfileLetters/profile-letters.service';
import { SocketService } from 'src/app/services/Sockets/socket.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'stupa-result-r-robin',
  templateUrl: './result-r-robin.component.html',
  styleUrls: ['./result-r-robin.component.scss'],
  providers: [MessageService],
})
export class ResultRRobinComponent implements OnInit {
  //#region Here we are declaring Variables
  @Input() __getRadioValues: any;
  @Input() _currentCategoryId: any;
  @Input() _currentParticipantId: any
  _showLoader: boolean = false;
  _eventId: any;
  _matchDetailsList: any = [];
  _matchDetailsListCopy: any = [];
  _searchTeams: any = '';
  _matchesArray: any = [];
  overlayVisible: boolean = false;
  _showDialog: boolean = false;
  _showTeam: boolean = false;
  _newTeamList: any = false;
  _showPlayerData: boolean = false;
  _showPlayer: any = [];
  _showName: any;
  _team1: any = [];
  _team2: any = [];
  _upperCross: any;
  azureLoggerConversion: any = new Error();
  //#endregion Here we are declaring Variables

  constructor(
    private eventsService: EventsService,
    private messageService: MessageService,
    private encyptDecryptService: EncyptDecryptService,
    private socketService: SocketService,
    private profileLettersService: ProfileLettersService,
    private azureLoggerService: MyMonitoringService
  ) { }
  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    this._currentCategoryId;
    this._currentParticipantId;
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getGroupResults();
  }
  //#region API call to get group results and logic to display cross at [i]===[j] position

  getGroupResults() {
    this._matchDetailsList = [];
    this._showLoader = true;
    this.eventsService
      .getGroupResults(
        this._eventId,
        this._currentCategoryId
      )
      .subscribe({
        next: (result: any) => {
          this._showLoader = false;
          if (result.body.length > 0) {
            this._matchDetailsList = [];
            this._matchDetailsListCopy = [];
            for (let i = 0; i < result.body.length; i++) {
              for (let j = 0; j < result.body[i].length; j++) {
                const dd = {
                  position: 0
                }
                result.body[i][j].data.splice(j, 0, dd);
              }
            }
            this._matchDetailsList = result.body;
            this._matchDetailsListCopy = result.body;
          }
          else {
          }
          this.callSocketForLiveScore();
        },
        error: (result: any) => {
          this._showLoader = false;
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
          this.messageService.add({
            key: 'bc',
            severity: 'info',
            summary: 'Info',
            detail: result.error.msg,
            life: 3000,
          });
        },
        complete: () => { },
      });
  }
  //#endregion API call to get group results and logic to display cross at [i]===[j] position

  RemoveTeamScreen() {
    this._showTeam = false;
    this._matchesArray = []
  }

  //#region Method to close teams Popup
  closePopUp() {
    this._showDialog = false;
    this._matchesArray = [];
    this._showPlayerData = false
  }
  //#endregion Method to close teams Popup

  //#region Method to display scores on click on the basis of participantType
  toggle(showScore: boolean, data: any, index: any, name: any, team: any, indexp: any) {
    if (this._currentParticipantId === 2) {
      if (indexp < index) {
        this._upperCross = true;
      }
      else {
        this._upperCross = false;
      }
      this._team1 = []
      this._team2 = []
      this._matchesArray = []
      this.getTeamMatches(data.match_id, index, team[indexp].participant_id);
      this._team1 = team[indexp].participant_name;
      this._team2 = data
    }
    else {
      this._showPlayerData = true;
      this._showPlayer = data;
      this._showName = team[indexp].participant_name;
    }
  }
  //#endregion Method to display scores on click on the basis of participantType

  //#region search groups by number
  searchGroups() {
    if (this._searchTeams > 0) {
      this._matchDetailsList = this._matchDetailsListCopy.filter((val: any, i: any) => i == this._searchTeams - 1);
    }
    else {
      this._matchDetailsList = this._matchDetailsListCopy;
    }
  }
  //#endregion search groups by number

  //#region API call to fetch scores in case of Team
  getTeamMatches(match: any, index1: any, participantID: any) {
    if (match != undefined) {
      this.eventsService.getTeamMatchesByParticipantId(this._eventId, match, participantID).subscribe({
        next: (result: any) => {
          this._showLoader = false;
          this._matchesArray = [];
          this._newTeamList = [];
          this._newTeamList = result.body.map((md: any) => md.match_details).flat();
          for (let i = 0; i < this._newTeamList.length; i += 2) {
            const matches = {
              participant_id_A: this._newTeamList[i],
              participant_id_B: this._newTeamList[i + 1],
            };
            this._matchesArray.push(matches);
            this._showTeam = true;
            this.overlayVisible = true;
          }
        },
        error: (result: any) => {
          this._showLoader = false;
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'Error',
            detail: result.error.msg,
            life: 3000,
          });
        },
        complete: () => { },
      });
    }
  }
  //#endregion API call to fetch scores in case of Team

  profileLetterService(data: any) {
    return this.profileLettersService.getFirstLetters(data);
  }
  //#region method used for Call socket for get live score
  callSocketForLiveScore() {
    //this.socketService.fetchEventResult();
    this.socketService.getLiveScore().subscribe({
      next: (result: any) => {
        result;
      },
      error: (result: any) => {
        result;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    });
  }
  //#endregion method used for Call socket for get live score
}
