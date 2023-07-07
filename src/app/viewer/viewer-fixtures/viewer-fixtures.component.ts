import { Component, OnChanges, OnInit } from '@angular/core';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';

@Component({
  selector: 'stupa-viewer-fixtures',
  templateUrl: './viewer-fixtures.component.html',
  styleUrls: ['./viewer-fixtures.component.scss'],
})
export class ViewerFixturesComponent implements OnInit {
 //#region Variable Declaration Start
  _eventId: any;
  _participantTypesList: any = []
  _selectedParticipantTypes: any
  _currentParticipantId: any
  _categoryList: any = []
  _currentCategoryId: any
  _categoryName: any
  _showFixtureFormat: boolean = false
  _selectedFixtureFormat: any = []
  _fixtureFormat: any = []
  _category: any = [];
  _totalPlayer: any;
  _tabIndex: any;
  _isAPICompleted: boolean = false
  _set: any
  azureLoggerConversion: any= new Error();
  _categoriesArray: any=[];
  _newList: any=[];
  _newList2: any=[];
  //#endregion Variable Declaration Start

  constructor(public encyptDecryptService: EncyptDecryptService, private eventsService: EventsService,private azureLoggerService: MyMonitoringService,) { }
  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getParticipantTypeAndCategories();
  }
  ngOnChanges() {
    this.getParticipantTypeAndCategories()
  }

  //#region API call to get list of participant type and categories
  getParticipantTypeAndCategories() {
    if (this._eventId !== undefined) {
      this.eventsService.getParticipantTypeAndCategories(this._eventId).subscribe({
        next: (result: any) => {
          this._participantTypesList = result.body;
          this._selectedParticipantTypes = this._participantTypesList[0];
          this._currentParticipantId = this._selectedParticipantTypes.participant_type_id;
          // this._categoryList = this._participantTypesList[0].categories;
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
      this._selectedFixtureFormat ='';
    }
  }
  //#endregion function to set fixture format

  //#region function to set fixture format on selection of categories dropdown
  tabSelection(data: any) {
    // this._category[data.index]
    this._categoryList[data.value];
    this._selectedFixtureFormat = []
    //this._showFixtureFormat = false;
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
      } else if (data.value.format_description == 'special') {
        this._fixtureFormat = [];
          this._selectedFixtureFormat = 'special';
          this._fixtureFormat.push({ name: 'Special', key: 'SP' });
      }
      else if (data.value.format_description == 'group playoff + consolation') {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'group playoff + consolation';
        this._fixtureFormat.push({ name: 'Group Play-Off + Consolation', key: 'GPOC' });
      }
      else if (data.value.format_description == 'group play off') {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'Group-PlayOff';
        this._fixtureFormat.push({ name: 'Group-PlayOff', key: 'GPO' });
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
    // this._categoryList = this._participantTypesList.filter((x: any) => x.participant_type_id == data.value.participant_type_id)[0].categories;
    this._categoriesArray = this._participantTypesList.filter((x: any) => x.participant_type_id == data.value.participant_type_id)[0].categories;
    this._newList = this._categoriesArray.filter((x:any)=> x.sub_categories.length==0)
    this._newList2 = this._categoriesArray.map((s:any)=>s.sub_categories).flat()
    this._categoryList = [...this._newList, ...this._newList2]
    this._currentCategoryId = this._categoryList[0].category_id
    this.setFormat();

  }
  //#endregion function to set fixture format on selection of participant type
 
}
