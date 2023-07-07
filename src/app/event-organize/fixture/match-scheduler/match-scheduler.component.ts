import { CdkDragDrop, CdkDragEnd, CdkDragMove, CdkDragStart, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { ProfileLettersService } from 'src/app/services/ProfileLetters/profile-letters.service';
import { VideosService } from 'src/app/services/Videos/videos.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
@Component({
  selector: 'stupa-match-scheduler',
  templateUrl: './match-scheduler.component.html',
  styleUrls: ['./match-scheduler.component.scss'],
  providers: [MessageService],
})
export class MatchSchedulerComponent implements OnInit {
  //#region Variable Declarations

  _showSVG: boolean = false

  value: any = ''
  searchSLots: any = ''
  _skeleton: boolean = false;
  five = [1, 2, 3, 4, 5, 1, 1, 1]
  _getSets: any = [];
  _participantTypesList: any = [];
  _selectedParticipantTypes: any = null;
  _fixtureFormat: any = [];
  _selectedFixtureFormat: any = null;
  _parent_match_id: any = '';
  _teamA_participant_id: any = '';
  _teamB_participant_id: any = '';
  @Input() _currentCategoryId: any = '';
  _currentParticipantId: any = '';
  _currentEventId: any;
  _categoryList: any = [];
  _matchListForScoreUpdate: any = [];
  _matchListForScoreUpdateCopy: any = [];
  _matchFullDetails: any = [];
  _event_id: any;
  _availableSlots: any = [];
  _selectedGroup: any;
  _slots: any = [];
  _editScore: boolean = false
  _plannedList: any = [];
  _daysList: any = [];
  _showLoader: boolean = false;
  _monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  _dateIntervalList: any = [];
  _currentTimeSlot: any = [];
  _currentAllTimeSlot: any = [];
  _currentSlotId: any;
  _currentPlannerId: any;
  _currentStartTime: any;
  _currentEndTime: any;
  _currentDaySlots: any = [];
  _searchByPlayerName: any = '';
  _searchByPlayerNameUpdateScore: any = '';
  _teamMatchFullDetails: any = [];
  _teamAPlayers: any = [];
  _teamBPlayers: any = [];
  _teamAPlayersCopy: any = [];
  _teamBPlayersCopy: any = [];
  _allTimeSlot: any = [];
  _scoreArray: any = [];
  _groupId: any;
  _newSlots: any = [];
  _plannerId: any = [];
  _alldaysList: any = [];
  _intervals: any = [];
  _getAll: boolean = false;
  deleteSlot: boolean = false;
  date!: Date;
  @Input() _matchDetailsList: any = [];
  @Input() _matchDetailsListCopy: any = [];
  @Output() getListWithCategoryId = new EventEmitter<any>();
  @Output() getLeftMathesForSlots = new EventEmitter<any>();
  @Input() _tabIndex: any;
  @Output() _isScoreUpadted = new EventEmitter<any>();
  @Input() _categoryName: any
  @Input() selectedParticipantId: any;
  @Input() selectedCategoryId: any
  @Input() isKnockout: boolean = false;
  num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 0,];
  layout: any[][] = [];
  isdata: boolean = false
  azureLoggerConversion: any = new Error();
  innerWidth: any;
  _swappedList: any = [];
  _swapBDetails: any;
  _swapADetails: any;
  _availableSwappedMatches: any = [];

  _isAPICallingCompleted: boolean = false;
  checked: boolean = true;
  _newList: any = [];
  tableCount: any;
  _swappedListCopy: any = [];
  _alldaysListCopy: any = [];
  draggedItem: any = [];
  _droppedData: any = [];
  _draggedData: any = [];
  _plannerIdFirstTime: any;
  _emptySlotsList: any = [];
  _emptySlot: any = [];



  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }


  deleteCell(e: any) {

  }

  //#endregion Variable Declarations
  constructor(private encyptDecryptService: EncyptDecryptService,
    private eventsService: EventsService,
    private messageService: MessageService,
    private route: Router,
    private profileLettersService: ProfileLettersService, private azureLoggerService: MyMonitoringService,
    private videosService: VideosService) {
    // this._selectedFixtureFormat = this._fixtureFormat[2];
    this.innerWidth = window.innerWidth;

  }
  ngOnInit(): void {
    this._tabIndex = localStorage.getItem('tabIndex')
    this._event_id = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getEventPlannerDetails();
    this.getParticipantTypeAndCategories();
    this.getPlannerDates();
    const m = 3; // Number of rows
    const n = 4; // Number of columns
  }
  addItem(row: number, column: number) {
    this.layout[row][column] = prompt('Enter item:');
  }
  deleteItem(row: number, column: number) {
    this.layout[row][column] = '';
  }
  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const chng = changes[propName];
      const cur = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);
    }
    this._slots = [];
    this._newSlots = []
    this._currentDaySlots = [];
    this._currentTimeSlot = [];
    this._currentAllTimeSlot = []
    this._matchListForScoreUpdate = [];
    this._matchListForScoreUpdateCopy = [];
    this.getEventPlannerDetails();
    this.getParticipantTypeAndCategories();
    this.getPlannerDates();
  }
  //#region Method is used for update score on button  click
  updateScore(data: any) {
    if (this.selectedParticipantId == 2) {
      this._parent_match_id = data.match_id;
      this.eventsService.getTeamParticipantsDetails(this._event_id, this._categoryList[0].category_id, data.match_id).subscribe({
        next: (result: any) => {
          this._teamMatchFullDetails = [];
          this._teamMatchFullDetails = result.body;
          this._teamAPlayers = [];
          this._teamBPlayers = [];
          this._teamAPlayers = result.body[0].event_participant_details;
          this._teamBPlayers = result.body[1].event_participant_details;
          this._teamAPlayersCopy = result.body[0].event_participant_details;;
          this._teamBPlayersCopy = result.body[1].event_participant_details;
          this._teamA_participant_id = result.body[0].event_participant_details[0].participant_id;
          this._teamB_participant_id = result.body[1].event_participant_details[0].participant_id;
          this._groupId = data.group_id;
          this._editScore = true
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      });
    } else if (this.selectedParticipantId == 1 || this.selectedParticipantId == 3 || this.selectedParticipantId == 4) {
      this._matchFullDetails = [];
      this._scoreArray = [];
      for (let f = 0; f < data.sets.length; f++) {
        const dd = { value: this.digits_count(data.sets[f]) + '-' + this.digits_count(data.sets[f]) }
        this._scoreArray.push(dd)
      }
      const dd = {
        "round_name": data.round_name,
        "group_id": data.group_id,
        "match_id": data.match_id,
        "category_id": data.category_id,
        "group_name": data.group_name,
        "participantA_id": data.participantA_id,
        "participantB_id": data.participantB_id,
        "participantA_name": data.participantA_name,
        "participantB_name": data.participantB_name,
        "isSelected": false,
        "event_id": data.event_id,
        "sets": this._scoreArray
      }
      this._matchFullDetails.push(dd);
      this._editScore = true
    }
  }
  //#endregion Method is used for update score on button  click
  //#region method is Calling API For get Planner Dates
  getPlannerDates() {
    this._isAPICallingCompleted = true;
    if (this._event_id != undefined) {
      // this._showLoader = true;
      this._showLoader = true
      this.eventsService.getPlannerDates(this._event_id).subscribe({
        next: (result: any) => {
          this._isAPICallingCompleted = false;
          this._daysList = [];
          for (let i = 0; i < result.body.length; i++) {
            const data = {
              dayCount: 'Day' + (i + 1),
              dayDate: result.body[i].day.split('T')[0].split('-')[2] + '-' + this._monthNames[result.body[i].day.split('T')[0].split('-')[1] - 1],
              isSelectedDay: i == 0 ? true : false,
              planner_id: result.body[i].intervals.length > 0 ? result.body[i].planner_id : 0,
              dayDateFromBackEnd: result.body[i].day,
              intervals: result.body[i].intervals
            }
            this._daysList.push(data);
          }
          if (this._daysList[0].intervals.length > 0) {
            this._plannerIdFirstTime = this._daysList[0].planner_id
            this.getAllSlotsInterval();
          }
          else {
            this._showSVG = false
          }
          // this._showLoader = false;
          this._showLoader = false

        },
        error: (result: any) => {
          // this._showLoader = false;
          this._showLoader = false
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
          this._isAPICallingCompleted = false;
        },
        complete: () => {
        },
      })
    }
  }
  //#endregion method is Calling API For get Planner Dates
  //#region method calling on dropdown select
  getSelectedDateInterval(data: any) {
    this._currentTimeSlot = [];
    this._currentAllTimeSlot = []
    this._dateIntervalList = [];
    this._intervals = []
    this._slots = [];
    this._newSlots = [];

    if (data.value.intervals.length == 0) {
      this._plannerId = [];
      this._newList = []
      this._showSVG = false;
    }
    else {
      this._skeleton = true
      this._showSVG = true
      if (this._daysList.filter((x: any) => x.dayDateFromBackEnd == data.value.dayDateFromBackEnd)[0].intervals.length > 0) {
        for (let i = 0; i < this._daysList.filter((x: any) => x.dayDateFromBackEnd == data.value.dayDateFromBackEnd)[0].intervals.length; i++) {
          const db = {
            dateInterval: this._daysList.filter((x: any) => x.dayDateFromBackEnd == data.value.dayDateFromBackEnd)[0].intervals[i].start_time.split('T')[1].split(':')[0] + ':' + this._daysList.filter((x: any) => x.dayDateFromBackEnd == data.value.dayDateFromBackEnd)[0].intervals[i].start_time.split('T')[1].split(':')[1] + '-' + this._daysList.filter((x: any) => x.dayDateFromBackEnd == data.value.dayDateFromBackEnd)[0].intervals[i].end_time.split('T')[1].split(':')[0] + ':' + this._daysList.filter((x: any) => x.dayDateFromBackEnd == data.value.dayDateFromBackEnd)[0].intervals[i].end_time.split('T')[1].split(':')[1],
            start_time: this._daysList.filter((x: any) => x.dayDateFromBackEnd == data.value.dayDateFromBackEnd)[0].intervals[i].start_time,
            end_time: this._daysList.filter((x: any) => x.dayDateFromBackEnd == data.value.dayDateFromBackEnd)[0].intervals[i].end_time,
            planner_id: data.value.planner_id
          }
          this._dateIntervalList.push(db)
        }
      }
      this._plannerId = this._dateIntervalList[0].planner_id;
      this.getAllSlots();

    }



  }
  //#endregion method calling on dropdown select
  //#region method is used for upcase all fisrt letter with API Calling
  upcaseAllFirstLetter(data: any) {
    return this.profileLettersService.capitalizeAllFirstLetter(data);
  }
  //#endregion method is used for upcase all fisrt letter with API Calling
  //#region method is used for get group matches after perticular slot selection from dropdown
  getSlotMatches(data: any) {
    this._currentPlannerId = data.value.planner_id;
    this._currentStartTime = data.value.start_time;
    const status = 'all';
    this._currentEndTime = data.value.end_time;
    this._getAll = false;
    this.eventsService.getSlotMatches(this._event_id, this._categoryList[0].category_id, this._currentPlannerId, status, this._currentStartTime, this._currentEndTime).subscribe({
      next: (result: any) => {
        this._slots = [];
        this._newSlots = []
        this._slots = result.body;
        this._newSlots = result.body;
        this._currentSlotId = result.body[0].slot_id
        this.getGroupMatchDetails(this._categoryList[0].category_id)
        this.getSlotMatchedForScoreUpdate();
      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    });
  }
  //#endregion method is used for get group matches after perticular slot selection from dropdown
  //#region  Mmethod is used for get matches list with pending score
  getSlotMatchedForScoreUpdate() {
    const status = 'in_progress'
    this.eventsService.getSlotMatches(this._event_id, this._categoryList[0].category_id, this._currentPlannerId, status, this._currentStartTime, this._currentEndTime).subscribe({
      next: (result: any) => {
        this._matchListForScoreUpdate = [];
        this._matchListForScoreUpdateCopy = [];
        for (let i = 0; i < result.body.length; i++) {
          const data = {
            "round_name": 'R' + result.body[i].round,
            "group_id": result.body[i].group_id,
            "match_id": result.body[i].match_id,
            "category_id": result.body[i].category_id,
            "group_name": result.body[i].group_name,
            "participantA_id": result.body[i].match_details[0].participant_id,
            "participantB_id": result.body[i].match_details[1].participant_id,
            "participantA_name": result.body[i].match_details[0].participant_name,
            "participantB_name": result.body[i].match_details[1].participant_name,
            "isSelected": false,
            "event_id": result.body[i].event_id,
            "sets": result.body[i].match_details[1].sets,
            "round_level": result.body[i].round_level
          }
          this._matchListForScoreUpdate.push(data);
          this._matchListForScoreUpdateCopy.push(data);
        }
      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    });
  }
  //#endregion Mmethod is used for get matches list with pending score
  //#region method is used for delete matche slot on button click
  deleteMatchSlot(data: any) {
    // && this.deleteSlot == false
    if (data.winner === null) {
      const planner_id = data.planner_id;
      const slot_id = data.slot_id;
      const match_id = data.match_id
      if ((planner_id !== undefined || slot_id !== undefined || match_id != undefined) && (planner_id !== null || slot_id !== null || match_id != null)) {
        // this._showLoader = true;
        this._showLoader = true
        this.eventsService.deleteMatchSlot(this._event_id, planner_id, slot_id, match_id).subscribe({
          next: (result: any) => {
            // this._showLoader = false;
            this._showLoader = false
            this._slots = [];
            this._newSlots = []
            this._slots = result.body;
            this._newSlots = result.body;
            const status = 'all';
            this.getGroupMatchDetails(this._categoryList[0].category_id);
            this.getAllSlots()
            // this.getLeftMathesForSlots.emit(this._currentCategoryId);
            //this.getSlotMatchedForScoreUpdate();
            this.eventsService.getSlotMatches(this._event_id, this._categoryList[0].category_id, this._currentPlannerId, status, this._currentStartTime, this._currentEndTime).subscribe({
              next: (result: any) => {
                this._slots = [];
                this._newSlots = []
                this._slots = result.body;
                this._newSlots = result.body;
                this._currentSlotId = result.body[0].slot_id
                //this.getSlotMatchedForScoreUpdate();
                this.getAllSlots()
                if (this._getAll === true) {
                  this.getAllSlots()
                }
              },
              error: (result: any) => {
                this.azureLoggerConversion = result.error.msg
                this.azureLoggerService.logException(this.azureLoggerConversion)
              },
              complete: () => { },
            });
          },
          error: (result: any) => {
            // this._showLoader = false;
            this._showLoader = false
            this.azureLoggerConversion = result.error.msg
            this.azureLoggerService.logException(this.azureLoggerConversion)
          },
          complete: () => { },
        });
      }
    }
    else {
      this.messageService.add({
        key: 'bc',
        severity: 'info',
        summary: 'Info',
        detail: 'Match Finished',
        life: 2000,
      });
    }
  }
  //#endregion method is used for delete matche slot on button click
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
  //#region method is used for get participantTypes along with category
  getParticipantTypeAndCategories() {

    if (this._event_id !== undefined) {
      this.eventsService.getParticipantTypeAndCategories(this._event_id).subscribe({
        next: (result: any) => {

          this.selectedParticipantId
          this._participantTypesList = result.body;
          this._selectedParticipantTypes = this._participantTypesList[0];
          this._currentParticipantId = this._selectedParticipantTypes.participant_type_id;
          // this._categoryList = this._participantTypesList[0].categories;
          this._categoryList = this._participantTypesList.filter((x: any) => x.participant_type_id == this.selectedParticipantId)[0].categories.filter((x: any) => x.category_id == this.selectedCategoryId)
          this.getGroupMatchDetails(this._currentCategoryId)
          // this._currentCategoryId = this._categoryList[0].category_id;
          // this.selectedFixtureFormat(this._categoryList[this._tabIndex].format_description)
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      });
    }

  }
  //#endregion method is used for get participantTypes along with category
  //#region method is used for set fixture format base on selected participantType
  selectedFixtureFormat(data: any) {
    if (data == 'knockout') {
      this._selectedFixtureFormat = 'Knockout'
      this._fixtureFormat = [{ name: 'Knockout', key: 'K' }];
    } else if (data == 'round robin') {
      this._selectedFixtureFormat = 'Round-Robin'
      this._fixtureFormat = [{ name: 'Round-Robin', key: 'RR' }];
    } else if (data == 'group play off') {
      this._selectedFixtureFormat = 'Group-PlayOff'
      this._fixtureFormat = [{ name: 'Group-PlayOff', key: 'GPO' }]
    } else {
      this._fixtureFormat = []
    }
  }
  //#endregion method is used for set fixture format base on selected participantType
  //#region method is used for update match slot and get group base on category_id
  updateMatchSlot(details: any) {
    if (this._newList.findIndex((x: any) => x.match_id == null) > -1) {
      // this._showLoader = true;
      this._showLoader = true
      this._currentSlotId = this._newList[this._newList.findIndex((x: any) => x.match_id == null)].slot_id;
      this._currentStartTime = this._newList[this._newList.findIndex((x: any) => x.match_id == null)].start_time;
      this._currentEndTime = this._newList[this._newList.findIndex((x: any) => x.match_id == null)].end_time;
      const dd = {
        "event_id": details.event_id,
        "planner_id": this._plannerId,
        "slot_id": this._currentSlotId,
        "match_id": details.match_id,
        "participant_id_A": details.participantA_id,
        "participant_name_A": details.participantA_name,
        "participant_id_B": details.participantB_id,
        "participant_name_B": details.participantB_name,
        "start_time": this._currentStartTime,
        "end_time": this._currentEndTime,
        "live_stream": false
      }
      this.eventsService.updateMatchSlot(dd).subscribe({
        next: (result: any) => {
          // this._showLoader = false;
          this._showLoader = false
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: result.body.msg,
            life: 4000,
          });
          //this.getLeftMathesForSlots.emit(this._currentCategoryId);
          this.getGroupMatchDetails(details.category_id)
          //this.getSlotMatchedForScoreUpdate();
          this.getAllSlots()
          // this._showLoader = true;
          this._showLoader = true
          this.eventsService.getSlotMatches(this._event_id, details.category_id, this._plannerId, 'all', this._currentStartTime, this._currentEndTime).subscribe({
            next: (result: any) => {
              // this._showLoader = false;
              this._showLoader = false
              this._slots = [];
              this._newSlots = []
              this._slots = result.body;
              this._newSlots = result.body

            },
            error: (result: any) => {
              // this._showLoader = false;
              this._showLoader = false
              this.azureLoggerConversion = result.error.msg
              this.azureLoggerService.logException(this.azureLoggerConversion)

            },
            complete: () => { },
          });
        },
        error: (result: any) => {
          // this._showLoader = false;
          this._showLoader = false
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
          this.messageService.add({
            key: 'bc',
            severity: 'info',
            summary: 'Info',
            detail: result.error.msg,
            life: 4000,
          });
        },
        complete: () => { },
      });
      return true
    } else {
      this.messageService.add({
        key: 'bc',
        severity: 'info',
        summary: 'Info',
        detail: 'No available slot in selected date',
        life: 4000,
      });
      return false
    }
  }
  //#endregion  method is used for update match slot and get group base on category_id
  //#region Method is used for get planner dates after selected participantType
  currentParticipant(data: any) {
    this._tabIndex = 0;
    this._currentDaySlots = [];
    this._dateIntervalList = [];
    this._intervals = []
    this._currentTimeSlot = [];
    this._currentAllTimeSlot = []
    this._slots = [];
    this._newSlots = []
    this._matchListForScoreUpdate = [];
    this._currentParticipantId = data.value.participant_type_id;
    this._categoryList = this._participantTypesList.filter((x: any) => x.participant_type_id == data.value.participant_type_id)[0].categories;
    this.selectedFixtureFormat(this._categoryList[this._tabIndex].format_description)
    this.getListWithCategoryId.emit(this._categoryList[0].category_id);
    this.getPlannerDates();
  }
  //#endregion Method is used for get planner dates after selected participantType
  //#region  Method is used for get planner dates after selecting categoryName
  tabSelection(data: any) {
    this._currentDaySlots = [];
    this._dateIntervalList = [];
    this._intervals = []
    this._currentTimeSlot = [];
    this._currentAllTimeSlot = []
    this._slots = [];
    this._newSlots = []
    this._matchListForScoreUpdate = [];
    this._searchByPlayerName = '';
    this._searchByPlayerNameUpdateScore = '';
    this._currentCategoryId = this._categoryList[this._tabIndex].format_description
    this._currentCategoryId = this._categoryList[data.index].category_id;
    this.selectedFixtureFormat(this._categoryList[data.index].format_description)
    this.getListWithCategoryId.emit(this._categoryList[data.index].category_id);
    this.getPlannerDates();
  }
  //#endregion  Method is used for get planner dates after selected categoryName
  //#region  method is used calling API for get  _availableSlots base on event_id
  getEventPlannerDetails() {
    if (this._event_id != undefined) {
      this.eventsService.getEventPlannerDetails(this._event_id, 1).subscribe({
        next: (result: any) => {
          this._plannedList = [];
          this._plannedList = result.body;
          for (let i = 0; i < result.body.length; i++) {
            const data = {
              date: new Date(this._plannedList[i].date).getDay() + '/' + new Date(this._plannedList[i].date).getDate() + '/' + new Date(this._plannedList[i].date).getFullYear()
            }
            if (this._availableSlots.findIndex((x: any) => x.date == data.date) == -1) {
              this._availableSlots.push(data);
            }
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
  //#endregion method is used calling API for get  _availableSlots base on event_id
  //#region  method is used for search player
  searchPlayer() {
    this._matchDetailsList = this._matchDetailsListCopy.filter((item: any) => {
      return (
        item.participantA_name
          .toLowerCase()
          .includes(this._searchByPlayerName.toLowerCase()) ||
        item.participantB_name
          .toLowerCase()
          .includes(this._searchByPlayerName.toLowerCase())
      );
    });
  }
  //#endregion method is used for search player
  //#region method is used for search player
  searchPlayerFromUpdateScore() {
    this._matchListForScoreUpdate = this._matchListForScoreUpdateCopy.filter((item: any) => {
      return (
        item.participantA_name
          .toLowerCase()
          .includes(this._searchByPlayerNameUpdateScore.toLowerCase()) ||
        item.participantB_name
          .toLowerCase()
          .includes(this._searchByPlayerNameUpdateScore.toLowerCase())
      );
    });
  }
  //#endregion method is used for search player
  //#region method is  used for getSlotMatchedForScoreUpdate
  teamMatchCreated(data: any) {
    this._editScore = false;
    this.getSlotMatchedForScoreUpdate();
  }
  //#endregion method is  used for getSlotMatchedForScoreUpdate
  //#region method is emiting parent true or false base  on that parent able to know status of score
  isScoreUpadted(data: any) {
    this._isScoreUpadted.emit(data)
    this.deleteSlot = data
  }
  //#endregion  method is emiting parent true or false base  on that parent able to know status of score
  //#region method called on button click and redirect
  goAtDayPlanner() {
    localStorage.setItem('isOpenDayPlanner', 'true')
    this.route.navigate(['/event/create-event']);
  }
  //#endregion method called on button click and redirect
  //#region API calling for group matches list with categoryId
  getGroupMatchDetails(categoryId: any) {

    if (this.isKnockout) {
      this._matchDetailsList = [];
      this._matchDetailsListCopy = [];
      // this._showLoader = false;
      this._showLoader = false
      if (this._event_id !== undefined && categoryId !== undefined) {
        this.eventsService.getGroupMatchDetailsV2(this._event_id, categoryId, 1)
          .subscribe({
            next: (result: any) => {
              // if (result.body.length > 0) {
              //   this._getSets = result.body[0].match_details[0].score;
              // }
              this._getSets = result.body[0].match_details[0].score;

              // this._showLoader = false;
              this._showLoader = false
              this._matchDetailsList = [];
              this._matchDetailsListCopy = [];
              if (result.body.length > 0) {
                for (let j = 0; j < result.body.length; j++) {
                  if (result.body[j].match_details.length > 1) {
                    const data = {
                      "round_name": 'R' + result.body[j].round,
                      "group_id": result.body[j].group_id,
                      "match_id": result.body[j].match_id,
                      "category_id": result.body[j].category_id,
                      "group_name": result.body[j].group_name,
                      "participantA_id": result.body[j].match_details[0].participant_id,
                      "participantB_id": result.body[j].match_details[1] == undefined ? '' : result.body[j].match_details[1].participant_id,
                      "participantA_name": result.body[j].match_details[0].participant_name,
                      "participantB_name": result.body[j].match_details[1] == undefined ? '' : result.body[j].match_details[1].participant_name,
                      "isSelected": false,
                      "event_id": result.body[j].event_id,
                      "round_level": result.body[j].round_level,

                    }
                    if (result.body[j].match_details[1] != undefined) {
                      if (result.body[j].match_details[0] != undefined) {
                        this._matchDetailsList.push(data)
                        this._matchDetailsListCopy.push(data)
                      }
                    }
                  }
                }
              }
              this._showLoader = false
            },
            error: (result: any) => {
              // this._showLoader = false;
              this._showLoader = false
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
    } else {
      this._matchDetailsList = [];
      this._matchDetailsListCopy = [];
      // this._showLoader = false;
      this._showLoader = false
      if (this._event_id !== undefined && categoryId !== undefined) {
        this.eventsService.getGroupMatchDetailsV2(this._event_id, categoryId, 1)
          .subscribe({
            next: (result: any) => {
              // this._showLoader = false;
              this._showLoader = false
              this._matchDetailsList = [];
              this._matchDetailsListCopy = [];
              if (result.body.length > 0) {
                for (let j = 0; j < result.body.length; j++) {
                  const data = {
                    "round_name": 'R' + result.body[j].round,
                    "group_id": result.body[j].group_id,
                    "match_id": result.body[j].match_id,
                    "category_id": result.body[j].category_id,
                    "group_name": result.body[j].group_name,
                    "participantA_id": result.body[j].match_details[0].participant_id,
                    "participantB_id": result.body[j].match_details[1] == undefined ? '' : result.body[j].match_details[1].participant_id,
                    "participantA_name": result.body[j].match_details[0].participant_name,
                    "participantB_name": result.body[j].match_details[1] == undefined ? '' : result.body[j].match_details[1].participant_name,
                    "isSelected": false,
                    "event_id": result.body[j].event_id,
                    "round_level": result.body[j].round_level
                  }
                  if (result.body[j].match_details[1] != undefined) {
                    if (result.body[j].match_details[0] != undefined) {
                      this._matchDetailsList.push(data)
                      this._matchDetailsListCopy.push(data)
                    }
                  }
                }
              }
              this._showLoader = false
            },
            error: (result: any) => {
              // this._showLoader = false;
              this._showLoader = false
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
  }
  //#endregion API calling for group matches list with categoryId
  //#region refresh data by Calling API With help of getSlotMatchedForScoreUpdate method 
  refreshAll() {
    this.getSlotMatchedForScoreUpdate();
  }
  //#endregion refresh data by Calling API With help of getSlotMatchedForScoreUpdate method
  //#region API Calling for update match status live or not
  updateMatchStatus(data: any) {
    if (this._event_id !== undefined && this._event_id !== null) {
      this.videosService.updateMatchStatus(this._event_id, data.match_id, !data.live).subscribe({
        next: (result: any) => {
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      });
    }
  }
  //#endregion API Calling for update match status live or not
  //#region method is used for get latest data after drag drop

  //#endregion method is used for get latest data after drag drop


  //#region  API Calling after swap from list 
  getSlotMatchesAfterSwap(start_time: any, end_time: any, planner_id: any) {
    if (this._event_id != undefined) {
      this._currentPlannerId = planner_id;
      this._currentStartTime = start_time;
      const status = 'all';
      this._currentEndTime = end_time;
      this.eventsService.getSlotMatches(this._event_id, this._categoryList[0].category_id, this._currentPlannerId, status, this._currentStartTime, this._currentEndTime).subscribe({
        next: (result: any) => {
          this._slots = [];
          this._newSlots = []
          this._slots = result.body;
          this._newSlots = result.body;
          this._currentSlotId = result.body[0].slot_id
          this.getGroupMatchDetails(this._categoryList[0].category_id)
          this.getSlotMatchedForScoreUpdate();
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      });
    }
  }
  //#endregion API Calling after swap from list 
  getAllSlots() {
    // this._skeleton=false
    if (this._event_id != undefined) {
      this._alldaysList = [];
      this._intervals = [];
      //this.deleteSlot = true
      this._currentTimeSlot = '';
      //this._plannerId= this._plannerId.length>0 ? this._plannerId : this._plannerIdFirstTime
      this.eventsService.getAllSlots(this._event_id, this._plannerId).subscribe({
        next: (result: any) => {
          this._skeleton = false
          this._alldaysList = result.body[0].match_slot_info;
          this._alldaysListCopy = this._alldaysList
          this.tableCount = result.body[0].match_slot_info[0].slot_info
          this._newList = result.body[0].match_slot_info.flatMap((s: any) => s.slot_info);
          this._swappedList = result.body[0].match_slot_info.flatMap((s: any) => s.slot_info).filter((p: any) => p.participant_name_A != null);
          this._emptySlotsList = result.body[0].match_slot_info.flatMap((s: any) => s.slot_info).filter((p: any) => p.participant_name_A == null);
          for (let i = 0; i < this._alldaysList.length; i++) {
            const db = {
              dateInt: this._alldaysList.map((x: any) => x.start_time)[i].split('T')[1].slice(0, 5) + '-' + this._alldaysList.map((x: any) => x.end_time)[i].split('T')[1].slice(0, 5),
              start_time: this._alldaysList.map((x: any) => x.start_time)[i],
              end_time: this._alldaysList.map((x: any) => x.end_time)[i],
              planner_id: this._alldaysList.map((x: any) => x.planner_id)[i]
            }
            this._intervals.push(db)
          }
          this._slots = [];
          this._newSlots = [];
          this._slots = result.body;
          this._newSlots = result.body;
          this._currentSlotId = result.body[0].slot_id;
          this.getGroupMatchDetails(this._categoryList[0].category_id)
          //this.getSlotMatchedForScoreUpdate();
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      });
    }
  }
  //#endregion API Calling after drag drop slot matches
  showImplty() {
    if (this._matchDetailsList == undefined) {
      return false
    } else {
      return true
    }
  }
  swapSlotsInstance(event: any) {
    this.swapSlotsFromList(event)
  }
  swapSlotsFromList(swappedData: any) {
    if (this._event_id != undefined) {
      const data = {
        event_id: parseInt(this._event_id),
        planner_id: swappedData.planner_id,
        slot_id_A: this._swapADetails.slot_id,
        slot_id_B: swappedData.slot_id,
        slot_start_time_A: this._swapADetails.start_time,
        slot_end_time_A: this._swapADetails.end_time,
        slot_start_time_B: swappedData.start_time,
        slot_end_time_B: swappedData.end_time
      }
      this.eventsService.swapMatchSlots(data).subscribe({
        next: (result: any) => {
          this.getAllSlots();
          this._availableSwappedMatches = [];
          this._swappedList = [];
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      });
    }
  }
  slotIdA(details: any) {
    this._swapBDetails = details.slot_id
  }
  slotIdB(details: any) {
    const index = this._swappedList.findIndex((x: any) => x.match_id == details.match_id);
    this._availableSwappedMatches = this._swappedList.splice(index, 1);
    this._swappedListCopy = this._swappedList;
    this._swapADetails = details
  }
  searchSlots() {
    this._swappedList = this._swappedListCopy.filter((item: any) => {
      return (
        item.participant_name_A.toLowerCase().includes(this.value.toLowerCase())) ||
        item.participant_name_B.toLowerCase().includes(this.value.toLowerCase())
    });
  }
  searcSlotsMatches() {

    this._alldaysList = this._newList.filter((item: any) => {
      return (
        item.participant_name_A.toLowerCase().includes(this.searchSLots.toLowerCase())) ||
        item.participant_name_B.toLowerCase().includes(this.searchSLots.toLowerCase())
    });
  }


  onDragStart(event: DragEvent) {
    this._draggedData = event;
  }

  onDrop(event: DragEvent) {
  }
  onDragOver(event: DragEvent) {
    this._droppedData = event;
  }
  onDragMatchHover(event: DragEvent, dragRef: HTMLElement) {
    dragRef.style.visibility = 'hidden';
    this._droppedData = event;
  }

  onDragEnd(event: DragEvent) {
    this.swapAfterDragAndDrop()
  }
  onDragEnter(event: DragEvent) {
  }
  swapAfterDragAndDrop() {
    if (this._event_id != undefined) {
      const data = {
        event_id: parseInt(this._event_id),
        planner_id: this._draggedData.planner_id,
        slot_id_A: this._draggedData.slot_id,
        slot_id_B: this._droppedData.slot_id,
        slot_start_time_A: this._draggedData.start_time,
        slot_end_time_A: this._draggedData.end_time,
        slot_start_time_B: this._droppedData.start_time,
        slot_end_time_B: this._droppedData.end_time,
       participant_id1_A: this._draggedData.participant_id_A,
       participant_id2_A: this._draggedData.participant_id_B,
       participant_id1_B: this._droppedData.participant_id_A,
       participant_id2_B: this._droppedData.participant_id_B,
       participant_name1_A: this._draggedData.participant_name_A,
       participant_name2_A: this._draggedData.participant_name_B,
       participant_name1_B: this._droppedData.participant_name_A,
       participant_name2_B: this._droppedData.participant_name_B
      }
      
      this.eventsService.swapMatchSlots(data).subscribe({
        next: (result: any) => {
          this.getAllSlots();
          this._availableSwappedMatches = []
          this._swappedList = [];
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: result.body.msg,
            life: 3000,
          });
        },
        error: (result: any) => {
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
  }
  getAllSlotsInterval() {
    this._isAPICallingCompleted = true;
    if (this._event_id != undefined) {

      this._alldaysList = [];
      this._intervals = [];
      this._getAll = true;
      //this.deleteSlot = true
      this._currentTimeSlot = ''
      this._plannerId = this._plannerIdFirstTime
      this.eventsService.getAllSlots(this._event_id, this._plannerIdFirstTime).subscribe({
        next: (result: any) => {
          this._showSVG = true
          this._isAPICallingCompleted = false;
          this._alldaysList = result.body[0].match_slot_info;
          this._alldaysListCopy = this._alldaysList
          this._newList = this._alldaysList.flatMap((s: any) => s.slot_info);
          this.tableCount = result.body[0].match_slot_info[0].slot_info
          this._swappedList = result.body[0].match_slot_info.flatMap((s: any) => s.slot_info).filter((p: any) => p.participant_name_A != null);
          this._emptySlotsList = result.body[0].match_slot_info.flatMap((s: any) => s.slot_info).filter((p: any) => p.participant_name_A == null);
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
          this._isAPICallingCompleted = false;
        },
        complete: () => { },
      });
    }
  }

  emptySlotsA(details: any) {
    this._availableSwappedMatches = [];
    this._swapADetails = [];
    this._swappedListCopy = []
    const index = this._emptySlotsList.findIndex((x: any) => x.match_id == details.match_id);
    this._availableSwappedMatches = this._emptySlotsList.splice(index, 1);
    this._swappedListCopy = this._emptySlotsList;
    this._swapADetails = details
  }
  onDropEndMatch(matchDetails: any) {
    // dragRef.style.visibility = 'visible';
    this.updateMatchSlotWhenDropped(matchDetails)
  }
  updateMatchSlotWhenDropped(details: any) {
    this._showLoader = true
    if(this._droppedData.slot_id != undefined){
      const dd = {
        "event_id": details.event_id,
        "planner_id": this._droppedData.planner_id,
        "slot_id": this._droppedData.slot_id,
        "match_id": details.match_id,
        "participant_id_A": details.participantA_id,
        "participant_name_A": details.participantA_name,
        "participant_id_B": details.participantB_id,
        "participant_name_B": details.participantB_name,
        "start_time": this._droppedData.start_time,
        "end_time": this._droppedData.end_time,
        "live_stream": false
      }
      this.eventsService.updateMatchSlot(dd).subscribe({
        next: (result: any) => {
          // this._showLoader = false;
          this._showLoader = false
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: result.body.msg,
            life: 4000,
          });
          //this.getLeftMathesForSlots.emit(this._currentCategoryId);
          this.getGroupMatchDetails(details.category_id)
          //this.getSlotMatchedForScoreUpdate();
          this.getAllSlots()
          // this._showLoader = true;
          this._showLoader = true
          this.eventsService.getSlotMatches(this._event_id,details.category_id, this._currentPlannerId, 'all', this._currentStartTime, this._currentEndTime).subscribe({
            next: (result: any) => {
              // this._showLoader = false;
              this._showLoader = false
              this._slots = [];
              this._newSlots = []
              this._slots = result.body;
              this._newSlots = result.body
  
            },
            error: (result: any) => {
              // this._showLoader = false;
              this._showLoader = false
              this.azureLoggerConversion = result.error.msg
              this.azureLoggerService.logException(this.azureLoggerConversion)
  
            },
            complete: () => { },
          });
        },
        error: (result: any) => {
          // this._showLoader = false;
          this._showLoader = false
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
          this.messageService.add({
            key: 'bc',
            severity: 'info',
            summary: 'Info',
            detail: result.error.msg,
            life: 4000,
          });
        },
        complete: () => { },
      });
    }
  }
  ghostCreateHandler(dragRef: HTMLElement) {
    dragRef.style.visibility = 'hidden';
  }
}
