import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { JsonDataCallingService } from 'src/app/services/LocalDataJsonDataAPI/json-data-calling.service';
import { MembershipService } from 'src/app/services/MemberShip/membership.service';

@Component({
  selector: 'app-create-membership-dialog',
  templateUrl: './create-membership-dialog.component.html',
  styleUrls: ['./create-membership-dialog.component.scss'],
  providers: [MessageService],
})
export class CreateMembershipDialogComponent implements OnInit {
  //#region Variables
  _describeFields: any = [];
  _typeOfMemberShip: any = [];
  date = new Date();
  lateFeeData: any;
  _validTill: any = [];
  _isPublishOrNot: any = [];
  _isSubmit: boolean = false;
  currency = [
    'USD',
    'INR',
    'Euro',
    'Brazilian real',
    'Pound',
    'Danish krone',
    'Norwegian krone',
    'Swedish krona',
  ];
  eventLevels = [{ level: 'National' }, { level: 'State' }, { level: 'Club' }];
  _lateFees = [{ name: 'Yes' }, { name: 'No' }];
  _memberShipForm!: FormGroup;
  _penaltiesData: any = [
    {
      date: new Date(),
      amount: '00',
    },
  ];
  _eventLevels: any = [];
  _selectedEvents: any = [];
  _currentTypeId: any = '';
  _memberShipListP: any = [];
  _memberShipListUP: any = [];
  _showValidDate: boolean = false;
  _describeFeatures: any = [
    {
      value: '',
    },
  ];
  _describeFeaturesData: any = [];
  _duration: any = '';
  _memberShipId: any = '';
  _currentDate: any = new Date();
  @Input() _subType: any;
  @Input() _formData: any;
  @Input() _isUpdate: boolean = false;
  @Input() _currentRoleId: any;
  @Output() closePopUp = new EventEmitter<any>();
  azureLoggerConversion: Error = new Error();
  //#endregion
  constructor(
    private jsonDataCallingService: JsonDataCallingService,
    private membershipService: MembershipService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private azureLoggerService: MyMonitoringService
  ) {
    this.loadMembershipForm();
    this.getMembershipType();
    this.getIsPublishOrNot();
    this.getValidTill();
    this.getLevels();
  }

  ngOnInit(): void { }
  //#region Load Form First Time
  loadMembershipForm() {
    this._memberShipForm = this.formBuilder.group({
      roleTitle: new FormControl('', Validators.compose([Validators.required])),
      merberShipType: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      amount: new FormControl('', Validators.compose([Validators.required])),
      startDate: new FormControl('', Validators.compose([Validators.required])),
      validDate: new FormControl(''),
      mermberShipPeriod: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      lateFee: new FormControl('', Validators.compose([Validators.required])),
      published: new FormControl(
        false,
        Validators.compose([Validators.required])
      ),
    });
  }
  //#endregion
  getLateFee(data: any) {
    this.lateFeeData = data.value.name;
  }
  addFields() {
    const data = {
      value: '',
    };
    this._describeFeatures.push(data);
  }
  deleteDecribeFields(index: any) {
    this._describeFeatures.splice(index, 1);
  }
  getMembershipType() {
    this.jsonDataCallingService.getMemberShipType().subscribe({
      next: (result: any) => {
        this._typeOfMemberShip = result;
      },
      error: (result) => {
        this.azureLoggerConversion = result.error.msg;
        this.azureLoggerService.logException(this.azureLoggerConversion);
      },
      complete: () => {

      },
    });
  }
  getIsPublishOrNot() {
    this.jsonDataCallingService.getIsPublishOrNot().subscribe({
      next: (result: any) => {
        this._isPublishOrNot = result;
      },
      error: (result) => {
        this.azureLoggerConversion = result.error.msg;
        this.azureLoggerService.logException(this.azureLoggerConversion);
      },
      complete: () => {

      },
    });
  }
  getValidTill() {
    this.jsonDataCallingService.getValidTill().subscribe({
      next: (result: any) => {
        this._validTill = result;
      },
      error: (result) => {
        this.azureLoggerConversion = result.error.msg;
        this.azureLoggerService.logException(this.azureLoggerConversion);
      },
      complete: () => { },
    });
  }
  getLevels() {
    this.jsonDataCallingService.getLevels().subscribe({
      next: (result: any) => {
        this._eventLevels = result;
      },
      error: (result) => {
        this.azureLoggerConversion = result.error.msg;
        this.azureLoggerService.logException(this.azureLoggerConversion);
      },
      complete: () => { },
    });
  }
  selectedLevels(data: any, isChecked: any) {
    if (isChecked.target.checked) {
      if (this._selectedEvents.findIndex((x: any) => x == data.level_id) == -1) {
        this._selectedEvents.push(data.level_id);
      }
    } else {
      this._selectedEvents.splice(
        this._selectedEvents.findIndex((x: any) => x == data.level_id),
        1
      );
    }
  }
  createMemberShip() {
    for (let i = 0; i < this._describeFeatures.length; i++) {
      this._describeFeaturesData.push(this._describeFeatures[i].value);
    }
    this.getMemberShipRoleWise(this._currentRoleId);
    this._isSubmit = true;
    if (this._memberShipForm.valid) {
      const data = {
        role_id: this._currentRoleId,
        title: this._memberShipForm.controls['roleTitle'].value,
        type_id: this._memberShipForm.controls['merberShipType'].value.typeId,
        late_fees: this.lateFeeData === 'Yes' ? true : false,
        published: this._memberShipForm.controls['published'].value,
        level_ids: this._selectedEvents,
        features: this._describeFeaturesData,
        data: {
          effective_from: this._memberShipForm.controls['startDate'].value,
          base_amount: this._memberShipForm.controls['amount'].value,
          duration: this._duration,
          penalties: this._penaltiesData,
        },
      };
      this.membershipService.createMemberShip(data).subscribe({
        next: (result: any) => {
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Created',
            detail: result.body.msg,
            life: 2000,
          });
          this._memberShipForm.reset();
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg;
          this.azureLoggerService.logException(this.azureLoggerConversion);
        },
        complete: () => {

        },
      });
      setTimeout(() => {
        this.closePopUp.emit(false);
      }, 4000);
      this.closePopUp.emit(false);
    }
    this._memberShipForm;
  }
  updateMemberShip() {
    this._describeFeaturesData = [];
    for (let i = 0; i < this._describeFeatures.length; i++) {
      if (
        this._describeFeaturesData.findIndex(
          (x: any) => x == this._describeFeatures[i].value
        ) == -1
      ) {
        this._describeFeaturesData.push(this._describeFeatures[i].value);
      }
    }
    this._isSubmit = true;
    if (this._memberShipForm.valid) {
      const data = {
        role_id: this._currentRoleId,
        title: this._memberShipForm.controls['roleTitle'].value,
        type_id: this._memberShipForm.controls['merberShipType'].value.typeId,
        late_fees: this.lateFeeData === 'Yes' ? true : false,
        published: this._memberShipForm.controls['published'].value,
        level_ids: this._selectedEvents,
        features: this._describeFeaturesData,
        data: {
          effective_from: this._memberShipForm.controls['startDate'].value,
          base_amount: this._memberShipForm.controls['amount'].value,
          duration: this._duration,
          penalties: this._penaltiesData,
        },
        membership_id: this._memberShipId,
      };
      this.membershipService.updateMemberShip(data).subscribe({
        next: (result: any) => {
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Created',
            detail: result.body.msg,
            life: 2000,
          });
          this.getMemberShipRoleWise(this._currentRoleId);
          this._memberShipForm.reset();
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg;
          this.azureLoggerService.logException(this.azureLoggerConversion);
        },
        complete: () => {
          // setTimeout(() => {
          //   this.closePopUp.emit(false);
          // }, 4000);
          this.closePopUp.emit(false);
        },
      });

    }
    this._memberShipForm;
  }
  ngOnDestroy() {
    this._isSubmit = false;
  }
  addMorePenaties() {
    if (this._penaltiesData.length <= 2) {
      const data = {
        date: new Date(),
        amount: '00',
      };
      this._penaltiesData.push(data);
    }
  }
  getMemberShipRoleWise(role_id: any) {
    if (this._subType) {
      this._currentTypeId = 1;
    } else {
      this._currentTypeId = 2;
    }
    this.membershipService.getMemberShipRoleWise(role_id, this._currentTypeId).subscribe({
      next: (result: any) => {
        this._memberShipListP = result.body.filter((x: any) => x.published);
        this._memberShipListUP = result.body.filter(
          (x: any) => x.published == false
        );
      },
      error: (result: any) => {
        this._memberShipListP = [];
        this._memberShipListUP = [];
        this.azureLoggerConversion = result.error.msg;
        this.azureLoggerService.logException(this.azureLoggerConversion);
      },
      complete: () => { },
    });
  }
  setExpireDate(data: any) {
    this._memberShipForm.controls['validDate'].setValue('');
    const date = this._memberShipForm.controls['startDate'].value;
    this._showValidDate = true;
    if (data.value.id == 1) {
      date.setMonth(date.getMonth() + 1);
      this._memberShipForm.controls['validDate'].setValue(date);
      this._duration = 1;
    } else {
      date.setMonth(date.getMonth() + 12);
      this._memberShipForm.controls['validDate'].setValue(date);
      this._duration = 12;
    }
  }
  deletePenalties(data: any) {
    this._penaltiesData.splice(this._penaltiesData.findIndex((x: any) => x.date == data.date), 1)
  }
}
