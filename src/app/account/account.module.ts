import { forwardRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RouterModule, Routes } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { StepsModule } from 'primeng/steps';
import { TranslateModule } from '@ngx-translate/core';
import { ToastModule } from 'primeng/toast';
import {RippleModule} from 'primeng/ripple';
import { VerifyComponent } from './verify/verify.component';
import { AccountLayoutComponent } from './account-layout/account-layout.component';
import { NgOtpInputModule } from 'ng-otp-input';
import {TooltipModule} from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import {PasswordModule} from 'primeng/password';
import { DividerModule } from 'primeng/divider';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignUpComponent,
  }, {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'verify',
    component: VerifyComponent,
  },
];

@NgModule({
  declarations: [LoginComponent, SignUpComponent, ForgotPasswordComponent, VerifyComponent, AccountLayoutComponent],
  imports: [
    ReactiveFormsModule,
    TooltipModule,
    StepsModule,
    FormsModule,
    CommonModule,
    DropdownModule,
    InputNumberModule,
    InputTextModule,
    CheckboxModule,
    RouterModule.forChild(routes),
    RadioButtonModule,
    TranslateModule.forChild(),
    ToastModule,
    RippleModule,
    NgOtpInputModule,
    CalendarModule,
    PasswordModule,
    DividerModule
  ],
  providers: [RadioButtonModule],
})
export class AccountModule { }
