import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { FixtureServiceService } from 'src/app/services/fixtures/fixture-service.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { SocketService } from 'src/app/services/Sockets/socket.service';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';

@Component({
  selector: 'stupa-result-knockout',
  templateUrl: './result-knockout.component.html',
  styleUrls: ['./result-knockout.component.scss'],
  providers: [MessageService],
})
export class ResultKnockoutComponent implements OnInit {
  //#region Here we are declariong Variables
  @Input() _currentCategoryId: any;
  @Input() _currentParticipantId: any;
  _showLoader: boolean = false;
  _eventId: any;
  _matchDetailsList: any = [];
  _searchTeams: any = '';
  _matchDetailsListCopy: any = [];
  _newTeamList: any = [];
  _matchesArray: any = [];
  _knockoutTournament: any = [];
  _showTeam: boolean = false;
  _details: any = [];
  azureLoggerConversion: any = new Error();
  @Input() _selectedFixtureFormat: any
  //#endregion Here we are declariong Variables

  constructor(
    private eventsService: EventsService,
    private messageService: MessageService,
    private encyptDecryptService: EncyptDecryptService,
    private fixtureService: FixtureServiceService,
    private socketService: SocketService,
    private azureLoggerService: MyMonitoringService
  ) {

  }
  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this.getKnockoutTournament(this._eventId, this._currentCategoryId);
    this.callSocketForLiveScore();
  }

  //#region Method to close team Popup
  closePopUp() {
    this._showTeam = false;
    this._matchesArray = [];
  }
  //#endregion Method to close team Popup

  //#region API call to get response for knockout results
  getKnockoutTournament(eventId: any, categoryId: any) {
    this.fixtureService.getKnockoutTournament(eventId, categoryId, 'result').subscribe({
      next: (result: any) => {
        this._showLoader = false;
        if (result.body.length > 0) {
          
          this._matchDetailsList = result.body.map((m: any) => m.matches).flat().reverse();
          this._knockoutTournament = result.body.map((m: any) => m.matches).flat();
        } else {
          this._matchDetailsList = [];
          this._knockoutTournament = [];
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
  //#endregion API call to get response for knockout results

  //#region Method to search by rounds
  searchGroups() {
    this._matchDetailsList = this._knockoutTournament.filter((item: any) => {
      return item.round_description.toLowerCase().includes(this._searchTeams.toLowerCase());
    });
  }
  //#endregion Method to search by  rounds


  //#region API call to show teamScore
  showTeamScore(match_id: any, matches: any) {
    if (this._currentParticipantId === 2) {
      this._details = matches;
      this.eventsService.getTeamMatches(this._eventId, match_id).subscribe({
        next: (result: any) => {
          this._showLoader = false;
          this._newTeamList = result.body
            .map((md: any) => md.match_details)
            .flat();
          this._matchesArray = [];
          for (let i = 0; i < this._newTeamList.length; i += 2) {
            const matches = {
              participant_id_A: this._newTeamList[i],
              participant_id_B: this._newTeamList[i + 1],
            };
            this._matchesArray.push(matches);
            this._showTeam = true;

          }
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
  }
  //#endregion API call to show teamScore

  //#region Method to close team Popup
  RemoveTeamScreen() {
    this._showTeam = false;
  }
  //#endregion  Method to close team Popup
  //#region method used for Call socket for get live score
  callSocketForLiveScore() {
    this.socketService.getLiveScore().subscribe({
      next: (result: any) => {
      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    });
  }
  //#endregion method used for Call socket for get live score
}
