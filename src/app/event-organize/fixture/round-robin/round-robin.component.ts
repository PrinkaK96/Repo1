import { Component, Input, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'stupa-round-robin',
  templateUrl: './round-robin.component.html',
  styleUrls: ['./round-robin.component.scss'],
  providers: [MessageService, ConfirmationDialogService],
})
export class RoundRobinComponent {
  //#region Variable Declarations
  _selectedPlayerForMainDraw: any = [];
  _topPlayersList: any = [];
  @Input() _matchFinished: boolean = false;
  @Input() _currentCategoryId: any;
  @Input() _currentParticipantId: any;
  @Input() _tabIndex: any;
  @Input() _categoryName: any;
  @Input() _fixtureFormat: any;
  _eventId: any;
  _matchDetailsList: any = [];
  _matchDetailsListCopy: any = [];
  _showLoader: boolean = false;
  _groupList: any = [];
  _isLocked: boolean = false;
  _finalGroupList: any = [];
  _participantContainer: any = [];
  _topPlayers: any = [];
  _topPlayersCopy: any = [];
  _dialogStyle = { width: '95vw' };
  _isViewPlayerGrid: boolean = false;
  _searchByPlayerNameView: any = '';
  _showFull: boolean = false;
  _saveBut: boolean = false;
  _teamList: any = [];
  _teamListCopy: any = [];
  _doubleList: any = [];
  _doubleListCopy: any = [];
  _mixDoubleList: any = [];
  _mixDoubleListCopy: any = [];
  azureLoggerConversion: any = new Error();
  _showSetting: boolean = false;
  _UpdateScore: boolean = false;
  _matchFullDetails: any = [];
  _parent_match_id: any;
  _scoreArray: any = [];
  _groupId: any;
  //#endregion Variable Declarations
  constructor(
    private eventsService: EventsService,
    private confirmationDialogService: ConfirmationDialogService,
    private azureLoggerService: MyMonitoringService,
    private encyptDecryptService: EncyptDecryptService,
    private messageService: MessageService) {
  }

  ngOnInit(): void {
    // this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    // this.getPlayerList();
    // this.getGroupList()
    // this.getGroupMatchDetails();
  }
  ngOnChanges(changes: SimpleChanges) {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getPlayerList();
    this.getGroupList()
    this.getGroupMatchDetails();
  }
  //#region method is used for get Group matches if group created
  getGroupMatchDetails() {
    if (this._eventId !== undefined && this._currentCategoryId !== undefined && this._eventId !== null && this._currentCategoryId !== null) {
      this._matchDetailsList = [];
      this._matchDetailsListCopy = []
      this.eventsService.getGroupMatchDetailsV3(this._eventId, this._currentCategoryId, 1).subscribe({
        next: (result: any) => {
          this._topPlayersList = [];
          if (result.body.length > 0) {
            this._topPlayersList = result.body[0].group_match_details;
          }
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion);
        },
        complete: () => { },
      });
    }
    this.checkCatMatches(this._currentCategoryId)
  }
  //#endregion method is used for get Group matches if group created
  //#region method is used for create draw on button click
  createDraw() {
    const body = {
      event_id: this._eventId,
      category_id: this._currentCategoryId,
      participant_type_id: this._currentParticipantId,
      max_winners: 1,
      main_draw_participants: [],
      min_no_participant: 1,
    };
    this._showLoader = true
    this.eventsService.generateFixtures(body).subscribe({
      next: (result: any) => {
        this._showLoader = false
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: result.body.msg,
          life: 3000,
        });
        this.getGroupList();
      },
      error: (result: any) => {
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg;
        this.azureLoggerService.logException(this.azureLoggerConversion);
      },
      complete: () => { },
    });
  }
  //#endregion method is used for create draw on button click
  //#region method is used for get system generated groups
  getGroupList() {
    if (this._eventId !== undefined && this._currentCategoryId !== undefined && this._eventId !== null && this._currentCategoryId !== null) {
      //this._showLoader=true
      this.eventsService
        .getGroupList(this._eventId, this._currentCategoryId, 1)
        .subscribe({
          next: (result: any) => {
            this._groupList = [];
            if (result.body.length > 0) {
              this._groupList = result.body[0].group_details;
              this._isLocked = result.body[0].locked;
            } else {
              this._isLocked = false;
            }
          },
          error: (result) => {
            this.azureLoggerConversion = result.error.msg;
            this.azureLoggerService.logException(this.azureLoggerConversion);
          },
          complete: () => { },
        });
    }

  }
  //#endregion method is used for get system generated groups
  //#region  method is used for get latest data after drag drop
  returnUpdatedList(detailsAfterSwap: any) {
    this._groupList = detailsAfterSwap;
  }
  //#endregion  method is used for get latest data after drag drop
  //#region method is used for delete fixture after button click
  deleteFixtures(text: any) {
    this.confirmationDialogService
      .confirm(
        'Please confirm..',
        'Are you sure ,you want to ' + text + ' this fixture? Once you delete the fixture all the changes, result and videos will be lost.'
      )
      .then((confirmed) => {
        if (confirmed) {
          this._showLoader = true;
          this.eventsService.deleteFixtures(this._currentCategoryId, this._eventId).subscribe({
            next: (result: any) => {
              this._showLoader = false
              this.messageService.add({
                key: 'bc',
                severity: 'success',
                summary: 'Success',
                detail: result.body.msg,
                life: 3000,
              });
              this._isLocked = false;
              this.getGroupList();
              this.getGroupMatchDetails();
            },
            error: (result: any) => {
              this._showLoader = false;
              this.azureLoggerConversion = result.error.msg;
              this.azureLoggerService.logException(this.azureLoggerConversion);
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
  //#endregion  method is used for delete fixture after button click
  //#region method is used for create custom groups on button click
  createCustomGroup() {
    this._saveBut = true;
    this._showLoader = true
    this._finalGroupList = [];
    this._participantContainer = [];
    for (let i = 0; i < this._groupList.length; i++) {
      const data = {
        participant_id: this._groupList[i].participant_id,
        position: i + 1,
      };
      this._participantContainer.push(data);
    }
    const body = {
      event_id: this._eventId,
      category_id: this._currentCategoryId,
      max_winners: 1,
      locked: true,
      groups: [{
        "participants": this._participantContainer
      }],
    };
    this.eventsService.createCustomGroups(body).subscribe({
      next: (result: any) => {
        this._showLoader = false
        this.createMatches();
      },
      error: (result: any) => {
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg;
        this.azureLoggerService.logException(this.azureLoggerConversion);
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
  //#endregion method is used for create custom groups on button click
  //#region method is used for create system generated groups on button click
  saveAsBefore() {
    this._saveBut = true;
    this._showLoader = true;
    this.eventsService.lockGroup(this._eventId, this._currentCategoryId)
      .subscribe({
        next: (result: any) => {
          this._showLoader = false;
          this.createMatches();
        },
        error: (result: any) => {
          this._showLoader = false;
          this.azureLoggerConversion = result.error.msg;
          this.azureLoggerService.logException(this.azureLoggerConversion);
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
  //#endregion method is used for create system generated groups on button click
  //#region method Hit API After saveAsBefore on Button click and get system generated group matches
  createMatches() {
    this._showLoader = true
    this.eventsService
      .createMatches(
        this._eventId,
        this._currentCategoryId,
        1
      )
      .subscribe({
        next: (result: any) => {
          this._showLoader = false;
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: result.body.msg,
            life: 3000,
          });
          this.getGroupList();
          this.getGroupMatchDetails();
        },
        error: (result: any) => {
          this._showLoader = false;
          this.azureLoggerConversion = result.error.msg;
          this.azureLoggerService.logException(this.azureLoggerConversion);
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
  //#endregion method Hit API After saveAsBefore on Button click and get system generated group matches

  //#region method is used for get event register players list
  getPlayerList() {
    if (this._eventId != undefined) {
      // this._showLoader=true
      this.eventsService
        .getEventRegistedPlayers(
          this._eventId,
          this._currentParticipantId,
          this._currentCategoryId
        )
        .subscribe({
          next: (result: any) => {
            this._showLoader = false
            this._topPlayers = [];
            this._topPlayersCopy = [];

            if (this._currentParticipantId == 1) {
              this._topPlayers = [];
              this._topPlayersCopy = [];
              this._showLoader = false
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
                  "participant_id": result.body[i].participant_id
                }
                this._topPlayers.push(data);
                this._topPlayersCopy.push(data);
              }
            } else if (this._currentParticipantId == 2) {
              this._showLoader = false
              this._teamList = []
              this._teamListCopy = [];
              this._teamList = result.body;
              this._teamListCopy = result.body;
            } else if (this._currentParticipantId == 3) {
              this._showLoader = false
              this._doubleList = []
              this._doubleListCopy = [];
              this._doubleList = result.body;
              this._doubleListCopy = result.body;
            } else if (this._currentParticipantId == 4) {
              this._showLoader = false
              this._mixDoubleList = []
              this._mixDoubleListCopy = [];
              this._mixDoubleList = result.body;
              this._mixDoubleListCopy = result.body;
            }
          },
          error: (result: any) => {
            this._showLoader = false
            this._topPlayers = [];
            this._topPlayersCopy = [];
            this.azureLoggerConversion = result.error.msg
            this.azureLoggerService.logException(this.azureLoggerConversion)
          },
          complete: () => { },
        });
    }
  }
  //#endregion method is used for get event register players list
  //#region  method is used for perform search in player list in case of popup
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
  //#endregion method is used for perform search in player list in case of popup
  //#region Method is used for open popup for view playerlist in Grid
  viewPlayer() {
    this._isViewPlayerGrid = true;
  }
  //#endregion Method is used for open popup for view playerlist in Grid
  //#region method is used for refresh all API Data
  refreshAllData() {
    this.getPlayerList();
    this.getGroupList()
    this.getGroupMatchDetails();
  }
  //#endregion  method is used for refresh all API Data
  //#region get set score. If score not greater then it will return ''
  getSetScore(data: any) {
    if (data[0].set_won !== null && data[1].set_won !== null) {
      if (data[0].set_won > 0 || data[1].set_won > 0) {
        return data[0].set_won + '-' + data[1].set_won
      } else {
        return ''
      }
    } else {
      return ''
    }
  }
  //#endregion get set score. If score not greater then it will return ''
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
  //#endregion  method is used for close popup
  //#region used for Check Matches finished for particul category
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
    this._showSetting = true
  }
  updateScore(data: any) {
    this._matchFullDetails = [];
    this._scoreArray = []
    this._groupId = data.group_id;
    if (this._currentParticipantId == 2) {
      this._parent_match_id = data.match_id;
      this.eventsService.getTeamParticipantsDetails(this._eventId, this._currentCategoryId, data.match_id).subscribe({
        next: (result: any) => {
          this._matchFullDetails = result.body
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      });
    } else {
      for (let f = 0; f < data.match_details[0].score.length; f++) {
        const dd = { value: this.digits_count(data.match_details[0].score[f]) + '-' + this.digits_count(data.match_details[1].score[f]) }
        this._scoreArray.push(dd)
      }
      const dd = {
        "table": data.table,
        "start_time": data.start_time,
        "umpire_name": data.umpire_name,
        "round_name": data.round_level,
        "match_id": data.match_id,
        "group_id": data.group_id,
        "participantA_id": data.match_details[0].participant_id,
        "participantB_id": data.match_details[1].participant_id,
        "participantA_name": data.match_details[0].participant_name,
        "participantB_name": data.match_details[1].participant_name,
        "sets": this._scoreArray
      }
      this._matchFullDetails.push(dd);
    }
    this._UpdateScore = true
  }
  isWinner(item: any) {
    if (item.winner == null) {
      return true;
    } else {
      return false;
    }
  }
  //#region Method is used for count digits
  digits_count(n: any) {
    if (n == 0) { return '00'; }
    else if (n == undefined) {
      return '00-00';
    } else if (n == 10) {
      return n;
    } else {
      var count = 0;
      if (n >= 1) ++count;
      while (n / 10 >= 1) {
        n /= 10;
        ++count;
      }
      if (count > 1) {
        return n
      } else {
        return '0' + n;
      }
    }
  }
  //#endregion  Method is used for count digits
  teamMatchCreated(detail: any) {
    this._UpdateScore = false;
    this.getGroupList();
    this.getGroupMatchDetails();
  }
  isEdit() {
    this._isLocked = false;
  }
}
