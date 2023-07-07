import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { FixtureServiceService } from 'src/app/services/fixtures/fixture-service.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
import { NgttTournament } from '../fixture-tree/interfaces';

@Component({
  selector: 'stupa-consolation',
  templateUrl: './consolation.html',
  styleUrls: ['./consolation.scss'],
  providers: [MessageService, ConfirmationDialogService],
})
export class Consolation implements OnInit {
  //#region Variable Declarations
  public singleEliminationTournament!: NgttTournament;
  public doubleEliminationTournament!: NgttTournament;
  public renderedTree: 'se' | 'de' = 'de';
  _controller: boolean = true;
  _showLoader: boolean = false;
  _isAllAPIExcecuted: boolean = false;
  _isViewPlayerGrid: boolean = false;
  _showTree: boolean = false;
  _fixture: any = [];
  _topPlayersCopy: any = [];
  _topPlayers: any = [];
  _arrangePlayer: any = [];
  _matchDetailsList: any = [];
  _participantIdList: any = [];
  _mathesList: any = [];
  _fixtureTreeData: any = [];
  @Input() _fixtureScreen: boolean = false;
  @Input() _currentCategoryId: any;
  @Input() _currentParticipantId: any;
  @Input() isRefreshData: boolean = false;
  @Input() isKnockout: boolean = false;
  @Input() viewer: boolean = false;
  _showFull: boolean = false;
  _dialogStyle = { width: '95vw' };
  _teamList: any = [];
  _teamListCopy: any = [];
  _doubleList: any = [];
  _doubleListCopy: any = [];
  _mixDoubleList: any = [];
  _mixDoubleListCopy: any = [];
  _searchByPlayerNameView: any = '';
  _eventId: any;
  azureLoggerConversion: any = new Error();
  _viewerFlag: boolean = false;
  //#endregion Variable Declarations
  constructor(
    private fixtureService: FixtureServiceService,
    private messageService: MessageService,
    private confirmationDialogService: ConfirmationDialogService,
    private encyptDecryptService: EncyptDecryptService,
    private eventsService: EventsService,
    private azureLoggerService: MyMonitoringService
  ) { }

  ngOnInit(): void { }
  ngOnChanges(changes: SimpleChanges) {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')

    );
    this.singleEliminationTournament = {
      rounds: [
      ],
    };
    this.getFirstRoundKnockout();
    this.getKnockoutTournament();
    this._viewerFlag = window.location.href.split('/').includes('viewer') == true ? true : false
  }
  //#region get Updated list for first round
  updatedPullList(data: any) {
    this.singleEliminationTournament.rounds[0] = data;
  }
  //#endregion get Updated list for first round
  //#region method used for show hide controller
  showFixture() {
    this._fixtureScreen = true;
    this._controller = false;
  }
  //#endregion  method used for show hide controller
  //#region method is used for generate First Round of Knockout with Match Details
  getFirstRoundKnockout() {
    this._isAllAPIExcecuted = false;
    if (
      this._eventId !== undefined &&
      this._currentCategoryId !== undefined &&
      this._eventId !== null &&
      this._currentCategoryId !== null
    ) {
      this.fixtureService
        .generateFirstRoundConsolation(this._eventId, this._currentCategoryId)
        .subscribe({
          next: (result: any) => {
            this._isAllAPIExcecuted = true;
            this._showLoader = false;
            this._arrangePlayer = [];
            this._matchDetailsList = result.body;
            this._arrangePlayer = result.body
              .map((md: any) => md.match_details)
              .flat();
          },
          error: (result: any) => {
            this._isAllAPIExcecuted = true;
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
  //#endregion method is used for generate First Round of Knockout with Match Details
  //#region method is used for get latest updated list after drag drop
  returnUpdatedList(detailsAfterSwap: any) {
    this._arrangePlayer = detailsAfterSwap;
  }
  //#endregion method is used for get latest updated list after drag drop
  //#region method is used for generate Customized Knockout on Button click
  generateCustomeKO() {
    this._participantIdList = this._arrangePlayer.map(
      (id: any) => id.participant_id
    );
    this._mathesList = [];
    for (let i = 0; i < this._participantIdList.length; i += 2) {
      const matches = {
        participant_id_A: this._participantIdList[i],
        participant_id_B: this._participantIdList[i + 1],
      };
      this._mathesList.push(matches);
    }
    const data = {
      event_id: parseInt(this._eventId),
      category_id: this._currentCategoryId,
      round: this._mathesList.length * 2,
      matches: this._mathesList,
      group_type: 3,
    };
    this.fixtureService.generateCustomizedKnockout(data).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this.getKnockoutTournament();
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: result.body.msg,
          life: 3000,
        });
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
  //#endregion method is used for generate Customized Knockout on Button click
  //#region  method will called after used for  generate Customized Knockout on Button click
  getKnockoutTournament() {
    this._isAllAPIExcecuted = false;
    if (
      this._eventId !== undefined &&
      this._currentCategoryId !== undefined &&
      this._eventId !== null &&
      this._currentCategoryId !== null
    ) {
      this.fixtureService
        .getConsolationTournament(this._eventId, this._currentCategoryId)
        .subscribe({
          next: (result: any) => {
            this.getPlayerList();
            if (result.body.length > 0) {
              this.singleEliminationTournament.rounds = [];
              if (result.body.length == 1) {
                for (let i = 0; i < result.body.length; i++) {
                  if (result.body[i].round == 'Final') {
                    this._showTree = true;
                    const dd = {
                      umpire_name: result.body[i].umpire_name,
                      start_time: result.body[i].start_time,
                      table: result.body[i].table,
                      roundName: 'Final',
                      type: 'Final',
                      matches: result.body[i].matches,
                      match_id: result.body[i].match_id
                    };
                    this.singleEliminationTournament.rounds.push(dd);
                  } else {
                    this._showTree = false;
                  }
                }
              } else {
                this._showTree = true;
                for (let i = 0; i < result.body.length; i++) {
                  if (result.body[i].round == 'Final') {
                    this._showTree = true;
                    const dd = {
                      roundName: 'Final',
                      type: 'Final',
                      umpire_name: result.body[i].umpire_name,
                      start_time: result.body[i].start_time,
                      table: result.body[i].table,
                      matches: result.body[i].matches,
                      match_id: result.body[i].match_id
                    };
                    this.singleEliminationTournament.rounds.push(dd);
                  } else {
                    const dd = {
                      umpire_name: result.body[i].umpire_name,
                      start_time: result.body[i].start_time,
                      table: result.body[i].table,
                      roundName: result.body[i].round,
                      type: 'Winnerbracket',
                      matches: result.body[i].matches,
                      match_id: result.body[i].match_id
                    };
                    this.singleEliminationTournament.rounds.push(dd);
                  }
                }
              }
            } else {
              this._showTree = false;
            }
            this._isAllAPIExcecuted = true;
          },
          error: (result: any) => {
            this._showLoader = false;
            this.azureLoggerConversion = result.error.msg
            this.azureLoggerService.logException(this.azureLoggerConversion);
          },
          complete: () => { },
        });
    }
  }
  //#endregion method will called after used for  generate Customized Knockout on Button click
  //#region method is used for Save System Generated Group
  saveAsBefore() {
    if (
      this._eventId !== undefined &&
      this._currentCategoryId !== undefined &&
      this._eventId !== null &&
      this._currentCategoryId !== null
    ) {
      this.eventsService
        .createMatches(this._eventId, this._currentCategoryId, 2)
        .subscribe({
          next: (result: any) => {
            this._showLoader = false;
            this.getKnockoutTournament();
            this.messageService.add({
              key: 'bc',
              severity: 'success',
              summary: 'Success',
              detail: result.body.msg,
              life: 3000,
            });
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
  //#endregion method is used for Save System Generated Group
  //#region This method is used for Generate Fixture On Button Click
  generateFixtures() {
    const body = {
      event_id: this._eventId,
      category_id: this._currentCategoryId,
      participant_type_id: this._currentParticipantId,
      max_winners: 1,
      main_draw_participants: [],
      min_no_participant: 1,
    };
    this.eventsService.generateFixtures(body).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this.getFirstRoundKnockout();
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
  //#endregion
  //#region method is used for  delete fixture
  deleteFixture() {
    if (this._showTree) {
      this.confirmationDialogService
        .confirm(
          'Please confirm..',
          'Are you sure ,you want to delete this fixture? Once you delete the fixture all the changes, result and videos will be lost.'
        )
        .then((confirmed) => {
          if (confirmed) {
            this._showLoader = true;
            this.fixtureService
              .deleteKnockout(this._eventId, this._currentCategoryId, 3)
              .subscribe({
                next: (result: any) => {
                  this.regenerateKoFirstRoundTournament();
                },
                error: (result: any) => {
                  this._showLoader = false;
                  this.messageService.add({
                    key: 'bc',
                    severity: 'error',
                    summary: 'Error',
                    detail: result.error.msg,
                    life: 3000,
                  });
                  this.azureLoggerConversion = result.error.msg
                  this.azureLoggerService.logException(this.azureLoggerConversion)
                },
                complete: () => { },
              });
          } else {
          }
        })
        .catch(() => { });
    }
  }
  //#endregion
  //#region  method will open popup for View list
  viewPlayer() {
    if (this._topPlayers.length > 0) {
      this._isViewPlayerGrid = true;
    }
  }
  //#endregion method will open popup for View list
  //#region method will re-generate knockout first round tournament after delete fixure on button click
  regenerateKoFirstRoundTournament() {
    this.fixtureService
      .regenerateKoFirstRoundTournament(this._eventId, this._currentCategoryId)
      .subscribe({
        next: (result: any) => {
          this.getKnockoutTournament();
        },
        error: (result: any) => {
          this._showLoader = false;
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      });
  }
  //#endregion method will re-generate knockout first round tournament after delete fixure on button click
  //#region method is used for get Event Registed Players List
  getPlayerList() {
    this._showLoader = true;
    if (
      this._eventId !== undefined &&
      this._currentParticipantId !== undefined &&
      this._currentCategoryId !== undefined
    ) {
      this.eventsService
        .getEventRegistedPlayers(
          this._eventId,
          this._currentParticipantId,
          this._currentCategoryId
        )
        .subscribe({
          next: (result: any) => {
            this._showLoader = false;
            if (this._currentParticipantId == 1) {
              this._topPlayers = [];
              this._topPlayersCopy = [];
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
                  "rating": result.body[i].rating
                }
                this._topPlayers.push(data);
                this._topPlayersCopy.push(data);
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
            this._showLoader = false;
            this.azureLoggerConversion = result.error.msg
            this.azureLoggerService.logException(this.azureLoggerConversion)
            this._topPlayers = [];
            this._topPlayersCopy = [];
          },
          complete: () => { },
        });
    }
  }
  //#endregion method is used for get Event Registed Players List
  //#region method is used for get first letter into uppercase
  getFirstLetters(data: any) {
    if (data.split(' ').length > 1) {
      return (
        data.split(' ')[0].charAt(0).toUpperCase() +
        data.split(' ')[1].charAt(0).toUpperCase()
      );
    } else {
      return data.split(' ')[0].charAt(0).toUpperCase();
    }
  }
  //#endregion method is used for get first letter into uppercase
  //#region method is used for Search Player/team/pair after open popup
  searchPlayerInView() {
    if (this._currentParticipantId == 1) {
      this._topPlayers = [];
      this._topPlayers = this._topPlayersCopy.filter((item: any) => {
        return (
          item.name
            .toLowerCase()
            .includes(this._searchByPlayerNameView.toLowerCase()) ||
          item.email
            .toLowerCase()
            .includes(this._searchByPlayerNameView.toLowerCase())
        );
      });
    } else if (this._currentParticipantId == 2) {
      this._teamList = [];
      this._teamList = this._teamListCopy.filter((item: any) => {
        return (
          item.name
            .toLowerCase()
            .includes(this._searchByPlayerNameView.toLowerCase()) ||
          item.participant_name
            .toLowerCase()
            .includes(this._searchByPlayerNameView.toLowerCase())
        );
      });
    }
    else if (this._currentParticipantId == 3) {
      this._doubleList = [];
      this._doubleList = this._doubleListCopy.filter((item: any) => {
        return (
          item.name
            .toLowerCase()
            .includes(this._searchByPlayerNameView.toLowerCase()) ||
          item.participant_name
            .toLowerCase()
            .includes(this._searchByPlayerNameView.toLowerCase())
        );
      });
    }
    else if (this._currentParticipantId == 4) {
      this._mixDoubleList = [];
      this._mixDoubleList = this._mixDoubleListCopy.filter((item: any) => {
        return (
          item.name
            .toLowerCase()
            .includes(this._searchByPlayerNameView.toLowerCase()) ||
          item.participant_name
            .toLowerCase()
            .includes(this._searchByPlayerNameView.toLowerCase())
        );
      });
    }
  }
  //#endregion method is used for Search Player/team/pair after open popup
  //#region method is used for close popup
  closePopUpIsViewPlayerGrid() {
    this._searchByPlayerNameView = '';
    if (this._currentParticipantId == 1) {
      this._topPlayers = this._topPlayersCopy;
    } else if (this._currentParticipantId == 2) {
      this._teamList = this._teamListCopy;
    } else if (this._currentParticipantId == 3) {
      this._doubleList = this._doubleListCopy;
    } else if (this._currentParticipantId == 4) {
      this._mixDoubleList = this._mixDoubleListCopy;
    }
  }
  //#endregion method is used for close popup
  //#region method is used for hide(--) row in case of bye
  hideBye(data: any) {
    if (data.club == '' || data.club == 'BYE') {
      return true
    } else {
      return false
    }
  }
  //#endregion method is used for hide(--) row in case of bye
  refreshTree() {
    this.getKnockoutTournament();
  }
}