import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { JsonDataCallingService } from 'src/app/services/LocalDataJsonDataAPI/json-data-calling.service';
import { RoleService } from 'src/app/services/RoleService/role.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss'],
  providers: [MessageService, ConfirmationDialogService]
})
export class RoleManagementComponent implements OnInit {
  _permissionData: any = [];
  _eventLevels: any = [];
  _isSubmit: boolean = false;
  _selectedLevels: string[] = [];
  _selectedPermission: any = [];
  _selectedAuth: any = [];
  _isPublishOrNot: any = [];
  _roleForm!: FormGroup;
  _authentication: any = [];
  _permissionDataCopy: any = [];
  _levelsCopy: any = [];
  _roleId: number = 0;
  _createRoleBtn: boolean = true;
  _publishLevels: any = [];
  _permissionIds: any = [];
  _showLoader: boolean = false;
  azureLoggerConversion: Error = new Error();
  constructor(private roleService: RoleService,
    private jsonDataCallingService: JsonDataCallingService, private messageService: MessageService, private formBuilder: FormBuilder,
    private confirmationDialogService: ConfirmationDialogService, private azureLoggerService: MyMonitoringService) {
    this.innerWidth = window.innerWidth;
    this._roleForm = this.formBuilder.group({
      roleName: new FormControl('', Validators.compose([Validators.required])),
      accessPermission: new FormControl('', Validators.compose([Validators.required])),
      authentication: new FormControl(''),
      eventLevels: new FormControl(''),
      isPublish: new FormControl('', Validators.compose([Validators.required]))
    });
    this.getPermissions();
    this.getIsPublishOrNot();
    this.getLevels();
    this.getRoles();
    this.getAuthentication();
  }
  /* Variables */
  roles: any = '';
  innerWidth: any
  ngOnInit(): void {
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  getAuthentication() {
    this.jsonDataCallingService.getAuthentication().subscribe({
      next: (result: any) => {
        this._authentication = result;
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
    this.roleService.getAdminRoles().subscribe(
      {
        next: (result: any) => {

          this.roles = result.body;
          this._showLoader = false;
        },
        error: (result) => {
          this._showLoader = false;
          this.azureLoggerConversion = result.error.msg;
          this.azureLoggerService.logException(this.azureLoggerConversion);
        },
        complete: () => {
        }
      }
    );
  }
  getPermissions() {
    this.jsonDataCallingService.getPermissions().subscribe({
      next: (result: any) => {
        this._permissionData = result;
        this._selectedPermission
      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg;
        this.azureLoggerService.logException(this.azureLoggerConversion);
      },
      complete: () => {

      }
    })
  }
  getLevels() {
    this.jsonDataCallingService.getLevels().subscribe({
      next: (result: any) => {
        this._eventLevels = result;
      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg;
        this.azureLoggerService.logException(this.azureLoggerConversion);
      },
      complete: () => {

      }
    })
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

      }
    });
  }
  saveRole() {

    this._roleForm
    this._isSubmit = true;
    if (this._roleForm.valid) {
      this._selectedLevels = [];
      this._selectedPermission = [];
      for (let i = 0; i < this._roleForm.controls['accessPermission'].value.length; i++) {
        this._selectedPermission.push(this._roleForm.controls['accessPermission'].value[i].perm_id)
      }
      for (let i = 0; i < this._roleForm.controls['eventLevels'].value.length; i++) {
        this._selectedLevels.push(this._roleForm.controls['eventLevels'].value[i].level_id)
      }


      var data = {
        "title": this._roleForm.controls['roleName'].value,
        "description": "string",
        "verified_by": this._roleForm.controls['authentication'].value,
        "published": this._roleForm.controls['isPublish'].value.id == 1 ? true : false,
        "perm_ids": this._selectedPermission,
        "level_ids": this._selectedLevels
      }
      this.roleService.createRole(data).subscribe(
        {
          next: (result: any) => {
            this.messageService.add({
              key: 'bc', severity: 'success', summary: 'Created', detail: result.body.msg, life: 3000,
            });
            this._roleForm.reset();
            //this.reset();
            this._isSubmit = false;
            this.getRoles();
          },
          error: (result: any) => {
            this.messageService.add({
              key: 'bc', severity: 'error', summary: 'Fail', detail: result.error.msg, life: 3000,
            });
            this.azureLoggerConversion = result.error.msg;
            this.azureLoggerService.logException(this.azureLoggerConversion);
          },
          complete: () => {

          }
        }
      );
    }
  }
  editRole(data: any) {
    this._roleForm.reset();
    this._permissionDataCopy = [];
    this._levelsCopy = [];
    this._createRoleBtn = false;
    this._roleId = data.role_id;
    for (let i = 0; i < data.permissions.length; i++) {
      this._permissionDataCopy.push(this._permissionData.filter((x: any) => x.perm_id === data.permissions[i].perm_id)[0]);
    }
    if (data.published) {
      var isPublishParam = { "id": 1, "name": "Publish" }
      this._roleForm.controls['isPublish'].setValue(isPublishParam);
    }
    else {
      var isPublishParam = { "id": 2, "name": "UnPublish" }
      this._roleForm.controls['isPublish'].setValue(isPublishParam);
    }
    for (let i = 0; i < data.levels.length; i++) {
      this._levelsCopy.push(this._eventLevels.filter((x: any) => x.level_id === data.levels[i].level_id)[0]);
    }

    this._roleForm.controls['eventLevels'].setValue(this._levelsCopy)
    this._roleForm.controls['roleName'].setValue(data.title);
    this._roleForm.controls['accessPermission'].setValue(this._permissionDataCopy);
    this._roleForm.controls['authentication'].setValue(data.verified_by);


  }
  updateRole(args: any) {
    this._createRoleBtn = true;
    if (this._roleForm.valid) {
      this._selectedLevels = [];
      this._selectedPermission = [];
      for (let i = 0; i < this._roleForm.controls['accessPermission'].value.length; i++) {
        this._selectedPermission.push(this._roleForm.controls['accessPermission'].value[i].perm_id)
      }
      var data = {
        "title": this._roleForm.controls['roleName'].value,
        "description": "string",
        "verified_by": this._roleForm.controls['authentication'].value,
        "published": this._roleForm.controls['isPublish'].value.id == 1 ? true : false,
        "perm_ids": this._selectedPermission,
        "level_ids": [1],
        "role_id": this._roleId
      }

      this.roleService.updateRole(data).subscribe(
        {
          next: (result: any) => {
            this.messageService.add({
              key: 'bc', severity: 'success', summary: 'Created', detail: result.body.msg, life: 3000,
            });
            this._isSubmit = false;
            this.getRoles();
          },
          error: (result: any) => {
            this.messageService.add({
              key: 'bc', severity: 'error', summary: 'Fail', detail: result.error.msg, life: 3000,
            });
            this.azureLoggerConversion = result.error.msg;
            this.azureLoggerService.logException(this.azureLoggerConversion);
          },
          complete: () => {

          }
        }
      );
      this._roleForm.reset();
    }
  }
  onPUblishClick(event: any, data: any) {
    this._publishLevels = [];
    this._permissionIds = [];
    for (let i = 0; i < data.levels.length; i++) {
      this._publishLevels.push(data.levels[i].level_id)
    }
    for (let i = 0; i < data.permissions.length; i++) {
      this._permissionIds.push(data.permissions[i].perm_id)
    }
    data.permissions = []
    data.levels = []
    data.permissions = this._permissionIds
    data.levels = this._publishLevels
    this._roleId = data.role_id;
    if (event.checked) {
      this.confirmationDialogService.confirm('', 'Are you sure you want to make changes against this role!')
        .then((confirmed) => {
          if (confirmed) {
            this.updatePublishUnpublish(data);
          } else {
            data.published = false;
          }
        })
        .catch(() => { });

    } else {
      this.confirmationDialogService.confirm('', 'Are you sure you want to make changes against this role!')
        .then((confirmed) => {
          if (confirmed) {
            this.updatePublishUnpublish(data);
          } else {
            data.published = false;
          }
        })
        .catch(() => { });
    }
  }
  updatePublishUnpublish(args: any) {
    var data = {
      "title": args.title,
      "description": args.description,
      "verified_by": 0,
      "published": args.published,
      "perm_ids": args.permissions,
      "level_ids": args.levels,
      "role_id": args.role_id
    }

    this.roleService.updateRole(data).subscribe(
      {
        next: (result: any) => {
          this.messageService.add({
            key: 'bc', severity: 'success', summary: 'Created', detail: result.body.msg, life: 3000,
          });

          //this.reset();
          this._isSubmit = false;
          this.getRoles();
        },
        error: (result: any) => {
          this.messageService.add({
            key: 'bc', severity: 'error', summary: 'Fail', detail: result.error.msg, life: 3000,
          });
          this.azureLoggerConversion = result.error.msg;
          this.azureLoggerService.logException(this.azureLoggerConversion);
        },
        complete: () => {

        }
      }
    );
    this._roleForm.reset();

  }
  reset() {
  }
  setFormValue(rolesData: any) {

  }
}
