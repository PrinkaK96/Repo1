import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalRankComponent } from './global-rank/global-rank.component';
import { RouterModule, Routes } from '@angular/router';
import { GRankLayoutComponent } from './g-rank-layout/g-rank-layout.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';


const routes: Routes = [
  {
    path: '',
    component: GRankLayoutComponent,
  },
  {
    path: 'global-rank',
    component: GlobalRankComponent,
  }
];
@NgModule({
  declarations: [
    GlobalRankComponent,
    GRankLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    InputTextModule,
    ButtonModule,
    DialogModule,
    TabViewModule,
    TableModule,
    PaginatorModule
  ]
})
export class RankingModule { }
