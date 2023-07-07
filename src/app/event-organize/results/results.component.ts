import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { ProfileLettersService } from 'src/app/services/ProfileLetters/profile-letters.service';
import { SocketService } from 'src/app/services/Sockets/socket.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  //#region Here we are declariong Variables
  _showarrow: boolean = false;
  _activeIndex = 0;
  _category: any = [];
  _totalPlayer: any;
  _participantTypesList: any = [];
  _currentCategoryId: any;
  _currentParticipantId: any = '';
  _showLoader: boolean = false;
  _categoryList: any = [];
  _groupPlayOffSteps: any = [
    {
      label: 'Group Creation',
      command: (event: any) => {
        this._activeIndex = 0;
      },
    },
    {
      label: 'Match Scheduler',
      command: (event: any) => {
        this._activeIndex = 1;
      },
    },
    {
      label: 'Main Draw',
      command: (event: any) => {
        this._activeIndex = 2;
      },
    },
  ];
  _selectedParticipantTypes: any = null;
  _fixtureFormat: any = [
  ];
  _selectedFixtureFormat: any = null;

  event: any;
  _eventId: any;
  azureLoggerConversion: any = new Error();
  _eventSlider: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    margin: 15,
    navSpeed: 700,
    autoWidth: true,
    navText: [
      '<i class="pi pi-chevron-left"></i>',
      '<i class="pi pi-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 4,
      },
    },
    nav: true,
  };
  _liveMatcheScoreDetails: any = [];
  intervalID: any;
  _subcategoryList: any = [];
  //#endregion Here we are declariong Variables

  constructor(
    private encyptDecryptService: EncyptDecryptService,
    public router: Router, private eventsService: EventsService,
    private socketService: SocketService, private azureLoggerService: MyMonitoringService,
    private profileLettersService: ProfileLettersService
  ) {
    // this.viewStatus()
    this._category = [
      {
        name: 'Men’s',
        totalPlayers: 12,
      },
      {
        name: 'Women’s',
        totalPlayers: 10,
      },
      { name: 'U-19 Boys', totalPlayers: 15 },
      { name: 'U-19 Girls', totalPlayers: 5 },
    ];
  }

  jump() {
    // <app-results></app-results>
    alert('clicked');
  }

  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getParticipantTypeAndCategories();
    this.event = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this.getLiveScoredMatches();
    this.callSocketForLiveScore();
  }

  getActive(data: any) { }

  //#region API call to get categories on the basis of fixture format
  tabSelection(data: any) {
    this._category[data.index]
    this._categoryList[data.index];
    this._currentCategoryId = this._categoryList[data.index].category_id;
    this._totalPlayer = this._category[data.index] === undefined ? '' : this._category[data.index].totalPlayers;
    this._subcategoryList = this._categoryList[data.index].sub_categories;
    if (this._subcategoryList.length > 0) {
      this._currentCategoryId = this._subcategoryList[0].category_id;
      this.setSubCategoryFormat();
    }
    else {
      if (this._categoryList[data.index].format_description != null) {

        if (this._categoryList[data.index].format_description == 'round robin') {
          this._fixtureFormat = [];
          this._selectedFixtureFormat = 'Round-Robin';
          this._fixtureFormat = [{ name: 'Round-Robin', key: 'RR' }];
        } else if (
          this._categoryList[data.index].format_description == 'knockout'
        ) {
          this._fixtureFormat = [];
          this._selectedFixtureFormat = 'Knockout';
          this._fixtureFormat = [{ name: 'Knockout', key: 'K' }];
        } else if (
          this._categoryList[data.index].format_description == 'group play off'
        ) {
          this._fixtureFormat = [];
          this._selectedFixtureFormat = 'Group-PlayOff';
          this._fixtureFormat = [{ name: 'Group Play-Off', key: 'GPO' }];
        }
        else if (this._categoryList[data.index].format_description == 'special') {
          this._fixtureFormat = [];
          this._selectedFixtureFormat = 'special';
          this._fixtureFormat.push({ name: 'Special', key: 'SP' });
        }
        else if (this._categoryList[data.index].format_description == 'group playoff + consolation') {
          this._fixtureFormat = [];
          this._selectedFixtureFormat = 'group playoff + consolation';
          this._fixtureFormat.push({ name: 'Group Play-Off + Consolation', key: 'GPOC' });
        }
      } else {
        this._selectedFixtureFormat = '';

      }
    }
  }
  //#endregion API call to get categories on the basis of fixture format


  //#region Method for navigation when event_ID is null
  eventClicked() {
    this.router.navigateByUrl('/event/create-event');
  }
  //#endregion Method for navigation when event_ID is null

  //#region Method to get categories on the basis of participant_type
  currentParticipant(data: any) {
    this._currentParticipantId = data.value.participant_type_id;
    this._categoryList = this._participantTypesList.filter((x: any) => x.participant_type_id == data.value.participant_type_id)[0].categories;
    this._currentCategoryId = this._categoryList[0].category_id;
    this._subcategoryList = data.value.categories[0].sub_categories
    this.setFormat();
    this.setSubCategoryFormat();

  }
  //#endregion Method to get categories on the basis of participant_type


  //#region API call to get data of participants and categories on the basis of event_ID
  getParticipantTypeAndCategories() {
    if (this._eventId != undefined || this._eventId != null) {
      this._showLoader = true;
      this.eventsService.getParticipantTypeAndCategories(this._eventId).subscribe({
        next: (result: any) => {
          this._showLoader = false;
          this._participantTypesList = result.body;
          this._selectedParticipantTypes = this._participantTypesList[0];
          this._currentParticipantId = this._selectedParticipantTypes.participant_type_id;
          this._categoryList = this._participantTypesList[0].categories;
          this._subcategoryList = result.body[0].categories[0].sub_categories;
          this._currentCategoryId = this._categoryList[0].category_id;

          if (this._categoryList.length > 7) {
            this._showarrow = true;
          }
          this.setFormat();
          this.setSubCategoryFormat();

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
  //#endregion API call to get data of participants and categories on the basis of event_ID


  //#region Method to set fixture Format and calling components according to that 
  setFormat() {
    if (this._categoryList[0]?.format_description != null) {
      if (this._categoryList[0]?.format_description == 'round robin') {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'Round-Robin';
        this._fixtureFormat.push({ name: 'Round-Robin', key: 'RR' });
      } else if (this._categoryList[0]?.format_description == 'knockout') {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'Knockout';
        this._fixtureFormat.push({ name: 'Knockout', key: 'K' }); //this._categoryList[data.index].format_description == 'group play off'
      } else if (this._categoryList[0]?.format_description == 'group play off') {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'Group-PlayOff';
        this._fixtureFormat.push({ name: 'Group Play-Off', key: 'GPO' });
      }
      else if (this._categoryList[0]?.format_description == 'special') {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'special';
        this._fixtureFormat.push({ name: 'Special', key: 'SP' });
      }
      else if (this._categoryList[0]?.format_description == 'group playoff + consolation') {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'group playoff + consolation';
        this._fixtureFormat.push({ name: 'Group Play-Off + Consolation', key: 'gpoc' });
      }
    } else {
      this._selectedFixtureFormat = '';
    }
  }

  //#endregion Method to set fixture Format and calling components according to that 

  //#region Method for navigation when no player is added
  goAtPlayerTab() {
    this.router.navigateByUrl('/event/add-player');
  }

  //#endregion Method for navigation when no player is added
  //#endregion function to set fixture format on selection of participant type
  getLiveScoredMatches() {
    if (this._eventId !== undefined && this._eventId !== null) {
      this.eventsService.getLiveScoredMatches(this._eventId).subscribe({
        next: (result: any) => {
          this._liveMatcheScoreDetails = [];
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
    // this.socketService.fetchEventResult();
    this.socketService.getLiveScore().subscribe({
      next: (result: any) => {
        if (result !== null) {
          for (let i = 0; i < this._liveMatcheScoreDetails.length; i++) {
            if (this._liveMatcheScoreDetails[i].match_id == result.MatchId) {
              this._liveMatcheScoreDetails[i].extra.nameValuePairs = result;
              this._liveMatcheScoreDetails[i].match_details[0].score[result.GameNumber] = result.GameScoreA;
              this._liveMatcheScoreDetails[i].match_details[1].score[result.GameNumber] = result.GameScoreB;
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
  subCategorySelection(data: any) {
    this._subcategoryList[data.index];
    this._currentCategoryId = this._subcategoryList[data.index].category_id;
    if (this._subcategoryList[data.index].format_description != null) {
      if (this._subcategoryList[data.index].format_description == 'round robin') {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'Round-Robin';
        this._fixtureFormat = [{ name: 'Round-Robin', key: 'RR' }];
      } else if (
        this._subcategoryList[data.index].format_description == 'knockout'
      ) {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'Knockout';
        this._fixtureFormat = [{ name: 'Knockout', key: 'K' }];
      } else if (
        this._subcategoryList[data.index].format_description == 'group play off'
      ) {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'Group-PlayOff';
        this._fixtureFormat = [{ name: 'Group Play-Off', key: 'GPO' }];
      }
      else if (this._subcategoryList[data.index].format_description == 'special') {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'special';
        this._fixtureFormat.push({ name: 'Special', key: 'SP' });
      }
      else if (this._subcategoryList[data.index].format_description == 'group playoff + consolation') {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'group playoff + consolation';
        this._fixtureFormat.push({ name: 'Group Play-Off + Consolation', key: 'GPOC' });
      }
    } else {
      this._selectedFixtureFormat = '';
    }
  }
  setSubCategoryFormat() {
    if (this._subcategoryList.length > 0) {
      if (this._subcategoryList[0].format_description != null) {
        if (this._subcategoryList[0].format_description == 'round robin') {
          this._fixtureFormat = [];
          this._selectedFixtureFormat = 'Round-Robin';
          this._fixtureFormat.push({ name: 'Round-Robin', key: 'RR' });
        } else if (this._subcategoryList[0].format_description == 'knockout') {
          this._fixtureFormat = [];
          this._selectedFixtureFormat = 'Knockout';
          this._fixtureFormat.push({ name: 'Knockout', key: 'K' }); //this._categoryList[data.index].format_description == 'group play off'
        } else if (this._subcategoryList[0].format_description == 'group play off') {
          this._fixtureFormat = [];
          this._selectedFixtureFormat = 'Group-PlayOff';
          this._fixtureFormat.push({ name: 'Group Play-Off', key: 'GPO' });
        }
        else if (this._subcategoryList[0].format_description == 'special') {
          this._fixtureFormat = [];
          this._selectedFixtureFormat = 'special';
          this._fixtureFormat.push({ name: 'Special', key: 'SP' });
        }
        else if (this._subcategoryList[0].format_description == 'group playoff + consolation') {
          this._fixtureFormat = [];
          this._selectedFixtureFormat = 'group playoff + consolation';
          this._fixtureFormat.push({ name: 'Group Play-Off + Consolation', key: 'gpoc' });
        }
      } else {
        this._selectedFixtureFormat = '';
      }
    }
  }
}

