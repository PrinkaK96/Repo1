import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './confirmation-dialog/confirmation-dialog.service';
import { RequestsComponent } from './requests/requests.component';
import { UserDetailsComponent } from './requests/user-details/user-details.component';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { RegisteredComponent } from './order-history/registered/registered.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { AvatarModule } from 'primeng/avatar';
import { SocialShareComponent } from './social-share/social-share.component';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { SuccessPageComponent } from './common/success-page/success-page.component';
import { SkeletonModule } from 'primeng/skeleton';
import { CarouselModule } from 'ngx-owl-carousel-o';
import {NgxPrintModule} from 'ngx-print';
import { PreventCharDirective } from './preventChars/prevent-char.directive';
// import { ShareIconsModule } from 'ngx-sharebuttons/icons';
@NgModule({
  declarations: [
    ConfirmationDialogComponent,
    RequestsComponent,
    UserDetailsComponent,
    RegisteredComponent,
    OrderHistoryComponent,
    SocialShareComponent,
    SuccessPageComponent,
    PreventCharDirective,
  ],
  imports: [
    CommonModule,
    TabViewModule,
    CommonModule,
    DialogModule,
    //RouterModule.forChild(routes),
    ToastModule,
    RippleModule,
    TableModule,
    InputTextareaModule,
    InputTextModule,
    FormsModule,
    TranslateModule,
    ButtonModule,
    PaginatorModule,
    OverlayPanelModule,
    AvatarModule,
    ShareButtonsModule,
    SkeletonModule,
    CarouselModule,
    NgxPrintModule
    // ShareIconsModule
    // AdminModule
  ],
  entryComponents: [ConfirmationDialogComponent],
  providers: [ConfirmationDialogService],
  exports: [RequestsComponent,SocialShareComponent,PreventCharDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
