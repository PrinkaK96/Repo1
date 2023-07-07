import { Component, Input, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { FixtureServiceService } from 'src/app/services/fixtures/fixture-service.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'stupa-knockout',
  templateUrl: './knockout.component.html',
  styleUrls: ['./knockout.component.scss'],
  providers: [MessageService, ConfirmationDialogService],
})
export class KnockoutComponent {
  //#region Variable
  @Input() _fixtureFormat: any
  @Input() _currentCategoryId: any;
  @Input() _currentParticipantId: any;
  _showLoader: boolean = false;
  _activeIndex = 0;
  _schedule: boolean = true;
  _showFull: boolean = false;
  _isMatchesCreated: boolean = false;
  _category: any = [];
  _groupPlayOffSteps: any = [
    {
      label: 'Knockout Round',
      command: (event: any) => {
        this._activeIndex = 0;
      },
    },
    {
      label: 'Main Draw',
      command: (event: any) => {
        this._activeIndex = 1;
      },
    },
  ];
  _matchDetailsList: any;
  _matchDetailsListCopy: any;
  _fixtureScreen: boolean = false;
  _showValues: boolean = false;
  _topPlayers: any = [];
  _topPlayersCopy: any = [];
  _isViewPlayerGrid: boolean = false;
  _dialogStyle = { width: '95vw' };
  _searchByPlayerNameView: any = '';
  _teamList: any = [];
  _teamListCopy: any = [];
  _doubleList: any = [];
  _doubleListCopy: any = [];
  _mixDoubleList: any = [];
  _mixDoubleListCopy: any = [];
  _matchFinished: any;
  azureLoggerConversion: any = new Error();
  _showSetting: boolean = false;
  _showUpdateScore: boolean = false;
  _reCreate: boolean = false;
  //#endregion
  constructor(
    private messageService: MessageService,
    private encyptDecryptService: EncyptDecryptService,
    private fixtureService: FixtureServiceService,
    private eventsService: EventsService,
    private confirmationDialogService: ConfirmationDialogService,
    private azureLoggerService: MyMonitoringService
  ) {
  }
  _eventId: any = 0;
  ngOnInit(): void {
    // this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    // this.isLockedGroup();
    // this.getPlayerList();
  }

  ngOnChanges(changes: SimpleChanges) {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this._showValues = false;
    this.isLockedGroup();
    this.getPlayerList();
  }
  //#region This Method is used for know index of current selected tab
  tabSelection(data: any) {
    this._category[data.index];
  }
  //#endregion
  //#region With this method is used for Get List of  First Round of Knockout
  getFirstRoundKnockout(categoryId: any) {
    if (this._eventId !== undefined && categoryId !== undefined) {
      this.fixtureService.generateFirstRoundKnockout(this._eventId, categoryId).subscribe({
        next: (result: any) => {
          this._showLoader = false;
          this._matchDetailsList = [];
          this._matchDetailsListCopy = [];
          for (let j = 0; j < result.body.length; j++) {
            const data = {
              "round_name": 'R' + result.body[j].round,
              "group_id": result.body[j].group_id,
              "match_id": result.body[j].match_id,
              "category_id": result.body[j].category_id,
              "group_name": 'G' + (j + 1),
              "participantA_id": result.body[j].match_details[0].participant_id,
              "participantB_id": result.body[j].match_details[1].participant_id,
              "participantA_name": result.body[j].match_details[0].participant_name,
              "participantB_name": result.body[j].match_details[1].participant_name,
              "isSelected": false,
              "event_id": this._eventId,
            }
            this._matchDetailsList.push(data);
            this._matchDetailsListCopy.push(data);
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
  //#endregion
  //#region This Method is used for Get List of  Knockout Tournament
  getKnockoutTournament(eventId: any, categoryId: any) {
    this.fixtureService.getKnockoutTournament(eventId, categoryId).subscribe({
      next: (result: any) => {
        this._showLoader = false;
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
  //#region This method is used for check is Group is locked of not
  isLockedGroup() {
    this._showLoader = false;
    if (this._eventId !== undefined && this._currentCategoryId !== undefined) {
      this.eventsService
        .getGroupList(this._eventId, this._currentCategoryId, 2)
        .subscribe({
          next: (result: any) => {
            if (result.body.length > 0) {
              this._fixtureScreen = result.body[0].locked;
              if (this._fixtureScreen) {
                this._showValues = true;
                // this.getKnockoutTournament(this._eventId, this._currentCategoryId)
                this._activeIndex = 1;
              }
              else {
                this._activeIndex = 0;
                this._fixtureScreen = false;
                this._showValues = false;
              }
              this.getKnockoutTournament(this._eventId, this._currentCategoryId)
            }
          },
          error: (result) => {
            this._showLoader = false;
            this.azureLoggerConversion = result.error.msg
            this.azureLoggerService.logException(this.azureLoggerConversion)
          },
          complete: () => { },
        });
    }
    this.checkCatMatches(this._currentCategoryId)
  }
  //#endregion
  //#region This method is just refresh data base on schedule parameter
  openSchedule(eventData: { schedule: boolean }) {
    this._schedule = eventData.schedule;
    this.isLockedGroup();
    this.getPlayerList()
  }
  //#endregion
  //#region This method is used for get First Round of Knockout base on categoryId
  getListWithCategoryId(categoryId: any) {
    this.getFirstRoundKnockout(categoryId);
  }
  //#endregion
  //#region This method is used for check is match is created or not
  isMatchesCreated(data: any) {
    this._isMatchesCreated = data;
  }
  //#endregion
  //#region This method is used for delete fixture
  deleteFixture(text: any) {
    this.confirmationDialogService
      .confirm(
        'Please confirm..',
        'Are you sure ,you want to ' + text + ' this fixture? Once you delete the fixture all the changes, result and videos will be lost.'
      )
      .then((confirmed) => {
        if (confirmed) {

          this._showLoader = false;
          this.fixtureService.deleteKnockout(this._eventId, this._currentCategoryId, 2).subscribe({
            next: (result: any) => {
              this._showLoader = false;
              this._showValues = false;
              if (text == 'Edit') {
                this._reCreate = true;
              } else {
                this._reCreate = false;
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
            complete: () => {
            },
          });
        } else {
        }
      })
      .catch(() => { });
  }
  //#endregion
  //#region This method is used for Get Player List
  getPlayerList() {
    this._showLoader = false;
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
                "rating": result.body[i].rating == null ? 0 : result.body[i].rating
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
  //#endregion
  //#region This method is used for Refresh All Data
  refreshAllData() {
    this._showValues = false;
    this.isLockedGroup();
    this.getPlayerList()
  }
  //#endregion
  //#region Open Popup For view list of player
  viewPlayer() {
    this._isViewPlayerGrid = true;
  }
  //#endregion
  //#region For Search
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
          item.participant_name
            .toLowerCase()
            .includes(this._searchByPlayerNameView.toLowerCase())
        );
      });
    }
  }
  //#endregion
  //#region This method is used for Get Tree
  getTree(data: any) {
    this._showValues = false;
    this.isLockedGroup();
    this.getPlayerList()
  }
  //#endregion
  //#region Close Popup
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
  //#endregion
  //#region For check matches base on particular category
  checkCatMatches(categoryId: any) {
    if (this._eventId != undefined) {
      this.eventsService.checkCatMatchFinished(this._eventId, categoryId).subscribe({
        next: (result: any) => {
          if (result.body) {
            this._matchFinished = true;
          }
          else {
            this._matchFinished = false;
          }
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      });
    }
  }
  showSetting() {
    this._showSetting = true;
  }
  //#endregion
  edit(data: any) {
    this._showValues = false;
  }
}

