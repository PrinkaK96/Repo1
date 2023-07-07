import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MembershipService } from 'src/app/services/MemberShip/membership.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
@Component({
  selector: 'stupa-member-ships',
  templateUrl: './member-ships.component.html',
  styleUrls: ['./member-ships.component.scss'],
  providers: [MessageService, ConfirmationDialogService]
})
export class MemberShipsComponent implements OnInit {
  //#region Variable Declaration Start
  _memberStatus: string | null = '';
  _memberShipListP: any = "";
  _memberShipList: any = [];
  _monthlyList: any = [];
  _yearlyList: any = [];
  _isMonthly: boolean = false;
  token_id: any;
  _responseData: any = [];
  _payment: any;
  intervalId: any;
  _upgrade: boolean = true;
  _exploreMem: boolean = false;
  _showLoader: boolean = false;
  _showDialog: boolean = false;
  isPopupClosed: boolean = false;
  azureLoggerConversion: any = new Error();
  _showPaymentGateways: boolean = false;
  _paymentGatewaysList: any = [{
    id: 1,
    name: 'Paypal',
    // logo: 'https://stupaprodsguscentral.blob.core.windows.net/cbtm/UserProfile/21/Paypallog.png',
    logo: 'https://stupaprodsguscentral.blob.core.windows.net/cbtm/UserProfile/21/Frame%201779%20%281%29.png',
    isActive: false
  },
  {
    id: 2,
    name: 'Cash Free',
    // logo: 'https://stupaprodsguscentral.blob.core.windows.net/cbtm/UserProfile/21/CashFreeLogo.jpg',
    logo: 'https://stupaprodsguscentral.blob.core.windows.net/cbtm/UserProfile/21/Frame%201780.png',
    isActive: false
  },
    // {
    //   id: 3,
    //   name: 'Asaas',
    //   logo: 'https://stupaprodsguscentral.blob.core.windows.net/cbtm/UserProfile/21/AsaasLogo.png',
    //   isActive: false
    // }, {
    //   id: 4,
    //   name: 'Paytm',
    //   logo: 'https://stupaprodsguscentral.blob.core.windows.net/cbtm/UserProfile/21/paytm6482.jpg',
    //   isActive: false
    // },
    // {
    //   id: 5,
    //   name: 'Google Pay',
    //   logo: 'https://stupaprodsguscentral.blob.core.windows.net/cbtm/UserProfile/21/GooglePay.png',
    //   isActive: false
    // },
    // {
    //   id: 6,
    //   name: 'Stripe',
    //   logo: 'https://stupaprodsguscentral.blob.core.windows.net/cbtm/UserProfile/21/StripePaymentLogo.png',
    //   isActive: false
    // }, {
    //   id: 7,
    //   name: 'Amazon Pay',
    //   logo: 'https://stupaprodsguscentral.blob.core.windows.net/cbtm/UserProfile/21/AmzonPaymentLogo.png',
    //   isActive: false
    // },
    // {
    //   id: 8,
    //   name: 'Phone Pay',
    //   logo: 'https://stupaprodsguscentral.blob.core.windows.net/cbtm/UserProfile/21/Phonepaylog.png',
    //   isActive: false
    // },
    // {
    //   id: 9,
    //   name: 'Asaas',
    //   logo: 'https://stupaprodsguscentral.blob.core.windows.net/cbtm/UserProfile/21/AsaasLogo.png',
    //   isActive: false
    // }
  ]
  _paymentId: any = '';
  _memberShipFullDetails: any;
  _buyMemberShip: any;
  _paybleAmount: any;
  _offlinePaymentDone: boolean = false;
  _onlinePaymentDone: boolean = true;
  s: string = "";
  //#endregion Variable Declaration Start
  constructor(private membershipService: MembershipService, private route: Router, private messageService: MessageService, private confirmationDialogService: ConfirmationDialogService, private azureLoggerService: MyMonitoringService,) {

    this._memberStatus = localStorage.getItem('memberStatus'); //, 'YES')
    if (this._memberStatus == 'YES') {

    }
    this.getAssociatedMembership();

  }

  ngOnInit() {


  }
  //#region get current Membership Plan
  getAssociatedMembership() {
    this._showLoader = true;
    this.membershipService.getUserMembership().subscribe({
      next: (result: any) => {
        this._showLoader = false;
        this._memberShipListP = result.body;


        if (Object.keys(this._memberShipListP.user).length === 0) {
          // this._upgrade = true;

          this._exploreMem = true;

        }
        else {
          //this._upgrade = false;
          this._exploreMem = false
        }
      },
      error: (result: any) => {
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => {

      }
    })
  }
  //#endregion get current Membership Plan

  //#region get all memberships except current
  getMemberShip() {
    this._showLoader = true;
    this.token_id = localStorage.getItem('reqToken')
    if (this.token_id !== undefined && this.token_id !== null) {
      const responseData = JSON.parse(
        atob(this.token_id.split('.')[1])
      );
      this._responseData.push(responseData);
      this.membershipService.getUserMembership().subscribe({
        next: (result: any) => {
          this._showLoader = false;
          this._memberShipList = result.body.available;
          this._monthlyList = this._memberShipList.filter((x: any) => (x.data.duration == 1 || x.data.duration == 0) && x.published);
          this._yearlyList = this._memberShipList.filter((x: any) => x.data.duration !== 1 && x.data.duration !== 0 && x.published);
          if (this._monthlyList.length > 0) {
            this._isMonthly = false;
          }
          else {
            this._isMonthly = true;
          }
        },
        error: (result: any) => {
          this._showLoader = false;
          this._yearlyList = [];
          this._monthlyList = [];
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => {

        }
      })
    }

  }
  //#endregion get all memberships except current


  //#region purchase membership
  buyMemberShip() {
    if(this.s == 'offline'){  
        const body = {
          "membership_id": this._memberShipFullDetails.membership_id
        }
        this.membershipService.patchMembership(this._memberShipFullDetails.membership_id,3).subscribe({
    
          next: (result: any) => {
            //this._payment = window.open(result.body.payment_url, '', 'width=900,height=900,left=200,top=200');
            this.hidePaymentgatway();
            this.getMembershipStatus();
          },
          error: (result: any) => {
            this.azureLoggerConversion = result.error.msg
            this.azureLoggerService.logException(this.azureLoggerConversion)
          },
          complete: () => {
    
          }
        })
  }
  else{
    if (this._paymentId !== undefined && this._paymentId !== '' && this._paymentId !== null) {
      const body = {
        "membership_id": this._memberShipFullDetails.membership_id
      }
      this.membershipService.patchMembership(this._memberShipFullDetails.membership_id,this._paymentId).subscribe({
  
        next: (result: any) => {
          this._payment = window.open(result.body.payment_url, '', 'width=900,height=900,left=200,top=200');
          this.hidePaymentgatway();
          this.getMembershipStatus();
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => {
  
        }
      })
    } else {
      this._showLoader = false;
      this.messageService.add({
        key: 'bc', severity: 'info', summary: 'Information', detail: 'Kindly Select Payment Method', life: 6000,
      });
    }
  }
  }
  //#endregion purchase membership

  //#region redirect after few intervals to know if membership have been purchased
  getMembershipStatus() {
    this.intervalId = setInterval(() => {
      if (this._payment.closed) {
        clearInterval(this.intervalId)
        this.getUserMembership()
      }

    }, 3000);
  }
  //#endregion redirect after few intervals to know if membership have been purchased

  //#region know if membership have been purchased
  getUserMembership() {
    // this._showLoader = true
    this.membershipService.getUserMembership().subscribe({
      next: (result: any) => {
        this._showLoader = false;

        if (result.body != null) {
          //this._upgrade = true;

          // this.messageService.add({
          //   key: 'bc',
          //   severity: 'success ',
          //   summary: 'success!',
          //   detail: 'Your payment will be processed in next 2 working days.',
          //   life: 8000,
          // });
          // this.getAssociatedMembership()

        }
        else {
          this.messageService.add({
            key: 'bc',
            severity: 'info',
            summary: 'Info!',
            detail: 'Purchase membership to get access to associated features.',
            life: 3000,
          });
        }
      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => {

      }
    })
  }
  //#endregion know if membership have been purchased
  back() {

  }
  //#region upgrade button click
  upgrade() {
    this._upgrade = false;
    this._exploreMem = false
    this.getMemberShip()
  }
  //#endregion upgrade button click

  checkUserMembershipStatus(membershipdetails: any) {
    this.membershipService.checkUserMembershipStatus().subscribe({
      next: (result: any) => {
        this._memberShipFullDetails = membershipdetails;
        this._paybleAmount = membershipdetails.data.base_amount;
        this._showPaymentGateways = true;
        if (result.body.msg == 'Pending') {
          this.showConfirmationDialogue();
        }
        else {
        }
      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => {

      }
    })
  }
  showConfirmationDialogue() {
    this.confirmationDialogService
      .confirm(
        'Please confirm..',
        'Are you sure , you want to proceed because status of last purchase is pending , new purchase will result in overriding of last purchase.'
      )
      .then((confirmed) => {
        if (confirmed) {
          this._showLoader = true;
          this._showPaymentGateways = true;
        } else {
        }
      })
      .catch(() => { });
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: any) {
    if (event.target.location.href.indexOf('your-assas-payment-link-url') !== -1) {
      this.isPopupClosed = true;
    }
  }
  //#region method is used for show payment popup with multiple payment gateways
  showPaymentgatway() {
    this._showPaymentGateways = false;
    this._showPaymentGateways = true;
  }
  //#endregion method is used for show payment popup with multiple payment gateways
  //#region  method is used for set active payment method 
  selectPaymentGateway(index: any) {
    this._paymentId = '';
    for (let i = 0; i < this._paymentGatewaysList.length; i++) {
      if (i == index) {
        this._paymentId = this._paymentGatewaysList[i].id
        this._paymentGatewaysList[i].isActive = true;
      } else {
        this._paymentGatewaysList[i].isActive = false;
      }
    }
  }
  //#endregion method is used for set active payment method 
  //#region method is used for hide payment methods popup
  hidePaymentgatway() {
    this._showPaymentGateways = false;
    this._paymentId = '';
    for (let i = 0; i < this._paymentGatewaysList.length; i++) {
      this._paymentGatewaysList[i].isActive = false;
    }
  }
  //#endregion  method is used for hide payment methods popup
  payNow(_buyMemberShip: any) {
    this._memberShipFullDetails = _buyMemberShip;
    this._paybleAmount = _buyMemberShip.data.base_amount
    this._showPaymentGateways = true;
  }
  radiochange(e: any) {
    this.s = e.target.value;
    
    if(this.s == "online"){
      this._onlinePaymentDone = true;
      this._offlinePaymentDone = false;
    }
    else if(this.s == "offline"){
      this._offlinePaymentDone = true
      this._onlinePaymentDone = false
    }
    else{
      alert("nothing is selected")
    }
  }
}
