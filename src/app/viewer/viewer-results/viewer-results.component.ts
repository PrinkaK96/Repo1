import { Component, Input } from '@angular/core';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { SocketService } from 'src/app/services/Sockets/socket.service';
import { ProfileLettersService } from 'src/app/services/ProfileLetters/profile-letters.service';

@Component({
  selector: 'stupa-viewer-results',
  templateUrl: './viewer-results.component.html',
  styleUrls: ['./viewer-results.component.scss']
})
export class ViewerResultsComponent {
  //#region Variable Declaration Start

  _skeleton: boolean = false
  idies = [1, 2, 3, 1, 2];
  id = [1, 1, 1, 1];
  _eventId: any;
  _participantTypesList: any = []
  _selectedParticipantTypes: any
  _currentParticipantId: any
  _categoryList: any = []
  _currentCategoryId: any
  _categoryName: any
  _showFixtureFormat: boolean = false
  _selectedFixtureFormat: any
  _fixtureFormat: any = []
  _category: any = [];
  _totalPlayer: any;
  // _tabIndex: any;
  _isAPICompleted: boolean = false
  _set: any;
  visible: boolean = false;
  cards = [
    {
      0: {
        _isTimeOut: true,
        _isGreen: true,
        _isYellow: true,
        _isRed: true,
      },
      1: {
        _isTimeOut: true,
        _isGreen: true,
        _isYellow: true,
        _isRed: true,
      },
    }
  ]
  // _isTimeOut:boolean=true
  // _isGreen:boolean=false
  // _isYellow:boolean=false
  // _isRed:boolean=true
  _MatchDetail = [
    {
      isTimeOut: false,
      isGreen: false,
      isRed: true,
      isYellow: false,
      islive: true,
      Rname: "Men's Singles",
      Rno: 16,
      PlaceName: 'Utttar Pradesh Sports Hub',
      tableno: 3,
      playerName: 'govind Singh',
      playerOneset: 7,
      playerOneMatchScore: [11, 11, 11, 11],
      playerName2: 'Aakash DK ',
      playerOneset2: 0,
      playerOneMatchScore2: [7, 7, 7, 7],
    }
  ];
  azureLoggerConversion: any = new Error();
  _liveMatcheScoreDetails: any = [];
  intervalID: any;
  @Input() _tabIndex: any
  _categoriesArray: any=[];
  _newList: any=[];
  _newList2: any=[];
  //#endregion Variable Declaration Start
  constructor(public encyptDecryptService: EncyptDecryptService, private eventsService: EventsService,
    private azureLoggerService: MyMonitoringService, private socketService: SocketService, private profileLettersService: ProfileLettersService) {
    // this.viewStatus();
  }
  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getParticipantTypeAndCategories();
    this.getLiveScoredMatches();
    this.callSocketForLiveScore();
  }
  ngOnChanges(changes: any) {
    if (changes._tabIndex.currentValue == 1) {
      this.getLiveScoredMatches();
      this.callSocketForLiveScore();
    }
    //this.getParticipantTypeAndCategories()
  }

  //#region API call to get list of participant type and categories
  getParticipantTypeAndCategories() {
    this._skeleton = true;
    if (this._eventId !== undefined) {
      this.eventsService.getParticipantTypeAndCategories(this._eventId).subscribe({
        next: (result: any) => {
          this._skeleton = false
          this._participantTypesList = result.body;
          this._selectedParticipantTypes = this._participantTypesList[0];
          this._currentParticipantId = this._selectedParticipantTypes.participant_type_id;
          this._categoriesArray = this._participantTypesList[0].categories;
          this._newList = this._categoriesArray.filter((x:any)=> x.sub_categories.length==0)
          this._newList2 = this._categoriesArray.map((s:any)=>s.sub_categories).flat()
          this._categoryList = [...this._newList, ...this._newList2]
          this._currentCategoryId = this._categoryList[0].category_id;
          this._categoryName = this._categoryList[0].category_description
          this._isAPICompleted = true;
          this.setFormat()
        },
        error: (result: any) => {
          this._skeleton = false
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      });
    }

  }
  //#endregion API call to get list of participant type and categories

  //#region function to get fixture format, category associated with that participant type
  currentParticipant(data: any) {
    this._currentParticipantId = data.value.participant_type_id;
    //this._categoryList = this._participantTypesList.filter((x: any) => x.participant_type_id == data.value.participant_type_id)[0].categories;
    this._categoriesArray = this._participantTypesList.filter((x: any) => x.participant_type_id == data.value.participant_type_id)[0].categories;
    this._newList = this._categoriesArray.filter((x:any)=> x.sub_categories.length==0)
    this._newList2 = this._categoriesArray.map((s:any)=>s.sub_categories).flat()
    this._categoryList = [...this._newList, ...this._newList2]
    this._currentCategoryId = this._categoryList[0].category_id
    this.setFormat()
  }
  //#endregion function to get fixture format, category associated with that participant type

  //#region function to set fixture format
  setFormat() {
    if (this._categoryList[0].format_description != null) {
      this._showFixtureFormat = true;
      if (this._categoryList[0].format_description == 'round robin') {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'Round-Robin'
        this._fixtureFormat.push(
          { name: 'Round-Robin', key: 'RR' },
        )
      } else if (this._categoryList[0].format_description == 'knockout') {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'Knockout'
        this._fixtureFormat.push(
          { name: 'Knockout', key: 'K' },
        )
      } else if (this._categoryList[0].format_description == 'group play off') {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'Group-PlayOff'
        this._fixtureFormat.push(
          { name: 'Group Play-Off', key: 'GPO' }
        )
      }
      else if (this._categoryList[0].format_description == 'special') {
        this._fixtureFormat = [];
          this._selectedFixtureFormat = 'special';
          this._fixtureFormat.push({ name: 'Special', key: 'SP' });
      }
      else if (this._categoryList[0].format_description == 'group playoff + consolation') {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'group playoff + consolation';
        this._fixtureFormat.push({ name: 'Group Play-Off + Consolation', key: 'GPOC' });
      }
    }
    else {
      this._showFixtureFormat = false;
    }
  }
  //#endregion function to set fixture format

  //#region function to set fixture format on selection of categories dropdown
  tabSelection(data: any) {
    this._skeleton = false
    // this._category[data.index]
    // alert("asdfas")
    this._categoryList[data.value];
    this._currentCategoryId = data.value.category_id;
    this._categoryName = data.value.category_description
    //this._totalPlayer = this._category[data.index].totalPlayers;
    // this._tabIndex = data.index;
    // localStorage.setItem('tabIndex', data.index)
    if (data.value.format_description != null) {
      this._showFixtureFormat = true;
      if (data.value.format_description == 'round robin') {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'Round-Robin'
        this._fixtureFormat = [{ name: 'Round-Robin', key: 'RR' }];
        // this._fixtureFormat.push(
        //   { name: 'Round-Robin', key: 'RR' },
        // )
      } else if (data.value.format_description == 'knockout') {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'Knockout'
        this._fixtureFormat = [{ name: 'Knockout', key: 'K' }];
        // this._fixtureFormat.push(
        //   { name: 'Knockout', key: 'K' },
        // )
      } else if (data.value.format_description == 'group play off') {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'Group-PlayOff'
        this._fixtureFormat = [{ name: 'Group Play-Off', key: 'GPO' }]
      }
      else if (data.value.format_description == 'special') {
        this._fixtureFormat = [];
          this._selectedFixtureFormat = 'special';
          this._fixtureFormat.push({ name: 'Special', key: 'SP' });
      }
      else if (data.value.format_description == 'group playoff + consolation') {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'group playoff + consolation';
        this._fixtureFormat.push({ name: 'Group Play-Off + Consolation', key: 'GPOC' });
      }
    }
    else {
      this._showFixtureFormat = false;
    }
  }
  //#endregion function to set fixture format on selection of categories dropdown

  //#region function to set fixture format on selection of participant type
  setType(data: any) {
    //this._categoryList = data.value.categories
    this._currentParticipantId = data.value.participant_type_id;
    //this._categoryList = this._participantTypesList.filter((x: any) => x.participant_type_id == data.value.participant_type_id)[0].categories;
    this._categoriesArray = this._participantTypesList.filter((x: any) => x.participant_type_id == data.value.participant_type_id)[0].categories;
    this._newList = this._categoriesArray.filter((x:any)=> x.sub_categories.length==0)
    this._newList2 = this._categoriesArray.map((s:any)=>s.sub_categories).flat()
    this._categoryList = [...this._newList, ...this._newList2]
    this._currentCategoryId = this._categoryList[0].category_id
    this.setFormat()

  }
  func() {
    alert(";shdf;sdh")
  }
  showDialog() {
    this.visible = false;
  }
  //#endregion function to set fixture format on selection of participant type
  getLiveScoredMatches() {
    this._skeleton = true
    if (this._eventId !== undefined && this._eventId !== null) {
      this.eventsService.getLiveScoredMatches(this._eventId).subscribe({
        next: (result: any) => {
          this._skeleton = false
          this._liveMatcheScoreDetails = []
          if (result.body.length > 0) {
            for (let i = 0; i < result.body.length; i++) {
              if (result.body[i].extra.nameValuePairs == undefined) {
                result.body[i].extra.nameValuePairs = result.body[i].extra;
              }
            }
            this._liveMatcheScoreDetails = result.body;
          } else {
            this._liveMatcheScoreDetails = [];
          }
        },
        error: (result: any) => {
          this._skeleton = false
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      });
    }
  }
  trackById(index: number, user: any): string {
    return user.match_id;
  }
  callSocketForLiveScore() {
    //this.socketService.fetchEventResult();
    this.socketService.getLiveScore().subscribe({
      next: (result: any) => {
        result;
        if (result !== null) {
          for (let i = 0; i < this._liveMatcheScoreDetails.length; i++) {
            if (this._liveMatcheScoreDetails[i].match_id == result.MatchId) {
              this._liveMatcheScoreDetails[i].extra.nameValuePairs = result;
              this._liveMatcheScoreDetails[i].match_details[0].score[result.GameNumber] = result.GameScoreA
              this._liveMatcheScoreDetails[i].match_details[1].score[result.GameNumber] = result.GameScoreB
              this._liveMatcheScoreDetails[i].match_details[0].set_won = result.SetScoreA
              this._liveMatcheScoreDetails[i].match_details[1].set_won = result.SetScoreB
            }
          }
          this._liveMatcheScoreDetails = [...this._liveMatcheScoreDetails]
          if (result.GameScore == '0-0') {
            this.getLiveScoredMatches();
          }
        }

      },
      error: (result: any) => {
        result;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    });
  }
  //#region method is used hit regressive API Calling
  viewStatus() {
    this.intervalID = setInterval(() => {
      this.getLiveScoredMatches()
    }, 60000);
  }
  //#endregion method is used hit regressive API Calling
  //#region method us used for get first letters of string
  profileLetterService(data: any) {
    return this.profileLettersService.getFirstLetters(data);
  }
  //#endregion method us used for get first letters of string
  isEmptyExtra(data: any) {
    if (data.nameValuePairs == undefined) {
      return false
    } else {
      return true
    }
  }
}
