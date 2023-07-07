import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AccountService } from 'src/app/services/Account/account.service';
import { AdminFooterService } from 'src/app/services/AdminFooter/admin-footer.service';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';

@Component({
  selector: 'app-main-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.scss'],
  providers: [MessageService]
})
export class MainFooterComponent implements OnInit {
  footerData: any = [];
  socialLinks: any = [];
  _fbLink: any = [];
  _twitterLink: any = [];
  _linkedInLink: any = [];
  _youTubeLink: any = [];
  _footerForm!: FormGroup;
  _setLinksArray: any = [];
  _fbValue: any = ''
  _fbShow: boolean = true;
  _startCountdown: boolean = false;
  _twitterValue: any = '';
  _linkedInValue: any = '';
  _youTubeValue: any = '';
  _twitterShow: boolean = true;
  _linkedInShow: boolean = true;
  _youtubeShow: boolean = true;
  token: any = '';
  _linkList: any = [];
  _showLoader: boolean = false;
  azureLoggerConversion: Error=new Error();
  constructor(private footerService: AdminFooterService, private accountService: AccountService, private formBuilder: FormBuilder, private messageService: MessageService,
    private azureLoggerService : MyMonitoringService ) {
    this.innerWidth = window.innerWidth;
    this.getFooter();
    this._footerForm = this.formBuilder.group({
      fbLink: new FormControl(''),
      twitterLInk: new FormControl(''),
      linkedInLink: new FormControl(''),
      youTubeLink: new FormControl(''),
      email: new FormControl('', Validators.compose([Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])),
      phone: new FormControl(''),
      otp: new FormControl()
    });
  }
  innerWidth: any;
  showFacebook: boolean = false;
  showTwitter: boolean = false;
  showLinkedin: boolean = false;
  showYoutube: boolean = false;
  _verifyEmail: boolean = false;
  timer: any='';
  activeIndex: number = 0;
  _isSubmit: boolean = false;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  ngOnInit(): void {
  }
  /*click event for every publish/unpublish checkbox */
  setCheckBox(data: any, index: any) {
    if (data.target.checked) {
      this._linkList[index].published = true;
    } else {
      this._linkList[index].published = false;
    }

  }
  /*edit event for every input*/
  editField(state: any, index: any) {
    if (!state) {
      for (let i = 0; i < this._linkList.length; i++) {
        this._linkList[i].isClicked = false;
      }
    } else {
      for (let i = 0; i < this._linkList.length; i++) {
        if (index == i) {
          this._linkList[i].isClicked = true;
        } else {
          this._linkList[i].isClicked = false;
        }
      }
    }
  }
  /*get all details for Main Footer page */
  getFooter() {
    this._showLoader = true;
    this.footerService.getFooter().subscribe({
      next: (data: any) => {
        this._showLoader = false;
        this.footerData = data.body.filter((x: any) => x.title === 'Main Footer')[0].data;
        for (let i = 0; i < this.footerData.links.length; i++) {
          const data = {
            "title": this.footerData.links[i].title,
            "url": this.footerData.links[i].url,
            "published": this.footerData.links[i].published,
            "isClicked": false
          }
          this._linkList.push(data)
        } this._footerForm.controls['phone'].setValue(this.footerData.phone);
        this._footerForm.controls['email'].setValue(this.footerData.contact);
      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg;
        this.azureLoggerService.logException(this.azureLoggerConversion);
        this._showLoader = false;
      },
      complete: () => {

      }
    })
  }
  /*update details for footer */
  updateFooter() {
    this._showLoader = true;
    const body = {
      "title": "Main Footer",
      "published": true,
      "data": {
        "logo": "https://stupaprodsguscentral.blob.core.windows.net/cbtm/Logo/fee9248831cc452c8213545da8b3a95c.png",
        "links": this._linkList,
        "contact": this._footerForm.controls['email'].value,
        "phone": this._footerForm.controls['phone'].value
      },
      "footer_id": 1

    };
    this.footerService.updateFooter(body).subscribe({

      next: (result: any) => {
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: result.body.msg,
          life: 3000,
        });
        this._showLoader = false;
      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg;
        this.azureLoggerService.logException(this.azureLoggerConversion);
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'oops!',
          detail: result.error.msg,
          life: 3000,
        });
        this._showLoader = false;
      },
      complete: () => {

      },

    })
  }
  /*Start: Email Verification and Send OTP procedure */
  verifyEmail() {

    this._isSubmit = true;
    if (this._footerForm.controls['email'].value != '' && !this._footerForm.controls['email'].hasError('pattern')) {
      this._verifyEmail = true;
      this.sendOtp();
    }
    else {
      if (this._footerForm.controls['email'].value === '') {
        this.messageService.add({
          key: 'bc',
          severity: 'warn',
          summary: '',
          detail: 'Enter email',
          life: 3000,
        });
      } else {

      }
    }
  }
  sendOtp() {
    this._showLoader = true;
    this.timer = 61;
    this._footerForm.controls['otp'].reset()
    const email = this._footerForm.controls['email'].value;
    if (this._footerForm.valid) {
      this.accountService.sendOTP(email).subscribe({
        next: (result: any) => {
          this._showLoader = false;
          this.token = result.body.token;
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
            setInterval(() => {
              if (this.timer > 0) {
                this.timer--;
              } else {
                const resend = document.getElementById('otpSender');
                resend?.classList.add('text-disabled');
              }
            }, 1000);

            this._startCountdown = true;
          }
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg;
          this.azureLoggerService.logException(this.azureLoggerConversion);
          this._showLoader = false;
          this._footerForm.controls['otp'].reset()
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
  //This Method is used for Verify OTP
  verifyOTP() {
     this._showLoader = true;
    const email = this._footerForm.controls['email'].value;
    const otp = this._footerForm.controls['otp'].value;
    const body = {
      "email": email,
      "code": otp
    }
    if (this._footerForm.controls['email'].value != '' && this._footerForm.controls['otp'].value != null) {
      this.footerService.verifyOTPAdminFooter(body, this.token).subscribe(
        (data: any) => {
          if (data.ok) {
            this._showLoader = false;
            this.messageService.add({ key: 'bc', severity: 'success', summary: 'OTP', detail: data.body.msg, life: 1000, });
            this._startCountdown = false;
            this._verifyEmail = false;
            this._footerForm.controls['otp'].reset()

          } else {
             this._showLoader = false;
             this._footerForm.controls['otp'].reset()
            this.messageService.add({
              key: 'bc', severity: 'error', summary: 'OTP', detail: data.body.msg, life: 3000,
            });
          }
        },
        (error: any) => {
          this._showLoader = false;
          this._footerForm.controls['otp'].reset()
          this.messageService.add({
            key: 'bc', severity: 'error', summary: 'OTP', detail: error.error.msg, life: 3000,
          });
        }
      )
    }
    else {
      this._showLoader = false;
      this.messageService.add({ key: 'bc', severity: 'error', summary: '', detail: 'Email and OTP should not be empty!', life: 2000, });

    }

  }
  /*End: Email verification and send OTP procedure */
}
