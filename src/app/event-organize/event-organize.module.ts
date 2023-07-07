import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventOrganizComponent } from '../landpage/event-organiz/event-organiz.component';
import { RouterModule, Routes } from '@angular/router';
import { EventOrganizeLayoutComponent } from './event-organize-layout/event-organize-layout.component';
import { EventOrgSidebarComponent } from './event-org-sidebar/event-org-sidebar.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { AddOfficialComponent } from './create-event/add-official/add-official.component';
import { AddPlayerComponent } from './add-player/add-player.component';
import { FixtureComponent } from './fixture/fixture.component';
import { ResultsComponent } from './results/results.component';
import { RankingsComponent } from './rankings/rankings.component';
import { TabViewModule } from 'primeng/tabview';
import { EventDetailsComponent } from './create-event/event-details/event-details.component';
import { LiveStreamComponent } from './create-event/live-stream/live-stream.component';
import { RegistrationFormComponent } from './create-event/registration-form/registration-form.component';
import { ProsGuidelinesComponent } from './create-event/pros-guidelines/pros-guidelines.component';
import { RuleSettingComponent } from './create-event/rule-setting/rule-setting.component';
import { PaymentMethodComponent } from './create-event/payment-method/payment-method.component';
import { DashboardComponent } from './create-event/dashboard/dashboard.component';
import { TimelineModule } from 'primeng/timeline';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { OfficialListComponent } from './create-event/add-official/official-list/official-list.component';
import { RecentRemovedComponent } from './create-event/add-official/recent-removed/recent-removed.component';
import { CreateOfficialComponent } from './create-event/add-official/create-official/create-official.component';
import { HistoryComponent } from './add-player/history/history.component';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { ImportMemberDialogComponent } from './create-event/add-official/official-list/import-member-dialog/import-member-dialog.component';
import { ImportPlayerComponent } from './add-player/import-player/import-player.component';
import { MergeCategoryComponent } from './add-player/merge-category/merge-category.component';
import { SkeletonModule } from 'primeng/skeleton';
import { AddPlayersComponent } from './add-player/add-players/add-players.component';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { FileUploadModule } from 'primeng/fileupload';
import { TranslateModule } from '@ngx-translate/core';
import { GroupCreationComponent } from './fixture/group-creation/group-creation.component';
import { MatchSchedulerComponent } from './fixture/match-scheduler/match-scheduler.component';
import { MainDrawComponent } from './fixture/main-draw/main-draw.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { StepsModule } from 'primeng/steps';
import { TreeModule } from 'primeng/tree';
import { KnockoutComponent } from './fixture/knockout/knockout.component';
import { RoundRobinComponent } from './fixture/round-robin/round-robin.component';
import { GrpPlayOffComponent } from './fixture/grp-play-off/grp-play-off.component';
import { RecentlyDeletedComponent } from './add-player/recently-deleted/recently-deleted.component';
import { VideosComponent } from './videos/videos.component';
import { AccordionModule } from 'primeng/accordion';
import { ResultKnockoutComponent } from './results/result-knockout/result-knockout.component';
import { ResultRRobinComponent } from './results/result-r-robin/result-r-robin.component';
import { ResultGPlayOffComponent } from './results/result-g-play-off/result-g-play-off.component';
import { MSGrpPlayOffComponent } from './fixture/m-s-grp-play-off/m-s-grp-play-off.component';
import { ArrangeDialogComponent } from './fixture/m-s-grp-play-off/arrange-dialog/arrange-dialog.component';
import { LiveVideosComponent } from './videos/live-videos/live-videos.component';
import { StreamMatchesComponent } from './videos/stream-matches/stream-matches.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { DragDropSwapDirective } from './videos/live-videos/drag-drop-swap.directive';
import { DayPlannerComponent } from './create-event/day-planner/day-planner.component';
import { DividerModule } from 'primeng/divider';
import { FixSingleTreeComponent } from './fixture/fixture-tree/fix-single-tree/fix-single-tree.component';
import { FixDoubleTreeComponent } from './fixture/fixture-tree/fix-double-tree/fix-double-tree.component';
import { MatchComponent } from './fixture/fixture-tree/match/match.component';
import { DragDropFixtureComponent } from './fixture/fixture-tree/drag-drop-fixture/drag-drop-fixture.component';
import { ConfirmationService, SharedModule } from 'primeng/api';
import { DragDropItemDirective } from '../shared/DragDropItem/drag-drop-item.directive';
import { GifLoaderComponent } from '../shared/gif-loader/gif-loader.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AllotRankPointersComponent } from './create-event/allot-rank-pointers/allot-rank-pointers.component';
import { CommonSvgMsgComponent } from '../shared/common-svg-msg/common-svg-msg.component';
import { RippleModule } from 'primeng/ripple';
import { GrpPlayerSwapComponent } from './fixture/group-creation/grp-player-swap/grp-player-swap.component';
import { InputMaskModule } from 'primeng/inputmask';
import { UpdateScoreComponent } from './fixture/match-scheduler/update-score/update-score.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { OpenRegistrationComponent } from '../registration/open-registration/open-registration.component';
import { KnockoutCreationComponent } from './fixture/knockout-creation/knockout-creation.component';
import { TooltipModule } from 'primeng/tooltip';
import { OverlayModule } from 'primeng/overlay';
import { ResultGroupsComponent } from './results/result-g-play-off/result-groups/result-groups.component';
import { SpeedDialModule } from 'primeng/speeddial';
import { ConfirmDeactivateGuard } from '../route-change-detector.service';
import { PanelModule } from 'primeng/panel';
import { NgxPrintModule } from 'ngx-print';
import { AddCategoryComponent } from './create-event/add-category/add-category.component';
import { BadgeModule } from 'primeng/badge';
import { CheckboxModule } from 'primeng/checkbox';
import { SettingsComponent } from '../shared/settings/settings.component';
import { NewScheduleComponent } from './new-schedule/new-schedule.component';
import { CommonUpdateScoreComponent } from '../shared/update-score/common-update-score.component';
import { CommonScoreComponent } from '../shared/common-score/common-score.component';

import { GrpPlayOffConsolidationComponent } from './fixture/grp-play-off-consolidation/grp-play-off-consolidation.component';
import { SpecialFixtureComponent } from './fixture/special-fixture/special-fixture.component';
import { Consolation } from './fixture/consolation/consolation';
import { UpdateMatchScoreComponent } from './create-event/update-match-score/update-match-score.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import { ToastComponent } from '../shared/toast/toast.component';
import { ResultConsolationComponent } from './results/result-consolation/result-consolation.component';
import { PaginatorModule } from 'primeng/paginator';

const routes: Routes = [
  {
    path: 'create-event',
    component: CreateEventComponent,
    canDeactivate: [ConfirmDeactivateGuard]
  },
  {
    path: 'add-player',
    component: AddPlayerComponent,
    canDeactivate: [ConfirmDeactivateGuard]
  },
  {
    path: 'fixture',
    component: FixtureComponent,
    canDeactivate: [ConfirmDeactivateGuard]
  },
  {
    path: 'update-score',
    component: UpdateMatchScoreComponent,
  },
  {
    path: 'results',
    component: ResultsComponent,
  },
  {
    path: 'ranking',
    component: RankingsComponent,
  },
  {
    path: 'videos',
    component: VideosComponent,
  },
  {
    path: 'open-reg',
    component: OpenRegistrationComponent,
  }, 
  {
    path: 'schedule',
    component: NewScheduleComponent,
  },

];
@NgModule({
  declarations: [
    EventOrganizComponent,
    EventOrganizeLayoutComponent,
    EventOrgSidebarComponent,
    CreateEventComponent,
    AddPlayerComponent,
    FixtureComponent,
    ResultsComponent,
    RankingsComponent,
    EventDetailsComponent,
    LiveStreamComponent,
    RegistrationFormComponent,
    ProsGuidelinesComponent,
    RuleSettingComponent,
    PaymentMethodComponent,
    DashboardComponent,
    HistoryComponent,
    ImportPlayerComponent,
    MergeCategoryComponent,
    AddPlayersComponent,
    GroupCreationComponent,
    MatchSchedulerComponent,
    MainDrawComponent,
    MergeCategoryComponent,
    KnockoutComponent,
    RoundRobinComponent,
    GrpPlayOffComponent,
    RecentlyDeletedComponent,
    VideosComponent,
    ResultKnockoutComponent,
    ResultRRobinComponent,
    ResultGPlayOffComponent,
    LiveVideosComponent,
    StreamMatchesComponent,
    DragDropSwapDirective,
    FixSingleTreeComponent,
    FixDoubleTreeComponent,
    MatchComponent,
    DragDropFixtureComponent,
    DragDropItemDirective,
    AllotRankPointersComponent,
    GrpPlayerSwapComponent,
    UpdateScoreComponent,
    AddOfficialComponent,
    OfficialListComponent,
    RecentRemovedComponent,
    CreateOfficialComponent,
    ImportMemberDialogComponent,
    KnockoutCreationComponent,
    ResultGroupsComponent,
    AddCategoryComponent,
    NewScheduleComponent,
    SpecialFixtureComponent,
    GrpPlayOffConsolidationComponent,
    Consolation,
    UpdateMatchScoreComponent,
    ResultConsolationComponent

  ],
  imports: [
    CommonModule,
    DialogModule,
    RouterModule.forChild(routes),
    TabViewModule,
    TimelineModule,
    InputSwitchModule,
    InputTextModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    CalendarModule,
    CarouselModule,
    ToastModule,
    SidebarModule,
    TableModule,
    SkeletonModule,
    AvatarModule,
    AvatarGroupModule,
    FileUploadModule,
    TranslateModule,
    StepsModule,
    RadioButtonModule,
    TreeModule,
    AccordionModule,
    MSGrpPlayOffComponent,
    InputNumberModule,
    DayPlannerComponent,
    DividerModule,
    SharedModule,
    GifLoaderComponent,
    OverlayPanelModule,
    CommonSvgMsgComponent,
    RippleModule,
    InputMaskModule,
    ArrangeDialogComponent,
    SelectButtonModule,
    TooltipModule,
    OverlayModule,
    SpeedDialModule,
    PanelModule,
    NgxPrintModule,
    BadgeModule,
    CheckboxModule,
    SettingsComponent,
    CommonUpdateScoreComponent,
    CommonScoreComponent,
    DragDropModule,
    ScrollPanelModule,
    ToastComponent,
    PaginatorModule
    

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [ResultKnockoutComponent, ResultGPlayOffComponent, ResultRRobinComponent, StreamMatchesComponent, ResultGroupsComponent, MatchComponent, Consolation,ResultConsolationComponent],
  providers: [ConfirmDeactivateGuard]
})
export class EventOrganizeModule { }
