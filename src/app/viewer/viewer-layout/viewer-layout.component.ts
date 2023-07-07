import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from '../.././services/WebEventService/events.service'
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
@Component({
  selector: 'stupa-viewer-layout',
  templateUrl: './viewer-layout.component.html',
  styleUrls: ['./viewer-layout.component.scss']
})
// getTeamParticipantsDetails
export class ViewerLayoutComponent implements OnInit {
  //#region Here we are declaring Variables
  _skeleton: boolean = true
  idies = [1, 2, 3, 1, 2];
  id = [1, 1, 1, 1];
  _tabList: any = [
    // {
    //   header: 'Player List',
    //   path: 'viewer/$/player-list',
    // },
    {
      header: 'Event Details',
      path: 'viewer/$/Event-Details'
    },

    {
      header: 'Registration',
      path: 'viewer/$/registration'
    },
    {
      header: 'Player List',
      path: 'viewer/$/Player-list'
    },
    {
      header: 'Fixtures',
      path: 'viewer/$/fixture',
    },
    {
      header: 'Results',
      path: 'viewer/$/results'
    },
    {
      header: 'Rankings',
      path: 'viewer/$/ranking'
    },
    {
      header: 'Videos',
      path: 'viewer/$/videos'
    },
    {
      header: 'Prospectus',
      path: 'viewer/$/prospectus'
    },


  ]
  _tabIndex: any = 0;
  _eventDetails: any = [];
  _role_id: any;
  _homeFlag: any = [];
  _event_id: any;
  @Input() _currentCategoryId: any;
  _eventId: any;
  _showLoader: boolean = false
  azureLoggerConversion: any = new Error();
  _isbroadcast: boolean = false;
  //#endregion Here we are declaring Variables
  constructor(private route: Router, private router: ActivatedRoute, private events: EventsService, private encyptDecryptService: EncyptDecryptService, private azureLoggerService: MyMonitoringService,) {
    this._isbroadcast = localStorage.getItem('isBroadcast') == 'true' ? true : false
  }
  ngOnInit(): void {

    localStorage.removeItem('eventDetailsForViewer')
    //this._eventInfo = localStorage.getItem('eventDetailsForViewer');
    // this._eventDetails.push(JSON.parse(this._eventInfo));
    this._eventId = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this.getDetailsByEventID()
    this._role_id = localStorage.getItem('rl');
    if (this._isbroadcast) {
      if (window.location.href.split('#')[1] == '/viewer/$/registration') {
        this._tabIndex = 1;
      } else if (window.location.href.split('#')[1] == '/viewer/$/videos') {
        this._tabIndex = 0;
      }
    } else {
      this.currentTabIndex();
    }

  }


  //#region function to getTabIndex and navigate to different tabs on based of that
  getTabIndex(tabIndex: any) {
    this._skeleton = false;
    this._tabIndex = tabIndex.index;
    this.route.navigate([this._tabList[tabIndex.index].path])
    // this._skeleton= false

  }
  //#endregion function to getTabIndex and navigate to different tabs on based of that


  //#region conditional check for back-button because we are using same viewer module in my account for player
  back() {
    this._homeFlag = localStorage.getItem('_homeFlag')
    if (this._homeFlag == 'account') {
      this.route.navigate(['/account/my-details/my-event']);
    } else if (this._homeFlag == 'home') {
      this.route.navigate(['/home']);
    } else {
      if (localStorage.getItem('navigationFrom') == 'ongoing') {
        this.route.navigate(['/home/all-ongoing-events/home']);
      }
      else if (localStorage.getItem('navigationFrom') == 'upcoming') {
        this.route.navigate(['/home/all-upcoming-events/home']);
      }
      else if (localStorage.getItem('navigationFrom') == 'registration') {
        this.route.navigate(['/home/all-registrations/home']);
      }
      else {
        this.route.navigate(['/home/all-recent/home']);
      }
    }

  }
  //#endregion conditional check for back-button because we are using same viewer module in my account for player


  getDetailsByEventID() {

    // this._showLoader = true
    this._skeleton = true;
    this.events.getDetailsByEventId(this._eventId).subscribe({
      next: (data: any) => {
        // this._showLoader = false
        this._skeleton = false
        this._eventDetails = data.body.filter((x: any) => x.event_id == this._eventId)[0];

      },
      error: (data: any) => {
        // this._showLoader = false
        this._skeleton = false
        this.azureLoggerConversion = data.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => {

      },
    })
  }
  currentTabIndex() {
    if (window.location.href.split('#')[1] == '/viewer/$/fixture') {
      this._tabIndex = 3;
    } else if (window.location.href.split('#')[1] == '/viewer/$/results') {
      this._tabIndex = 4;
    } else if (window.location.href.split('#')[1] == '/viewer/$/ranking') {
      this._tabIndex = 5;
    } else if (window.location.href.split('#')[1] == '/viewer/$/videos') {
      this._tabIndex = 6;
    } else if (window.location.href.split('#')[1] == '/viewer/$/prospectus') {
      this._tabIndex = 7;
    } else if ((window.location.href.split('#')[1] == '/viewer/$/registration')) {
      this._tabIndex = 1;
    } else if ((window.location.href.split('#')[1] == '/viewer/$/Player-list')) {
      this._tabIndex = 2;
    } else if ((window.location.href.split('#')[1] == '/viewer/$/Player-list')) {
      this._tabIndex = 0;
    }
  }
  ngOnDestroy() {
    localStorage.removeItem('isBroadcast')
    // Can be left empty if no other teardown is required
  }
}
