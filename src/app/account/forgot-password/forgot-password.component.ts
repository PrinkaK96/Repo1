import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { AccountService } from 'src/app/services/Account/account.service';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [MessageService],
})
export class ForgotPasswordComponent implements OnInit {
  //Declaring Variables
  items: MenuItem[] = [
    {
      label: 'Sent OTP',
      command: (event: any) => {
        this.activeIndex = 0;
      },
    },
    {
      label: 'Verify OTP',
      command: (event: any) => {
        this.activeIndex = 1;
      },
    },
    {
      label: 'Change Password',
      command: (event: any) => {
        this.activeIndex = 2;
      },
    },
  ];
  activeIndex: number = 0;
  sendotp: boolean = true;
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  config = {
    allowNumbersOnly: false,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '17%',
      height: '40px',
    },
  };
  _currentOTP: any = '';
  _userEmail: any = '';
  _startCountdown: boolean = false;
  countdown: any;
  timer: any = '';
  _forgotForm!: FormGroup;
  _isSubmit: boolean = false;
  _setDisabled: boolean = true;
  _currentTime: any;
  intervalId: number = 0;
  azureLoggerConversion: any = new Error();
  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private route: Router,
    private messageService: MessageService,
    private azureLoggerService: MyMonitoringService
  ) {
    this._forgotForm = this.formBuilder.group({
      email: new FormControl(
        '',
        [Validators.required, Validators.email]
      ),
      password: new FormControl(''),
      confirmPassword: new FormControl(''),
    });
  }
  // email: new FormControl(
  //   '',
  //   Validators.compose([
  //     Validators.required,
  //     Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
  //   ])
  // ),
  showPassword(data: any) {
    const type = data.type === 'password' ? 'text' : 'password';
    const eye = document.querySelector('#eye');
    if (data.type === "text" || data.type === "password") {
      data.type = type;
      eye?.classList.toggle('pi-eye');
    }
    // data.type = type;
    // eye?.classList.toggle('pi-eye-slash');
  }
  checkIndex(data: any) { }
  ngOnInit(): void { }
  //For Getting Current OTP
  onOtpChange(otp: any) {
    this._currentOTP = otp;
  }
  ngOnDestroy() { clearInterval(this.intervalId); }
  goBack(event: any) {
    event.preventDefault();
    this.route.navigate(['/account/login']);
  }
  //With method is used for Send OTP
  sendOtp() {
    clearInterval(this.intervalId);
    this._isSubmit = true;
    this.timer = 60;
    //if (this._forgotForm.controls['email'].hasError('pattern'))
    if (this._forgotForm.valid) {
      this.accountService
        .forgotPassword(this._forgotForm.controls['email'].value.toLocaleLowerCase())
        .subscribe({
          next: (result: any) => {
            localStorage.setItem('tokenForVerify', result.body.token);
            this.activeIndex = 1;
            this.messageService.add({
              key: 'bc',
              severity: 'success',
              summary: 'OTP',
              detail: result.body.msg,
              life: 3000,
            });
            if (this.timer > 0) {
              const resend = document.getElementById('otpSender');
              resend?.classList.add('text-disabled');
              this.intervalId = window.setInterval(() => {
                if (this.timer > 0) {
                  this.timer -= 1;
                } else {
                  const resend = document.getElementById('otpSender');
                  resend?.classList.add('text-disabled');
                }
              }, 1000);

              this._startCountdown = true;
            }
            // setInterval(() => {
            //   // if (this.timer > 0) {
            //   //   const resend = document.getElementById('otpSender')
            //   //   resend?.classList.add('text-disabled')

            //   //   this.timer--;

            //   //   this._startCountdown = true;
            //   // }
            // }, 1000);
          },
          error: (result: any) => {
            this.azureLoggerConversion = result.error.msg
            this.azureLoggerService.logException(this.azureLoggerConversion)

            this.messageService.add({
              key: 'bc',
              severity: 'error',
              summary: 'Fail',
              detail: result.error.msg,
              life: 3000,
            });
          },
          complete: () => { },
        });
    }
  }
  //This method is used for verify OTP
  verifyOTP() {
    this._isSubmit = true;
    const body = {
      email: this._forgotForm.controls['email'].value,
      code: this._currentOTP,
    };
    this.accountService.verifyOTP(body).subscribe({
      next: (result: any) => {
        localStorage.removeItem('tokenForVerify');
        localStorage.setItem('tokenForChangePassword', result.body.token);
        // this._forgotForm.controls['password'].setValidators(
        //   Validators.required
        // );
        this._forgotForm.controls['password'].updateValueAndValidity();
        this.activeIndex = 2;
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'OTP',
          detail: result.body.msg,
          life: 3000,
        });
      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'OTP',
          detail: result.error.msg,
          life: 3000,
        });
      },
      complete: () => { },
    });
  }
  //This method is used for change password
  changePassword() {
    this._forgotForm.controls['password'].setValidators(
      Validators.required
    );
    if (this.activeIndex === 2) {
      this._forgotForm.controls['password'].addValidators([Validators.minLength(8), Validators.required,
      Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)]);
      this._forgotForm.controls['password'].updateValueAndValidity();
    }
    if (this._forgotForm.valid) {
      if (
        this._forgotForm.controls['password'].value == this._forgotForm.controls['confirmPassword'].value) {
        const body = {
          password: this._forgotForm.controls['password'].value,
          email: this._forgotForm.controls['email'].value,
        };
        this.accountService.changePassword(body).subscribe({
          next: (result: any) => {
            this.messageService.add({
              key: 'bc',
              severity: 'success',
              summary: 'Password changed successfully',
              detail: result.body.msg,
              life: 3000,
            });
            setTimeout(() => {
              this.route.navigate(['/account/login']);
            }, 3000);
          },
          error: (result: any) => {
            this.azureLoggerConversion = result.error.msg
            this.azureLoggerService.logException(this.azureLoggerConversion)
            this.messageService.add({
              key: 'bc',
              severity: 'error',
              summary: 'OTP',
              detail: result.error.msg,
              life: 3000,
            });
          },
          complete: () => {

          },
        });
      } else {
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Password Not Matched',
          detail: 'New password and confirm password not matched',
          life: 3000,
        });
      }
    }
  }
  changeMail() {
    this._forgotForm.controls['email'].setValue('');
    this.activeIndex = 0;
  }
  checkDesign() {
  }
}
