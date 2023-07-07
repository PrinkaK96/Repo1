import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { TooltipModule } from 'primeng/tooltip';
import { CreateTieComponent } from './create-tie/create-tie.component';
import { SquadComponent } from './squad/squad.component';
import { UttLayoutComponent } from './utt-layout/utt-layout.component';
import { AppRoutingModule } from '../app-routing.module';



@NgModule({
  declarations: [
    CreateTieComponent,
    SquadComponent,
    UttLayoutComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    SidebarModule,
    TooltipModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UttModule { }
