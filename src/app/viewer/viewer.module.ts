import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewerLayoutComponent } from './viewer-layout/viewer-layout.component';
import { ViewerFixturesComponent } from './viewer-fixtures/viewer-fixtures.component';
import { ViewerResultsComponent } from './viewer-results/viewer-results.component';
import { ViewerRankingsComponent } from './viewer-rankings/viewer-rankings.component';
import { ViewerVideosComponent } from './viewer-videos/viewer-videos.component';
import { ViewerProspectusComponent } from './viewer-prospectus/viewer-prospectus.component';
import { RouterModule, Routes } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventOrganizeModule } from '../event-organize/event-organize.module';
import { ViewerKnockoutComponent } from './viewer-fixtures/viewer-knockout/viewer-knockout.component';
import { ViewerGrpPlayOffComponent } from './viewer-fixtures/viewer-grp-play-off/viewer-grp-play-off.component';
import { ViewerRoundRobinComponent } from './viewer-fixtures/viewer-round-robin/viewer-round-robin.component';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AccordionModule } from 'primeng/accordion';
import { TreeModule } from 'primeng/tree';
import { PanelModule } from 'primeng/panel';
import { TimelineModule } from 'primeng/timeline';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { GifLoaderComponent } from '../shared/gif-loader/gif-loader.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { RippleModule } from 'primeng/ripple';
import { InputMaskModule } from 'primeng/inputmask';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';
import { ViewerGroupCreationComponent } from './viewer-fixtures/viewer-group-creation/viewer-group-creation.component';
import { ViewerTreeComponent } from './viewer-fixtures/viewer-knockout/viewer-tree/viewer-tree.component';
import { MyEventsComponent } from '../my-profile/my-events/my-events.component';
import { DialogModule } from 'primeng/dialog';
import { ViewerPlayerListComponent } from './viewer-player-list/viewer-player-list.component';
import { BroadcastVideosComponent } from './broadcast-videos/broadcast-videos.component';
import { BroadcastViewerResultsComponent } from './broadcast-viewer-results/broadcast-viewer-results.component';
import {NgxPrintModule} from 'ngx-print';
import { ViewerEventDetailsComponent } from './viewer-event-details/viewer-event-details.component';
import { EventDetailsComponent } from '../event-organize/create-event/event-details/event-details.component';
import { ViewerRegistrationComponent } from './viewer-registration/viewer-registration.component';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PaginatorModule } from 'primeng/paginator';

// header: 'Event Details',
// path: 'viewer/$/Event-Details'
const routes: Routes = [
  {
    path: '', component: EventDetailsComponent
  },
  {
    path: '$/Event-Details',
    component: EventDetailsComponent,
  },
  {
    path: '$/Player-list',
    component: ViewerPlayerListComponent,
  },
  {
    path: '$/fixture',
    component: ViewerFixturesComponent,
  },
  {
    path: '$/results',
    component: ViewerResultsComponent
  },
  {
    path: '$/ranking',
    component: ViewerRankingsComponent
    ,
  },
  {
    path: '$/videos',
    component: ViewerVideosComponent
  },
  {
    path: '$/prospectus',
    component: ViewerProspectusComponent
  },
  {
    path: '$/registration',
    component: ViewerRegistrationComponent
  },
  {
    path: '$/player-list',
    component: ViewerProspectusComponent
  },
  {
    path: 'account/my-details/my-event',
    component: MyEventsComponent
  }
];


@NgModule({
  declarations: [
    ViewerLayoutComponent,
    ViewerFixturesComponent,
    ViewerResultsComponent,
    ViewerRankingsComponent,
    ViewerVideosComponent,
    ViewerProspectusComponent,
    ViewerKnockoutComponent,
    ViewerGrpPlayOffComponent,
    ViewerRoundRobinComponent,
    ViewerGroupCreationComponent,
    ViewerTreeComponent,
    ViewerPlayerListComponent,
    BroadcastVideosComponent,
    BroadcastViewerResultsComponent,
    ViewerEventDetailsComponent,
    ViewerRegistrationComponent
    
    
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RadioButtonModule,
    TabViewModule,
    RouterModule.forChild(routes),
    EventOrganizeModule,
    DropdownModule,
    TableModule,
    InputTextModule,
    PdfViewerModule,
    AccordionModule,
    TreeModule,
    TimelineModule,
    StepsModule,
    ToastModule,
    InputSwitchModule,
    InputTextModule,
    DropdownModule,
    SkeletonModule,
    AvatarModule,
    AvatarGroupModule,
    InputNumberModule,
    DividerModule,
    GifLoaderComponent,
    OverlayPanelModule,
    RippleModule,
    InputMaskModule,
    SelectButtonModule,
    TooltipModule,
    DialogModule,
    PanelModule,
    NgxPrintModule,
    ScrollPanelModule,
    PaginatorModule
  ],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ViewerModule { }
