import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { JsonDataCallingService } from 'src/app/services/LocalDataJsonDataAPI/json-data-calling.service';
import { PlayerServiceService } from 'src/app/services/player/player-service.service';
import { ProfileLettersService } from 'src/app/services/ProfileLetters/profile-letters.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
import { DashboardService } from "src/app/services/Dashboard/dashboard.service"
import { MultiSelect } from 'primeng/multiselect';

@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.component.html',
  styleUrls: ['./add-player.component.scss'],
  providers: [MessageService, ConfirmationDialogService],
})
export class AddPlayerComponent implements OnInit {
  _name: string = "";
  _queuedName: string = "";
  _skeleton: boolean = true
  _showAddPlayer: boolean = false;
  _showarrow: boolean = false;
  showDialog: boolean = false;
  _showHistoryDialog: boolean = false;
  _showTeamPlayers: boolean = false;
  _openRecentlyDeleted: boolean = false;
  _showLoader: boolean = false;
  _selectedFixtureFormat: any;
  _selectedParticipantTypes: any;
  _eventFixtureFormat: any;
  _categoryId: any;
  _eventId: any;
  _window: any;
  _players: any = [];
  _playersCopy: any = [];
  _teamList: any = [];
  _teamListCopy: any = [];
  _doubleList: any = [];
  _doubleListCopy: any = [];
  _mixDoubleList: any = [];
  _mixDoubleListCopy: any = [];
  _participantTypesList: any = [];
  _categoryList: any = [];
  _mergeCategoryList: any = [];
  _anotherCategoryList: any = [];
  _teamPlayers: any = [];
  _searchByPlayerName: any = '';
  _searchByTeamName: any = '';
  _currentParticipantId: any = '';
  selectedFixture: any = '';
  _searchByDoubleName: any = '';
  _searchMixDouble: any = '';
  idies = [1, 2, 3, 4];
  tables = [1, 2, 3, 4, 5, 6, 7];
  _visibleDialog: boolean = false;
  azureLoggerConversion: any = new Error()
  unsavedChanges: any;
  _playerList: any = []
  _playerListCopy: any = [];
  _queuedDialog: boolean = false;
  _queuedPlayerList: any = [];
  _finalPlayerList: any = [];
  _queuedPlayerListCopy: any = [];
  teamRating: number = 0;
  doublesRating: any = 0;
  mixDoublesRating: any = 0;
  _subclassList: any = [];
  _categoryData: any = [];
  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this._window = window.pageYOffset;
  }
  _isDisabled: boolean = false;
  _tabIndex: any
  _isPlayerCreated: boolean = false;
  _totolLength: any;
  _isCorrect: boolean = false;
  _openSubClass: boolean = false;
  _categoryName = ''
  _subClass = [
    { name: 2 },
    { name: 3 },
    { name: 4 },
    { name: 5 },
    { name: 6 },
    { name: 7 },
    { name: 8 },
    { name: 9 },
    { name: 10 }
  ]
  _selectedCategory: any
  _tabChange: boolean = false
  _alphaList: any;
  _subClassList: any
  _subClassVal: any
  _isTeamCreation: boolean = false;
  _teamPlayerList: any = [];
  _teamName: any;
  _selectedPlayer: any = [];
  _membersList: any = [];
  _orderPlayerList: any = [];
  _isDoubleCreation: boolean = false;
  _doublePlayerList: any = [];
  _selectedDoublePlayer: any = [];
  _classList: any = []
  _isMixDoubleCreation: boolean = false;
  _mixDoublePlayerList: any = [];
  _selectedMixDoublePlayer: any = [];
  _subcategoryList: any = []
  _dynamicName: any = "Player";
  @ViewChild('multiSelect') multiSelect: MultiSelect | any;
  maxNumber: any;
  constructor(private encyptDecryptService: EncyptDecryptService,
    private messageService: MessageService, private jsonDataCallingService: JsonDataCallingService,
    private registrationService: EventsService,
    private playerService: PlayerServiceService,
    public router: Router,
    private confirmationDialogService: ConfirmationDialogService,
    public profileLetterServic: ProfileLettersService,
    private azureLoggerService: MyMonitoringService,
    private _dashboardService: DashboardService,
    private eventsService: EventsService,
  ) {
  }

  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this.eventsFixtureFormat();
    this.getParticipantAndCategories();
  }

  eventsFixtureFormat() {
    if (this._eventId != null) {
      this.jsonDataCallingService.eventsFixtureFormat().subscribe({
        next: (result: any) => {
          this._eventFixtureFormat = result;
        },
        error: (result) => {
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      });
    }
  }
  srollTop() {
    window.scrollTo(0, 0);
    window.pageXOffset + window.pageYOffset;
  }
  openAddPlayer() {
    this._showAddPlayer = true;
    this._openRecentlyDeleted = false;
  }
  landPage(data: any) {
    this._showAddPlayer = data;
    this._openRecentlyDeleted = data;
    this.getPlayerList();
  }
  // mergeCategories() {
  //   this._mergeCategoryList = [];
  //   for (let i = 0; i < this._categoryList.length; i++) {
  //     const data = {
  //       categoryName: this._categoryList[i].category_description,
  //       numberOfPlayer: this.getCategoriesParticipantsCount(),
  //       eventId: this._eventId,
  //       isSelectedCategory: false,
  //       category_id: this._categoryList[i].category_id
  //     }
  //     this._mergeCategoryList.push(data)
  //   }
  //   this.showDialog = true;
  // }
  openHistoryDialog() {
    this._showHistoryDialog = true;
    this._openRecentlyDeleted = false;
  }
  openRecentlyDeleted() {
    this._openRecentlyDeleted = true;
    this._showHistoryDialog = false;
    this._showAddPlayer = false;
  }

  getParticipantAndCategories() {
    if (this._eventId != null) {
      this.registrationService.getParticipantTypeAndCategories(this._eventId).subscribe({
        next: (result: any) => {
          if (result.body.length > 0) {
            this._queuedPlayerList = []
            this._categoryData = []
            this._selectedFixtureFormat = result.body;
            this._participantTypesList = result.body;
            this._selectedParticipantTypes = result.body[0];
            this._categoryList = result.body[0].categories;
            this._subcategoryList = result.body[0].categories[0].sub_categories;
            this._categoryId = this._subcategoryList.length > 0 ? this._selectedFixtureFormat[0].categories[0].sub_categories[0].category_id : this._selectedFixtureFormat[0].categories[0].category_id;
            var categoryData = this._selectedFixtureFormat[0].categories.filter((x: any) => x.category_id === this._categoryId);
            this.maxNumber = this._subcategoryList.length > 0 ? this._subcategoryList[0].max_no : categoryData[0].max_no;
            this._categoryData = categoryData[0];
            this._currentParticipantId = this._selectedParticipantTypes.participant_type_id;
            if (this._currentParticipantId == 2) {
              this._dynamicName = 'Team';
            }
            else if (this._currentParticipantId == 3 || this._currentParticipantId == 4) {
              this._dynamicName = 'Pair'
            }
            this._tabIndex = 0;
            if (this._categoryList.length > 7) {
              this._showarrow = true;
            }
            if (this._categoryList[0].format_id == null) {
              this.selectedFixture = '';
              this._isDisabled = false;
            } else {
              this.selectedFixture = this._categoryList[0].format_id
              this._isDisabled = true
            }
            this.getPlayerList();
          }
        },
        error: (result) => {
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      });
    }
    this._showLoader = false;
  }
  removeEventRegisteredParticipants(users: any) {
    this.registrationService.removeEventRegisteredParticipants(this._eventId, users.participant_id, false).subscribe({
      next: (result: any) => {
        this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: result.body.msg, life: 3000 });
        this.getPlayerList();
      },
      error: (result: any) => {
        this.messageService.add({ key: 'bc', severity: 'info', summary: 'Info', detail: result.error.msg, life: 3000 });
        this.showDialog = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    });
  }
  mergeCategories() {
    this.registrationService.getCategoriesParticipantsCount(this._eventId, this._currentParticipantId).subscribe({
      next: (result: any) => {
        this._mergeCategoryList = [];
        for (let i = 0; i < result.body.length; i++) {
          const data = {
            categoryName: result.body[i].category_description,
            numberOfPlayer: result.body[i].count,
            eventId: this._eventId,
            isSelectedCategory: false,
            category_id: result.body[i].category_id
          }
          this._mergeCategoryList.push(data)
        }
        this.showDialog = true;
      },
      error: (result) => {
        this.showDialog = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    });
  }
  deleteFixture() {
    this.confirmationDialogService
      .confirm(
        'Please confirm..',
        'Are you sure ,you want to delete this fixture format? Once you delete the fixture format all the changes, result and videos will be lost.'
      )
      .then((confirmed) => {
        if (confirmed) {
          this._showLoader = true;
          this.playerService
            .deleteFixtureFormat(this._eventId, this._categoryId)
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
                this.getParticipantAndCategories();
              },
              error: (result) => {
                this._showLoader = false;
                this.azureLoggerConversion = result.error.msg
                this.azureLoggerService.logException(this.azureLoggerConversion)
                this.messageService.add({
                  key: 'bc',
                  severity: 'error',
                  summary: 'error',
                  detail: 'Some Error Occured',
                  life: 3000,
                });
              },
              complete: () => { },
            });

        } else {
        }
      })
      .catch(() => { });
  }
  generateFixture() {
    var data;
    if (this.selectedFixture == 1 && this._totolLength < 5 && this._totolLength !== 4) {
      data = 4;
      this._isCorrect = false;
    } else if (this.selectedFixture == 2 && this._totolLength < 7 && this._totolLength !== 6) {
      data = 6;
      this._isCorrect = false;
    } else if (this.selectedFixture == 3 && this._totolLength < 4 && this._totolLength !== 3) {
      data = 3;
      this._isCorrect = false;
    }
    else if (this.selectedFixture == 6 && this._totolLength < 9 && this._totolLength !== 8) {
      data = 8;
      this._isCorrect = false;
    }
    else if (this.selectedFixture == 7 && this._totolLength < 4 && this._totolLength !== 3) {
      data = 3;
      this._isCorrect = false;
    } else {
      this._isCorrect = true;
    }
    if (!this._isCorrect) {
      this.messageService.add({
        key: 'bc',
        severity: 'info',
        summary: 'Info',
        detail: 'Minimum ' + data + ' Entries needed  in This Format',
        life: 3000,
      });
    }
    if (this.selectedFixture != '' && this._isCorrect) {
      this._showLoader = true;
      this.playerService
        .updateFixtureFormat(this._eventId, this.selectedFixture, this._categoryId)
        .subscribe({
          next: (result: any) => {
            this._categoryList[this._tabIndex].format_id = this.selectedFixture;
            this._isDisabled = true;
            this._showLoader = false;
            this.messageService.add({
              key: 'bc',
              severity: 'success',
              summary: 'Success',
              detail: result.body.msg,
              life: 3000,
            });
          },
          error: (result) => {
            this._showLoader = false;
            this.azureLoggerConversion = result.error.msg
            this.azureLoggerService.logException(this.azureLoggerConversion)
            this.messageService.add({
              key: 'bc',
              severity: 'error',
              summary: 'error',
              detail: 'Some Error Occured',
              life: 3000,
            });
          },
          complete: () => {
            this.getParticipantAndCategories();
          },
        });
    }
  }
  eventClicked() {
    this.router.navigateByUrl('/event/create-event');
  }
  getPlayerList() {
    if (this._eventId != undefined && this._categoryId != undefined && this._currentParticipantId != undefined) {
      this._showLoader = true;
      this.registrationService.getEventRegistedPlayers(this._eventId, this._currentParticipantId, this._categoryId).subscribe({
        next: (result: any) => {
          this._showLoader = false;
          this._totolLength = '';
          if (this._currentParticipantId == 1) {
            if (result.body.length > 0) {
              this._isPlayerCreated = true;
            } else {
              this._isPlayerCreated = false;
            }
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
            this._totolLength = this._playersCopy.length;
          } else if (this._currentParticipantId == 2) {
            if (result.body.length > 0) {
              this._isPlayerCreated = true;
            } else {
              this._isPlayerCreated = false;
            }
            this._showLoader = false;
            this._teamList = []
            this._teamListCopy = [];
            this._teamList = result.body;
            this._teamListCopy = result.body;
            this._totolLength = this._teamListCopy.length;
          } else if (this._currentParticipantId == 3) {
            if (result.body.length > 0) {
              this._isPlayerCreated = true;
            } else {
              this._isPlayerCreated = false;
            }
            this._showLoader = false;
            this._doubleList = []
            this._doubleListCopy = [];
            this._doubleList = result.body;
            this._doubleListCopy = result.body;
            this._totolLength = this._doubleListCopy.length;
          } else if (this._currentParticipantId == 4) {
            if (result.body.length > 0) {
              this._isPlayerCreated = true;
            } else {
              this._isPlayerCreated = false;
            }
            this._showLoader = false;
            this._mixDoubleList = []
            this._mixDoubleListCopy = [];
            this._mixDoubleList = result.body;
            this._mixDoubleListCopy = result.body;
            this._totolLength = this._mixDoubleListCopy.length;
          }
        },
        error: (result: any) => {
          this._totolLength = '';
          this._players = [];
          this._playersCopy = [];
          this._teamList = []
          this._mixDoubleList = []
          this._mixDoubleListCopy = [];
          this._doubleList = []
          this._doubleListCopy = [];
          this._teamListCopy = [];
          this._showLoader = false;
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion);
        },
        complete: () => { },
      });
      this.getAllQueuedPlayers();
    }
  }
  currentParticipant(data: any) {
    this._tabIndex = 0
    this._currentParticipantId = data.value.participant_type_id;
    this._categoryList = this._participantTypesList.filter((x: any) => x.participant_type_id == data.value.participant_type_id)[0].categories;
    this._subcategoryList = this._participantTypesList.filter((x: any) => x.participant_type_id == data.value.participant_type_id)[0].categories[0].sub_categories;
    this._categoryData = this._categoryList[0];
    if (this._categoryList.length > 0) {
      this._categoryId = this._subcategoryList.length > 0 ? this._categoryList[0].sub_categories[0].category_id : this._categoryList[0].category_id;
      this.getPlayerList();
    }
    if (this._categoryList[0].format_id == null) {
      this.selectedFixture = '';
      this._isDisabled = false;
    } else {
      this.selectedFixture = this._categoryList[0].format_id
      this._isDisabled = true;
    }
    if (this._currentParticipantId == 2) {
      this._dynamicName = 'Team';
    }
    else if (this._currentParticipantId == 3 || this._currentParticipantId == 4) {
      this._dynamicName = 'Pair'
    }
  }
  tabSelection(data: any) {
    this._tabChange = true;
    this._subcategoryList = []
    this._categoryData = []
    this._categoryName = this._categoryList[data.index].category_description
    this.maxNumber = this._categoryList[data.index].max_no == undefined || this._categoryList[data.index].max_no == null ? this._categoryList[data.index].sub_categories.length > 0 ? this._categoryList[data.index].sub_categories[0].max_no : 0 : this._categoryList[data.index].max_no
    this._tabIndex = data.index;
    this._categoryList[data.index];
    this._categoryData = this._categoryList[data.index];
    this._subcategoryList = this._categoryList[data.index].sub_categories;
    this._categoryId = this._subcategoryList.length > 0 ? this._subcategoryList[0].category_id : this._categoryList[data.index].category_id;
    if (this._categoryList[data.index].format_id == null) {
      this.selectedFixture = '';
      this._isDisabled = false;
    } else {
      this.selectedFixture = this._categoryList[data.index].format_id
      this._isDisabled = true;
    }
    if (this._subcategoryList.length > 0) {
      if (this._subcategoryList[0].format_id !== null) {
        this._isDisabled = true;
        this.selectedFixture = this._subcategoryList[0].format_id
      } else {
        this._isDisabled = false;
        this.selectedFixture = '';
      }
    }
    this.getPlayerList();
  }

  subCategorySelection(data: any) {
    this._tabChange = true
    this._categoryName = this._subcategoryList[data.index].category_description
    this.maxNumber = this._subcategoryList[data.index].max_no
    this._tabIndex = data.index;
    this._subcategoryList[data.index];
    this._categoryId = this._subcategoryList[data.index].category_id;
    if (this._subcategoryList[data.index].format_id == null) {
      this.selectedFixture = '';
      this._isDisabled = false;
    } else {
      this.selectedFixture = this._subcategoryList[data.index].format_id
      this._isDisabled = true;
    }
    this.getPlayerList();
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
          .includes(this._searchByTeamName.toLowerCase())
      );
    });

  }
  searchDoubles() {
    this._doubleList = this._doubleListCopy.filter((item: any) => {
      return (
        item.participant_name
          .toLowerCase()
          .includes(this._searchByDoubleName.toLowerCase())
      );
    });
  }
  searchMixDoubles() {
    this._mixDoubleList = this._mixDoubleListCopy.filter((item: any) => {
      return (
        item.participant_name
          .toLowerCase()
          .includes(this._searchMixDouble.toLowerCase())
      );
    });
  }
  refreshPlayerList() {
    this.getParticipantAndCategories();
  }
  getAnotherCategoryList() {
    this._anotherCategoryList = this._categoryList.filter((x: any) => x.category_id !== this._categoryId)
  }
  updateParticipantCategory(fullDetails: any, participantDetails: any) {
    this._showLoader = true;
    this.playerService.updateParticipantCategory(participantDetails.participant_id, fullDetails.category_id, this._eventId).subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this.getPlayerList();
      },
      error: (result: any) => {
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this.messageService.add({ key: 'bc', severity: 'info', summary: 'Info', detail: result.error.msg, life: 3000 });
      },
      complete: () => { },
    });
  }
  viewTeamPlayerList(fullDetails: any) {
    this._showTeamPlayers = true;
    this._teamPlayers = fullDetails.event_participant_details;
  }
  setHeader() {
    if (this._selectedParticipantTypes == undefined) {
      return ''
    } else {
      if (this._selectedParticipantTypes.participant_description === 'Singles') {
        return 'Player Details'
      }
      else if (this._selectedParticipantTypes.participant_description === 'Team') {
        return 'Team Details'
      }
      else {
        return 'Pair Details'
      }
    }
  }
  profileLetterService(data: any) {
    return this.profileLetterServic.getFirstLetters(data);
  }
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if ((this.selectedFixture != '' && this._isDisabled == false && this._eventId != null)) {
      this.navigationToSidebar()
    }
    return true
  }
  navigationToSidebar() {
    this.confirmationDialogService
      .confirm(
        'Please confirm..',
        'You have unsaved changes, are you sure you want to leave this page?'
      )
      .then((confirmed) => {
        if (confirmed) {

        } else {
          this.router.navigateByUrl('/event/add-player');
        }
      })
      .catch(() => { });
  }

  openDialog() {
    this._visibleDialog = true;
    this.getAllPlayers('');
  }

  removeDialog() {
    this._visibleDialog = false;
    this._queuedDialog = false
  }
  getAllPlayers(data: any) {
    var searchText = data.filter == undefined ? data : data.filter;
    if (this.isSeaching(searchText))
      this._dashboardService.getAllPlayersForTeams(searchText == '' ? '' : searchText, this._categoryData.dob_cap, this._categoryData.gender_id, this._categoryData.rating).subscribe({
        next: (data: any) => {
          this._playerList = [];
          this._playerListCopy = [];
          this._playerList = data.body[1];
          this._playerListCopy = data.body[1];
        },
        error: (result: any) => {
          this._playerList = [];
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)

        },
        complete: () => {
        },
      });
  }
  search() {
    if (this._name != "") {
      this.getAllPlayers(this._name)
    }
    else if (this._name == "") {
      this.getAllPlayers('')
    }
  }
  getFirstLettersofTeam(data: any) {
    if (data !== undefined) {
      if (data.split('/').length > 1) {
        return data.split('/')[0].charAt(0).toUpperCase() + data.split('/')[1].charAt(0).toUpperCase()
      } else {
        return data.split('/')[0].charAt(0).toUpperCase()
      }
    } else {
      return '';
    }
  }
  showSubClass() {
    this._openSubClass = true
  }
  openQueuedPlayers() {
    this._queuedDialog = true;
    this._queuedName = "";
    this.getAllQueuedPlayers();
  }

  getAllQueuedPlayers() {
    if (this._eventId != undefined && this._categoryId != undefined && this._currentParticipantId != undefined) {
      this._showLoader = true
      this._dashboardService.getQueuedPlayers(this._eventId, this._categoryId, this._currentParticipantId).subscribe({
        next: (data: any) => {
          this._showLoader = false
          this._queuedPlayerList = []
          this._queuedPlayerList = data.body;
          this._queuedPlayerListCopy = data.body;
        },
        error: (result: any) => {
          this._queuedPlayerList = [];
          this._showLoader = false;
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion);
        },
        complete: () => {
        },
      });
    }

  }
  updateQueuedPlayers(data: any) {
    this._showLoader = true
    this._dashboardService.updateQueuedPlayers(data.participant_id).subscribe({
      next: (data: any) => {
        this._showLoader = false
        this._queuedDialog = false;
        this.getPlayerList();
        this.getAllQueuedPlayers()
      },
      error: (result: any) => {
        this._showLoader = false
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion);
      },
      complete: () => {
      },
    });
  }
  //#region method is used for open popup and API calling for get list of players
  openTeamCreationPopUp() {
    this._isTeamCreation = true;
    this.getAllPlayers('');
  }
  //#endregion method is used for open popup and API calling for get list of players
  //#region method is used for close popup and API calling for get list of players
  closeTeamCreationPopUp() {
    this._isTeamCreation = false;
    this._membersList = [];
    this._orderPlayerList = [];
    this._teamPlayerList = [];
    this._selectedPlayer = [];
    this._teamName = '';
    this.getPlayerList()
  }
  //#endregion method is used for close popup and API calling for get list of players
  //#region method us used to insert Data In _teamPlayerList array
  onPlayerSelections(playerDetails: any) {
    this._teamPlayerList = playerDetails.value;
  }
  //#endregion method us used to insert Data In _teamPlayerList array
  //#region method is used for API calling for team Creation
  CreateTeam() {
    if (this._teamName == '' || this._teamName == null || this._teamPlayerList.length < 3) {
      if (this._teamPlayerList.length < 3) {
        this.messageService.add({
          key: 'bc', severity: 'info', summary: 'Info', detail: ' Minimum 3 Players Are Required.', life: 3000,
        });
      } else {
        this.messageService.add({
          key: 'bc', severity: 'info', summary: 'Info', detail: 'Team Name Is Required.', life: 3000,
        });
      }
    } else {
      this._membersList = [];
      for (let i = 0; i < this._teamPlayerList.length; i++) {
        this.teamRating = this.teamRating + this._teamPlayerList[i].rating
        const details = {
          "user_id": this._teamPlayerList[i].user_id,
          "club_id": this._teamPlayerList[i].club_id,
          "club_name": this._teamPlayerList[i].club,
          "rating": this._teamPlayerList[i].rating,
          "age": this._teamPlayerList[i].age,
          "gender_id": this._teamPlayerList[i].gender_id,
        }
        this._membersList.push(details);
      }
      const body = {
        "user_id": 0,
        "name": this._teamName,
        "category_id": this._categoryId,
        "participant_type_id": 2,
        "members": this._membersList,
        "is_self_registered": true
      }
      this.eventsService.createTeam(body).subscribe({
        next: (data: any) => {
          this.messageService.add({
            key: 'bc', severity: 'success', summary: 'Success', detail: 'Team Created Successfully', life: 1000,
          });
          this.teamOrderCreations(data.body);
        },
        error: (result: any) => {
        },
        complete: () => {
        },
      });
    }
  }
  //#endregion method is used for API calling for team Creation
  //#region method is used for API Calling for order Creation After Team Creation
  teamOrderCreations(teamId: any) {
    this._orderPlayerList = [];
    for (let i = 0; i < this._teamPlayerList.length; i++) {
      const body = {
        "user_id": this._teamPlayerList[i].user_id,
        "state": this._teamPlayerList[i].state,
        "club": this._teamPlayerList[i].club,
        "email": this._teamPlayerList[i].email,
        "name": this._teamPlayerList[i].name,
        "rating": this._teamPlayerList[i].rating,
        "age": this._teamPlayerList[i].age,
        "gender_id": this._teamPlayerList[i].gender_id,
      }
      this._orderPlayerList.push(body);
    }
    const data = {
      "event_id": this._eventId,
      "participant_type_id": 2,
      "categories": [
        {
          "category_id": this._categoryId,
          "participants": [
            {
              "participant_name": this._teamName,
              "ref_id": teamId,
              "rating": Math.ceil(this.teamRating / this._teamPlayerList.length),
              "players": this._orderPlayerList
            }
          ]
        }
      ],
      "payment_id": 3,
      "is_self": true
    }
    this.eventsService.registerParticipants(data).subscribe({
      next: (result: any) => {
        this._isTeamCreation = false;
        this._membersList = [];
        this._orderPlayerList = [];
        this._teamPlayerList = [];
        this._selectedPlayer = [];
        this._teamName = '';
        this.getPlayerList()
      },
      error: (result) => {
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this.messageService.add({
          key: 'bc', severity: 'error', summary: 'Error', detail: result.error.msg, life: 3000,
        });
      },
      complete: () => {

      },
    });
  }
  //#endregion method is used for API Calling for order Creation After Team Creation
  registerPLayer(playerFullDetail: any) {
    this._finalPlayerList = [];
    const playerDetails = {
      "user_id": playerFullDetail.user_id,
      "state": playerFullDetail.state,
      "club": playerFullDetail.club,
      "email": playerFullDetail.email,
      "name": playerFullDetail.name,
      "rating": playerFullDetail.rating,
      "age": playerFullDetail.age,
      "gender_id": playerFullDetail.gender_id
    }
    this._finalPlayerList.push(playerDetails);
    const body = {
      "event_id": this._eventId,
      "participant_type_id": this._currentParticipantId,
      "categories": [
        {
          "category_id": this._categoryId,
          "participants": [
            {
              "participant_name": this._finalPlayerList[0].name,
              "ref_id": this._finalPlayerList[0].user_id,
              "rating": this._finalPlayerList[0].rating,
              "players": this._finalPlayerList
            }
          ]
        }
      ],
      "payment_id": 3,
      "is_self": true
    }

    this.registrationService.registerParticipants(body).subscribe({
      next: (result: any) => {
        this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: 'Player Added Successfully' });
        this.getPlayerList();
        this._visibleDialog = false;
      },
      error: (result: any) => {
      }
    })

  }
  //#region method is used for open popup and API for get list of Players
  openDoubleCreationPopUp() {
    this._isDoubleCreation = true;
    this.getAllPlayers('');
  }
  //#endregion method is used for open popup and API for get list of Players
  //#region method is used for close popup and Get List of Players With API calling
  closeDoubleCreationPopUp() {
    this._isDoubleCreation = false;
    this._membersList = [];
    this._orderPlayerList = [];
    this._doublePlayerList = [];
    this._selectedDoublePlayer = [];
    this.getPlayerList()
  }
  //#endregion method is used for close popup and Get List of Players With API calling
  //#region method us used to insert Data In _doublePlayerList array
  onDoublePlayerSelections(playerDetails: any) {
    //this._doublePlayerList = playerDetails.value;
    if (this._doublePlayerList.length < 2) {
      this._doublePlayerList.push(playerDetails.itemValue);
    }
    else {
      this.multiSelect.overlayVisible = false;
      this.messageService.add({
        key: 'bc',
        severity: 'error',
        summary: 'Error',
        detail: 'Only 2 players can be added',
        life: 3000,
      });
    }
  }
  //#endregion method us used to insert Data In _doublePlayerList array
  //#region method is used for Double Creation With API Calling
  createDouble() {
    if (this._doublePlayerList.length < 2) {
      this.messageService.add({
        key: 'bc', severity: 'info', summary: 'Info', detail: ' Minimum 2 Players Are Required.', life: 3000,
      });
    } else {
      this._membersList = [];
      for (let i = 0; i < this._doublePlayerList.length; i++) {
        this.doublesRating = this.doublesRating + this._doublePlayerList[i].rating
        const details = {
          "user_id": this._doublePlayerList[i].user_id,
          "club_id": this._doublePlayerList[i].club_id,
          "club_name": this._doublePlayerList[i].club,
          "rating": this._doublePlayerList[i].rating,
          "age": this._doublePlayerList[i].age,
          "gender_id": this._doublePlayerList[i].gender_id,
        }
        this._membersList.push(details);
      }
      const body = {
        "user_id": 0,
        "name": this._doublePlayerList[0].name + '/' + this._doublePlayerList[1].name,
        "category_id": this._categoryId,
        "participant_type_id": 3,
        "members": this._membersList,
        "is_self_registered": true
      }
      this._dashboardService.duplicatePair(this._doublePlayerList[0].user_id + ',' + this._doublePlayerList[1].user_id, this._categoryId).subscribe({
        next: (data: any) => {
          this.messageService.add({
            key: 'bc', severity: 'error', summary: 'Error', detail: 'Pair Exists', life: 2000,
          });
        },
        error: (result: any) => {
          this.eventsService.createTeam(body).subscribe({
            next: (data: any) => {
              this.messageService.add({
                key: 'bc', severity: 'success', summary: 'Success', detail: 'Team Created Successfully', life: 1000,
              });
              this.doubleOrderCreations(data.body);

            },
            error: (result: any) => {

            },
            complete: () => {
            },
          });
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => {
        },
      });

    }
  }
  //#endregion method is used for Double Creation With API Calling
  //#region method is used order creation with API Calling after  Double Creation
  doubleOrderCreations(mixId: any) {
    this._orderPlayerList = [];
    for (let i = 0; i < this._doublePlayerList.length; i++) {
      const body = {
        "user_id": this._doublePlayerList[i].user_id,
        "state": this._doublePlayerList[i].state,
        "club": this._doublePlayerList[i].club,
        "email": this._doublePlayerList[i].email,
        "name": this._doublePlayerList[i].name,
        "rating": this._doublePlayerList[i].rating,
        "age": this._doublePlayerList[i].age,
        "gender_id": this._doublePlayerList[i].gender_id,
      }
      this._orderPlayerList.push(body);
    }
    const data = {
      "event_id": this._eventId,
      "participant_type_id": 3,
      "categories": [
        {
          "category_id": this._categoryId,
          "participants": [
            {
              "participant_name": this._doublePlayerList[0].name + '/' + this._doublePlayerList[1].name,
              "ref_id": mixId,
              "rating": Math.ceil(this.doublesRating / this._doublePlayerList.length),
              "players": this._orderPlayerList
            }
          ]
        }
      ],
      "payment_id": 3,
      "is_self": true
    }
    this.eventsService.registerParticipants(data).subscribe({
      next: (result: any) => {
        this._isDoubleCreation = false;
        this._membersList = [];
        this._orderPlayerList = [];
        this._doublePlayerList = [];
        this._selectedDoublePlayer = [];
        this.getPlayerList()
      },
      error: (result) => {
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this.messageService.add({
          key: 'bc', severity: 'error', summary: 'Error', detail: result.error.msg, life: 3000,
        });
      },
      complete: () => {
      },
    });
  }
  //#endregion method is used order creation with API Calling after  Double Creation
  //#region method is used for open popup and API Calling for get list of players
  openMixDoubleCreationPopUp() {
    this._isMixDoubleCreation = true;
    this.getAllPlayers('');
  }
  //#endregion method is used for open popup and API Calling for get list of players
  //#region method is used for close popUp and refresh data
  closeMixDoubleCreationPopUp() {
    this._isMixDoubleCreation = false;
    this._membersList = [];
    this._orderPlayerList = [];
    this._mixDoublePlayerList = [];
    this._selectedMixDoublePlayer = [];
    this.getPlayerList()
  }
  //#endregion method is used for close popUp and refresh data
  //#region method us used to insert Data In _mixDoublePlayerList array
  onMixDoublePlayerSelections(playerDetails: any) {
    if (this._mixDoublePlayerList.length < 2) {
      if (this._mixDoublePlayerList.findIndex((x: any) => x.gender_id === playerDetails.itemValue.gender_id) == -1) {
        this._mixDoublePlayerList.push(playerDetails.itemValue);
      }
      else {
        this.multiSelect.overlayVisible = false;
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Error',
          detail: 'Select player with different gender',
          life: 3000,
        });
      }
    }
    else {
      this.multiSelect.overlayVisible = false;
      this.messageService.add({
        key: 'bc',
        severity: 'error',
        summary: 'Error',
        detail: 'Only 2 players can be added',
        life: 3000,
      });
    }
  }
  deselectDropdownValues() {
    this.multiSelect.value = [];
    this.multiSelect.updateLabel();
  }
  //#endregion method us used to insert Data In _mixDoublePlayerList array
  //#region method is used for API Calling for create Entry for mixDoubles
  createMixDouble() {
    if (this._mixDoublePlayerList.length < 2) {
      this.messageService.add({
        key: 'bc', severity: 'info', summary: 'Info', detail: ' Minimum 2 Players Are Required.', life: 3000,
      });
    } else {
      this._membersList = [];
      for (let i = 0; i < this._mixDoublePlayerList.length; i++) {
        this.mixDoublesRating = this.mixDoublesRating + this._mixDoublePlayerList[i].rating
        const details = {
          "user_id": this._mixDoublePlayerList[i].user_id,
          "club_id": this._mixDoublePlayerList[i].club_id,
          "club_name": this._mixDoublePlayerList[i].club,
          "rating": this._mixDoublePlayerList[i].rating,
          "age": this._mixDoublePlayerList[i].age,
          "gender_id": this._mixDoublePlayerList[i].gender_id,
        }
        this._membersList.push(details);
      }
      const body = {
        "user_id": 0,
        "name": this._mixDoublePlayerList[0].name + '/' + this._mixDoublePlayerList[1].name,
        "category_id": this._categoryId,
        "participant_type_id": 4,
        "members": this._membersList,
        "is_self_registered": true
      }
      this._dashboardService.duplicatePair(this._mixDoublePlayerList[0].user_id + ',' + this._mixDoublePlayerList[1].user_id, this._categoryId).subscribe({
        next: (data: any) => {
          this.messageService.add({
            key: 'bc', severity: 'error', summary: 'Error', detail: 'Pair Exists', life: 2000,
          });
        },
        error: (result: any) => {
          this.eventsService.createTeam(body).subscribe({
            next: (data: any) => {
              this.messageService.add({
                key: 'bc', severity: 'success', summary: 'Success', detail: 'Team Created Successfully', life: 1000,
              });
              this.mixDoubleOrderCreations(data.body);
            },
            error: (result: any) => {
            },
            complete: () => {
            },
          });
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => {
        },
      });

    }
  }
  //#endregion method is used for API Calling for create Entry for mixDoubles
  //#region  method is used for API caliing for order creation 
  mixDoubleOrderCreations(mixId: any) {
    this._orderPlayerList = [];
    for (let i = 0; i < this._mixDoublePlayerList.length; i++) {
      const body = {
        "user_id": this._mixDoublePlayerList[i].user_id,
        "state": this._mixDoublePlayerList[i].state,
        "club": this._mixDoublePlayerList[i].club,
        "email": this._mixDoublePlayerList[i].email,
        "name": this._mixDoublePlayerList[i].name,
        "rating": this._mixDoublePlayerList[i].rating,
        "age": this._mixDoublePlayerList[i].age,
        "gender_id": this._mixDoublePlayerList[i].gender_id,
      }
      this._orderPlayerList.push(body);
    }
    const data = {
      "event_id": this._eventId,
      "participant_type_id": 4,
      "categories": [
        {
          "category_id": this._categoryId,
          "participants": [
            {
              "participant_name": this._mixDoublePlayerList[0].name + '/' + this._mixDoublePlayerList[1].name,
              "ref_id": mixId,
              "rating": Math.ceil(this.mixDoublesRating / this._mixDoublePlayerList.length),
              "players": this._orderPlayerList
            }
          ]
        }
      ],
      "payment_id": 3,
      "is_self": true
    }
    this.eventsService.registerParticipants(data).subscribe({
      next: (result: any) => {
        this._isMixDoubleCreation = false;
        this._membersList = [];
        this._orderPlayerList = [];
        this._mixDoublePlayerList = [];
        this._selectedMixDoublePlayer = [];
        this.getPlayerList()
      },
      error: (result) => {
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this.messageService.add({
          key: 'bc', severity: 'error', summary: 'Error', detail: result.error.msg, life: 3000,
        });
      },
      complete: () => {

      },
    });
  }
  //#endregion method is used for API caliing for order creation 
  //#region This method return true if text length greater then 2 after that we will search
  isSeaching(data: any) {
    if (data == '') {
      return true
    } else {
      if (data.length > 2) {
        return true
      } else {
        return false;
      }
    }
  }
  //#endregion This method return true if text length greater then 2 after that we will search
  //#region method to check the duplicate team name when the user is creating the team
  duplicateTeam() {
    this._dashboardService.duplicateTeamName(this._teamName).subscribe({
      next: (data: any) => {
        this.messageService.add({
          key: 'bc', severity: 'error', summary: 'Error', detail: 'Team Name Exists', life: 2000,
        });
      },
      error: (result: any) => {
        this.CreateTeam();
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    });
  }
  //#endregion method to check the duplicate team name when the user is creating the team

  searchQueuedPlayer() {
    if (this._queuedName != "") {
      this._queuedPlayerList = this._queuedPlayerListCopy.filter((res: { participant_name: string; }) => {
        return res.participant_name.toLowerCase().match(this._queuedName.toLocaleLowerCase())
      })
    }
    else if (this._queuedName == "") {
      this.getAllQueuedPlayers()
    }
  }
  generateClass() {
    this._classList = []
    this._alphaList = ['A', 'B', 'C', "D", "E", "F", "G", "H", "I", "J"]
    if (this._tabChange) {
      this._selectedCategory = this._categoryName
    }
    else {
      this._selectedCategory = this._categoryList[0].category_description
    }
    this._subClassList = this._alphaList.splice(0, this._subClassVal)
    for (let index = 0; index < this._subClassVal; index++) {
      this._classList.push({ subClassName: this._selectedCategory + ' ' + this._subClassList[index], numberOfPlayer: null })
    }
  }
  closeSubClass() {
    this._classList = []
    this._subClassVal = '';
    this._openSubClass = false;
    this.getParticipantAndCategories()
  }
  sendData() {
    this._subclassList = [];
    for (let i = 0; i < this._classList.length; i++) {
      const body = {
        "num_of_participant_sub_cat": this._classList[i].numberOfPlayer,
      }
      this._subclassList.push(body);
    }
    const singleArray = this._subclassList.flatMap((obj: any) => Object.values(obj));
    const body = {
      participant_type_id: this._currentParticipantId,
      from_cat_id: this._categoryId,
      category_num: this._classList.length,
      num_of_participant_sub_cat: singleArray
    }
    this._showLoader = true;
    this.playerService.createSubClasses(body, this._eventId).subscribe({
      next: (result: any) => {
        this._showLoader = false;
      },
      error: (result: any) => {
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error', detail: result.error.msg, life: 3000 });
      },
      complete: () => { },
    });
    this._openSubClass = false;
    this.getParticipantAndCategories()
  }
  getPlayerCount() {
    if (this._currentParticipantId == 1) {
      return this._playersCopy.length;
    } else if (this._currentParticipantId == 2) {
      return this._teamListCopy.length;
    } else if (this._currentParticipantId == 3) {
      return this._doubleListCopy.length;
    } else if (this._currentParticipantId == 4) {
      return this._mixDoubleListCopy.length;
    }
  }
}
