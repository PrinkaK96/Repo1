import { Component, EventEmitter, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { PrimeIcons } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
@Component({
  selector: 'app-event-org-sidebar',
  templateUrl: './event-org-sidebar.component.html',
  styleUrls: ['./event-org-sidebar.component.scss'],
})
export class EventOrgSidebarComponent implements OnInit {
  @Output() isFirstScreen = new EventEmitter<any>();
  _showIndicatiorON: string = 'event/create-event';
  _events: any[] = [
    {
      index: 0,
      status: 'Create Event',
      //status: this.translate.getTranslation('tms.createEvent'),
      icon: '../../../assets/icons/sidebarIcons/createICON.png',
      // icon: '../../../assets/icons/svg/ems_sidebar/createEvent.svg',
      org_icon: '../../../assets/icons/svg/ems_sidebar/createEvent.svg',
      icon_selected: '../../../assets/icons/svg/ems_sidebar/createEvent.svg',
      color: 'white',
      path: 'event/create-event',
      isScheduler: false,
    },
    {
      index: 1,
      status: 'Players',
      icon: '../../../assets/icons/svg/ems_sidebar/players.svg',
      org_icon: '../../../assets/icons/svg/ems_sidebar/players.svg',
      icon_selected: '../../../assets/icons/svg/ems_sidebar/players_green.svg',
      color: 'transparent',
      path: 'event/add-player',
      isScheduler: false,
    },
    {
      index: 2,
      status: 'Fixtures',
      icon: '../../../assets/icons/svg/ems_sidebar/fixtures.svg',
      org_icon: '../../../assets/icons/svg/ems_sidebar/fixtures.svg',
      icon_selected: '../../../assets/icons/svg/ems_sidebar/fixtures_green.svg',
      color: 'transparent',
      path: 'event/fixture',
      isScheduler: true,
    },
    {
      index: 3,
      status: 'Schedule',
      icon: '../../../assets/icons/svg/ems_sidebar/fixtures.svg',
      org_icon: '../../../assets/icons/svg/ems_sidebar/fixtures.svg',
      icon_selected: '../../../assets/icons/svg/ems_sidebar/fixtures_green.svg',
      color: 'transparent',
      path: 'event/schedule',
      isScheduler: false,
    },
    {
      index: 4,
      status: 'Update Score',
      icon: '../../../assets/icons/svg/ems_sidebar/fixtures.svg',
      org_icon: '../../../assets/icons/svg/ems_sidebar/fixtures.svg',
      icon_selected: '../../../assets/icons/svg/ems_sidebar/fixtures_green.svg',
      color: 'transparent',
      path: 'event/update-score',
      isScheduler: false,
    },
    {
      index: 5,
      status: 'Results',
      icon: '../../../assets/icons/svg/ems_sidebar/results.svg',
      org_icon: '../../../assets/icons/svg/ems_sidebar/results.svg',
      icon_selected: '../../../assets/icons/svg/ems_sidebar/results_green.svg',
      color: 'transparent',
      path: 'event/results',
      isScheduler: false,
    },
    {
      index: 6,
      status: 'Rankings',
      icon: '../../../assets/icons/svg/ems_sidebar/ranking.svg',
      org_icon: '../../../assets/icons/svg/ems_sidebar/ranking.svg',
      icon_selected: '../../../assets/icons/svg/ems_sidebar/ranking_green.svg',
      color: 'transparent',
      path: 'event/ranking',
      isScheduler: false,
    },
    {
      index: 7,
      status: 'Videos',
      icon: '../../../assets/icons/svg/ems_sidebar/video.svg',
      org_icon: '../../../assets/icons/svg/ems_sidebar/video.svg',
      icon_selected: '../../../assets/icons/svg/ems_sidebar/video_green.svg',
      color: 'transparent',
      path: 'event/videos',
      isScheduler: false,
    },



  ];
  event_id: any;
  constructor(private translate: TranslateService, private router: Router, private encyptDecryptService: EncyptDecryptService) {
    this.router.events.subscribe((event: any) => {
      if (event.url !== undefined) {
        this.selectedEvent(this._events.findIndex(x => x.path == event.url.split('/')[1] + '/' + event.url.split('/')[2]

        ));
        this._showIndicatiorON = event.url.split('/')[1] + '/' + event.url.split('/')[2];
      }

      if (event instanceof NavigationStart) {
        // Show loading indicator
      }

      if (event instanceof NavigationEnd) {
        // Hide loading indicator
      }

      if (event instanceof NavigationError) {
        // Hide loading indicator
        // Present error to user
      }
    });
    if (window.location.href.split('/')[5] == undefined) {
      this._showIndicatiorON = 'event/create-event';
    } else {
      this._showIndicatiorON = 'event/' + window.location.href.split('/')[5];
    }
    // this.selectedEvent(this._events[0]);
  }
  ngOnInit(): void {
    this.selectedEvent(this._events.findIndex(x => x.path == 'event/' + window.location.href.split('/')[5]));
    this.event_id = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
  }
  selectedEvent(item: any) {

    for (let i = 0; i < this._events.length; i++) {
      if (item.index == undefined) {
        if (this._events[i].index <= item) {
          this._events[i].color = 'white';
          this._events[i].icon = this._events[i].icon_selected;
        } else {
          this._events[i].color = 'transparent';
          this._events[i].icon = this._events[i].org_icon;
        }
      } else {
        if (this._events[i].index <= item.index) {
          this._events[i].color = 'white';
          this._events[i].icon = this._events[i].icon_selected;
        } else {
          this._events[i].color = 'transparent';
          this._events[i].icon = this._events[i].org_icon;
        }
        this._showIndicatiorON = item.path;
      }
    }
  }
  goBackAtFirstScreen() {
    this.isFirstScreen.emit(true);
  }

  navigateToOrganize() {
    if (localStorage.getItem('navigationFrom') == 'ongoing') {
      this.router.navigate(['/home/all-ongoing-events', 'organize']);
    }
    else if (localStorage.getItem('navigationFrom') == 'recent') {
      this.router.navigate(['/home/all-recent', 'organize']);
    }
    else if (localStorage.getItem('navigationFrom') == 'upcoming') {
      this.router.navigate(['/home/all-upcoming-events', 'organize']);
    }
    else if (localStorage.getItem('navigationFrom') == 'registration') {
      this.router.navigate(['/home/all-registrations', 'organize']);
    }
    else {
      this.router.navigate(['/home/organize']);
    }
  }
  logOut() {
    localStorage.removeItem('reqToken');
    localStorage.clear();
    this.router.navigate(['/home/']);
  }
  innerwidth: any;
  openSchedule(url: any) {
    this.router.navigate([url])
  }
}
