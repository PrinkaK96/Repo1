import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageComponent } from './manage/manage.component';
import { SettingsComponent } from './settings/settings.component';
import { ChatComponent } from './chat/chat.component';
import { WebImagesComponent } from './web-images/web-images.component';
import { FeedbacksComponent } from './feedbacks/feedbacks.component';
import { VideosComponent } from './videos/videos.component';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SignupManagementComponent } from './signup-management/signup-management.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CreateRoleDialogComponent } from './role-management/create-role-dialog/create-role-dialog.component';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { AddFieldDialogComponent } from './signup-management/add-field-dialog/add-field-dialog.component';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MamberManagementComponent } from './mamber-management/mamber-management.component';
import { MamberComponent } from './mamber/mamber.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CreateMembershipDialogComponent } from './mamber-management/create-membership-dialog/create-membership-dialog.component';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../services/AuthService/auth.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { BannerManagementComponent } from './banner-management/banner-management.component';
import { FooterManagementComponent } from './footer-management/footer-management.component';
import { TabViewModule } from 'primeng/tabview';
import { MainFooterComponent } from './footer-management/main-footer/main-footer.component';
import { SidebarModule } from 'primeng/sidebar';
import { TermsConditionComponent } from './footer-management/terms-condition/terms-condition.component';
import { MobileappDetailsComponent } from './footer-management/mobileapp-details/mobileapp-details.component';
import { SampleViewComponent } from './footer-management/sample-view/sample-view.component';
import { TableModule } from 'primeng/table';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RouteAuthService } from '../services/RouteAuth/route-auth.service';
import {
  IgxDragDirective,
  IgxDropDirective,
  IgxDragDropModule,
  IgxDialogModule,
} from 'igniteui-angular';
import { SharedModule } from '../shared/shared.module';
import { RequestsComponent } from '../shared/requests/requests.component';
import { CarouselModule } from 'primeng/carousel';
import { TranslateModule } from '@ngx-translate/core';
import { GifLoaderComponent } from '../shared/gif-loader/gif-loader.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { OpenRegistrationComponent } from '../registration/open-registration/open-registration.component';
import { PlatformHeadersComponent } from './platform-headers/platform-headers.component';
import { LiveSettingsComponent } from './live-settings/live-settings.component';
import { IsStateFedService } from '../services/RouteAuth/is-state-fed.service';
import { DividerModule } from 'primeng/divider';
import { EventManagementComponent } from './event-management/event-management.component';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { EventVerificationComponent } from './event-verification/event-verification.component';
import { PaginatorModule } from 'primeng/paginator';
import { AddWorldRankComponent } from './add-world-rank/add-world-rank.component';
import { ViewAdminEventComponent } from './event-verification/view-admin-event/view-admin-event.component';
import { AccordionModule } from 'primeng/accordion';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CommonSvgMsgComponent } from '../shared/common-svg-msg/common-svg-msg.component';
import { AdminPlayerDashboardComponent } from './admin-player-dashboard/admin-player-dashboard.component';
import { AdminClubDashboardComponent } from './admin-club-dashboard/admin-club-dashboard.component';
import { AvatarModule } from 'primeng/avatar';

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthService] },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthService],
  },
  { path: 'manage', component: ManageComponent, canActivate: [AuthService] },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthService],
  },
  { path: 'chat', component: ChatComponent, canActivate: [AuthService] },
  {
    path: 'web-images',
    component: WebImagesComponent,
    canActivate: [AuthService],
  },
  { path: 'videos', component: VideosComponent, canActivate: [AuthService] },
  {
    path: 'feedback',
    component: FeedbacksComponent,
    canActivate: [AuthService],
  },
  {
    path: 'notification',
    component: NotificationsComponent,
    canActivate: [AuthService],
  },
  { path: 'member', component: MamberComponent, canActivate: [AuthService] },

  {
    path: 'banner',
    component: BannerManagementComponent,
    canActivate: [AuthService],
  },
  {
    path: 'footer',
    component: FooterManagementComponent,
    canActivate: [AuthService],
  },
  {
    path: 'requests',
    component: RequestsComponent,
    canActivate: [AuthService],
  },
  {
    path: 'open-reg/:id',
    component: OpenRegistrationComponent,
    canActivate: [RouteAuthService],
  },
  {
    path: 'platform-headers',
    component: PlatformHeadersComponent,
    canActivate: [IsStateFedService],
  },
  {
    path: 'live-setup',
    component: LiveSettingsComponent,
    canActivate: [IsStateFedService],
  },
  {
    path: 'event-management',
    component: EventManagementComponent,
    canActivate: [IsStateFedService],
  },
  {
    path: 'create-category',
    component: CreateCategoryComponent,
    canActivate: [IsStateFedService]
  },
  {
    path: 'player',
    component: AdminPlayerDashboardComponent,
    canActivate: [IsStateFedService]
  },
  {
    path: 'club',
    component: AdminClubDashboardComponent,
    canActivate: [IsStateFedService]
  }
];
@NgModule({
  declarations: [
    DashboardComponent,
    ManageComponent,
    SettingsComponent,
    ChatComponent,
    WebImagesComponent,
    FeedbacksComponent,
    VideosComponent,
    AdminLayoutComponent,
    AdminSidebarComponent,
    NotificationsComponent,
    SignupManagementComponent,
    RoleManagementComponent,
    CreateRoleDialogComponent,
    AddFieldDialogComponent,
    MamberManagementComponent,
    MamberComponent,
    CreateMembershipDialogComponent,
    BannerManagementComponent,
    FooterManagementComponent,
    MainFooterComponent,
    TermsConditionComponent,
    MobileappDetailsComponent,
    SampleViewComponent,
    PlatformHeadersComponent,
    LiveSettingsComponent,
    EventManagementComponent,
    CreateCategoryComponent,
    EventVerificationComponent,
    AddWorldRankComponent,
    ViewAdminEventComponent,
    AdminPlayerDashboardComponent,
    AdminClubDashboardComponent,
  ],
  imports: [
    SidebarModule,
    TabViewModule,
    CarouselModule,
    CalendarModule,
    TooltipModule,
    ToggleButtonModule,
    InputSwitchModule,
    MenuModule,
    FormsModule,
    DropdownModule,
    CommonModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    RouterModule.forChild(routes),
    ToastModule,
    RippleModule,
    MultiSelectModule,
    ReactiveFormsModule,
    IgxDragDropModule,
    IgxDialogModule,
    TableModule,
    InputTextareaModule,
    SharedModule,
    TranslateModule,
    GifLoaderComponent,
    OverlayPanelModule,
    DividerModule,
    PaginatorModule,
    AccordionModule,
    RadioButtonModule,
    CommonSvgMsgComponent,
    AvatarModule
  ],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminModule { }
