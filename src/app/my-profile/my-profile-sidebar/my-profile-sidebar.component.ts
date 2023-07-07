import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { UserProfileService } from 'src/app/services/UserProfile/user-profile.service';
import { PersonalDetailsComponent } from '../personal-details/personal-details.component';

@Component({
  selector: 'stupa-my-profile-sidebar',
  templateUrl: './my-profile-sidebar.component.html',
  styleUrls: ['./my-profile-sidebar.component.scss'],
})
export class MyProfileSidebarComponent {
  _skeleton:boolean=false;
  idies=[1,2];
  id=[1,2,3,4,4,4,];

  _showIndicatiorON: string = 'my-details/personal-info';
  activeTab = ''
  _activeIndex: any = '';
  _router: any;
  _events: any[] = [
    {
      index: 0,
      tabName: 'Personal Details',
      icon: '../../../assets/icons/sidebarIcons/createICON.png',
      org_icon: '../../../assets/icons/svg/ems_sidebar/createEvent.svg',
      icon_selected: '../../../assets/icons/svg/ems_sidebar/createEvent.svg',
      color: 'white',
      path: 'my-details/personal-info',
    },
    {
      index: 1,
      tabName: 'Role Management',
      icon: '../../../assets/icons/svg/ems_sidebar/players.svg',
      org_icon: '../../../assets/icons/svg/ems_sidebar/players.svg',
      icon_selected: '../../../assets/icons/svg/ems_sidebar/players_green.svg',
      color: 'transparent',
      path: 'my-details/role',
    },
    {
      index: 2,
      tabName: 'Membership',
      icon: '../../../assets/icons/svg/ems_sidebar/fixtures.svg',
      org_icon: '../../../assets/icons/svg/ems_sidebar/fixtures.svg',
      icon_selected: '../../../assets/icons/svg/ems_sidebar/fixtures_green.svg',
      color: 'transparent',
      path: 'my-details/membership',
    },
    {
      index: 3,
      tabName: 'My Event',
      icon: '../../../assets/icons/svg/ems_sidebar/results.svg',
      org_icon: '../../../assets/icons/svg/ems_sidebar/results.svg',
      icon_selected: '../../../assets/icons/svg/ems_sidebar/results_green.svg',
      color: 'transparent',
      path: 'my-details/my-event',
    },
    // {
    //   index: 4,
    //   tabName: 'Delete Account',
    //   icon: '../../../assets/icons/svg/ems_sidebar/ranking.svg',
    //   org_icon: '../../../assets/icons/svg/ems_sidebar/ranking.svg',
    //   icon_selected: '../../../assets/icons/svg/ems_sidebar/ranking_green.svg',
    //   color: 'transparent',
    //   path: 'my-details/delete-account',
    // }
  ];
  link: any = [{ url: '../../../assets/icons/profileicons/right-chevron.png' }];
  active: any;
  _userDetails: any;
  _role_id: any;
  innerWidth: any;
  _uploadImage: any;
  _name: any;
  _email:any
  azureLoggerConversion: any = new Error ();

  constructor(private userProfileService: UserProfileService, private router: Router, private azureLoggerService : MyMonitoringService) {
    if (window.location.href.split('/')[5] == undefined) {
      // this._showIndicatiorON = 'account/my-details';
    } else {
      this._showIndicatiorON = window.location.href.split('/')[5] + '/' + window.location.href.split('/')[6];
    }
    this.innerWidth = window.innerWidth;
    this._activeIndex = 'home';
    this._router = router;
  }
  ngOnInit(): void {
    this.getUserProfile();
    this._role_id = localStorage.getItem('rl')
    // this.selectedEvent(this._events.findIndex(x => x.path ==  'account/' + window.location.href.split('/')[5] + '/' + window.location.href.split('/')[6]));
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
  getUserProfile() {
    // alert("asdf")
    this._skeleton=true;
    this.userProfileService.getUserProfile().subscribe({
      next: (result: any) => {
        this._skeleton=false;
        this._userDetails = result.body[0];
        if( result.body[0]!==undefined){
          this._uploadImage = this._userDetails.image
          this._name = this._userDetails.name
          this._email = this._userDetails.email
        }
   
       
      },
      error: (result: any) => {
        this._skeleton=false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException( this.azureLoggerConversion)
      },
      complete: () => {

      },
    })
  }
  activeNav(data: any, name: any) {
    this._activeIndex = name;
  }
  isActiveTab(url: any) {
    
    if (url == window.location.href.split('/')[5] + '/' + window.location.href.split('/')[6]) { return true }
    else {
      return false
    }
  }
}
