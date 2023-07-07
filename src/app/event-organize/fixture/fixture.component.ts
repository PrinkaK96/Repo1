import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'app-fixture',
  templateUrl: './fixture.component.html',
  styleUrls: ['./fixture.component.scss'],
})
export class FixtureComponent implements OnInit {
  //#region Variable
  _showLoader: boolean = false;
  _showarrow: boolean = false;
  _categoryList: any = [];
  _selectedParticipantTypes: any = null;
  _fixtureFormat: any = [];
  _selectedFixtureFormat: any;
  _eventId: any;
  _participantTypesList: any = [];
  _currentCategoryId: any = '';
  _currentParticipantId: any = '';
  _isAPICompleted: boolean = false;
  _tabIndex: any = 0;
  _showFixtureFormat: boolean = false;
  _categoryName: any;
  _matchFinished: boolean = false;
  azureLoggerConversion: any = new Error();
  _subcategoryList: any = [];
  seedPlayer: any = '';
  separation: any;
  playerInGroup: any;
  //#endregion
  constructor(
    public encyptDecryptService: EncyptDecryptService,
    private eventsService: EventsService,
    private router: Router,
    private azureLoggerService: MyMonitoringService
  ) {
  }

  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this.getParticipantTypeAndCategories();
  }


  //#region This method is basically used for Get current selected Tab
  tabSelection(data: any) {
    this._categoryList[data.index];
    this._currentCategoryId = this._categoryList[data.index].category_id;
    this._categoryName = this._categoryList[data.index].category_description;
    this._subcategoryList = this._categoryList[data.index].sub_categories;
    if (this._categoryList[data.index].fixture_details !== undefined && this._categoryList[data.index].fixture_details !== null) {
      this.seedPlayer = this._categoryList[data.index].fixture_details.seed;
      this.playerInGroup = this._categoryList[data.index].fixture_details.min_no_participant;
      this.separation = this._categoryList[data.index].fixture_details.club_seperation;
    } else {
      this.seedPlayer = '';
      this.playerInGroup = '';
      this.separation = '';
    }
    if (this._subcategoryList.length > 0) {
      this._currentCategoryId = this._subcategoryList[0].category_id;
      if (this._subcategoryList[0].fixture_details !== null && this._subcategoryList[0].fixture_details !== null) {
        this.seedPlayer = this._subcategoryList[0].fixture_details.seed;
        this.playerInGroup = this._subcategoryList[0].fixture_details.min_no_participant;
        this.separation = this._subcategoryList[0].fixture_details.club_seperation;
      } else {
        this.seedPlayer = '';
        this.playerInGroup = '';
        this.separation = '';
      }
      this.setSubCategoryFormat();
    }
    else {
      this._tabIndex = data.index;
      localStorage.setItem('tabIndex', data.index);
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
      //Check if Category Matches are finished
      this.checkCatMatches(this._currentCategoryId);
    }
  }
  //#endregion
  //#region This method is used for Get Categories List along with Participant Type
  getParticipantTypeAndCategories() {
    if (this._eventId != undefined || this._eventId != null) {
      this.eventsService
        .getParticipantTypeAndCategories(this._eventId)
        .subscribe({
          next: (result: any) => {
            this._participantTypesList = result.body;
            this._selectedParticipantTypes = this._participantTypesList[0];
            this._currentParticipantId =
              this._selectedParticipantTypes.participant_type_id;
            this._categoryList = this._participantTypesList[0].categories;
            this._subcategoryList = result.body[0].categories[0].sub_categories;
            this._currentCategoryId = result.body[0].categories[0].sub_categories.length > 0 ? result.body[0].categories[0].sub_categories.category_id : result.body[0].categories[0].category_id;
            localStorage.setItem('team_Matches', result.body[0].categories[0].sub_categories.length > 0 ? result.body[0].categories[0].sub_categories[0].team_matches : result.body[0].categories[0].team_matches)
            this._categoryList[0].category_id;
            this._categoryName = this._categoryList[0].category_description;
            this._isAPICompleted = true;
            if (this._categoryList.length > 7) {
              this._showarrow = true;
            }
            this.checkCatMatches(this._currentCategoryId);
            this.setFormat();
            this.setSubCategoryFormat();
            if (this._participantTypesList[0].categories[0].fixture_details != null) {
              this.seedPlayer = this._participantTypesList[0].categories[0].fixture_details.seed;
              this.playerInGroup = this._participantTypesList[0].categories[0].fixture_details.min_no_participant;
              this.separation = this._participantTypesList[0].categories[0].fixture_details.club_seperation;
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
  //#region This Method is basically used for get to know which participant is currently selected
  currentParticipant(data: any) {
    if (data.index == undefined) {
      data.index = 0;
    }
    this._currentParticipantId = data.value.participant_type_id;
    this._categoryList = this._participantTypesList.filter(
      (x: any) => x.participant_type_id == data.value.participant_type_id
    )[0].categories;
    if (this._categoryList[0].fixture_details !== undefined && this._categoryList[0].fixture_details !== null) {
      this.seedPlayer = this._categoryList[0].fixture_details.seed;
      this.playerInGroup = this._categoryList[0].fixture_details.min_no_participant;
      this.separation = this._categoryList[0].fixture_details.club_seperation;
    } else {
      this.seedPlayer = '';
      this.playerInGroup = '';
      this.separation = '';
    }
    this._subcategoryList = data.value.categories[0].sub_categories
    this._currentCategoryId = data.value.categories[0].sub_categories.length > 0 ? data.value.categories[0].sub_categories.category_id : data.value.categories[0].category_id;
    if (this._subcategoryList.length > 0) {
      if (this._subcategoryList[data.index].fixture_details != null) {
        this.seedPlayer = this._subcategoryList[data.index].fixture_details.seed == null ? '' : this._subcategoryList[data.index].fixture_details.seed;
        this.playerInGroup = this._subcategoryList[data.index].fixture_details.min_no_participant == null ? '' : this._subcategoryList[data.index].fixture_details.min_no_participant;
        this.separation = this._subcategoryList[data.index].fixture_details.club_seperation == null ? '' : this._subcategoryList[data.index].fixture_details.club_seperation;

      }
    } else {
      this.seedPlayer = '';
      this.playerInGroup = '';
      this.separation = '';
    }
    this.setFormat();
    this.setSubCategoryFormat();
  }
  //#endregion
  //#region This method is used for Navigation
  eventClicked() {
    this.router.navigateByUrl('/event/create-event');
  }
  //#endregion
  //#region This method is just for set current format Type
  setFormat() {
    if (this._categoryList[0]?.format_description != null) {
      this._showFixtureFormat = true;
      if (this._categoryList[0]?.format_description == 'round robin') {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'Round-Robin';
        this._fixtureFormat.push({ name: 'Round-Robin', key: 'RR' });
      } else if (this._categoryList[0]?.format_description == 'knockout') {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'Knockout';
        this._fixtureFormat.push({ name: 'Knockout', key: 'K' });
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
      this._showFixtureFormat = false;
    }
  }
  //#endregion
  //#region This method is used for Navigation
  goAtPlayerTab() {
    this.router.navigateByUrl('/event/add-player');
  }
  //#endregion
  //#region This method is used for get Categories Matches
  checkCatMatches(categoryId: any) {
    this.eventsService
      .checkCatMatchFinished(this._eventId, categoryId)
      .subscribe({
        next: (result: any) => {
          if (result.body) {
            this._matchFinished = true;
          } else {
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
  //#endregion
  subCategorySelection(data: any) {
    this._categoryName = this._subcategoryList[data.index].category_description
    this._tabIndex = data.index;
    this._subcategoryList[data.index];
    this._currentCategoryId = this._subcategoryList[data.index].category_id;
    if (this._subcategoryList[data.index].fixture_details !== undefined && this._subcategoryList[data.index].fixture_details !== null) {
      this.seedPlayer = this._subcategoryList[data.index].fixture_details.seed;
      this.playerInGroup = this._subcategoryList[data.index].fixture_details.min_no_participant;
      this.separation = this._subcategoryList[data.index].fixture_details.club_seperation;
    } else {
      this.seedPlayer = '';
      this.playerInGroup = '';
      this.separation = '';
    }
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
    this.checkCatMatches(this._currentCategoryId);
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
          this._fixtureFormat.push({ name: 'Knockout', key: 'K' });
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
}
