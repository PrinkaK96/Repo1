import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyProfileLayoutComponent } from './my-profile-layout/my-profile-layout.component';
import { MyProfileSidebarComponent } from './my-profile-sidebar/my-profile-sidebar.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { MemberShipsComponent } from './member-ships/member-ships.component';
import { MyEventsComponent } from './my-events/my-events.component';
import { DeteteAccountComponent } from './detete-account/detete-account.component';
import { RouterModule, Routes } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { GifLoaderComponent } from '../shared/gif-loader/gif-loader.component';
import { CalendarModule } from 'primeng/calendar';
import { TranslateModule } from '@ngx-translate/core';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CommonSvgMsgComponent } from '../shared/common-svg-msg/common-svg-msg.component';
import { DropdownModule } from 'primeng/dropdown';
import { NgxPaginationModule } from 'ngx-pagination';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { DividerModule } from 'primeng/divider';
import { TabViewModule } from 'primeng/tabview';
import { PaginatorModule } from 'primeng/paginator';
const routes: Routes = [
  // {
  //   path: '',
  //   component: PersonalDetailsComponent,
  // },
  {
    path: 'personal-info',
    component: PersonalDetailsComponent,
  },
  {
    path: 'role',
    component: RoleManagementComponent,
  },
  {
    path: 'membership',
    component: MemberShipsComponent,
  },
  {
    path: 'my-event',
    component: MyEventsComponent,
  },
  {
    path: 'delete-account',
    component: DeteteAccountComponent,
  }
];

@NgModule({
  declarations: [
    MyProfileLayoutComponent,
    MyProfileSidebarComponent,
    PersonalDetailsComponent,
    RoleManagementComponent,
    MemberShipsComponent,
    MyEventsComponent,
    DeteteAccountComponent,
  ],
  imports: [
    CommonModule,
    AvatarModule,
    AvatarGroupModule,
    RouterModule.forChild(routes),
    FormsModule, ReactiveFormsModule,
    ToastModule,
    GifLoaderComponent,
    CalendarModule,
    TranslateModule,
    InputSwitchModule,
    CommonSvgMsgComponent,
    DropdownModule,
    NgxPaginationModule,
    InputTextModule,
    DialogModule,
    SkeletonModule,
    DividerModule,
    TabViewModule,
    PaginatorModule
  ],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MyProfileModule { }
