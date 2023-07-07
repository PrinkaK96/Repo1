import {
  Component,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
import { AllotRankPointersComponent } from './allot-rank-pointers/allot-rank-pointers.component';
import { DayPlannerComponent } from './day-planner/day-planner.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { RuleSettingComponent } from './rule-setting/rule-setting.component';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
  providers: [ConfirmationDialogService]
})
export class CreateEventComponent implements OnInit {
  _window: any;
  innerWidth: any;
  @ViewChild(EventDetailsComponent, { static: false }) childRef!: EventDetailsComponent;
  @ViewChild(AllotRankPointersComponent, { static: false }) allotChildRef!: AllotRankPointersComponent;
  @ViewChild(RegistrationFormComponent, { static: false }) regFormChildRef!: RegistrationFormComponent;
  @ViewChild(RuleSettingComponent, { static: false }) rulesSettingChildRef!: RuleSettingComponent;
  @ViewChild(DayPlannerComponent, { static: false }) dayPlannerChildRef!: DayPlannerComponent;
  _prevIndex: any;
  unsavedChanges: boolean = false;
  activeIndex: any;
  event: any;
  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this._window = window.pageYOffset;
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  _tabIndex: any = 0;
  @Input() tabIndex: any;
  tabToIndex: any
  constructor(private confirmationDialogService: ConfirmationDialogService, private router: Router,private encyptDecryptService: EncyptDecryptService) {
    this.getTabIndexx(0)

    if (localStorage.getItem('isOpenDayPlanner') == 'true') {
      localStorage.removeItem('isOpenDayPlanner')
      this._tabIndex = 6;
    } else {
      this._tabIndex = localStorage.getItem('_tabIndex')
    }
    this._window = window.pageYOffset;
    this.innerWidth = window.innerWidth;
  }

  ngOnInit(): void { 
    this.event = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
  }
  goback() { }
  srollTop() {

    window.scrollTo(0, 0);
    window.pageXOffset + window.pageYOffset;
  }
  getTabIndex(tabIndex: any) {
    this._tabIndex = tabIndex;
  }
  getTabIndexx(tabIndex: any) {
    //this.childRef._eventDetailForm.dirty
    this._tabIndex = tabIndex.index;
    this._prevIndex = tabIndex.index
    this._prevIndex = this.activeIndex;
    this.activeIndex = tabIndex.index
    localStorage.setItem('_tabIndex', tabIndex.index)


    if (this._prevIndex === 0 && this.childRef._eventDetailForm.dirty == true && this.event!=null) {
      // this.showPopUp(tabIndex)
    }

    else if (this._prevIndex === 6 && this.dayPlannerChildRef._dayPlannerForm.dirty == true) {
      // this.showPopUp(tabIndex)
    }

    // else{
    //   this.showPopUp(tabIndex)
    // }


    // if((this._tabIndex===0 && this.childRef._eventDetailForm.dirty==true) || (this._tabIndex===7 && this.dayPlannerChildRef._dayPlannerForm.dirty==true)
    //   || (this._tabIndex===4 && this.regFormChildRef._regForm.dirty==true) || (this._tabIndex===5 && this.rulesSettingChildRef._ruleSettingForm.dirty==true) || (this._tabIndex=== 2 && this.allotChildRef._rankPointerForm.dirty==true)
    //   ){
    //   this.showPopUp(tabIndex)
    // }

  }

  eventClicked() {
    this._tabIndex = 0;
  }
  showPopUp(tabIndex: any) {
    this.confirmationDialogService
      .confirm(
        'Please Confirm',
        'You have unsaved changes, are you sure you want to leave this page?'
      )
      .then((confirmed) => {
        if (confirmed) {
          this._tabIndex = tabIndex.index;
          this.childRef._eventDetailForm.markAsPristine()
          this.dayPlannerChildRef._dayPlannerForm.markAsPristine()
          this.regFormChildRef._openPopup = false
          this.rulesSettingChildRef._ruleSettingForm.markAsPristine()
          this.allotChildRef._rankPointerForm.markAsPristine()
        } else {
          this._tabIndex = this._prevIndex;
          // this.regFormChildRef._display= this.regFormChildRef._priceChange;
        }
      })
      .catch(() => { });
  }
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {

    if (this._tabIndex == 0 && this.childRef._eventDetailForm.dirty == true && this.event!=undefined) {
      this.navigationToSidebar()
    }

    else if (this._tabIndex ==  6 && this.dayPlannerChildRef._dayPlannerForm.dirty == true) {
      this.navigationToSidebar()
    }
    return true;
  }

  navigationToSidebar() {
    this.confirmationDialogService
      .confirm(
        'Please confirm..',
        'You have unsaved changes, are you sure you want to leave this page?'
      )
      .then((confirmed) => {
        if (confirmed) {
          this.childRef._eventDetailForm.markAsPristine()
          this.dayPlannerChildRef._dayPlannerForm.markAsPristine()
          // this.regFormChildRef._regForm.markAsPristine()
          // this.rulesSettingChildRef._ruleSettingForm.markAsPristine()
          // this.allotChildRef._rankPointerForm.markAsPristine()
        } else {
          this.router.navigate(['/event/create-event']);
        }
      })
      .catch(() => { });
  }
}
