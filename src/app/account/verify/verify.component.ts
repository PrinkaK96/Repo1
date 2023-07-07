import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { AccountService } from 'src/app/services/Account/account.service';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
  providers: [MessageService]
})
export class VerifyComponent implements OnInit {
  //Here we are declariong Variables
  activeIndex: number = 1;
  startCountdown: boolean = false;
  countdown: any;
  timer = 60;
  intervalId: number = 0;
  @Input() _signUpFormData: any = [];
  @Input() _finalSignUpFormData: any = [];
  @Input() _userEmail: any = 'amittester@yopmail.com';
  @Input() _userPassword: any = [];
  @Input() _userGender: any;
  @Input() _currentRoleId: any;
  @Input() _stateId: any;
  @Input() _countryId: any;
  @Input() _fullName: any;
  @Input() _parentId: any;
  _currentOTP: any = '';
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  config = {
    allowNumbersOnly: false,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '17%',
      'height': '50px'
    }
  };
  _startCountdown: boolean = false;
  azureLoggerConversion: any= new Error();
  constructor(private accountService: AccountService, private route: Router, private primengConfig: PrimeNGConfig, private messageService: MessageService,
    private azureLoggerService : MyMonitoringService) {
    this.primengConfig.ripple = true;
    this.sendOtp();
  }
  ngOnInit(): void {
  }
  ngOnDestroy() { clearInterval(this.intervalId); }
  //This Method is used for send OTP
  sendOtp() {
    if (localStorage.getItem('UserEmail') !== null && localStorage.getItem('UserEmail') !== undefined) {
      clearInterval(this.intervalId);
      this.timer = 60;
      this.accountService.sendOTP(localStorage.getItem('UserEmail')?.toLocaleLowerCase()).subscribe(
        {
          next: (result: any) => {
            this.messageService.add({ key: 'bc', severity: 'success', summary: 'OTP', detail: result.body.msg, life: 3000, });
            localStorage.setItem('tokenForVerify', result.body.token)
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
          },
          error: (result) => {
            this.azureLoggerConversion = result.error.msg
            this.azureLoggerService.logException(this.azureLoggerConversion)
            this.messageService.add({
              key: 'bc', severity: 'error', summary: 'OTP', detail: result.error.msg, life: 3000,
            });
          },
          complete: () => { }
        }
      )
    }

  }
  //This Method is used for Verify OTP
  verifyOTP() {
    if (this._currentOTP == '') {
      this.messageService.add({ key: 'bc', severity: 'error', summary: 'Fail', detail: 'Enter OTP', life: 2000, });
    } else {
      const body = {
        "email": this._userEmail.toLocaleLowerCase(),
        "code": this._currentOTP
      }
      this.accountService.verifyOTP(body).subscribe(
        {
          next: (result: any) => {
            localStorage.removeItem('tokenForVerify');
            localStorage.setItem('tokenForSignUp', result.body.token)
            this.messageService.add({ key: 'bc', severity: 'success', summary: 'OTP', detail: result.body.msg, life: 1000, });
            this._finalSignUpFormData = [];
            for (let item = 0; item < this._signUpFormData.length; item++) {
              if (this._signUpFormData[item].field_id == '00') {
              } else {
                this._finalSignUpFormData.push(this._signUpFormData[item])
              }
            }
            const body = {
              "user": {
                "email": this._userEmail.toLocaleLowerCase(),
                "password": this._userPassword,
                "name": this._fullName,
                "parent_id": this._parentId,
                "gender_id": this._userGender == null || this._userGender == '' ? 0 : this._userGender,
                "country_id": this._countryId == '' ? 30 : this._countryId,
                "state_id": this._stateId == undefined ? 0 : this._stateId
              },
              "role_id": this._currentRoleId,
              "role_fields": this._finalSignUpFormData
            }
            this.accountService.signUpSubmit(body).subscribe(
              {
                next: (result: any) => {
                  // this.messageService.add({ key: 'bc', severity: 'success', summary: 'success', detail: result.body.msg, life: 1000, });
                  localStorage.removeItem('tokenForSignUp');
                  setTimeout(() => {
                    this.route.navigate(['/account/login']);
                  }, 1000);
                },
                error: (result) => {
                  this.messageService.add({
                    key: 'bc', severity: 'error', summary: 'Error', detail: result.error.msg, life: 3000,
                  });
                },
                complete: () => { }
              }
            )
          },
          error: (result) => {
            this.azureLoggerConversion = result.error.msg
            this.azureLoggerService.logException(this.azureLoggerConversion)
            this.messageService.add({
              key: 'bc', severity: 'error', summary: 'OTP', detail: result.error.msg, life: 3000,
            });
          },
          complete: () => { }
        }

      )
    }

  }
  //With this method we are getting current OTP
  onOtpChange(otp: any) {
    this._currentOTP = otp;
  }
  changeMail() {
    this._userEmail = '';
  }
}
