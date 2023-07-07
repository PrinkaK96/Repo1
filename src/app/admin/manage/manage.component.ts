import { Component, OnInit, ViewChild } from '@angular/core';
import { RoleManagementComponent } from '../role-management/role-management.component';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
  providers: [ConfirmationDialogService]
})
export class ManageComponent implements OnInit {
  _breadcrumb: any;
  signUpManagement: boolean = false;
  roleManagement: boolean = false;
  memberManagement: boolean = false;
  @ViewChild(RoleManagementComponent, { static: false }) childRef!: RoleManagementComponent;
  constructor(private confirmationDialogService: ConfirmationDialogService) { }

  ngOnInit(): void {
  }

  currentMangemanet(managementName: any) {
    if (managementName == 'banners') {
      this.roleManagement = false;
      this.memberManagement = false
      this.signUpManagement = true;
      this._breadcrumb = 'Sign Up Fields';
    } else if (managementName == 'brand') {
      this.signUpManagement = false;
      this.memberManagement = false
      this.roleManagement = true;
      this._breadcrumb = 'Create Roles';
    }
    else if (managementName == 'membership') {
      this.signUpManagement = false;
      this.roleManagement = false;
      this.memberManagement = true;
      this._breadcrumb = 'Member';
    }
  }
  goback() {
    if (this.roleManagement) {
      if (this.childRef._roleForm.dirty) {
        this.confirmationDialogService
          .confirm(
            'Please confirm..',
            'Are you sure ,you want to lose your data.'
          )
          .then((confirmed: any) => {
            if (confirmed) {
              this._breadcrumb = '';
              this.signUpManagement = false;
              this.roleManagement = false;
              this.memberManagement = false;
            } else {
              this._breadcrumb = '';
              this.signUpManagement = false;
              this.memberManagement = false;
              this.roleManagement = true;
            }
          })
          .catch(() => { });
      }
      else {
        this.roleManagement = false
      }
    } else {
      this._breadcrumb = '';
      this.signUpManagement = false;
      this.roleManagement = false;
      this.memberManagement = false;
    }
  }
}
