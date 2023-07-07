import { Component, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { VideosService } from 'src/app/services/Videos/videos.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'stupa-stream-matches',
  templateUrl: './stream-matches.component.html',
  styleUrls: ['./stream-matches.component.scss'],
  providers:[MessageService]
})
export class StreamMatchesComponent {
  idies = [1, 2, 3, 4];
  tables = [1, 2, 3, 4, 5, 6, 7];
  _skeleton:boolean=true
  two=[1,2];
  three=[1,1,1]
  _eventId: any;
  _participantTypesList: any = [];
  _currentCategoryId: any = '';
  _showFixtureFormat: boolean = false;
  _selectedParticipantTypes: any = null;
  _categoryList: any = [];
  _fixtureFormat: any = [];
  _category: any = [];
  _totalPlayer: any;
  _streamedVideos: any = [];
  _showLoader: boolean = false;
  @Input() _tabIndex: any
  _streamedVideosCopy: any = [];
  _searchByPlayerName: any = '';
  _showVideoOnFullScreen: boolean = false;
  _currentAssetId: any;
  _playerAName: any;
  _playerBName: any;
  _participantTypeName: any;
  _categoryName: any;
  azureLoggerConversion: any= new Error();
  _subcategoryList: any=[];
  constructor(private encyptDecryptService: EncyptDecryptService, private router: Router, private azureLoggerService : MyMonitoringService, private messageService: MessageService,
    private eventsService: EventsService, private videosService: VideosService) { }
  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this.getParticipantTypeAndCategories()
  }
  ngOnChanges(changes: SimpleChanges) {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this.getParticipantTypeAndCategories()
  }
  eventClicked() {
    this.router.navigateByUrl('/event/create-event');
  }
  currentParticipant(data: any) {
    this._categoryList = this._participantTypesList.filter((x: any) => x.participant_type_id == data.value.participant_type_id)[0].categories;
    this._subcategoryList = data.value.categories[0].sub_categories
    this._currentCategoryId = data.value.categories[0].sub_categories.length > 0 ? data.value.categories[0].sub_categories.category_id : data.value.categories[0].category_id;
    //this._currentCategoryId = this._categoryList[0].category_id
    this.setFormat();
    this.setSubCategoryFormat();
  }
  getParticipantTypeAndCategories() {
    if (this._eventId != undefined || this._eventId != null) {
      this._showLoader = true;
      this.eventsService.getParticipantTypeAndCategories(this._eventId).subscribe({
        next: (result: any) => {
          this._showLoader = false;
          this._participantTypesList = result.body;
          this._selectedParticipantTypes = this._participantTypesList[0];
          this._participantTypeName = this._participantTypesList[0].participant_description
          this._categoryList = this._participantTypesList[0].categories;
          this._subcategoryList = result.body[0].categories[0].sub_categories;
          this._currentCategoryId = this._categoryList[0].category_id;
          this._categoryName = this._categoryList[0].category_description;
          this.setFormat();
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
  tabSelection(data: any) {
    this._currentCategoryId = this._categoryList[data.index].category_id;
    //this._selectedParticipantTypes = this._participantTypesList[0];
    this._participantTypeName = this._participantTypesList[0].participant_description
    this._subcategoryList = this._categoryList[data.index].sub_categories;
    this._categoryName = this._categoryList[data.index].category_description;
    if (this._subcategoryList.length > 0) {
      this._currentCategoryId = this._subcategoryList[0].category_id;
      this.setSubCategoryFormat();
    }
    else{ 
    if (this._categoryList[data.index].format_description != null) {
      this._showFixtureFormat = true;
      if (this._categoryList[data.index].format_description == 'round robin') {
        this._fixtureFormat = [];
        this._fixtureFormat = [{ name: 'Round-Robin', key: 'RR' }];
      } else if (this._categoryList[data.index].format_description == 'knockout') {
        this._fixtureFormat = [];
        this._fixtureFormat = [{ name: 'Knockout', key: 'K' }];
      } else if (this._categoryList[data.index].format_description == 'group play off') {
        this._fixtureFormat = [];
        this._fixtureFormat = [{ name: 'Group Play-Off', key: 'GPO' }]
      }
      else if (this._categoryList[0]?.format_description == 'special') {
        this._fixtureFormat = [];
        this._fixtureFormat.push({ name: 'Special', key: 'SP' });
      }
      else if (this._categoryList[0]?.format_description == 'group playoff + consolation') {
        this._fixtureFormat = [];
        this._fixtureFormat.push({ name: 'Group Play-Off + Consolation', key: 'gpoc' });
      }
    }
    else {
      this._showFixtureFormat = false;
    }}
    this.getEventLiveMatches();
  }
  setFormat() {
    if (this._categoryList[0].format_description != null) {
      this._showFixtureFormat = true;
      if (this._categoryList[0].format_description == 'round robin') {
        this._fixtureFormat = [];
        this._fixtureFormat.push(
          { name: 'Round-Robin', key: 'RR' },
        )
      } else if (this._categoryList[0].format_description == 'knockout') {
        this._fixtureFormat = [];
        this._fixtureFormat.push(
          { name: 'Knockout', key: 'K' },
        )
      } else if (this._categoryList[0].format_description == 'group play off') {
        this._fixtureFormat = [];
        this._fixtureFormat.push(
          { name: 'Group Play-Off', key: 'GPO' }
        )
      }
      else if (this._categoryList[0].format_description == 'special') {
        this._fixtureFormat = [];
        
        this._fixtureFormat.push({ name: 'Special', key: 'SP' });
      }
      else if (this._categoryList[0].format_description == 'group playoff + consolation') {
        this._fixtureFormat = [];
        
        this._fixtureFormat.push({ name: 'Group Play-Off + Consolation', key: 'GPOC' });
      }
    }
    else {
      this._showFixtureFormat = false;
    }
    this.getEventLiveMatches()
  }
  getEventLiveMatches() {
    this._showLoader = true;
    this.videosService.getEventStreamedMatches(this._eventId, this._currentCategoryId, 'streamed').subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._streamedVideos = [];
        this._streamedVideosCopy = [];
        for (let i = 0; i < result.body.length; i++) {
          if(result.body[i].asset_playback_id!=null){
          const videosDetails = {
            "match_id": result.body[i].match_id,
            "round_description": result.body[i].round_description,
            "playback_id": result.body[i].playback_id,
            "asset_playback_id": result.body[i].asset_playback_id,
            "participants": result.body[i].participants,
            "thumbnail": 'https://image.mux.com/' + result.body[i].asset_playback_id + '/thumbnail.png?width=214&height=121&fit_mode=pad',
            "published": result.body[i].published
          }
          this._streamedVideos.push(videosDetails);
          this._streamedVideosCopy.push(videosDetails);
        }
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
  searchPlayer() {
    this._streamedVideos = this._streamedVideosCopy.filter((item: any) => {
      return (
        item.participants[0]
          .toLowerCase()
          .includes(this._searchByPlayerName.toLowerCase()) ||
        item.participants[1]
          .toLowerCase()
          .includes(this._searchByPlayerName.toLowerCase())
      );
    });
  }
  viewVideo(item: any) {
    this._currentAssetId = item.asset_playback_id;
    this._playerAName = item.participants[0];
    this._playerBName = item.participants[1];
    this._showVideoOnFullScreen = true
  }
  closePopUp() {
    this._showVideoOnFullScreen = false;
  }
  publishStreamedVideos(data:any , flag:any){
      if (this._eventId !== undefined && this._eventId !== null) {
        this.videosService.updateVideosStatus(this._eventId, data.match_id,flag).subscribe({
          next: (result: any) => {
            this.messageService.add({
              key: 'bc',
              severity: 'success',
              summary: 'Success',
              detail: flag===true ? 'Video published successfully' : 'Video unpublished successfully' ,
              life: 3000,
            });
            this.getEventLiveMatches();
          },
          error: (result: any) => { 
            this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
          },
          complete: () => { },
        });
      }
}
subCategorySelection(data: any) {
  this._categoryName = this._subcategoryList[data.index].category_description
  this._tabIndex = data.index;
  this._subcategoryList[data.index];
  this._currentCategoryId = this._subcategoryList[data.index].category_id;

  //this._selectedFixtureFormat = this._subcategoryList[data.index].format_description
  // this.selectedFixture = this._categoryList[data.index].format_id
  if (this._subcategoryList[data.index].format_description != null) {
    this._showFixtureFormat = true;
    if (this._subcategoryList[data.index].format_description == 'round robin') {
      this._fixtureFormat = [];
      
      this._fixtureFormat = [{ name: 'Round-Robin', key: 'RR' }];
    } else if (
      this._subcategoryList[data.index].format_description == 'knockout'
    ) {
      this._fixtureFormat = [];
      
      this._fixtureFormat = [{ name: 'Knockout', key: 'K' }];
    } else if (
      this._subcategoryList[data.index].format_description == 'group play off'
    ) {
      this._fixtureFormat = [];
      this._fixtureFormat = [{ name: 'Group Play-Off', key: 'GPO' }];
    }
    else if (this._subcategoryList[data.index].format_description == 'special') {
      this._fixtureFormat = [];
      this._fixtureFormat.push({ name: 'Special', key: 'SP' });
    }
    else if (this._subcategoryList[data.index].format_description == 'group playoff + consolation') {
      this._fixtureFormat = [];
      
      this._fixtureFormat.push({ name: 'Group Play-Off + Consolation', key: 'GPOC' });
    }
  } else {
    
    this._showFixtureFormat = false;
  }
  //Check if Category Matches are finished
  

}
setSubCategoryFormat() {
  if (this._subcategoryList.length > 0) {
    if (this._subcategoryList[0].format_description != null) {
      this._showFixtureFormat = true;
      if (this._subcategoryList[0].format_description == 'round robin') {
        this._fixtureFormat = [];
        
        this._fixtureFormat.push({ name: 'Round-Robin', key: 'RR' });
      } else if (this._subcategoryList[0].format_description == 'knockout') {
        this._fixtureFormat = [];
        
        this._fixtureFormat.push({ name: 'Knockout', key: 'K' }); //this._categoryList[data.index].format_description == 'group play off'
      } else if (this._subcategoryList[0].format_description == 'group play off') {
        this._fixtureFormat = [];
       
        this._fixtureFormat.push({ name: 'Group Play-Off', key: 'GPO' });
      }
      else if (this._subcategoryList[0].format_description == 'special') {
        this._fixtureFormat = [];
       
        this._fixtureFormat.push({ name: 'Special', key: 'SP' });
      }
      else if (this._subcategoryList[0].format_description == 'group playoff + consolation') {
        this._fixtureFormat = [];
       
        this._fixtureFormat.push({ name: 'Group Play-Off + Consolation', key: 'gpoc' });
      }
    } else {
     
      this._showFixtureFormat = false;
    }
  }
}
}
