import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AccountService } from 'src/app/services/Account/account.service';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { RoleService } from 'src/app/services/RoleService/role.service';

@Component({
  selector: 'app-add-field-dialog',
  templateUrl: './add-field-dialog.component.html',
  styleUrls: ['./add-field-dialog.component.scss'],
  providers: [MessageService]
})
export class AddFieldDialogComponent implements OnInit {
  showCreator: boolean = true;
  preDefined: boolean = false;
  previous: boolean = false;

  datatypes = [{ name: 'Text' }, { name: 'Number' }, { name: 'Document' }, { name: 'Calendar' }, { name: 'Phone' }];
  moveto = [{ name: 'Mandatory' }, { name: 'Optional' }];


  fields: any = [];
  _currentDataType: any = '';
  _isMandatory: boolean = false;
  @Input() roleId: any
  _fieldTitle: any = '';
  _setIsMandatory: any = '';
  _isSubmit: boolean = false;
  _currentFinalDataType: any = '';
  _preDefinedFields: any;
  _previousFields: any = [];
  _showLoader: boolean = false;
  azureLoggerConversion: Error = new Error();
  constructor(private accountService: AccountService, private messageService: MessageService, private roleService: RoleService,
    private azureLoggerService: MyMonitoringService) {

  }
  showCustomCreator() {
    this.showCreator = true;
    this._currentDataType = '';
    this._fieldTitle = ''
    this._setIsMandatory = '';
    this._isSubmit = false;
  }
  setpreDefind(value: any) {
    this.preDefined = value.checked;
  }
  setPrevious(value: any) {
    this.previous = value.checked;
  }
  ngOnInit(): void {
    // this.getPreDefinedFields();
    this.getPreviousFields();
  }

  createRoleField() {
    this._showLoader = true;
    if (this._currentDataType.name == 'Number') {
      this._currentFinalDataType = 'number'
    } else if (this._currentDataType.name == 'Text') {
      this._currentFinalDataType = 'text'
    } else if (this._currentDataType.name == 'Document') {
      this._currentFinalDataType = 'file'
    } else if (this._currentDataType.name == 'Calendar') {
      this._currentFinalDataType = 'date'
    } else if (this._currentDataType.name == 'Phone') {
      this._currentFinalDataType = 'phone'
    }
    this._isSubmit = true;
    if (this._currentFinalDataType !== '' && this._fieldTitle !== '') {
      const data = {
        "role_id": this.roleId,
        "fields": [
          {
            "title": this._fieldTitle,
            "description": "string",
            "data_type": this._currentFinalDataType,
            "input_type": "textbox",
            "mandatory": this._isMandatory
          }]
      }
      this.roleService.createRoleField(data).subscribe({
        next: (result: any) => {
          this._showLoader = false;
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: result.msg,
            life: 2000,
          });
          this._currentDataType = '';
          this._fieldTitle = ''
          this._setIsMandatory = '';
          this._isSubmit = false;
        },
        error: (result) => {
          this._showLoader = false;
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'Fails',
            detail: result.msg,
            life: 2000,
          });
          this.azureLoggerConversion = result.error.msg;
          this.azureLoggerService.logException(this.azureLoggerConversion);
        },
        complete: () => {

        }
      }
        // (res: any) => {
        //   this.messageService.add({
        //     key: 'bc',
        //     severity: 'success',
        //     summary: 'Field Created Successfully',
        //     detail: 'Sign Up Done Kindly Login',
        //     life: 2000,
        //   });
        //   this._currentDataType = '';
        //   this._fieldTitle = ''
        //   this._setIsMandatory = '';
        //   this._isSubmit = false;
        // }
      )

    }

    // var roleId = 1;
    // this.accountService.createRoleField(roleId).subscribe(
    //   (res: any) => {
    //     this.fields = res.roles;
    //   },
    //   (error: any) => { }
    // );
    this._showLoader = false;
  }
  setMandatory(data: any) {
    if (data.value.name == 'Mandatory') {
      this._isMandatory = true
    } else {
      this._isMandatory = false;
    }
  }
  getPreDefinedFields() {
    this.roleService.getAdminfields().subscribe({
      next: (result: any) => {
        this._preDefinedFields = result.body;

        this._currentDataType = '';
        this._fieldTitle = ''
        this._setIsMandatory = '';
        this._isSubmit = false;
      },
      error: (result) => {
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Fails',
          detail: result.msg,
          life: 2000,
        });
        this.azureLoggerConversion = result.error.msg;
        this.azureLoggerService.logException(this.azureLoggerConversion);
      },
      complete: () => {

      }
    })
  }
  getPreviousFields() {
    this.roleService.getPreviousFields().subscribe({
      next: (result: any) => {
        this._previousFields = result.body;

        this._currentDataType = '';
        this._fieldTitle = ''
        this._setIsMandatory = '';
        this._isSubmit = false;
      },
      error: (result) => {
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Fails',
          detail: result.msg,
          life: 2000,
        });
        this.azureLoggerConversion = result.error.msg;
        this.azureLoggerService.logException(this.azureLoggerConversion);
      },
      complete: () => {

      }
    })
  }
  updateRoleFields(item: any, isMandatory: boolean) {
    const data = {
      "field_id": item.field_id,
      "role_id": this.roleId,
      "mandatory": isMandatory
    }
    this.roleService.assignFieldsToRole(data).subscribe({
      next: (result: any) => {
        this.getPreDefinedFields();
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Field moved successfully',
          detail: result.msg,
          life: 2000,
        });
        this._currentDataType = '';
        this._fieldTitle = ''
        this._setIsMandatory = '';
        this._isSubmit = false;
      },
      error: (result) => {
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Fails',
          detail: result.msg,
          life: 2000,
        });
        this.azureLoggerConversion = result.error.msg;
        this.azureLoggerService.logException(this.azureLoggerConversion);
      },
      complete: () => {
        
      }
    })
  }
  ngOnDestroy() {
    this._isSubmit = false;
  }
}
