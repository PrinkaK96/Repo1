import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { JsonDataCallingService } from 'src/app/services/LocalDataJsonDataAPI/json-data-calling.service';
import { MembershipService } from 'src/app/services/MemberShip/membership.service';
import { RoleService } from 'src/app/services/RoleService/role.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
import { CreateMembershipDialogComponent } from './create-membership-dialog/create-membership-dialog.component';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';

@Component({
  selector: 'app-mamber-management',
  templateUrl: './mamber-management.component.html',
  styleUrls: ['./mamber-management.component.scss'],
  providers: [MessageService, ConfirmationDialogService]
})
export class MamberManagementComponent implements OnInit {
  _activeRole: any;
  _memberShipListP: any = []
  _memberShipListUP: any = []
  _roleList: any = [];
  _currentTypeId: any = '';
  _currentRoleId: any = '';
  _subType: boolean = false;
  _showDialog: boolean = false;
  _isDisabled: boolean = false;
  _formData: any = [];
  _isUpdate: boolean = false;
  _eventLevels: any = [];
  @ViewChild(CreateMembershipDialogComponent, { static: false }) childRef!: CreateMembershipDialogComponent;
  _currentMemberShip: any = '';
  _showLoader: boolean = false;
  azureLoggerConversion: Error = new Error();
  constructor(private jsonDataCallingService: JsonDataCallingService, private membershipService: MembershipService,
    private roleService: RoleService, private messageService: MessageService, private confirmationDialogService: ConfirmationDialogService
    , private azureLoggerService: MyMonitoringService) {
    this.getRoles();
    this.getLevels();
  }
  ngOnInit(): void { }
  tabStyle(item: any) {

    if (item === this._activeRole) {
      return 'memberSlider-tab notActive isSelected'
    }
    else {
      return 'memberSlider-tab notActive'
    }
  }
  setActive(roles: any) {
    this._activeRole = roles;
    this._currentRoleId = roles.role_id;
    this._currentMemberShip = roles.title;
    this.getMemberShipRoleWise(roles.role_id)
  }
  openDialog() {
    this.childRef._eventLevels = [{
      "level_id": 1,
      "name": "National",
      "checked": false
    },
    {
      "level_id": 2,
      "name": "State",
      "checked": false
    },
    {
      "level_id": 3,
      "name": "Club",
      "checked": false
    }]
    this.childRef._memberShipForm.reset();
    this.childRef._describeFeatures = [{
      value: ''
    }];

    this.childRef._isUpdate = false;
    this.childRef._penaltiesData = [];
    this.childRef._penaltiesData = [{
      date: new Date(),
      amount: '00',
    }];

    this.childRef.lateFeeData = 'No'
    this.childRef._memberShipForm.controls['published'].setValue(false);
    if (this._memberShipListP.length > 3) {
      this.messageService.add({
        key: 'bc', severity: 'error', summary: 'Failure', detail: 'You have already exceeded the maximum number of membership', life: 2000,
      });
    } else {
      this._showDialog = true;
    }
  }
  getMemberShip() {
    this.membershipService.getMemships().subscribe({
      next: (result: any) => {
        this._memberShipListP = result.body
      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg;
        this.azureLoggerService.logException(this.azureLoggerConversion);
      },
      complete: () => {

      }
    })
  }
  getRoles() {
    this._showLoader = true;
    this.roleService.getRoles().subscribe(
      {
        next: (result: any) => {
          this._roleList = result.body.filter((x: any) => x.published === true);
          this.tabStyle(this._roleList[0]);
          this.setActive(this._roleList[0])
          this.getMemberShipRoleWise(this._roleList[0].role_id)
          this._showLoader = false;
        },
        error: (result: any) => {
          this._showLoader = false;
          this.azureLoggerConversion = result.error.msg;
          this.azureLoggerService.logException(this.azureLoggerConversion);
        },
        complete: () => {

        }
      }
    );
  }
  getMemberShipRoleWise(role_id: any) {
    this._showLoader = true;
    if (this._subType) {
      this._currentTypeId = 2;

    } else {
      this._currentTypeId = 1;
    }
    this.membershipService.getMemberShipRoleWise(role_id, this._currentTypeId).subscribe({
      next: (result: any) => {
        this._memberShipListP = result.body.filter((x: any) => x.published)
        this._memberShipListUP = result.body.filter((x: any) => x.published == false)
        this._showLoader = false;
      },
      error: (result: any) => {
        this._memberShipListP = []
        this._memberShipListUP = [];
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg;
        this.azureLoggerService.logException(this.azureLoggerConversion);
      },
      complete: () => {

      }
    })

  }
  handleChange(data: any) {
    this.getMemberShipRoleWise(this._currentRoleId);
  }
  closePopUp() {
    if (this.childRef._memberShipForm.dirty) {
      this.confirmationDialogService
        .confirm(
          'Please confirm..',
          'Are you sure ,you want to lose your data.'
        )
        .then((confirmed: any) => {
          if (confirmed) {
            this._showDialog = false
          } else {
            this._showDialog = true;
          }
        })
        .catch(() => { });

    } else {
      this.childRef._eventLevels = this._eventLevels;
      this.childRef.ngOnDestroy();
    }



    // if (this.childRef) {
    //   this.childRef._eventLevels = this._eventLevels;
    //   this.childRef.ngOnDestroy();
    // }
  }
  closePopUps(data: any) {
    this._showDialog = data;
    this.getMemberShipRoleWise(this._currentRoleId);
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
      complete: () => {

      },
    });
  }
  editMemberShip(data: any) {
    this._showDialog = true;
    this._isUpdate = true;
    this._formData.push(data)
    this.childRef._isUpdate = true;
    this.childRef._memberShipForm.controls['roleTitle'].setValue(data.title)
    this.childRef._memberShipForm.controls['merberShipType'].setValue(data.type_id == 2 ? { typeId: 2, typeName: 'One-Time' } : { typeId: 1, typeName: 'Subscription' });
    this.childRef._memberShipForm.controls['published'].setValue(data.published);
    this.childRef._memberShipForm.controls['amount'].setValue(data.data.base_amount);
    this.childRef._memberShipForm.controls['mermberShipPeriod'].setValue(data.data.duration == 1 ? { "id": 1, "name": "Month" } : { "id": 2, "name": "Year" });
    this.childRef._memberShipForm.controls['startDate'].setValue(data.data.effective_from == 'string' ? new Date : new Date(data.data.effective_from));

    this.childRef._memberShipForm.controls['lateFee'].setValue(data.late_fees ? { name: 'Yes' } : { name: 'No' });
    this.childRef._memberShipId = data.membership_id
    this.childRef._duration = data.data.duration == 0 ? 1 : data.data.duration;
    if (data.features.length !== 0) {
      this.childRef._describeFeatures = [];
      for (let i = 0; i < data.features.length; i++) {
        const dd = {
          value: data.features[i]
        }
        this.childRef._describeFeatures.push(dd)
      }
    }
    if (data.level_ids[0] == 0) {
      this.childRef._eventLevels = this._eventLevels;
    } else {
      if (data.level_ids.length !== 0) {
        this.childRef._eventLevels = [];

        for (let i = 0; i < this._eventLevels.length; i++) {
          var isChecked = false;
          if (data.level_ids.includes(this._eventLevels[i].level_id)) {
            isChecked = true;
          }
          const dd = {
            level_id: this._eventLevels[i].level_id,
            name: this._eventLevels[i].name,
            checked: isChecked
          }
          this.childRef._eventLevels.push(dd);
        }
      }
    }

    if (this.childRef) {
      this.childRef.ngOnDestroy();
    }
  }

  publishAndUnpublish(event: any, data: any, state: any) {
    if (state == 'UP') {
      if (event.checked) {
        this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to publish ?')
          .then((confirmed) => {

            if (confirmed) {
              data.published = true;
              this.updateMemberShip(data)
            } else {
              data.published = false;
            }
          })
          .catch(() => {

          });
      }
    } else {
      if (event.checked) {

      } else {
        this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to unpublish ?')
          .then((confirmed) => {
            if (confirmed) {
              data.published = false;
              this.updateMemberShip(data)
            } else {
              data.published = true;
            }
          })
          .catch(() => { });
      }
    }
  }
  updateMemberShip(data: any) {
    this.membershipService.updateMemberShip(data).subscribe({
      next: (result: any) => {
        this.messageService.add({
          key: 'bc', severity: 'success', summary: 'Updated', detail: result.body.msg, life: 2000,
        });
        this.getMemberShipRoleWise(this._currentRoleId);
      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg;
        this.azureLoggerService.logException(this.azureLoggerConversion);
      },
      complete: () => { },
    });

  }
}
