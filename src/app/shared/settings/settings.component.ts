import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { FixtureServiceService } from 'src/app/services/fixtures/fixture-service.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'stupa-settings',
  standalone: true,
  imports: [CommonModule, RadioButtonModule, FormsModule, ReactiveFormsModule, DropdownModule, ToastModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  providers: [MessageService]
})
export class SettingsComponent {
  @Input() currentParticipantId: any;
  @Input() _fixtureFormat: any;
  @Input() selectedCategoryId: any;
  _eventId: any;
  _grpListRounds: any = [];
  _index: any;
  _roundInfo: any = [];
  _ruleSetInfo: any = [];
  data: any
  _groupRule: any;
  _consolationKo: any = [];
  constructor(
    private encyptDecryptService: EncyptDecryptService,
    private azureLoggerService: MyMonitoringService,
    public router: Router,
    private messageService: MessageService,
    private fixtureService: FixtureServiceService,
  ) {

  }
  _standardSetList: any = [
    { set: 1, id: 1, isActive: false },
    { set: 3, id: 2, isActive: false },
    { set: 5, id: 3, isActive: true },
    { set: 7, id: 4, isActive: false },
    { set: 9, id: 5, isActive: false },
  ]
  _specialSetList: any = [
    { set: 1, id: 1, isActive: false },
    { set: 2, id: 2, isActive: false },
    { set: 3, id: 3, isActive: false },
    { set: 4, id: 4, isActive: false },
    { set: 5, id: 5, isActive: true },
    { set: 6, id: 6, isActive: false },
    { set: 7, id: 7, isActive: false },
    { set: 8, id: 8, isActive: false },
    { set: 9, id: 9, isActive: false },
  ]
  _specialSetsList = [
    { set: 1 },
    { set: 2 },
    { set: 3 },
    { set: 4 },
    { set: 5 },
    { set: 6 },
    { set: 7 },
    { set: 8 },
    { set: 9 },
  ]
  _standardSetsList = [
    { set: 1 },
    { set: 3 },
    { set: 5 },
    { set: 7 },
    { set: 9 },
  ]
  _currentSet: any
  _gameSetting: any
  _type: any
  _selectedSet: any
  azureLoggerConversion: any = new Error();
  grpList: any = []

  ngOnInit() {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getAllRoundsInfo();
  }
  ngOnChanges() {
    // this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    // this.getAllRoundsInfo();
  }
  selectSet(data: any, index: any, gameSetting: any) {
    if (gameSetting == 'standard') {
      this._currentSet = data.set;
      for (let i = 0; i < this._standardSetList.length; i++) {
        if (index == i) {
          this._standardSetList[i].isActive = true;
        } else {
          this._standardSetList[i].isActive = false;
        }
      }
    }
    else {
      this._currentSet = data.set;
      for (let i = 0; i < this._specialSetList.length; i++) {
        if (index == i) {
          this._specialSetList[i].isActive = true;
        } else {
          this._specialSetList[i].isActive = false;
        }
      }
    }
  }

  getAllRoundsInfo() {
    this.fixtureService.getEventRoundRules(this._eventId, this.selectedCategoryId)
      .subscribe({
        next: (result: any) => {
          this._roundInfo = result.body;
          this.grpList = result.body.groups;
          this._grpListRounds = this.grpList.map((r: any) => r.rules)
          this._type = this._roundInfo.round_wise == false ? 'allRounds' : 'roundWise';
          this._currentSet = result.body.rule_set
          this._gameSetting = this._roundInfo.rule_type == "ST" ? 'standard' : 'special';
          if (result.body.rule_type == "ST" && this.grpList.round_wise == null) {
            for (let i = 0; i < this._standardSetList.length; i++) {
              if (this._currentSet === 1) {
                this._index = 0
              }
              else if (this._currentSet === 3) {
                this._index = 1
              }
              else if (this._currentSet === 5) {
                this._index = 2
              } else if (this._currentSet === 7) {
                this._index = 3
              } else {
                this._index = 4
              }
              if (this._index == i) {
                this._standardSetList[i].isActive = true;
              } else {
                this._standardSetList[i].isActive = false;
              }
            }
          }
          else if (result.body.rule_type == "SP" && this.grpList.round_wise == null) {
            for (let i = 0; i < this._specialSetList.length; i++) {
              // if (this._currentSet === 1) {
              //   this._index = 0
              // }
              // else if (this._currentSet === 3) {
              //   this._index = 1
              // }
              // else if (this._currentSet === 5) {
              //   this._index = 2
              // }
              // else {
              //   this._index = 3
              // }
              this._index = this._currentSet - 1
              if (this._index == i) {
                this._specialSetList[i].isActive = true;
              } else {
                this._specialSetList[i].isActive = false;
              }
            }
          }
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'Error',
            detail: result.error.msg,
            life: 3000,
          });
        },
        complete: () => { },
      });
  }

  updateEventCategoryRoundSettings() {
    if (this._fixtureFormat == 'Group-PlayOff') {
      const finalData = [];
      this._ruleSetInfo = [];
      this._ruleSetInfo = this._ruleSetInfo.length == 0 ? this.grpList[1].rules.slice(0, 7) : this._ruleSetInfo
      for (let i = 0; i < this._ruleSetInfo.length; i++) {
        var rules = {
          round_description: this._ruleSetInfo[i].round_description,
          round_level: this._ruleSetInfo[i].round_level,
          rule_set: this._ruleSetInfo[i].rule_set,
          group_type: 2
        };
        finalData.push(rules);
      }
      const group_info = [{
        round_description: "Group Stage",
        round_level: "G",
        rule_set: this._groupRule,
        group_type: 1
      }];
      this.data =
      {
        event_id: parseInt(this._eventId),
        category_id: this.selectedCategoryId,
        rule_type: this._gameSetting == 'standard' ? 'ST' : 'SP',
        round_wise: this._type == 'roundWise' ? true : false,
        rule_set: this._currentSet,
        rule: this._type == 'roundWise' ? [...finalData, ...group_info] : undefined
      }
    }
    else if (this._fixtureFormat == 'Knockout') {
      const finalData = []
      for (let i = 0; i < this._ruleSetInfo.length; i++) {
        var rules = {
          round_description: this._ruleSetInfo[i].round_description,
          round_level: this._ruleSetInfo[i].round_level,
          rule_set: this._ruleSetInfo[i].rule_set,
          group_type: 2
        };
        finalData.push(rules);
      }
      this.data =
      {
        event_id: parseInt(this._eventId),
        category_id: this.selectedCategoryId,
        rule_type: this._gameSetting == 'standard' ? 'ST' : 'SP',
        round_wise: this._type == 'roundWise' ? true : false,
        rule_set: this._currentSet,
        rule: this._type == 'roundWise' ? finalData : undefined
      }
    }
    else if (this._fixtureFormat == 'Round-Robin') {
      const group_info = [{
        round_description: "Group Playoff",
        round_level: "G",
        rule_set: this._type == 'roundWise' ? this._ruleSetInfo[0].rule_set : undefined,
        group_type: 1
      }];
      this.data =
      {
        event_id: parseInt(this._eventId),
        category_id: this.selectedCategoryId,
        rule_type: this._gameSetting == 'standard' ? 'ST' : 'SP',
        round_wise: this._type == 'roundWise' ? true : false,
        rule_set: this._currentSet,
        rule: this._type == 'roundWise' ? group_info : undefined
      }
    }
    else if (this._fixtureFormat == 'special') {
      const group_info = [{
        round_description: "Group Stage",
        round_level: "G",
        rule_set: this._type == 'roundWise' ? this._ruleSetInfo[0].rule_set : undefined,
        group_type: 1
      }];
      this.data =
      {
        event_id: parseInt(this._eventId),
        category_id: this.selectedCategoryId,
        rule_type: this._gameSetting == 'standard' ? 'ST' : 'SP',
        round_wise: this._type == 'roundWise' ? true : false,
        rule_set: this._currentSet,
        rule: this._type == 'roundWise' ? group_info : undefined
      }
    }
    else {
      const finalData = []
      this._ruleSetInfo = []
      this._ruleSetInfo = this._ruleSetInfo.length == 0 ? this.grpList[1].rules.slice(0, 7) : this._ruleSetInfo
      for (let i = 0; i < this._ruleSetInfo.length; i++) {
        var rules = {
          round_description: this._ruleSetInfo[i].round_description,
          round_level: this._ruleSetInfo[i].round_level,
          rule_set: this._ruleSetInfo[i].rule_set,
          group_type: 2
        };
        finalData.push(rules);
      }
      const group_info = [{
        round_description: "Group Stage",
        round_level: "G",
        rule_set: this._groupRule,
        group_type: 1
      }];
      const consolData = [];
      this._consolationKo = []
      this._consolationKo = this._consolationKo.length == 0 ? this.grpList[2].rules.slice(0, 7) : this._consolationKo
      for (let i = 0; i < this._consolationKo.length; i++) {
        var rules = {
          round_description: this._consolationKo[i].round_description,
          round_level: this._consolationKo[i].round_level,
          rule_set: this._consolationKo[i].rule_set,
          group_type: 3
        };
        consolData.push(rules);
      }
      this.data =
      {
        event_id: parseInt(this._eventId),
        category_id: this.selectedCategoryId,
        rule_type: this._gameSetting == 'standard' ? 'ST' : 'SP',
        round_wise: this._type == 'roundWise' ? true : false,
        rule_set: this._currentSet,
        rule: this._type == 'roundWise' ? [...finalData, ...group_info, ...consolData] : undefined
      }
    }

    this.fixtureService.updateEventCategoryRoundSettings(this.data)
      .subscribe({
        next: (result: any) => {
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: result.body.msg,
            life: 3000,
          });
          this.getAllRoundsInfo();
          this._ruleSetInfo = []
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'Error',
            detail: result.error.msg,
            life: 3000,
          });
        },
        complete: () => { },
      });
  }
  rulePoints(event: any, item2: any, item: any) {
    if (this._fixtureFormat == 'Group-PlayOff') {
      if (item.group_name == 'Group Playoff')
        this._groupRule = item2.rule_set;
      else {
        this._ruleSetInfo = event
      }
    }
    else if (this._fixtureFormat == 'group playoff + consolation') {
      if (item.group_name == 'Group Playoff')
        this._groupRule = item2.rule_set;
      else if (item.group_name == 'Knockout') {
        this._ruleSetInfo = event;
      }
      else {
        this._consolationKo = event;
      }
    }
    else {
      this._ruleSetInfo = event;
    }
  }
}
