import { Component, Input, OnInit } from '@angular/core';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { VideosService } from 'src/app/services/Videos/videos.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { BroadcastOnlyService } from 'src/app/services/broadcastOnly/broadcast-only.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'stupa-broadcast-videos',
  templateUrl: './broadcast-videos.component.html',
  styleUrls: ['./broadcast-videos.component.scss']
})
export class BroadcastVideosComponent {
  //#region Variable Declaration Start
  _skeleton: boolean = false
  id = [1, 1, 1, 1];
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
  _showSection: any;
  _showLoader: boolean = false;
  @Input() _tabIndex: any;
  _streamedVideosCopy: any = [];
  _searchByPlayerName: any = '';
  _showVideoOnFullScreen: boolean = false;
  _currentAssetId: any;
  _playerAName: any;
  _playerBName: any;
  _participantTypeName: any;
  _categoryName: any;
  _currentParticipantId: any;
  _selectedFixtureFormat: any;
  azureLoggerConversion: any = new Error();
  isBroadCastFlag: any;
  _liveMatchesList: any;
  _liveMatchesListCopy: any = [];
  _liveFlag: any;
  _viewMatch: boolean = false;
  _matchDetails: any
  //#endregion Variable Declaration Start

  constructor(
    public encyptDecryptService: EncyptDecryptService,
    private eventsService: EventsService, private broadcastService: BroadcastOnlyService,
    private route: Router, private azureLoggerService: MyMonitoringService,
  ) { }
  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );

    //this.getParticipantTypeAndCategories();
    this.getBroadcastMatchesStreamed();
    this.getBroadcastMatchesLive();

  }
  //#region API call to get list of participant type and categories
  getParticipantTypeAndCategories() {
    this._skeleton = true;

    if (this._eventId !== undefined) {
      this.eventsService
        .getParticipantTypeAndCategories(this._eventId)
        .subscribe({
          next: (result: any) => {
            this._skeleton = false
            this._participantTypesList = result.body;
            this._selectedParticipantTypes = this._participantTypesList[0];
            this._currentParticipantId =
              this._selectedParticipantTypes.participant_type_id;
            this._categoryList = this._participantTypesList[0].categories;
            this._currentCategoryId = this._categoryList[0].category_id;
            this._categoryName = this._categoryList[0].category_description;
            this.setFormat();
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
    this._categoryList = this._participantTypesList.filter(
      (x: any) => x.participant_type_id == data.value.participant_type_id
    )[0].categories;
    this._currentCategoryId = this._categoryList[0].category_id;
    this.setFormat();
  }
  //#endregion function to get fixture format, category associated with that participant type

  //#region function to set fixture format
  setFormat() {
    if (this._categoryList[0].format_description != null) {
      this._showFixtureFormat = true;
      if (this._categoryList[0].format_description == 'round robin') {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'Round-Robin';
        this._fixtureFormat.push({ name: 'Round-Robin', key: 'RR' });
      } else if (this._categoryList[0].format_description == 'knockout') {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'Knockout';
        this._fixtureFormat.push({ name: 'Knockout', key: 'K' });
      } else if (this._categoryList[0].format_description == 'group play off') {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'Group-PlayOff';
        this._fixtureFormat.push({ name: 'Group-PlayOff', key: 'GPO' });
      }
    } else {
      this._showFixtureFormat = false;
    }

  }
  //#endregion function to set fixture format

  //#region function to set fixture format on selection of categories dropdown
  tabSelection(data: any) {
    // this._category[data.index]
    this._categoryList[data.value];
    this._currentCategoryId = data.value.category_id;
    this._categoryName = data.value.category_description;
    if (data.value.format_description != null) {
      this._showFixtureFormat = true;
      if (data.value.format_description == 'round robin') {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'Round-Robin';
        this._fixtureFormat = [{ name: 'Round-Robin', key: 'RR' }];
      } else if (data.value.format_description == 'knockout') {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'Knockout';
        this._fixtureFormat = [{ name: 'Knockout', key: 'K' }];
      } else if (data.value.format_description == 'group play off') {
        this._fixtureFormat = [];
        this._selectedFixtureFormat = 'Group-PlayOff';
        this._fixtureFormat = [{ name: 'Group-PlayOff', key: 'GPO' }];
      }
    } else {
      this._showFixtureFormat = false;
    }

  }
  //#endregion function to set fixture format on selection of categories dropdown

  //#region function to set fixture format on selection of participant type
  setType(data: any) {
    this._currentParticipantId = data.value.participant_type_id;
    this._categoryList = this._participantTypesList.filter(
      (x: any) => x.participant_type_id == data.value.participant_type_id
    )[0].categories;
    this._currentCategoryId = this._categoryList[0].category_id;
    this.setFormat();
  }
  //#endregion function to set fixture format on selection of participant type


  searchPlayer() {
    this._showFixtureFormat = true
    this._streamedVideos = this._streamedVideosCopy.filter((item: any) => {
      return (
        item.participants[0].participant_name
          .toLowerCase()
          .includes(this._searchByPlayerName.toLowerCase()) ||
        item.participants[0].participant_name
          .toLowerCase()
          .includes(this._searchByPlayerName.toLowerCase())
      );
    });
  }
  viewVideo(item: any) {
    this._currentAssetId = item.asset_playback_id;
    this._playerAName = item.participants[0];
    this._playerBName = item.participants[1];
    this._showVideoOnFullScreen = true;
  }
  closePopUp() {
    this._showVideoOnFullScreen = false;
  }

  getBroadcastMatchesStreamed() {
    if (this._eventId != undefined || this._eventId != null) {
      this._showLoader = true;

      this.broadcastService.getBroadCastLiveMatches(this._eventId, false).subscribe({
        next: (result: any) => {
          this._showLoader = false;
          this._streamedVideos = [];
          //this._showSection = result.body.length===0 ? false : true;
          if (result.body.length > 0) {
            this._showSection = true
            for (let i = 0; i < result.body.length; i++) {
              if (result.body[i].asset_playback_id != null || result.body[i].additional_url != null) {
                const videosDetails = {
                  "match_id": result.body[i].match_id,
                  "round_description": result.body[i].fixture_format,
                  "playback_id": result.body[i].playback_id,
                  "asset_playback_id": result.body[i].additional_url == null ? result.body[i].asset_playback_id : undefined,
                  "additional_url": result.body[i].asset_playback_id == null ? result.body[i].additional_url : undefined,
                  "participants": result.body[i].match_details,
                  "thumbnail": 'https://image.mux.com/' + result.body[i].playback_id + '/thumbnail.png?width=214&height=121&fit_mode=pad'
                }
                this._streamedVideos.push(videosDetails);
                this._streamedVideosCopy.push(videosDetails);
              }
            }
          }
          else {
            this._showSection = false
          }

          // this._liveMatchesList = result.body;
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
  getBroadcastMatchesLive() {
    if (this._eventId != undefined || this._eventId != null) {
      this._showLoader = true;
      this.broadcastService.getBroadCastLiveMatches(this._eventId, true).subscribe({
        next: (result: any) => {
          this._showLoader = false;
          this._liveMatchesList = [];

          if (result.body.length > 0) {
            this._liveFlag = true;
            for (let i = 0; i < result.body.length; i++) {
              const videosDetails = {
                "match_id": result.body[i].match_id,
                "round_description": result.body[i].fixture_format,
                "playback_id": result.body[i].playback_id,
                "asset_playback_id": result.body[i].asset_playback_id,
                "participants": result.body[i].match_details,
                "thumbnail": 'https://image.mux.com/' + result.body[i].playback_id + '/thumbnail.png?width=214&height=121&fit_mode=pad'
              }
              this._liveMatchesList.push(videosDetails);
              this._liveMatchesListCopy.push(videosDetails);
            }
          }
          else {
            this._liveFlag = false;
          }
          // this._liveMatchesList = result.body;
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
  getImageURL(item: any) {
    this._matchDetails = item;
    this._viewMatch = true;

  }
}
