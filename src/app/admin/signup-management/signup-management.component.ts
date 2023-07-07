import { Component, OnInit, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MessageService } from 'primeng/api';
import { RoleService } from 'src/app/services/RoleService/role.service';
import { AddFieldDialogComponent } from './add-field-dialog/add-field-dialog.component';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
@Component({
  selector: 'app-signup-management',
  templateUrl: './signup-management.component.html',
  styleUrls: ['./signup-management.component.scss'],
  providers: [MessageService, ConfirmationDialogService]
})
export class SignupManagementComponent implements OnInit {
  defaultFieldList: any = [
    {
      "data_type": "email",
      "field_id": Math.floor(10000000 + Math.random() * 90000000),
      "description": "Email",
      "title": "Email",
      "input_type": "email",
      "mandatory": false,
      "id": "email"
    },
    {
      "data_type": "password",
      "field_id": Math.floor(10000000 + Math.random() * 90000000),
      "description": "Password",
      "title": "Password",
      "input_type": "Password",
      "mandatory": false,
      "id": "password"
    },
    {
      "data_type": "text",
      "field_id": Math.floor(10000000 + Math.random() * 90000000),
      "description": "Full Name",
      "title": "Full Name",
      "input_type": "text",
      "mandatory": false,
      "id": "fullName"
    }
  ];
  mandatoryFieldList: any = [];
  optionFieldList: any = [];
  _currentRole: any = '';
  _currentRoleId: any = '';
  @ViewChild(AddFieldDialogComponent, { static: false }) childRef!: AddFieldDialogComponent;
  typeSelected: any = 'ball-circus';
  roles: any = [];
  roleSlider: OwlOptions = {
    loop: false,
    mouseDrag: true,
    margin: 25,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      200: {
        items: 2,
      },
      400: {
        items: 3,
      },
      600: {
        items: 4,
      },
      800: {
        items: 5,
      },
      1000: {
        items: 6,
      },
      1200: {
        items: 7,
      },
    },
    nav: false,
  };
  activeRole = '';
  options = [{ label: 'Mandatory' }, { label: 'Remove' }];
  tabStyle(item: any) {
    if (item === this.activeRole) {
      return 'roleSlider-tab notActive isSelected'
    }
    else {
      return 'roleSlider-tab notActive'
    }
  }
  _setSubmit: boolean = false;
  showDialog: boolean = false;
  selectedTab: boolean = false;
  _showLoader: boolean = false;
  azureLoggerConversion: Error = new Error();
  constructor(private messageService: MessageService, private roleService: RoleService,
    private azureLoggerService: MyMonitoringService,
    private confirmationDialogService: ConfirmationDialogService,) { }
  ngOnInit(): void {
    this.getRoles();
  }
  setActive(roles: any) {
    this.activeRole = roles;
    this._currentRole = roles.title;
    this._currentRoleId = roles.role_id;
    this.getRoleFields(roles.role_id)
  }
  openDialog() {
    this.showDialog = true;
  }
  getRoles() {

    this._showLoader = true;
    this.roleService.getAdminRoles().subscribe({
      next: (result: any) => {
        // this.roles = result.body;
        this.roles = result.body.filter((x: any) => x.published === true);
        this.activeRole = this.roles[0];
        this._currentRole = this.roles[0].title;
        this.getRoleFields(this.roles[0].role_id)
        this._currentRoleId = this.roles[0].role_id
        this._showLoader = false;
      },
      error: (e: any) => {
        this._showLoader = false;
        this.azureLoggerConversion = e.error.msg;
        this.azureLoggerService.logException(this.azureLoggerConversion);
      },
      complete: () => { }
    })
  }
  getRoleFields(data: any) {

    this._showLoader = true;
    this.roleService.getRoleWiseFields(data).subscribe(
      {
        next: (res: any) => {
          this._showLoader = false;
          this.optionFieldList = res.body.optional;
          this.mandatoryFieldList = res.body.mandatory;
        },
        error: (e: any) => {
          this._showLoader = false;
          this.azureLoggerConversion = e.error.msg;
          this.azureLoggerService.logException(this.azureLoggerConversion);
        },
        complete: () => { }
      }
    )
  }
  addInMandatoryList(fieldDetails: any) {

    this.asignRoleFieldM(fieldDetails)
  }
  removeFromMandatoryList(fieldDetails: any) {
    this.asignRoleFieldOption(fieldDetails)
  }
  closePopUp() {
    if (this.childRef._currentDataType !== '' || this.childRef._fieldTitle !== '' || this.childRef._setIsMandatory !== '') {
      this.showDialog = true;
      this.confirmationDialogService
        .confirm(
          'Please confirm..',
          'Are you sure ,you want to lose your data.'
        )
        .then((confirmed: any) => {
          if (confirmed) {
            this.showDialog = false;
            this.childRef._currentDataType = '';
            this.childRef._fieldTitle = '';
            this.childRef._setIsMandatory = '';
            this.getRoleFields(this._currentRoleId);
            this._setSubmit = true;
            if (this.childRef) {
              this.childRef.ngOnDestroy();
            }
          } else {
            this.showDialog = true;
          }
        })
        .catch(() => { });

    } else {
      this.showDialog = false;
      this.getRoleFields(this._currentRoleId);
      this._setSubmit = true;
      if (this.childRef) {
        this.childRef.ngOnDestroy();
      }
    }
  }
  asignRoleFieldM(data: any) {
    const body = {
      "role_id": this._currentRoleId,
      "field_id": data.field_id,
      "mandatory": true
    }
    this.roleService.assignRoleField(body).subscribe(
      {
        next: (res: any) => {
          if (this.mandatoryFieldList.findIndex((x: any) => x.field_id == data.field_id) == -1) {
            this.mandatoryFieldList.push(data);
          }
          this.optionFieldList.splice(this.optionFieldList.findIndex((x: any) => x.field_id == data.field_id), 1);
          this.messageService.add({
            key: 'bc', severity: 'success', summary: 'Success', detail: res.body.msg, life: 2000,
          });
        },
        error: (e: any) => {
          this.azureLoggerConversion = e.error.msg;
          this.azureLoggerService.logException(this.azureLoggerConversion);
        },
        complete: () => { }
      }

    )
  }
  asignRoleFieldOption(data: any) {
    const body = {
      "role_id": this._currentRoleId,
      "field_id": data.field_id,
      "mandatory": false
    }
    this.roleService.assignRoleField(body).subscribe(
      {
        next: (res: any) => {
          if (this.optionFieldList.findIndex((x: any) => x.field_id == data.field_id) == -1) {
            this.optionFieldList.push(data);
          }
          this.mandatoryFieldList.splice(this.mandatoryFieldList.findIndex((x: any) => x.field_id == data.field_id), 1);

          this.messageService.add({
            key: 'bc', severity: 'success', summary: 'Success', detail: res.body.msg, life: 2000,
          });
        },
        error: (e: any) => {
          this.azureLoggerConversion = e.error.msg;
          this.azureLoggerService.logException(this.azureLoggerConversion);
        },
        complete: () => { }
      }
    )
  }
  deleteRoleField(data: any) {
    const body = {
      "role_id": this._currentRoleId,
      "field_id": data.field_id,
    }
    this.roleService.deleteRoleField(body).subscribe(
      {
        next: (res: any) => {

          this.messageService.add({
            key: 'bc', severity: 'success', summary: 'Success', detail: res.body.msg, life: 2000,
          });
          this.getRoleFields(this._currentRoleId)
        },
        error: (e: any) => {
          this.azureLoggerConversion = e.error.msg;
          this.azureLoggerService.logException(this.azureLoggerConversion);
        },
        complete: () => { }
      }
    )
  }

}
