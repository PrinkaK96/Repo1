import { Component } from '@angular/core';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { SocketService } from 'src/app/services/Sockets/socket.service';
import { ProfileLettersService } from 'src/app/services/ProfileLetters/profile-letters.service';
import { BroadcastOnlyService } from 'src/app/services/broadcastOnly/broadcast-only.service';
@Component({
  selector: 'stupa-viewer-broadcast-results',
  templateUrl: './broadcast-viewer-results.component.html',
  styleUrls: ['./broadcast-viewer-results.component.scss']
})
export class BroadcastViewerResultsComponent {
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
  _tabIndex: any;
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
    // ,
    // {
    //   islive: true,
    //   Rname: 'U-17 Singles',
    //   Rno: 8,
    //   PlaceName: 'haryana Sports Hub',
    //   tableno: 1,
    //   playerName: 'asdfasdf ',
    //   playerOneset: 3,
    //   playerOneMatchScore: [11, 11, 11],
    //   playerName2: 'tryutyu DK ',
    //   playerOneset2: 0,
    //   playerOneMatchScore2: [7, 7, 7],
    // },
    // {
    //   islive: false,
    //   Rname: 'U-15  Singles',
    //   Rno: 2,
    //   PlaceName: 'gurgaon Hub',
    //   tableno: 3,
    //   playerName: '23432 Si234324ngh',
    //   playerOneset: 3,
    //   playerOneMatchScore: [11, 11, 11],
    //   playerName2: 'ashfla asdfsddf ',
    //   playerOneset2: 0,
    //   playerOneMatchScore2: [7, 7, 7],
    // },
    // {
    //   islive: true,
    //   Rname: "Men's Singles",
    //   Rno: 16,
    //   PlaceName: 'Utttar Pradesh Sports Hub',
    //   tableno: 3,
    //   playerName: 'govind Singh',
    //   playerOneset: 3,
    //   playerOneMatchScore: [11, 11, 11],
    //   playerName2: 'Aakash DK ',
    //   playerOneset2: 0,
    //   playerOneMatchScore2: [7, 7, 7],
    // },
    // {
    //   islive: true,
    //   Rname: "WoMan's Singles",
    //   Rno: 16,
    //   PlaceName: 'asdf Sports Hub',
    //   tableno: 1,
    //   playerName: 'asdf Singh',
    //   playerOneset: 3,
    //   playerOneMatchScore: [11, 11, 11],
    //   playerName2: 'Aakash DK ',
    //   playerOneset2: 0,
    //   playerOneMatchScore2: [7, 7, 7],
    // },
    // {
    //   islive: true,
    //   Rname: "Men's Singles",
    //   Rno: 16,
    //   PlaceName: 'Utttar Pradesh Sports Hub',
    //   tableno: 3,
    //   playerName: 'govind Singh',
    //   playerOneset: 3,
    //   playerOneMatchScore: [11, 11, 11],
    //   playerName2: 'Aakash DK ',
    //   playerOneset2: 0,
    //   playerOneMatchScore2: [7, 7, 7],
    // },
    // {
    //   islive: true,
    //   Rname: "Men's Singles",
    //   Rno: "f",
    //   PlaceName: 'Utttar Pradesh Sports Hub',
    //   tableno: 3,
    //   playerName: 'Yogesh ',
    //   playerOneset: 4,
    //   playerOneMatchScore: [12,4,5,11, 11, 11,11],
    //   playerName2: 'Rohit Kumar  ',
    //   playerOneset2: 3 ,
    //   playerOneMatchScore2: [14,11,11,7, 7, 7],
    // },
  ];
  azureLoggerConversion: any = new Error();
  _liveMatcheScoreDetails: any = [];
  intervalID: any;
  _streamedVideos: any = [];
  _streamedVideosCopy: any = [];
  _liveMatches: any = [];
  _liveMatchesCopy: any = [];
  //#endregion Variable Declaration Start
  constructor(public encyptDecryptService: EncyptDecryptService, private eventsService: EventsService, private broadcastService: BroadcastOnlyService,
    private azureLoggerService: MyMonitoringService, private socketService: SocketService, private profileLettersService: ProfileLettersService) {
    // this.viewStatus();


  }
  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getLiveScoredMatches();
    this.callSocketForLiveScore();
    this.getBroadcastMatchesStreamed();

  }
  // ngOnChanges() {
  //   this.getLiveScoredMatches()
  //   this.getBroadcastMatchesStreamed();
  //   //this.getParticipantTypeAndCategories()
  // }

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
          this._categoryList = this._participantTypesList[0].categories;
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
    this._categoryList = this._participantTypesList.filter((x: any) => x.participant_type_id == data.value.participant_type_id)[0].categories;
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
          { name: 'Group-PlayOff', key: 'GPO' }
        )
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
        this._fixtureFormat = [{ name: 'Group-PlayOff', key: 'GPO' }]
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
    this._categoryList = this._participantTypesList.filter((x: any) => x.participant_type_id == data.value.participant_type_id)[0].categories;
    this._currentCategoryId = this._categoryList[0].category_id
    this.setFormat()

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
        complete: () => {
         
        },
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
              this._liveMatcheScoreDetails[i].match_details[0].score[result.GameNumber - 1] = result.GameScoreA
              this._liveMatcheScoreDetails[i].match_details[1].score[result.GameNumber - 1] = result.GameScoreB
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
  getBroadcastMatchesStreamed() {
    if (this._eventId != undefined || this._eventId != null) {
      //this._showLoader = true;
      this.broadcastService.getBroadCastLiveMatches(this._eventId, false).subscribe({
        next: (result: any) => {
          // this._showLoader = false;
          this._streamedVideos = [];

          for (let i = 0; i < result.body.length; i++) {
            // const videosDetails = {
            //   "match_id": result.body[i].match_id,
            //   "round_description": result.body[i].fixture_format,
            //   "playback_id": result.body[i].playback_id,
            //   "asset_playback_id": result.body[i].additional_url==null ? result.body[i].asset_playback_id : undefined,
            //   "additional_url": result.body[i].asset_playback_id==null ? result.body[i].additional_url : undefined,
            //   "participants": result.body[i].match_details,
            //   "thumbnail": 'https://image.mux.com/' + result.body[i].playback_id + '/thumbnail.png?width=214&height=121&fit_mode=pad'
            // }
            if (result.body[i].winner !== null) {
              this._streamedVideos.push(result.body[i]);
              this._streamedVideosCopy.push(result.body);
            }

          }
          // this._liveMatchesList = result.body;
        },
        error: (result: any) => {
          //this._showLoader = false;
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      });
    }
  }
}
