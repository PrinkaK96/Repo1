import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'stupa-update-match-score',
  templateUrl: './update-match-score.component.html',
  styleUrls: ['./update-match-score.component.scss']
})
export class UpdateMatchScoreComponent {
  _scoreList: any = [];
  _scoreListCopy: any = [];
  _updateScore: boolean = false;
  _eventId: any;
  _participantTypesList: any = [];
  _currentCategoryId: any;
  _matchDetailsList: any = [];
  _matchDetailsListCopy: any = [];
  _categoryList: any = [];
  _showLoader: boolean = false;
  _selectedParticipantTypes: any;
  _currentParticipantId: any;
  _showFixtureFormat: any;
  _selectedFixtureFormat = ''
  _fixtureFormat: any = []
  _tabIndex: any
  _showarrow: boolean = false;
  _scoreArray: any = [];
  _parent_match_id: any = '';
  _groupId: any;
  _activeIndex = 0;
  _groupPlayOffSteps: any = [
    {
      label: 'Group Play-Off',
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
    {
      label: 'Consolation',
      command: (event: any) => {
        this._activeIndex = 2;
      },
    }
  ];

  _withoutConsolation: any = [
    {
      label: 'Group Play-Off',
      command: (event: any) => {
        this._activeIndex = 0;
      },
    },
    {
      label: 'Main Draw',
      command: (event: any) => {
        this._activeIndex = 1;
      },
    }
  ];
  _finalScoreArray: any = [];
  _team_Matches: any = [];
  _isNextStepActive: boolean = false;
  _search: any = '';
  @Output() isScoreUpdated = new EventEmitter<any>();
  _subcategoryList: any = [];
  _isAPICallingCompleted: boolean = false;
  constructor(private encyptDecryptService: EncyptDecryptService, private eventsService: EventsService, private router: Router) { }

  _printScore: boolean = false;
  ngOnInit() {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getParticipantTypeAndCategories()
  }
  // addScore() {
  //   this._updateScore = true
  //   this.showEdit();
  // }
  getParticipantTypeAndCategories() {
    if (this._eventId !== undefined) {
      this.eventsService.getParticipantTypeAndCategories(this._eventId).subscribe({
        next: (result: any) => {
          if (result.body.length) {
            this._participantTypesList = result.body;
            this._selectedParticipantTypes = this._participantTypesList[0];
            this._currentParticipantId = this._selectedParticipantTypes.participant_type_id;
            this._categoryList = this._participantTypesList[0].categories;
            this._subcategoryList = result.body[0].categories[0].sub_categories;
            this._currentCategoryId = this._categoryList[0].category_id;
            localStorage.setItem('team_Matches', result.body[0].categories[0].sub_categories.length > 0 ? result.body[0].categories[0].sub_categories[0].team_matches : result.body[0].categories[0].team_matches)
            this.setFormat();
            this.setSubCategoryFormat();
            this.getGroupMatchDetails(this._currentCategoryId)
            if (this._categoryList.length > 7) {
              this._showarrow = true;
            }
          }
        },
        error: (result: any) => {

        },
        complete: () => { },
      });

    }

  }
  getGroupMatchDetails(categoryId: any) {
    this._scoreList = [];
    let grpType = 2;
    if (this._selectedFixtureFormat == 'Knockout' || this._selectedFixtureFormat == 'Main Draw' || this._selectedFixtureFormat == 'Consolation Main Draw') {
      grpType = 2
    }
    else if (this._selectedFixtureFormat == 'consolation') {
      grpType = 3
    }
    else {
      grpType = 1;
    }
    if (this._eventId !== undefined && categoryId !== undefined) {
      this._isAPICallingCompleted = true;
      this.eventsService.getGroupMatchDetailsV3(this._eventId, categoryId, grpType)
        .subscribe({
          next: (result: any) => {
            this._isAPICallingCompleted = false;
            if (result.body.length > 0) {
              this._isNextStepActive = true
            } else {
              this._isNextStepActive = false
            }
            for (let i = 0; i < result.body.length; i++) {
              for (let j = 0; j < result.body[i].group_match_details.length; j++) {
                this._scoreList.push(result.body[i].group_match_details[j]);
                this._scoreListCopy.push(result.body[i].group_match_details[j]);
              }
            }
          },
          error: (result: any) => {
            this._isAPICallingCompleted = false;
          },
          complete: () => { },
        });
    }

  }
  //#region used when change in participant Type occurs
  currentParticipant(data: any) {
    this._currentParticipantId = data.value.participant_type_id;
    this._categoryList = this._participantTypesList.filter(
      (x: any) => x.participant_type_id == data.value.participant_type_id
    )[0].categories;
    this._currentCategoryId = data.value.categories[0].sub_categories.length > 0 ? data.value.categories[0].sub_categories.category_id : data.value.categories[0].category_id;
    ;
    this._subcategoryList = data.value.categories[0].sub_categories
    this.setFormat();
    this.setSubCategoryFormat();
    this.getGroupMatchDetails(this._currentCategoryId);

  }
  //#endregion

  //#region Start: set fixture format label
  setFormat() {
    if (this._categoryList.length > 0) {
      if (this._categoryList[0].format_description != null) {
        this._showFixtureFormat = true;
        if (this._categoryList[0].format_description == 'round robin') {
          this._fixtureFormat = [];
          this._selectedFixtureFormat = 'Round-Robin';
          this._fixtureFormat.push({ name: 'Round-Robin', key: 'RR' });
        } else if (this._categoryList[0].format_description == 'knockout') {
          this._fixtureFormat = [];
          this._selectedFixtureFormat = 'Knockout';
          this._fixtureFormat.push({ name: 'Knockout', key: 'K' }); //this._categoryList[data.index].format_description == 'group play off'
        } else if (this._categoryList[0].format_description == 'group play off') {
          this._fixtureFormat = [];
          this._selectedFixtureFormat = 'Group-PlayOff';
          this._fixtureFormat.push({ name: 'Group Play-Off', key: 'GPO' });
        }
        else if (this._categoryList[0].format_description == 'special') {
          this._fixtureFormat = [];
          this._selectedFixtureFormat = 'special';
          this._fixtureFormat.push({ name: 'Special', key: 'SP' });
        }
        else if (this._categoryList[0].format_description == 'group playoff + consolation') {
          this._fixtureFormat = [];
          this._selectedFixtureFormat = 'group playoff + consolation';
          this._fixtureFormat.push({ name: 'Group Play-Off + Consolation', key: 'gpoc' });
        }
      } else {
        this._selectedFixtureFormat = '';
        this._showFixtureFormat = false;
      }
    }

  }
  //#endregion End":set fixture format label

  //#region This method is basically used for Get current selected Tab
  tabSelection(data: any) {
    this._categoryList[data.index];
    this._currentCategoryId = this._categoryList[data.index].category_id;
    this._subcategoryList = this._categoryList[data.index].sub_categories;
    localStorage.setItem('tabIndex', data.index);
    this._tabIndex = data.index;
    if (this._subcategoryList.length > 0) {
      this._currentCategoryId = this._subcategoryList[0].category_id;
      this.setSubCategoryFormat();
    }
    // this._categoryName = this._categoryList[data.index].category_description;

    else {
      if (this._categoryList[data.index].format_description != null) {
        this._showFixtureFormat = true;
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
        this._showFixtureFormat = false;
      }
    }
    this.getGroupMatchDetails(this._currentCategoryId);

    //Check if Category Matches are finished
  }
  //#endregion
  addScore(data: any) {
    this._matchDetailsList = [];
    this._scoreArray = [];
    this._groupId = data.group_id;
    if (this._currentParticipantId == 2) {
      this._parent_match_id = data.match_id;
      this.eventsService.getTeamParticipantsDetails(this._eventId, this._currentCategoryId, data.match_id).subscribe({
        next: (result: any) => {
          this._matchDetailsList = result.body
        },
        error: (result: any) => {
          // this.azureLoggerConversion = result.error.msg
          // this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      });
    } else {
      for (let f = 0; f < data.match_details[0].score.length; f++) {
        const dd = { value: this.digits_count(data.match_details[0].score[f]) + '-' + this.digits_count(data.match_details[1].score[f]) }
        this._scoreArray.push(dd)
      }
      const dd = {
        "round_name": data.round_level,
        "match_id": data.match_id,
        "participantA_id": data.match_details[0].participant_id,
        "participantB_id": data.match_details[1].participant_id,
        "participantA_name": data.match_details[0].participant_name,
        "participantB_name": data.match_details[1].participant_name,
        "sets": this._scoreArray,
        "group_id": data.group_id,
        "start_time": data.start_time,
        "table": data.table,
        "umpire_name": data.umpire_name
      }

      this._matchDetailsList.push(dd);
    }
    this._updateScore = true;
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
  _newList: any = []
  openPrintScore() {
    this._scoreList;
    this._finalScoreArray = [];
    if (this._currentParticipantId == 2) {
      let grpType = 2;
      if (this._selectedFixtureFormat == 'Knockout') {
        grpType = 2
      } else {
        grpType = 1;
      }
      this._printScore = false;
      this.eventsService.getTeamMatchesAndSubmatches(this._eventId, this._currentCategoryId, grpType).subscribe({
        next: (result: any) => {
          if (localStorage.getItem('team_Matches') !== null) {
            this._team_Matches.length = localStorage.getItem('team_Matches')
          } else {
            this._team_Matches.length = 0;
          }
          this._matchDetailsList = result.body;
          this._printScore = true;
        },
        error: (result: any) => {
          // this.azureLoggerConversion = result.error.msg
          // this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => {
          this.getTeamMatches();
        },
      });
    } else {
      for (let i = 0; i < this._scoreList.length; i++) {
        this._parent_match_id = this._scoreList[i].match_id;
        this._scoreArray = [];
        for (let f = 0; f < this._scoreList[i].match_details[0].score.length; f++) {
          const dd = { value: this.digits_count(this._scoreList[i].match_details[0].score[f]) + '-' + this.digits_count(this._scoreList[i].match_details[1].score[f]) }
          this._scoreArray.push(dd)
        }
        const dd = {
          "table": this._scoreList[i].table,
          "start_time": this._scoreList[i].start_time,
          "umpire_name": this._scoreList[i].umpire_name,
          "round_level": this._scoreList[i].round_level,
          "match_id": this._scoreList[i].match_id,
          "participantA_id": this._scoreList[i].match_details[0].participant_id,
          "participantB_id": this._scoreList[i].match_details[1].participant_id,
          "participantA_name": this._scoreList[i].match_details[0].participant_name,
          "participantB_name": this._scoreList[i].match_details[1].participant_name,
          "bestof": this._scoreList[i].match_details[0].score.length,
          "sets": this._scoreArray
        }
        this._finalScoreArray.push(dd)

      }
    }
    this._printScore = true
  }

  //#endregion  Method is used for count digits

  //#region This method is used for Navigation
  goAtPlayerTab() {
    this.router.navigateByUrl('/event/add-player');
  }
  //#endregion

  isScoreUpadted(data: any) {
    this._updateScore = false;
    this.isScoreUpdated.emit(true)
  }
  teamMatchCreated(data: any) {
    this._matchDetailsList = []
    this._updateScore = false;
    this.isScoreUpdated.emit(true)
    this.getGroupMatchDetails(this._currentCategoryId);
    //this.getSlotMatchedForScoreUpdate();
  }
  getTeamMatches() {

    // this._skeleton=true;
    if (this._parent_match_id !== '' && this._parent_match_id !== null && this._parent_match_id !== undefined) {
      this.eventsService.getTeamMatches(this._eventId, this._parent_match_id).subscribe({
        next: (result: any) => {


        },
        error: (result: any) => {

        },
        complete: () => {

        },
      });
    }
  }
  getPrintEvent(data: any) { }

  onActiveIndexChange(e: any, format: any) {
    if (e == 0) {
      if (format == "consolation") {
        this._selectedFixtureFormat = 'group playoff + consolation'
      } else {
        this._selectedFixtureFormat = 'Group-PlayOff'
      }
      this.getGroupMatchDetails(this._currentCategoryId)
    }
    else if (e == 1) {
      if (format == "consolation") {
        this._selectedFixtureFormat = 'Consolation Main Draw'
      } else {
        this._selectedFixtureFormat = 'Main Draw'
      }
      this.getGroupMatchDetails(this._currentCategoryId)
    }
    else {
      this._selectedFixtureFormat = 'consolation'
      this.getGroupMatchDetails(this._currentCategoryId)

    }
  }


  subCategorySelection(data: any) {
    //this._categoryName = this._subcategoryList[data.index].category_description
    this._tabIndex = data.index;
    this._subcategoryList[data.index];
    this._currentCategoryId = this._subcategoryList[data.index].category_id;

    //this._selectedFixtureFormat = this._subcategoryList[data.index].format_description
    // this.selectedFixture = this._categoryList[data.index].format_id
    if (this._subcategoryList[data.index].format_description != null) {
      this._showFixtureFormat = true;
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
        2
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
      this._showFixtureFormat = false;
    }
    //Check if Category Matches are finished
    // this.checkCatMatches(this._currentCategoryId);
    this.getGroupMatchDetails(this._currentCategoryId);
  }
  setSubCategoryFormat() {
    if (this._subcategoryList.length > 0) {
      if (this._subcategoryList[0].format_description != null) {
        this._showFixtureFormat = true;
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
        this._showFixtureFormat = false;
      }
    }

  }
  ClosePrint() {
    this._printScore = false;

  }
  search() {
    this._scoreList = this._scoreListCopy.filter((item: any) => {
      return (
        item.players
          .toLowerCase()
          .includes(this._search.toLowerCase())
      );
    });

  }
  eventClicked() {
    this.router.navigateByUrl('/event/create-event');
  }
}
