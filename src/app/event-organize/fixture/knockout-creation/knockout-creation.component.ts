import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { FixtureServiceService } from 'src/app/services/fixtures/fixture-service.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
@Component({
  selector: 'stupa-knockout-creation',
  templateUrl: './knockout-creation.component.html',
  styleUrls: ['./knockout-creation.component.scss'],
  providers: [MessageService, ConfirmationDialogService],
})
export class KnockoutCreationComponent {
  //#region Variable Declarations
  @Output() _schedule = new EventEmitter<{ schedule: boolean }>();
  @Output() isMatchesCreated = new EventEmitter<any>();
  @Output() getTree = new EventEmitter<any>();
  @Input() _currentCategoryId: any;
  @Input() _currentParticipantId: any;
  @Input() totalPlayer: any;
  @Input() _reCreate: any;
  _showLoader: boolean = false;
  _showFull: boolean = false;
  _fixtureScreen: boolean = false;
  _showCustomizedFixture: boolean = false;
  showSchedule: boolean = false;
  _showTree: boolean = false;
  _showTooltip: any = false;
  _isViewPlayerGrid: boolean = false;
  _activeIndex = 0;
  _groupPlayOffSteps: any = [
    {
      label: 'Group Creation',
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
  _eventId: any;
  _arrangePlayer: any = [];
  match_details: any = [];
  _data: any = [];
  _finalData: any = [];
  _participantID: any = [];
  _matchDetailsList: any = [];
  _topPlayers: any = [];
  _topPlayersCopy: any = [];
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

  //#endregion Variable Declarations
  constructor(
    private eventsService: EventsService,
    private messageService: MessageService,
    private encyptDecryptService: EncyptDecryptService,
    private fixtureService: FixtureServiceService,
    private confirmationDialogService: ConfirmationDialogService,
    private azureLoggerService: MyMonitoringService
  ) { }

  ngOnInit(): void {

    // this._eventId = this.encyptDecryptService.decryptUsingAES256(
    //   localStorage.getItem('event_id')
    // );
    // //#region First Time API Calling 
    // this.getFirstRoundKnockout();
    // this.getPlayerList();
    // //#endregion
  }
  //#region method will get latest changes
  ngOnChanges(changes: SimpleChanges) {
    // for (const propName in changes) {
    //   const chng = changes[propName];
    //   const cur = JSON.stringify(chng.currentValue);
    //   const prev = JSON.stringify(chng.previousValue);
    // }
    // //#region API Calling After Detect Change In Parent Component
    // this.getFirstRoundKnockout();
    // this.getPlayerList();
    // //#endregion
    this._eventId = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    if (this._reCreate) {
      this.generateFixtures();
    } 
    this.getFirstRoundKnockout();
    this.getPlayerList()
    this.checkCatMatches(this._currentCategoryId)
  }
  //#endregion
  //#region Method to Create First Round of Fixture on Button Click
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
  //#endregion Method to Create First Round of Fixture on Button Click

  //#region method is used for Save Group And Emit True to parent Component
  saveGroup() {
    this.showSchedule = true;
    this._schedule.emit({ schedule: this.showSchedule });
  }
  //#endregion method is used for Save Group And Emit True to parent Component
  //#region method is used for get Knockout Tournament After generate Fixtures or get First Round Knockout();
  getKnockoutTournament(eventId: any, categoryId: any) {
    this.fixtureService.getKnockoutTournament(eventId, categoryId).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this.saveGroup();
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
  //#region method is used for get First Round Knockout
  //eventId and categoryId Both are Required parameter For Hit API
  getFirstRoundKnockout() {
    this._matchDetailsList = [];
    if (this._eventId !== undefined && this._currentCategoryId !== undefined) {
      this.fixtureService
        .generateFirstRoundKnockout(this._eventId, this._currentCategoryId)
        .subscribe({
          next: (result: any) => {
            this._showLoader = false;
            this._arrangePlayer = result.body;
            this._matchDetailsList = result.body;
            this._arrangePlayer = this._arrangePlayer
              .map((md: any) => md.match_details)
              .flat();
            // this.getKnockoutTournament(this._eventId, this._currentCategoryId);
            if (this._matchDetailsList.length > 0) {
              this.isMatchesCreated.emit(true);
            } else {
              this.isMatchesCreated.emit(false);
            }
          },
          error: (result: any) => {
            this._showLoader = false;
            this.azureLoggerConversion = result.error.msg
            this.azureLoggerService.logException(this.azureLoggerConversion)
          },
          complete: () => { },
        });
    }
   
  }
  //#endregion
  //#region method is used for create Matches Same as System Generated
  justSaveKnockout() {
    this.eventsService
      .createMatches(this._eventId, this._currentCategoryId, 2)
      .subscribe({
        next: (result: any) => {
          this._showLoader = false;
          this._schedule.emit({ schedule: true });
          this.getTree.emit(true);
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
        },
        complete: () => { },
      });
  }
  //#endregion
  //#region method is used for Get Latest arrangement After Drag Drop
  returnUpdatedList(data: any) {
    this._arrangePlayer = data;
    this._showCustomizedFixture = true;
  }
  //#endregion
  //#region method is used for Save Customized Fixture after re-arranging list
  //This is Also used for get Knockout Tournament
  saveCustomizedFixture() {
    this._participantID = this._arrangePlayer.map(
      (id: any) => id.participant_id
    );
    let matchesArray = [];
    for (let i = 0; i < this._participantID.length; i += 2) {
      const matches = {
        participant_id_A: this._participantID[i],
        participant_id_B: this._participantID[i + 1],
      };
      matchesArray.push(matches);
    }
    const data = {
      event_id: parseInt(this._eventId),
      category_id: this._currentCategoryId,
      round: matchesArray.length * 2,
      matches: matchesArray,
    };
    this.fixtureService.generateCustomizedKnockout(data).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._schedule.emit({ schedule: true });
        this.getTree.emit(true)
        this.getKnockoutTournament(this._eventId, this._currentCategoryId);
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
  //#endregion
  //#region method is used for remove player From this._arrangePlayer
  removePlayer(id: any, index: any) {
    this.match_details.push(id)
    this._arrangePlayer.splice(index, 1);
  }
  //#endregion
  //#region  used for delete Fixture
  deleteFixture() {
    this.confirmationDialogService
      .confirm(
        'Please confirm..',
        'Are you sure ,you want to delete this fixture? Once you delete the fixture all the changes, result and videos will be lost.'
      )
      .then((confirmed) => {
        if (confirmed) {
          this._showLoader = true;
          this.fixtureService.deleteKnockout(this._eventId, this._currentCategoryId, 2).subscribe({
            next: (result: any) => {
              this._showLoader = false;
              this._arrangePlayer.length = 0;
              this._showTree = false;
              this._fixtureScreen = false;
            },
            error: (result: any) => {
              this._showLoader = false;
              this.azureLoggerConversion = result.error.msg
              this.azureLoggerService.logException(this.azureLoggerConversion)
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
  //#region method is used for Get List Of Event Registed Players
  getPlayerList() {
    if (this._eventId != undefined) {
      this._showLoader = true;
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
                  "rating": result.body[i].rating,
                  "points": result.body[i].points == null ? 0 : result.body[i].points,
                  "state": result.body[i].event_participant_details[0].state,
                  "participant_id": result.body[i].participant_id,

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
  //#endregion
  //#region method is used for Get First letters As Capital
  getFirstLetters(data: any) {
    if (data.split(' ').length > 1) {
      return data.split(' ')[0].charAt(0).toUpperCase() + data.split(' ')[1].charAt(0).toUpperCase()
    } else {
      return data.split(' ')[0].charAt(0).toUpperCase()
    }
  }
  //#endregion
  //#region method will open popup
  viewPlayer() {
    this._isViewPlayerGrid = true;
  }
  //#endregion
  //#region method is used for Search Player In View Popup
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
  //#endregion
  //#region method is used show (--) In Case of BYE
  hideBye(data: any) {
    if (data.club == 'BYE') {
      return true
    } else {
      return false
    }
  }
  //#endregion
  //#region method is used close popup
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
  //#region  used for Check Matches finished for particul category
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
  //#endregion
}
