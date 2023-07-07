import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { ProfileLettersService } from 'src/app/services/ProfileLetters/profile-letters.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'app-rankings',
  templateUrl: './rankings.component.html',
  styleUrls: ['./rankings.component.scss'],
  providers: [MessageService],
})

export class RankingsComponent implements OnInit {
  //#region Variable Declaration Start
  _skeleton: boolean = true;
  idies = [1, 2, 3, 4];
  tables = [1, 2, 3, 4, 5, 6, 7];
  event_id: any;
  _playerrank: any = [];
  _participantTypes: any[] = [
    { name: 'Single', key: 'S' },
    { name: 'Teams', key: 'T' },
    { name: 'Doubles', key: 'D' },
    { name: 'Mixed Doubles', key: 'MD' },
  ];
  _tabIndex: any;
  _showLoader: boolean = false;
  azureLoggerConversion: any = new Error();
  _totalPlayers: any = [];
  _currenAcceptedPage: number = 1;
  search: any = '';
  first = 0;
  gender_id: any;
  //#endregion Variable Declaration Start

  constructor(
    private encyptDecryptService: EncyptDecryptService,
    private router: Router,
    private eventsService: EventsService,
    private azureLoggerService: MyMonitoringService,
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
    this._showLoader = true;
    this.eventsService.getRanking(this.event_id, this.gender_id, this._currenAcceptedPage, '').subscribe({
      next: (result: any) => {
        this._skeleton = false;
        this._totalPlayers = result.body[0]
        this._playerrank = result.body[1]

      },
      error: (result: any) => {
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    });
  }

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
    data.index == 0 ? this.gender_id = 1 : this.gender_id = 2;
    this._currenAcceptedPage = 1;
    this.first = 1;
    this.getRanking();
  }
}
