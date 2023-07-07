import { CommonModule } from '@angular/common';
import { BroadcastOnlyComponent } from './broadcast-only/broadcast-only.component';
import { CreateMatchComponent } from './create-match/create-matchcomponent';
import { CommonSvgMsgComponent } from '../shared/common-svg-msg/common-svg-msg.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { InputMaskModule } from 'primeng/inputmask';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';
import { OverlayModule } from 'primeng/overlay';
import { TabViewModule } from 'primeng/tabview';
import {TournamentDetailsComponent } from './tournament-details/tournament-details.component';
import { TableModule } from 'primeng/table';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
const routes: Routes = [
  {
    path: '', component: BroadcastOnlyComponent,
    // canActivate: [AuthService]
  },
  {
    path: 'broadcast-only',
    component: BroadcastOnlyComponent,
    // canActivate: [AuthService],
  }
];
@NgModule({
  declarations: [BroadcastOnlyComponent, CreateMatchComponent, TournamentDetailsComponent],
  imports: [CommonModule,
    OverlayModule,
    TooltipModule,
    SelectButtonModule,
    DropdownModule,
    ReactiveFormsModule,
    FormsModule,
    InputMaskModule,
    RippleModule,
    ToastModule,
    TabViewModule,
    CalendarModule,
    InputTextModule,
    TableModule,
    OverlayModule,
    OverlayPanelModule,
    CommonSvgMsgComponent,
    InputNumberModule,
    InputTextareaModule,
    RouterModule.forChild(routes),],
})
export class BroadcastOnlyModule { }
