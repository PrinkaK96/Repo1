import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountLayoutComponent } from './account/account-layout/account-layout.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { BroadcastOnlyComponent } from './broadcast-only/broadcast-only/broadcast-only.component';
import { EventOrganizeLayoutComponent } from './event-organize/event-organize-layout/event-organize-layout.component';
import { LayoutComponent } from './layout/layout.component';
import { MyProfileLayoutComponent } from './my-profile/my-profile-layout/my-profile-layout.component';
import { RequestsComponent } from './shared/requests/requests.component';
import { ViewerLayoutComponent } from './viewer/viewer-layout/viewer-layout.component';
import { WebViewComponent } from './ios-web-view/web-view/web-view.component';
import { UttLayoutComponent } from './utt/utt-layout/utt-layout.component';
import { NewScheduleComponent } from './event-organize/new-schedule/new-schedule.component';

const routes: Routes = [
  { path: '', redirectTo: "home", pathMatch: 'full' },
  {
    path: '', component: LayoutComponent,
    children: [
      { path: 'home', loadChildren: () => import('./landpage/home.module').then(m => m.HomeModule) },
      // { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
      // { path: 'broadcast', data: { preload: true, loadAfterSeconds: 5 }, loadChildren: () => import('./broadcast-only/broadcast-only.module').then(m => m.BroadcastOnlyModule) },
      // { path: 'event-organize', data: { preload: true, loadAfterSeconds: 5 }, loadChildren: () => import('./event-organize/event-organize.module').then(m => m.EventOrganizeModule) },
      // { path: 'admin', data: { preload: true, loadAfterSeconds: 5 }, loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
      { path: 'tournament', data: { preload: true, loadAfterSeconds: 5 }, loadChildren: () => import('./tournaments/tournaments.module').then(m => m.TournamentsModule) },
      { path: 'live-matches', loadChildren: () => import('./live-matches/live-matches.module').then(m => m.LiveMatchesModule) },
      {
        path: 'account', component: MyProfileLayoutComponent,
        children: [{
          path: 'my-details',
          loadChildren: () => import('./my-profile/my-profile.module').then(m => m.MyProfileModule)
        }]
      },
      { path: 'registration', data: { preload: true, loadAfterSeconds: 5 }, loadChildren: () => import('./registration/registration.module').then(m => m.RegistrationModule) },
      { path: 'profile-menu', data: { preload: true, loadAfterSeconds: 5 }, loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'broadcasting', loadChildren: () => import('./broadcast-only/broadcast-only.module').then(m => m.BroadcastOnlyModule) },
      { path: 'ranking', loadChildren: () => import('./ranking/ranking.module').then(m => m.RankingModule) },
     ]
  },
  {
    path: '', component: AdminLayoutComponent,

    children: [
      { path: '', redirectTo: "admin", pathMatch: 'full' },
      { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
    ]
  },
  {
    path: '', component: ViewerLayoutComponent,

    children: [
      { path: '', redirectTo: "viewer", pathMatch: 'full' },
      { path: 'viewer', loadChildren: () => import('./viewer/viewer.module').then(m => m.ViewerModule) },
    ]
  },
  {
    path: '', component: AccountLayoutComponent,

    children: [
      { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
    ]
  },
  {
    path: '', component: EventOrganizeLayoutComponent,

    children: [
      { path: 'event', loadChildren: () => import('./event-organize/event-organize.module').then(m => m.EventOrganizeModule) },
    ]
  },
  // {
  //   path: '', component: BroadcastOnlyComponent,

  //   children: [
  //     { path: 'broadcasting', loadChildren: () => import('./broadcast-only/broadcast-only.module').then(m => m.BroadcastOnlyModule) },
  //   ]
  // },
  {
    path: 'requests',
    component: RequestsComponent,
    //canActivate: [AuthService],
  },
  {
    path: 'schedule',
    component: NewScheduleComponent,
    //canActivate: [AuthService],
  },
  {
    path: '', component: WebViewComponent,

    children: [
      { path: 'web-view/:eventId/:matchId', loadChildren: () => import('./ios-web-view/ios-web-view.module').then(m => m.IosWebViewModule) },
    ]
  },
  {
    path: 'utt', component: UttLayoutComponent,

    children: [
      { path: 'utt', loadChildren: () => import('./utt/utt.module').then(m => m.UttModule) },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
