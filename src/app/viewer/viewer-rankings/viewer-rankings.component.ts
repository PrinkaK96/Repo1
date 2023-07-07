import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { ProfileLettersService } from 'src/app/services/ProfileLetters/profile-letters.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'stupa-viewer-rankings',
  templateUrl: './viewer-rankings.component.html',
  styleUrls: ['./viewer-rankings.component.scss'],
  providers: [MessageService]
})
export class ViewerRankingsComponent implements OnInit {
  //#region Variable Declaration Start
  _skeleton: boolean = true;
  idies = [1, 2, 3, 4];
  tables = [1, 2, 3, 4, 5, 6, 7];
  _showarrow: boolean = false;
  event_id: any;
  _participantType: any;
  _playerrank: any = [];
  _playerrankCopy: any = [];
  _activeIndex = 0;
  _category: any = [];
  _participantTypes: any[] = [
    { name: 'Single', key: 'S' },
    { name: 'Teams', key: 'T' },
    { name: 'Doubles', key: 'D' },
    { name: 'Mixed Doubles', key: 'MD' },
  ];
  _selectedParticipantTypes: any = null;
  _fixtureFormat: any = [
  ];
  _selectedFixtureFormat: any = null;
  _categoryList: any = [];
  _participantTypesList: any = [];
  _currentCategoryId: any = '';
  _currentParticipantId: any = '';
  _isAPICompleted: boolean = false;
  _tabIndex: any;
  _showLoader: boolean = false;
  _searchByPlayerName: any = '';
  _placeholderSearch: any = 'Single';
  azureLoggerConversion: any = new Error();
  _totalPlayers: any = [];
  _currenAcceptedPage: number = 1;
  search: any = '';
  first = 0;
  gender_id: any;
  overlayVisible: boolean = false;
  currentSelectedData: any;
  _ratingHistory: any;
  //#endregion Variable Declaration Start

  constructor(private encyptDecryptService: EncyptDecryptService,
    private router: Router,
    private messageService: MessageService,
    private eventsService: EventsService, private azureLoggerService: MyMonitoringService,
    private profileLettersService: ProfileLettersService) {
  }

  ngOnInit(): void {
    this.event_id = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this.gender_id = 1;
    this.getRanking();
  }

  //#region method to navigate to create-event screen if no event has been created initially
  eventClicked() {
    this.router.navigateByUrl('/event/create-event');
  }
  //#endregion method to navigate to create-event screen if no event has been created initially

  //#region API call to get players rank acccording too its category
  getRanking() {
    //this._skeleton=false;
    // this._showLoader = true;
    this._showLoader = true;
    this.eventsService.getRanking(this.event_id, this.gender_id, this._currenAcceptedPage, '').subscribe({
      next: (result: any) => {
        this._skeleton = false;
        this._totalPlayers = result.body[0]
        this._playerrank = result.body[1]

      },
      error: (result: any) => {
        // this._showLoader = false;
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    });
  }
  //#endregion API call to get players rank acccording too its category
  //#region API call to search player in the list
  searchPlayer() {
    this._playerrank = this._playerrankCopy.filter((item: any) => {
      return (
        item.name
          .toLowerCase()
          .includes(this._searchByPlayerName.toLowerCase())

      );
    });
  }
  //#endregion API call to search player in the list
  //#region function to fetch first initials of the name
  profileLetterService(data: any) {
    return this.profileLettersService.getFirstLetters(data);
  }

  paginate(event: any) {
    this.first = event.first;
    this._currenAcceptedPage = event.page + 1;
    if (this.search != '') {
      this.searchPlayers()
    }
    else {
      this.getRanking()
    }


  }
  searchPlayers() {
    this.eventsService.getRanking(this.event_id, this.gender_id, this._currenAcceptedPage, this.search).subscribe({
      next: (data: any) => {
        this._totalPlayers = data.body[0];
        this._playerrank = data.body[1];

      },
      error: (error: any) => {
      },
      complete: () => { },
    })
  }
  currentTab(data: any) {
    this.search = ''
    this._tabIndex = data.index;
    if (data.index == 0) {
      this._currenAcceptedPage = 1;
      this.first = 1
      this.gender_id = 1;
      this.getRanking();
    }
    else {
      this._currenAcceptedPage = 1;
      this.first = 1
      this.gender_id = 2;
      this.getRanking();
    }
  }



  showRanks(value: any, item: any) {
    this._ratingHistory = [];
    if (item == '') {
      this.overlayVisible = false
    }
    this.currentSelectedData = item
    if (this.currentSelectedData.user_id !== undefined && this.currentSelectedData.user_id !== '' && this.currentSelectedData.user_id !== null) {
      this.eventsService.ratingHistory(this.currentSelectedData.user_id, true).subscribe(
        {
          next: (res) => {
            this._ratingHistory = res.body[0]?.rating_history_details;
            this.overlayVisible = value
          },
          error: () => {
            this.overlayVisible = false;
          },
          complete: () => { },
        }
      )
    } else {
      this.overlayVisible = false;
    }

  }
}
