import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { MessageService } from 'primeng/api';
import { PlayerServiceService } from 'src/app/services/player/player-service.service';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
@Component({
  selector: 'stupa-order-history',
  standalone: false,
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
  providers: [MessageService],
})
export class OrderHistoryComponent {
  isInvoice: boolean = false;

  _skeleton: boolean = false;
  id = [1, 2, 3]
  tables = [1, 2, 3, 1, 1, 1, 1]
  _showLoader: boolean = false;
  _eventList: any = [
  ];
  _showRegisered: boolean = false;
  _eventId: number = 0;
  _currenAcceptedPage: number = 1;
  _showDetailsonIcon: any = [];
  _totalAcceptedUser: any = [];
  azureLoggerConversion: any = new Error();
  _tabIndex = 0;


  first = 0;
  _showInvoice:boolean = false;
  // invoiceArray = [
  //   {
  //     "invoiceNO": 1223,
  //     "d": new Date().toLocaleDateString(),
  //     "userName": "Pinnacle Sports",
  //     "address": "asdfsadf",
  //     "Discription": [{
  //       "Eventname": "Master Cup",
  //       "participantName": "govind singh",
  //       "Amount": 200

  //     },
  //     {
  //       "Eventname": "IPL ",
  //       "participantName": "asdf ",
  //       "Amount": 4000

  //     }]

  //   }
  // ]
  _invoiceData:any =[];

  constructor(
    private eventService: EventsService,
    private encyptDecryptService: EncyptDecryptService, private azureLoggerService: MyMonitoringService,
    public router: Router, private playerService: PlayerServiceService, private messageService: MessageService
  ) {

  }
  ngOnInit() {

    this._eventId = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this.getOrderHistoryDetails()
  }


  //#region to show details of player participated in which category
  showDialog(event_details: any) {
    this._showRegisered = true;
    this._showDetailsonIcon = event_details;
  }
  //#endregion to show details of player participated in which category

  //#region to navigate back to home
  goBack() {
    this.router.navigateByUrl('/home');
  }
  //#endregion to navigate back to home

  //#region this method is used to fetch order history details of the players that have registered and pay through reg-open section
  getOrderHistoryDetails() {
    this._showLoader = true;
    this.playerService.getOrderHistory(this._currenAcceptedPage)
      .subscribe({
        next: (result: any) => {
          this._showLoader = false;
          this._eventList = result.body[1];
          this._totalAcceptedUser = result.body[0];

        },
        error: (result: any) => {
          this._showLoader = false;
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'Error',
            detail: result.error.msg,
            life: 3000,
          });
        },
        complete: () => { },
      });

  }
  //#endregion this method is used to fetch order history details of the players that have registered and pay through reg-open section

  //#region get paginated requests of order-history
  paginate(event: any) {
    this.first = event.first;
    this._currenAcceptedPage = event.page + 1;
    this.getOrderHistoryDetails();
  }
  //#endregion get paginated requests of order-history
//#region Method to show Invoice pop-up along with data of particular row
  showInvoice(event:any){
    this._showInvoice=true;
    this._invoiceData=[];
    this._invoiceData.push(event);
  }
  //#endregion Method to show Invoice pop-up along with data of particular row
}
