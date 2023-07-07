import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
})
export class PaymentMethodComponent implements OnInit {
  event: any;
  checked: boolean = true;
  paymentMethods = [
    // {
    //   paymentMethod: 'Gpay',
    //   paymentIcon: '../../../../assets/icons/svg/google-pay-icon 1.svg',
    //   flag: false,
    // },
    // {
    //   paymentMethod: 'Klarna',
    //   paymentIcon: '../../../../assets/icons/svg/klarna.svg',
    //   flag: false,
    // },
    {
      paymentMethod: 'Asaas',
      paymentIcon: '../../../../assets/icons/svg/asaas.svg',
      flag: true,
    },
    // {
    //   paymentMethod: 'Paypal',
    //   paymentIcon: '../../../../assets/icons/svg/paypal.svg',
    //   flag: false,
    // },
    // {
    //   paymentMethod: 'Stripe',
    //   paymentIcon: '../../../../assets/icons/svg/stripe.svg',
    //   flag: false,
    // },
    // {
    //   paymentMethod: 'Cashify',
    //   paymentIcon: '../../../../assets/icons/svg/cashify.svg',
    //   flag: false,
    // },
  ];
  @Output() tabIndex = new EventEmitter<number>();
  @Input() _tabIndex: any;
  constructor(private encyptDecryptService: EncyptDecryptService) {}

  ngOnInit(): void {
    this.event = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    // this.event = this.encyptDecryptService.decryptUsingAES256(
    //   sessionStorage.getItem('event_id')
    // );
  }
  ngOnChanges(changes:SimpleChanges){
    
    this.event = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    // this.event = this.encyptDecryptService.decryptUsingAES256(
    //   sessionStorage.getItem('event_id')
    // );
    
  }
  enablePayment(e: any, item: any) {
    if (e.checked == true) {
      this.paymentMethods[item].flag = true;
    } else {
      this.paymentMethods[item].flag = false;
    }
  }
  eventClicked() {
    this.tabIndex.emit();
  }
}
