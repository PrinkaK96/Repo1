import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebViewComponent } from './web-view/web-view.component';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';



@NgModule({
  declarations: [
    WebViewComponent
  ],
  imports: [
    CommonModule,
    AvatarModule,
    DividerModule,
  ]
})
export class IosWebViewModule { }
