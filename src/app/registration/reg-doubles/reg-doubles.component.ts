import { Component, HostListener, Input } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { CommonApiService } from 'src/app/services/Common/common-api.service';
import { DashboardService } from 'src/app/services/Dashboard/dashboard.service';
import { ProfileLettersService } from 'src/app/services/ProfileLetters/profile-letters.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'stupa-reg-doubles',
  templateUrl: './reg-doubles.component.html',
  styleUrls: ['./reg-doubles.component.scss'],
})
export class RegDoublesComponent {
  //#region Variable
  _skeleton: boolean = false;
  _playerArray: any = [{}, {}];
  _teams: any = [];
  _dummyList: any;
  _players: any = [];
  _playersCopy: any = [];
  _playerInCategories: any = [];
  _selectedPlayerList: any = [];
  _participantList: any = [];
  _categoriesList: any = [];
  _categoriesListFinal: any = [];
  _selectedCategoryList: any = [];
  _totalAmount: any = 0;
  _showLoader: boolean = false;
  _teamPlayerList: any = [];
  @Input() _participant_Id: any
  @Input() categories: any = [];
  @Input() _eventId!: number;
  _searchTeams: any = '';
  _payment: any = '';
  intervalID: any;
  length: any = [];
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
  _eventSlider: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    margin: 5,
    autoWidth: true,
    navSpeed: 700,
    navText: [
      '<i class="pi pi-chevron-left"></i>',
      '<i class="pi pi-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      180: {
        items: 2,
      },
      360: {
        items: 3,
      },
      540: {
        items: 4,
      },
      720: {
        items: 5,
      }
    },
    nav: true,
  };
  innerWidth: any
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  _offlinePaymentDone: boolean = false;
  _onlinePaymentDone: boolean = true;
  s: string = "";
  constructor(private dashboardService: DashboardService, private eventService: EventsService, private azureLoggerService: MyMonitoringService,
    private messageService: MessageService, private profileLettersService: ProfileLettersService, private commonApiService: CommonApiService) {
    this.innerWidth = window.innerWidth;

  }
  ngOnInit(): void {
    this.getDoubleList();
  }
  //#region With This method we are able to select or de-select checkbox
  currentEvent(eventDetails: any, index: any, catIndex: any) {
    if (eventDetails.target.checked) {
      const data = {
        "participant_name": this._players[index].player_name,
        "ref_id": this._players[index].player_id,
        "state": this._players[index].state,
        "club": this._players[index].club,
        "email": this._players[index].email,
        "category_id": this._players[index].categories_list[catIndex].categoryId + this._players[index].GUID,
        "cat_Id": this._players[index].categories_list[catIndex].categoryId,
        "playerList": this._players[index].playerList,
        "team_id": this._players[index].team_id,
        "rating": this._players[index].rating,
        "age": this._players[index].age,
        "gender_id": this._players[index].gender_id
      }
      this._selectedPlayerList.push(data)
      this._players[index].eventAmount = this._players[index].eventAmount + this._players[index].categories_list[catIndex].price;
      this._players[index].isChecked = true;
      this._players[index].categories_list[catIndex].isSelected = true;
      this._totalAmount = this._totalAmount + this._players[index].categories_list[catIndex].price;
      this.length = Array.from(new Set(this._selectedPlayerList.map((r: any) => r.participant_name)));
    } else {
      if (this._selectedPlayerList.findIndex((x: any) => x.category_id == this._players[index].categories_list[catIndex].categoryId + this._players[index].GUID) !== -1) {
        this._selectedPlayerList.splice(this._selectedPlayerList.findIndex((x: any) => x.category_id == this._players[index].categories_list[catIndex].categoryId + this._players[index].GUID), 1)
      }
      this._players[index].eventAmount = this._players[index].eventAmount - this._players[index].categories_list[catIndex].price;
      this._players[index].isChecked = false;
      this._players[index].categories_list[catIndex].isSelected = false;
      this._totalAmount = this._totalAmount - this._players[index].categories_list[catIndex].price;
      this.length = Array.from(new Set(this._selectedPlayerList.map((r: any) => r.participant_name)));
    }
  }
  //#endregion
  //#region With this method we are able to getDouble List
  getDoubleList() {
    this._showLoader = true;
    this.dashboardService.getTeamsByParticipantIDAndEventId(3).subscribe({
      next: (data: any) => {

        this._teams = [];
        this._players = [];
        this._playersCopy = [];
        this._teams = data.body;
        for (let i = 0; i < this._teams.length; i++) {
          this._playerInCategories = [];
          if (this._teams[i].open_categories.length > 0) {
            for (let j = 0; j < this.categories.length; j++) {
              if (this._teams[i].open_categories.includes(this.categories[j].category_id)) {
                const ddd = {
                  categoryName: this.categories[j].category_description,
                  categoryId: this.categories[j].category_id,
                  price: this.categories[j].price,
                  isSelected: false,
                }
                if (this._playerInCategories.findIndex((x: any) => x.categoryId == this.categories[j].category_id) == -1) {
                  this._playerInCategories.push(ddd)
                }
              }
            }
            this._dummyList = {
              player_id: this._teams[i].team_id,
              player_name: this._teams[i].name,
              isChecked: false,
              eventAmount: 0,
              playerList: this._teams[i].team_details,
              categories_list: this._playerInCategories,
              team_id: this._teams[i].team_id,
              rating: this._teams[i].rating,
              age: this._teams[i].age,
              gender_id: this._teams[i].gender_id,
              GUID:this.generateRandomNumberInRange()
            };
            if (this._dummyList != undefined) {
              if (this._players.findIndex((x: any) => x.player_id == this._dummyList.player_id) == -1) {
                this._players.push(this._dummyList);
                this._playersCopy.push(this._dummyList);
              }
            }
          }
        }
        this._showLoader = false;
      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this._teams = [];
        this._players = [];
        this._playersCopy = [];
      },
      complete: () => {
      },
    });
  }
  //#endregion
  //#region This method is used for Pay Final Amount
  payNow() {
    // if (this._paymentId !== undefined && this._paymentId !== '' && this._paymentId !== null) {
    //   this.callAPIForOrderCreation();
    // } else {
    //   this._showLoader = false;
    //   this.messageService.add({
    //     key: 'bc', severity: 'info', summary: 'Information', detail: 'Kindly Select Payment Method', life: 6000,
    //   });
    // }
    if (this.s == 'online') {
      if (this._paymentId !== undefined && this._paymentId !== '' && this._paymentId !== null) {
        this.callAPIForOrderCreation();
      } else {
        this._showLoader = false;
        this.messageService.add({
          key: 'bc', severity: 'info', summary: 'Information', detail: 'Kindly Select Payment Method', life: 6000,
        });
      }
    }
    else {
      this._paymentId = 3;
      this.callAPIForOrderCreation();

    }
  }
  //#endregion
  //#region This method is used for Get Status of payment 
  orderStatus(data: any) {
    this.intervalID = setInterval(() => {
      if (this._payment.closed) {
        clearInterval(this.intervalID)
        this.getDoubleList();
      }

    }, 5000);
  }
  //#endregion
  //#region This Method is used search
  findTeams() {
    this._players = this._playersCopy.filter((item: any) => {
      return item.player_name.toLowerCase().includes(this._searchTeams.toLowerCase());
    });
  }
  //#endregion
  //#region Get First Letters
  profileLetterService(data: any) {
    return this.profileLettersService.getFirstLetters(data);
  }
  //#endregion

  //#region method is used for show payment popup with multiple payment gateways
  showPaymentgatway() {
    if (this._totalAmount == 0) {
      this.callAPIForOrderCreation();
    } else {
      this._showPaymentGateways = false;
      this._showPaymentGateways = true;
    }
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
  callAPIForOrderCreation() {
    this._showLoader = true;
    var list;
    this._selectedCategoryList = [];
    this._categoriesListFinal = [];
    for (let i = 0; i < this._selectedPlayerList.length; i++) {
      if (this._selectedCategoryList.findIndex((x: any) => x == this._selectedPlayerList[i].cat_Id) == -1) {
        this._selectedCategoryList.push(this._selectedPlayerList[i].cat_Id);
      }
    }
    for (let i = 0; i < this._selectedCategoryList.length; i++) {
      this._participantList = [];
      for (let k = 0; k < this._selectedPlayerList.length; k++) {
        if (this._selectedPlayerList[k].cat_Id == this._selectedCategoryList[i]) {
          this._teamPlayerList = [];
          for (let f = 0; f < this._selectedPlayerList[k].playerList.length; f++) {
            const playerData = {
              "user_id": this._selectedPlayerList[k].playerList[f].user_id,
              "state": this._selectedPlayerList[k].playerList[f].state,
              "club": this._selectedPlayerList[k].playerList[f].club,
              "email": this._selectedPlayerList[k].playerList[f].email,
              "name": this._selectedPlayerList[k].playerList[f].name,
              "rating": this._selectedPlayerList[k].playerList[f].rating,
              "age": this._selectedPlayerList[k].playerList[f].age,
              "gender_id": this._selectedPlayerList[k].playerList[f].gender_id
            }
            this._teamPlayerList.push(playerData)
          }
          list =
          {
            "participant_name": this._selectedPlayerList[k].participant_name,
            "ref_id": this._selectedPlayerList[k].team_id,
            "players": this._teamPlayerList,
            "rating": this._selectedPlayerList[k].rating
          }
          if (this._participantList.findIndex((x: any) => x.ref_id == this._selectedPlayerList[k].team_id) == -1) {
            this._participantList.push(list);
          }
          const details = {
            "category_id": this._selectedCategoryList[i],
            "participants": this._participantList
          }
          if (this._categoriesListFinal.findIndex((x: any) => x.category_id == this._selectedCategoryList[i]) == -1) {
            this._categoriesListFinal.push(details)
          } else {
            const index = this._categoriesListFinal.findIndex((x: any) => x.category_id == this._selectedCategoryList[i])
            if (this._categoriesListFinal[index].participants.findIndex((x: any) => x.ref_id == this._participantList[0].ref_id) == -1) {
              this._categoriesListFinal[index].participants.push(this._participantList[0])
            }
          }
        }
      }
    }
    for (let g = 0; g < this._categoriesList.length; g++) {
      const dd = {
        "category_id": this._categoriesList[g].category_id,
        "participants": this._participantList
      }
      this._categoriesListFinal
    }
    if (this._selectedPlayerList.length > 0) {
      const data = {
        "event_id": this._eventId,
        "participant_type_id": 3,
        "categories": this._categoriesListFinal,
        "payment_id": this._paymentId == '' || this._paymentId == null || this._paymentId == null ? 0 : this._paymentId
      }
      this.eventService.registerParticipants(data).subscribe({
        next: (result: any) => {
          this._selectedPlayerList=[]
          this.hidePaymentgatway();
          this._showLoader = false;
          this.length = [];
          this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: result.body.msg, life: 3000, });
          this.getDoubleList();
          // window.open(result.body.payment_url);
          if (result.body.payment_url === '') {
            this.getDoubleList();
          }
          else {
            this._payment = window.open(result.body.payment_url, '', 'width=900,height=900,left=200,top=200');
            this.orderStatus(result.body);
          }
        },
        error: (result) => {
          this._selectedCategoryList = [];
          this._categoriesListFinal = [];
          this._showLoader = false;
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
          this.messageService.add({
            key: 'bc', severity: 'error', summary: 'Error', detail: result.error.msg, life: 3000,
          });
        },
        complete: () => {
        },
      });
    }
    else {
      this._showLoader = false;
      this.messageService.add({
        key: 'bc', severity: 'info', summary: 'Information', detail: 'Select some entries to send.', life: 6000,
      });
      //some message here
    }
  }
  radiochange(e: any) {
    this.s = e.target.value;
    if (this.s == "online") {
      this._onlinePaymentDone = true;
      this._offlinePaymentDone = false;
      // alert("online is selectd ")
    }
    else if (this.s == "offline") {
      this._offlinePaymentDone = true
      this._onlinePaymentDone = false
    }
    else {
      alert("nothing is selected")
    }
  }
  generateRandomNumberInRange() {
    return this.commonApiService.generateRandomNumberInRange(0, 99999999999);
  }
}
