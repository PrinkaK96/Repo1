import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'stupa-group-creation',
  templateUrl: './group-creation.component.html',
  styleUrls: ['./group-creation.component.scss'],
  providers: [MessageService, ConfirmationDialogService],
})
export class GroupCreationComponent implements OnInit {
  //#region Variable Declaration Start
  @Input() _seedPlayer: any = '';
  @Output() _schedule = new EventEmitter<{ schedule: boolean }>();
  @Output() isMatchesCreated = new EventEmitter<any>();
  @Input() isRefreshData: boolean = false;
  @Input() _category = [];
  @Input() _currentCategoryId: any;
  @Input() _currentParticipantId: any;
  @Output() _isScoreUpadted = new EventEmitter<any>();
  @Input() _separation: any;
  @Input() _separationOne: any;
  @Input() _playerInGroup: any;
  _showFull: boolean = false;
  _fullScreenView: boolean = false;
  _isFullViewGrid: boolean = false;
  _isAddPlayerGrid: boolean = false;
  showSchedule: boolean = false;
  _grpSwapPlayer: boolean = false;
  _showLoader: boolean = false;
  _isLocked: boolean = false;
  _isViewPlayerGrid: boolean = false;
  _isGroupCreated: boolean = false;
  __playerStatus: any = 'Players added ';
  _groupList: any = [];
  _winningPlayer = [
    { caption: 'Number of Winners 1', value: 1 },
    { caption: 'Number of Winners 2', value: 2 },
    { caption: 'Number of Winners 3', value: 3 },
  ];
  _topPlayers: any = [];
  _topPlayersCopy: any = [];
  _topPlayersList: any = [];
  _dialogStyle = { width: '95vw' };
  _selectedPlayer: any = [];
  _winnerCount: any;
  _finalGroupList: any = [];
  _participantContainer: any = [];
  _matchDetailsList: any = [];
  _searchByPlayerName: any = '';
  _searchByPlayerNameView: any = '';
  _mainDrawParticipantsList: any = [];
  _selectedPlayerForMainDraw: any = [];
  _selectedTeamForMainDraw: any = [];
  _selectedDoubleForMainDraw: any = [];
  _selectedMixDoublsForMainDraw: any = [];
  _playerListWithGroupName: any = [];
  _playerSwapDataList: any = [];
  _playerListWithGroupNameCopy: any = [];
  _currentGroupName: any = '';
  _eventId: any;
  _searchByPlayerNameSwap: any = '';
  _teamList: any = [];
  _teamListCopy: any = [];
  _doubleList: any = [];
  _doubleListCopy: any = [];
  _mixDoubleList: any = [];
  _mixDoubleListCopy: any = [];
  _matchFinished: any
  azureLoggerConversion: any = new Error()
  _eventHandler: any = [
    {
      icon: 'pi pi-eye',
      command: () => { this.viewFullGridData() }
    },
    {
      icon: 'pi pi-user-plus',
      command: () => { this.addPlayer() }
    },
    {
      icon: 'pi pi-trash',
      command: () => { this.deleteAllPlayerFromMainDraw() }
    },
  ]
  innerWidth: any
  _groupMatchDetails: any = [];
  _showGroupMatches: boolean = false;
  _updateScore: boolean = false;
  _UpdateScore: boolean = false;
  _parent_match_id: any;
  _teamMatchFullDetails: any = [];
  _groupId: any;
  _matchFullDetails: any = [];
  _scoreArray: any = [];
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  _playerInGroupList = [
    { caption: 3, value: 3 },
    { caption: 4, value: 4 },
    { caption: 5, value: 5 },
    { caption: 6, value: 6 },
    { caption: 7, value: 7 },
    { caption: 8, value: 8 },
    { caption: 9, value: 9 },
    { caption: 10, value: 10 },
    { caption: 11, value: 11 },
    { caption: 12, value: 12 },
    { caption: 13, value: 13 },
    { caption: 14, value: 14 },
    { caption: 15, value: 15 }
  ];
  _separationList = [
    { caption: "Club", value: "club" },
    { caption: "No Separation", value: "No Separation" }
  ];

_theme :boolean = false
  //#endregion Variable Declaration End
  constructor(
    private eventsService: EventsService,
    private messageService: MessageService,
    private encyptDecryptService: EncyptDecryptService,
    private confirmationDialogService: ConfirmationDialogService,
    private azureLoggerService: MyMonitoringService,
  ) {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit(): void { }
  ngOnChanges(changes: SimpleChanges) {
    this._separationOne = this._separation === true ? { caption: "Club", value: "club" } : { caption: "No Separation", value: "No Separation" };
    this._seedPlayer = this._seedPlayer === -1 ? '' : this._seedPlayer;
    this._playerInGroup = this._playerInGroupList.filter((x: any) => x.value === this._playerInGroup)[0];
    this._eventId = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this._winnerCount = '';
    this.isRefreshData = false;
    this.getGroupList();
    this.getMainDraw();
    this.getPlayerList();
    this.getGroupMatchDetails();
  }
  //#region This method is used for Oper Accordion
  openAccordion(index: any) {
    this._groupList[index].showButton = true;
  }
  //#endregion
  //#region This Method is used for open Full Screen Page
  showFullScreen() {
    this._groupList;
    for (let i = 0; i < this._groupList.length; i++) {
      this._groupList[i].showButton = false;
    }
    this._fullScreenView = true;
  }
  //#endregion
  //#region This Method is used for close Full Screen Page
  closeFullView() {
    this._groupList;
    for (let i = 0; i < this._groupList.length; i++) {
      this._groupList[i].showButton = false;
    }
    this._fullScreenView = false;
  }
  //#endregion
  //#region This method is used for close Accordion
  closeAccordion(index: any) {
    this._groupList[index].showButton = false;
    this._groupList[index].showDropDown = false;
  }
  //#endregion
  //#region This method is used for Delete Group
  deleteGroup($event: MouseEvent, index: any) {
    $event.stopPropagation();
    for (let i = 0; i < this._groupList[index].group_details.length; i++) {
      this._topPlayersList.push(this._groupList[index].group_details[i]);
    }
    this._groupList.splice(index, 1);
  }
  //#endregion
  //#region This Method is used for Add DropDown
  addDrp($event: MouseEvent, index: any) {
    $event.stopPropagation();
    this._groupList[index].showDropDown = true;
  }
  //#endregion
  //#region This method is used for Remove Drop Down
  removeDrpDown($event: MouseEvent, index: any) {
    $event.stopPropagation();
    this._groupList[index].showDropDown = false;
  }
  //#endregion
  //#region This method is used for select Players
  selectedPlayer(data: any, index: any) {
    this._topPlayersList.splice(
      this._topPlayersList.findIndex(
        (x: any) => x.participant_name == data.value.participant_name
      ),
      1
    );
    data.value.group_id = this._groupList[index].group_id;
    this._groupList[index].group_details.push(data.value);
    this._selectedPlayer = [];
  }
  //#endregion
  //#region This Method is used for Remove Players
  removePlayer(parentIndex: any, childIndex: any, itemDetail: any) {
    this._groupList[parentIndex].group_details[childIndex];
    this._groupList[parentIndex].group_details.splice(childIndex, 1);
    this._topPlayersList.push(itemDetail);
  }
  //#endregion
  //#region This method is used for View Drid Data as Full Screen 
  viewFullGridData() {
    if (this._currentParticipantId == 1) {
      if (this._selectedPlayerForMainDraw.length > 0) {
        this._isFullViewGrid = true;
      }
    } else if (this._currentParticipantId == 2) {
      if (this._selectedTeamForMainDraw.length > 0) {
        this._isFullViewGrid = true;
      }
    } else if (this._currentParticipantId == 3) {
      if (this._selectedDoubleForMainDraw.length > 0) {
        this._isFullViewGrid = true;
      }
    } else if (this._currentParticipantId == 4) {
      if (this._selectedMixDoublsForMainDraw.length > 0) {
        this._isFullViewGrid = true;
      }
    }
  }
  //#endregion
  //#region This method is used for add Players
  addPlayer() {
    this._searchByPlayerName = '';
    if (this._currentParticipantId == 1) {
      if (this._matchDetailsList.length == 0 && this._topPlayers.length > 0) {
        this._isAddPlayerGrid = true;
      }
    } else if (this._currentParticipantId == 2) {
      if (this._matchDetailsList.length == 0 && this._teamList.length > 0) {
        this._isAddPlayerGrid = true;
      }
    } else if (this._currentParticipantId == 3) {
      if (this._matchDetailsList.length == 0 && this._doubleList.length > 0) {
        this._isAddPlayerGrid = true;
      }
    } else if (this._currentParticipantId == 4) {
      if (
        this._matchDetailsList.length == 0 &&
        this._mixDoubleList.length > 0
      ) {
        this._isAddPlayerGrid = true;
      }
    }
  }
  //#endregion
  //#region This method is used for View Player List
  viewPlayer() {
    this._isViewPlayerGrid = true;
  }
  //#endregion
  //#region This method is used for Add New Groups
  addGroup() {
    const data = {
      group_id: this._groupList.length + 1,
      group_type: 1,
      category_id: this._currentCategoryId,
      event_id: this._currentCategoryId,
      group_details: [],
      label: 'Group ' + (this._groupList.length + 1),
      showButton: false,
      showDropDown: false,
      data: 'Pictures Folder1',
      playerAdded: 3,
      expandedIcon: 'pi pi-folder-open',
      collapsedIcon: 'pi pi-folder',
      children: [],
      club_flag: false
    };
    this._groupList.push(data);
  }
  //#endregion
  //#region This method is used for Save Group
  saveGroup() {
    this.showSchedule = true;
    this._schedule.emit({ schedule: this.showSchedule });
  }
  //#endregion
  //#region This method Used for get List of Groups
  getGroupList() {
    this._showLoader = true;
    const event_id = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    const category_id = this._currentCategoryId;
    const group_type = 1;
    if (event_id !== undefined && category_id !== undefined) {
      this.eventsService
        .getGroupList(event_id, category_id, group_type)
        .subscribe({
          next: (result: any) => {
            this._groupList = [];
            this._showLoader = false;
            this._isLocked = false;
            if (result.body.length > 0) {
              this._isGroupCreated = true;
              this._isLocked = result.body[0].locked;
              if (result.body[0].max_winners == 1) {
                this._winnerCount = {
                  caption: 'Number of Winners 1',
                  value: 1,
                };
              } else if (result.body[0].max_winners == 2) {
                this._winnerCount = {
                  caption: 'Number of Winners 2',
                  value: 2,
                };
              } else if (result.body[0].max_winners == 3) {
                this._winnerCount = {
                  caption: 'Number of Winners 3',
                  value: 3,
                };
              }
              for (let i = 0; i < result.body.length; i++) {
                const data = {
                  group_id: result.body[i].group_id,
                  group_type: result.body[i].group_type,
                  category_id: result.body[i].category_id,
                  event_id: result.body[i].event_id,
                  group_details: result.body[i].group_details,
                  label: 'Group ' + (i + 1),
                  showButton: false,
                  showDropDown: false,
                  data: 'Pictures Folder1',
                  playerAdded: 3,
                  expandedIcon: 'pi pi-folder-open',
                  collapsedIcon: 'pi pi-folder',
                  children: [],
                  club_flag: result.body[i].club_flag
                };
                this._groupList.push(data);
              }
            } else {
              this._isGroupCreated = false;
            }
          },
          error: (result: any) => {
            this._groupList = [];
            this._showLoader = false;
            this.azureLoggerConversion = result.error.msg
            this.azureLoggerService.logException(this.azureLoggerConversion)
          },
          complete: () => { },
        });
    }
  }
  //#endregion
  //#region This method is used for Get Data for main draw
  getMainDraw() {
    if (this._eventId !== undefined) {
      this.eventsService
        .getParticipantTypeAndCategories(
          this._eventId
        )
        .subscribe({
          next: (result: any) => {
            this._showLoader = false;
          },
        });
    }
    if (this._eventId !== undefined && this._currentCategoryId !== undefined) {
      this.eventsService
        .getGroupList(this._eventId, this._currentCategoryId, 1)
        .subscribe({
          next: (result: any) => {
            this._groupList = [];
            this._showLoader = false;
            for (let i = 0; i < result.body.length; i++) {
              const data = {
                group_id: result.body[i].group_id,
                group_type: result.body[i].group_type,
                category_id: result.body[i].category_id,
                event_id: result.body[i].event_id,
                group_details: result.body[i].group_details,
                label: 'Group ' + (i + 1),
                showButton: false,
                showDropDown: false,
                data: 'Pictures Folder1',
                playerAdded: 3,
                expandedIcon: 'pi pi-folder-open',
                collapsedIcon: 'pi pi-folder',
                children: [],
                club_flag: result.body[i].club_flag
              };
              this._groupList.push(data);
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
  }
  //#endregion 
  //#region generate Fixture Tree
  generateFixtures() {
    if (this._currentParticipantId == 1) {
      if (this._selectedPlayerForMainDraw.length > 0) {
        for (let i = 0; i < this._selectedPlayerForMainDraw.length; i++) {
          if (
            this._mainDrawParticipantsList.findIndex(
              (x: any) => x == this._selectedPlayerForMainDraw[i].participant_id
            ) == -1
          ) {
            this._mainDrawParticipantsList.push(
              this._selectedPlayerForMainDraw[i].participant_id
            );
          }
        }
      }
    } else if (this._currentParticipantId == 2) {
      if (this._selectedTeamForMainDraw.length > 0) {
        this._mainDrawParticipantsList = [];
        for (let i = 0; i < this._selectedTeamForMainDraw.length; i++) {
          if (
            this._mainDrawParticipantsList.findIndex(
              (x: any) => x == this._selectedTeamForMainDraw[i].participant_id
            ) == -1
          ) {
            this._mainDrawParticipantsList.push(
              this._selectedTeamForMainDraw[i].participant_id
            );
          }
        }
      }
    } else if (this._currentParticipantId == 3) {
      if (this._selectedDoubleForMainDraw.length > 0) {
        this._mainDrawParticipantsList = [];
        for (let i = 0; i < this._selectedDoubleForMainDraw.length; i++) {
          if (
            this._mainDrawParticipantsList.findIndex(
              (x: any) => x == this._selectedDoubleForMainDraw[i].participant_id
            ) == -1
          ) {
            this._mainDrawParticipantsList.push(
              this._selectedDoubleForMainDraw[i].participant_id
            );
          }
        }
      }
    } else if (this._currentParticipantId == 4) {
      if (this._selectedMixDoublsForMainDraw.length > 0) {
        this._mainDrawParticipantsList = [];
        for (let i = 0; i < this._selectedMixDoublsForMainDraw.length; i++) {
          if (
            this._mainDrawParticipantsList.findIndex(
              (x: any) =>
                x == this._selectedMixDoublsForMainDraw[i].participant_id
            ) == -1
          ) {
            this._mainDrawParticipantsList.push(
              this._selectedMixDoublsForMainDraw[i].participant_id
            );
          }
        }
      }
    }
    this._showLoader = true;
    if (this._winnerCount == undefined) {
      this._showLoader = false;
      this.messageService.add({
        key: 'bc',
        severity: 'error',
        summary: 'Error',
        detail: 'Please select number of winner',
        life: 3000,
      });
    } else {
      this._showLoader = true;
      const body = {
        event_id: this._eventId,
        category_id: this._currentCategoryId,
        participant_type_id: this._currentParticipantId,
        max_winners:
          this._winnerCount == undefined || this._winnerCount.value == undefined
            ? 1
            : this._winnerCount.value,
        main_draw_participants: this._mainDrawParticipantsList,
        min_no_participant: this._playerInGroup == undefined ? 3 : this._playerInGroup.value,
        seed: (this._seedPlayer === '' || this._seedPlayer === '') ? -1 : this._seedPlayer,
        club_seperation: this._separationOne.value === 'club' ? true : false
      };
      this.eventsService.generateFixtures(body).subscribe({
        next: (result: any) => {
          this._showLoader = false;
          if (result.body.warning === undefined) {
            this.messageService.add({
              key: 'bc',
              severity: 'success',
              summary: 'Success',
              detail: result.body.msg,
              life: 3000,
            });
          }
          else {
            this.messageService.add({
              key: 'bc',
              severity: 'warn',
              summary: 'Warning!',
              detail: result.body.warning,
              life: 3000,
            });
          }
          this.getGroupList();
        },
        error: (result: any) => {
          this._showLoader = false;
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
          this._winnerCount = '';
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
  //#endregion
  //#region With this method we are able to delete Fixture tree
  deleteFixtures(text: any) {
    this.confirmationDialogService
      .confirm(
        'Please confirm..',
        'Are you sure ,you want to delete this group? Once you delete the group all the changes, result and videos will be lost.'
      )
      .then((confirmed) => {
        if (confirmed) {
          this._showLoader = true;
          this.eventsService
            .deleteFixtures(this._currentCategoryId, this._eventId)
            .subscribe({
              next: (result: any) => {
                this._topPlayersList = [];
                this._showLoader = false;
                this._winnerCount = '';
                this._seedPlayer = '';
                this._playerInGroup = '';
                this._separation = '';
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
                this._winnerCount = '';
                this.azureLoggerConversion = result.error.msg
                this.azureLoggerService.logException(this.azureLoggerConversion);
              },
              complete: () => {
                this.getGroupList();
                this.getMainDraw();
                this.getPlayerList();
                this.getGroupMatchDetails();
              },
            });
        }
      })
      .catch(() => { });
  }
  //#endregion
  //#region This method is used for Create Team Matches
  createTeamMatches() {
    const body = {
      event_id: this._eventId,
      category_id: this._currentCategoryId,
      parent_match_id: 0,
      teamA_participant_id: 0,
      teamB_participant_id: 0,
      matches: [
        {
          player_teamA: 'string',
          player_teamB: 'string',
        },
      ],
    };
    this.eventsService.createTeamMatches(body).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._winnerCount = '';
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
        this._winnerCount = '';
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    });
  }
  //#endregion
  //#region This method is used for Show Pop up for Swap Players
  showPlayerSwap() {
    this._searchByPlayerNameSwap = '';
    this._grpSwapPlayer = true;
  }
  //#endregion
  //#region With this method we are able to Create Custom Groups
  createCustomGroup() {
    this._finalGroupList = [];
    for (let i = 0; i < this._groupList.length; i++) {
      this._participantContainer = [];
      for (let j = 0; j < this._groupList[i].group_details.length; j++) {
        const data = {
          participant_id: this._groupList[i].group_details[j].participant_id,
          position: j + 1,
        };
        this._participantContainer.push(data);
      }
      const data1 = {
        participants: this._participantContainer,
      };
      this._finalGroupList.push(data1);
    }
    const body = {
      event_id: this._eventId,
      category_id: this._currentCategoryId,
      max_winners:
        this._winnerCount == undefined ||
          this._winnerCount == null ||
          this._winnerCount == ''
          ? 1
          : this._winnerCount.value,
      locked: true,
      groups: this._finalGroupList,
    };
    this.eventsService.createCustomGroups(body).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._winnerCount = '';
        this.createMatches();
      },
      error: (result: any) => {
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this._winnerCount = '';
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
  //#region This method will save with custom modification
  justSave() {
    this.eventsService
      .lockGroup(
        this._eventId,
        this._currentCategoryId
      )
      .subscribe({
        next: (result: any) => {
          this._showLoader = false;
          this._winnerCount = '';
          // this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: result.body.msg, life: 3000 });
          this.createMatches();
        },
        error: (result: any) => {
          this._showLoader = false;
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
          this._winnerCount = '';
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
  //#region  With This method we are able to create custom matches
  createMatches() {
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
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion);
        },
        complete: () => { },
      });
  }
  //#region With this method we are getting Group Matches Details
  getGroupMatchDetails() {
    this._matchDetailsList = [];
    this._showLoader = false;
    if (
      this._eventId !== undefined &&
      this._currentCategoryId !== undefined
    ) {
      this.eventsService
        .getGroupMatchDetailsV3(
          this._eventId,
          this._currentCategoryId,
          1
        )
        .subscribe({
          next: (result: any) => {
            this._showLoader = false;
            this.getPlayersForMainDraw();
            this._matchDetailsList = result.body;

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
    this.checkCatMatches(this._currentCategoryId)
  }
  //#endregion
  //#region This method is used for get List of players
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
                  user_id: result.body[i].event_participant_details[0].user_id,
                  name: result.body[i].participant_name,
                  email: result.body[i].event_participant_details[0].email,
                  gender_id:
                    result.body[i].event_participant_details[0].gender_id,
                  isSelected: false,
                  club: result.body[i].club,
                  rating: result.body[i].rating,
                  points: result.body[i].points,
                  state: result.body[i].event_participant_details[0].state,
                  participant_id: result.body[i].participant_id,
                };
                this._topPlayers.push(data);
                this._topPlayersCopy.push(data);
              }
            } else if (this._currentParticipantId == 2) {
              this._showLoader = false;
              this._teamList = [];
              this._teamListCopy = [];
              this._teamList = result.body;
              this._teamListCopy = result.body;
            } else if (this._currentParticipantId == 3) {
              this._showLoader = false;
              this._doubleList = [];
              this._doubleListCopy = [];
              this._doubleList = result.body;
              this._doubleListCopy = result.body;
            } else if (this._currentParticipantId == 4) {
              this._showLoader = false;
              this._mixDoubleList = [];
              this._mixDoubleListCopy = [];
              this._mixDoubleList = result.body;
              this._mixDoubleListCopy = result.body;
            }
          },
          error: (result: any) => {
            this._showLoader = false;
            this._topPlayers = [];
            this._topPlayersCopy = [];
            this.azureLoggerConversion = result.error.msg
            this.azureLoggerService.logException(this.azureLoggerConversion);
          },
          complete: () => { },
        });
    }
  }
  //#endregion
  //#region This method is used for get list of Player in Main Draw 
  playerForMainDraw(event: any, playerDetails: any) {
    if (event.target.checked) {
      if (this._currentParticipantId == 1) {
        this._topPlayers.splice(
          this._topPlayers.findIndex(
            (x: any) => x.user_id == playerDetails.user_id
          ),
          1
        );
        this._selectedPlayerForMainDraw.push(playerDetails);
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully added player in main draw',
          life: 3000,
        });
      } else if (this._currentParticipantId == 2) {
        this._teamList.splice(
          this._teamList.findIndex(
            (x: any) => x.participant_id == playerDetails.participant_id
          ),
          1
        );
        this._selectedTeamForMainDraw.push(playerDetails);
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully added team in main draw',
          life: 3000,
        });
      } else if (this._currentParticipantId == 3) {
        this._doubleList.splice(
          this._doubleList.findIndex(
            (x: any) => x.participant_id == playerDetails.participant_id
          ),
          1
        );
        this._selectedDoubleForMainDraw.push(playerDetails);
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully added pair in main draw',
          life: 3000,
        });
      } else if (this._currentParticipantId == 4) {
        this._mixDoubleList.splice(
          this._mixDoubleList.findIndex(
            (x: any) => x.participant_id == playerDetails.participant_id
          ),
          1
        );
        this._selectedMixDoublsForMainDraw.push(playerDetails);
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully added pair in main draw',
          life: 3000,
        });
      }
    } else {
      if (this._currentParticipantId == 1) {
        this._selectedPlayerForMainDraw.splice(
          this._selectedPlayerForMainDraw.findIndex(
            (x: any) => x.user_id == playerDetails.user_id
          ),
          1
        );
      } else if (this._currentParticipantId == 2) {
        this._selectedTeamForMainDraw.splice(
          this._selectedTeamForMainDraw.findIndex(
            (x: any) => x.participant_id == playerDetails.participant_id
          ),
          1
        );
      } else if (this._currentParticipantId == 3) {
        this._selectedDoubleForMainDraw.splice(
          this._selectedDoubleForMainDraw.findIndex(
            (x: any) => x.participant_id == playerDetails.participant_id
          ),
          1
        );
      } else if (this._currentParticipantId == 4) {
        this._selectedMixDoublsForMainDraw.splice(
          this._selectedMixDoublsForMainDraw.findIndex(
            (x: any) => x.participant_id == playerDetails.participant_id
          ),
          1
        );
      }
    }
  }
  //#endregion
  //#region This methos is used for delete players from main Draw
  deleteAllPlayerFromMainDraw() {
    if (this._currentParticipantId == 1) {
      if (
        this._selectedPlayerForMainDraw.length > 0 &&
        this._groupList.length == 0
      ) {
        this.confirmationDialogService
          .confirm(
            'Please confirm..',
            'Are you sure ,you want to delete all players from main draw?.'
          )
          .then((confirmed) => {
            if (confirmed) {
              if (this._currentParticipantId == 1) {
                for (
                  let i = 0;
                  i < this._selectedPlayerForMainDraw.length;
                  i++
                ) {
                  this._topPlayers.push(this._selectedPlayerForMainDraw[i]);
                }
                this._selectedPlayerForMainDraw = [];
              }
            } else {
            }
          })
          .catch(() => { });
      }
    } else if (this._currentParticipantId == 2) {
      if (
        this._selectedTeamForMainDraw.length > 0 &&
        this._groupList.length == 0
      ) {
        this.confirmationDialogService
          .confirm(
            'Please confirm..',
            'Are you sure ,you want to delete all players from main draw?.'
          )
          .then((confirmed) => {
            if (confirmed) {
              if (this._currentParticipantId == 2) {
                for (let i = 0; i < this._selectedTeamForMainDraw.length; i++) {
                  this._teamList.push(this._selectedTeamForMainDraw[i]);
                }
                this._selectedTeamForMainDraw = [];
              }
            } else {
            }
          })
          .catch(() => { });
      }
    } else if (this._currentParticipantId == 3) {
      if (
        this._selectedDoubleForMainDraw.length > 0 &&
        this._groupList.length == 0
      ) {
        this.confirmationDialogService
          .confirm(
            'Please confirm..',
            'Are you sure ,you want to delete all players from main draw?.'
          )
          .then((confirmed) => {
            if (confirmed) {
              if (this._currentParticipantId == 3) {
                for (
                  let i = 0;
                  i < this._selectedDoubleForMainDraw.length;
                  i++
                ) {
                  this._doubleList.push(this._selectedDoubleForMainDraw[i]);
                }
                this._selectedDoubleForMainDraw = [];
              }
            } else {
            }
          })
          .catch(() => { });
      }
    } else if (this._currentParticipantId == 4) {
      if (
        this._selectedMixDoublsForMainDraw.length > 0 &&
        this._groupList.length == 0
      ) {
        this.confirmationDialogService
          .confirm(
            'Please confirm..',
            'Are you sure ,you want to delete all players from main draw?.'
          )
          .then((confirmed) => {
            if (confirmed) {
              if (this._currentParticipantId == 4) {
                for (
                  let i = 0;
                  i < this._selectedMixDoublsForMainDraw.length;
                  i++
                ) {
                  this._mixDoubleList.push(
                    this._selectedMixDoublsForMainDraw[i]
                  );
                }
                this._selectedMixDoublsForMainDraw = [];
              }
            } else {
            }
          })
          .catch(() => { });
      }
    }
  }
  //#endregion
  //#region This method is used for get list of players for main draw
  getPlayersForMainDraw() {
    const category_id = this._currentCategoryId;
    const group_type = 2;
    if (this._eventId !== undefined && category_id !== undefined) {
      this.eventsService
        .getGroupList(this._eventId, category_id, group_type)
        .subscribe({
          next: (result: any) => {
            this._selectedPlayerForMainDraw = [];
            this._selectedTeamForMainDraw = [];
            this._selectedDoubleForMainDraw = [];
            this._selectedMixDoublsForMainDraw = [];
            this._showLoader = false;
            if (result.body.length > 0) {
              const _tempResult = result.body[0].group_details.filter((x: any) => x.points != -1);
              if (this._currentParticipantId == 1) {
                for (let i = 0; i < _tempResult.length; i++) {
                  _tempResult[i].name = _tempResult[i].participant_name
                }
                this._selectedPlayerForMainDraw = _tempResult;
              } else if (this._currentParticipantId == 2) {
                this._selectedTeamForMainDraw = _tempResult;
              } else if (this._currentParticipantId == 3) {
                this._selectedDoubleForMainDraw = _tempResult;
              } else if (this._currentParticipantId == 4) {
                this._selectedMixDoublsForMainDraw = _tempResult;
              }
            }
          },
          error: (result) => {
            this._selectedPlayerForMainDraw = [];
            this._showLoader = false;
            this.azureLoggerConversion = result.error.msg
            this.azureLoggerService.logException(this.azureLoggerConversion)
          },
          complete: () => { },
        });
    }
  }
  //#endregion
  //#region This method is used for Remove Players from Main Draw
  removeFromMainDraw(data: any) {
    const details = {
      user_id: data.user_id,
      name: data.name,
      email: data.email,
      gender_id: data.gender_id,
      dob: data.dob,
      open_categories: data.open_categories,
      isSelected: false,
    };
    if (this._currentParticipantId == 1) {
      this._topPlayers.push(data);
      this._selectedPlayerForMainDraw.splice(
        this._selectedPlayerForMainDraw.findIndex(
          (x: any) => x.user_id == data.user_id
        ),
        1
      );
      this.messageService.add({
        key: 'bc',
        severity: 'success',
        summary: 'Success',
        detail: 'Removed Successfully',
        life: 3000,
      });
    } else if (this._currentParticipantId == 2) {
      this._teamList.push(data);
      this._selectedTeamForMainDraw.splice(
        this._selectedTeamForMainDraw.findIndex(
          (x: any) => x.participant_id == data.participant_id
        ),
        1
      );
      this.messageService.add({
        key: 'bc',
        severity: 'success',
        summary: 'Success',
        detail: 'Removed Successfully',
        life: 3000,
      });
    } else if (this._currentParticipantId == 3) {
      this._doubleList.push(data);
      this._selectedDoubleForMainDraw.splice(
        this._selectedDoubleForMainDraw.findIndex(
          (x: any) => x.participant_id == data.participant_id
        ),
        1
      );
      this.messageService.add({
        key: 'bc',
        severity: 'success',
        summary: 'Success',
        detail: 'Removed Successfully',
        life: 3000,
      });
    } else if (this._currentParticipantId == 4) {
      this._mixDoubleList.push(data);
      this._selectedMixDoublsForMainDraw.splice(
        this._selectedMixDoublsForMainDraw.findIndex(
          (x: any) => x.participant_id == data.participant_id
        ),
        1
      );
      this.messageService.add({
        key: 'bc',
        severity: 'success',
        summary: 'Success',
        detail: 'Removed Successfully',
        life: 3000,
      });
    }
  }
  //#endregion
  //#region This Method is used for Close popup
  ClosePopUpIsAddPlayerGrid() {
    this._searchByPlayerName = '';
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
  //#region This Method is used for Close popup
  ClosePopUpIsViewPlayerGrid() {
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
  //#region This method is used for Search Players
  searchPlayer() {
    if (this._currentParticipantId == 1) {
      this._topPlayers = [];
      this._topPlayers = this._topPlayersCopy.filter((item: any) => {
        return (
          item.name
            .toLowerCase()
            .includes(this._searchByPlayerName.toLowerCase()) ||
          item.email
            .toLowerCase()
            .includes(this._searchByPlayerName.toLowerCase())
        );
      });
    } else if (this._currentParticipantId == 2) {
      this._teamList = [];
      this._teamList = this._teamListCopy.filter((item: any) => {
        return (
          item.name
            .toLowerCase()
            .includes(this._searchByPlayerName.toLowerCase()) ||
          item.participant_name
            .toLowerCase()
            .includes(this._searchByPlayerName.toLowerCase())
        );
      });
    } else if (this._currentParticipantId == 3) {
      this._doubleList = [];
      this._doubleList = this._doubleListCopy.filter((item: any) => {
        return (
          item.name
            .toLowerCase()
            .includes(this._searchByPlayerName.toLowerCase()) ||
          item.participant_name
            .toLowerCase()
            .includes(this._searchByPlayerName.toLowerCase())
        );
      });
    } else if (this._currentParticipantId == 4) {
      this._mixDoubleList = [];
      this._mixDoubleList = this._mixDoubleListCopy.filter((item: any) => {
        return (
          item.name
            .toLowerCase()
            .includes(this._searchByPlayerName.toLowerCase()) ||
          item.participant_name
            .toLowerCase()
            .includes(this._searchByPlayerName.toLowerCase())
        );
      });
    }
  }
  //#endregion
  //#region This method is used for Search Players
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
    } else if (this._currentParticipantId == 3) {
      this._doubleList = [];
      this._doubleList = this._doubleListCopy.filter((item: any) => {
        return (

          item.participant_name
            .toLowerCase()
            .includes(this._searchByPlayerNameView.toLowerCase())
        );
      });
    } else if (this._currentParticipantId == 4) {
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
  swapPlayerWithGroup(playerDeatils: any, groupDetails: any) {
    this._playerSwapDataList = [];
    this._playerListWithGroupName = [];
    this._playerListWithGroupNameCopy = [];
    this._currentGroupName = '';
    for (let i = 0; i < this._groupList.length; i++) {
      for (let j = 0; j < this._groupList[i].group_details.length; j++) {
        const data = {
          index: j + 1,
          playerName: this._groupList[i].group_details[j].participant_name,
          playerId: this._groupList[i].group_details[j].participant_id,
          playerEmail:
            this._groupList[i].group_details[j].email == undefined
              ? ''
              : this._groupList[i].group_details[j].email,
          playerGroupName: this._groupList[i].label,
          playerGroupId: this._groupList[i].group_id,
          playerStateName:
            this._groupList[i].group_details[j].state == undefined
              ? ''
              : this._groupList[i].group_details[j].state,
          playerClubName: this._groupList[i].group_details[j].club,
          playerRating: this._groupList[i].group_details[j].rating,
          playerPoints:
            this._groupList[i].group_details[j].points == null
              ? 0
              : this._groupList[i].group_details[j].points,
        };
        if (playerDeatils.participant_id !== data.playerId) {
          this._playerListWithGroupName.push(data);
          this._playerListWithGroupNameCopy.push(data);
        }
      }
    }
    this._currentGroupName = groupDetails.label;
    this._playerSwapDataList.push(playerDeatils);
    this._grpSwapPlayer = true;
  }
  //#region This method is used for swap player
  swapGroupPlayer(data: any) {
    this._groupList = [];
    this._groupList = data;
    this._grpSwapPlayer = false;
  }
  //#endregion
  //#region This method is used for get score 
  getSetScore(data: any) {
    if (data[0].set_won !== null && data[1].set_won !== null) {
      if (data[0].set_won > 0 || data[1].set_won > 0) {
        return data[0].set_won + '-' + data[1].set_won;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }
  //#endregion
  //#region This method is used for set Label
  setLabel() {
    if (this._currentParticipantId === 1) {
      return this.__playerStatus = 'Players Added ';
    }
    else if (this._currentParticipantId === 2) {
      return this.__playerStatus = 'Teams  Added ';
    }
    else if (this._currentParticipantId === 3 || this._currentParticipantId === 4) {
      return this.__playerStatus = 'Pairs  Added ';
    }
    else {
      return ""
    }
  }
  //#endregion
  //#region This method is used for close popup
  closeSmallDialog() {
    this._isViewPlayerGrid = false;
    this._isAddPlayerGrid = false;

  }
  //#endregion
  //#region This method is used for check Matches base on category Id
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

  showMatches() {
    this._showGroupMatches = true;
  }

  showGroups() {
    this._showGroupMatches = false;
    this._isLocked = true;
  }
  updateScore(data: any, match: any, fullDetails: any) {
    if (this._currentParticipantId == 2) {
      this._parent_match_id = match;
      this.eventsService.getTeamParticipantsDetails(data.event_id, data.category_id, match).subscribe({
        next: (result: any) => {
          this._groupId = data.group_id;
          this._UpdateScore = true;
          this._matchFullDetails = result.body;
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      });
    } else if (this._currentParticipantId == 1 || this._currentParticipantId == 3 || this._currentParticipantId == 4) {
      this._matchFullDetails = [];
      this._scoreArray = [];
      for (let f = 0; f < data.match_details[0].score.length; f++) {
        const dd = { value: this.digits_count(data.match_details[0].score[f]) + '-' + this.digits_count(data.match_details[1].score[f]) }
        this._scoreArray.push(dd)
      }
      const dd = {
        "group_id": fullDetails.group_id,
        "match_id": data.match_id,
        "category_id": fullDetails.category_id,
        "group_name": fullDetails.group_name,
        "participantA_id": data.match_details[0].participant_id,
        "participantB_id": data.match_details[1].participant_id,
        "participantA_name": data.match_details[0].participant_name,
        "participantB_name": data.match_details[1].participant_name,
        "isSelected": false,
        "event_id": fullDetails.event_id,
        "start_time": data.start_time,
        "table": data.table,
        "umpire_name": data.umpire_name,
        "round_name": data.round_level,
        "sets": this._scoreArray
      }
      this._matchFullDetails.push(dd);
      this._UpdateScore = true;
    }
  }
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
  isScoreUpadted(data: any) {
    this._isScoreUpadted.emit(data);
  }
  teamMatchCreated(data: any) {
    this._UpdateScore = false;
    this.getGroupMatchDetails();
  }
  isWinner(data: any) {
    if (data.winner == null) {
      return true;
    } else {
      return false;
    }
  }
  getSetScor(users: any) {
    if (users.winner !== null) {
      return users.match_details[0].set_won + '-' + users.match_details[1].set_won;
    } else {
      return '';
    }
  }
  isEdit() {
    this._isLocked = false;
  }
}
