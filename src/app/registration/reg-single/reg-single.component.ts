import { Component, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { CommonApiService } from 'src/app/services/Common/common-api.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { ProfileLettersService } from 'src/app/services/ProfileLetters/profile-letters.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'stupa-reg-single',
  templateUrl: './reg-single.component.html',
  styleUrls: ['./reg-single.component.scss'],
  providers: [MessageService]
})
export class RegSingleComponent {
  //#region variable declarations
  _skeleton: boolean = false;
  // loader false
  _showarrow: boolean = false;
  _selectedEvent: boolean = false;
  @Input() categories: any = [];
  @Input() _eventId!: number;
  _totalAmount: any = 0;
  _playerList: any = [];
  _playersList: any = [];
  _categoryList: any = [];
  _players: any = [];
  _playersCopy: any = [];
  _dummyList: any;
  _showLoader: boolean = false;
  _playerInCategories: any = [];
  _searchTeams: any = '';
  _selectedCategory: any;
  _participantList: any = [];
  _categoriesList: any = [];
  _categoriesListFinal: any = [];
  _selectedPlayerList: any = [];
  _selectedCategoryList: any = [];
  _payment: any;
  intervalID: any
  _length: any = [];
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

  ]
  _paymentId: any = '';
  innerWidth: any
  azureLoggerConversion: any = new Error();
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
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  _offlinePaymentDone: boolean = false;
  _onlinePaymentDone: boolean = true;
  s: string = "";

  //#endregion variable declarations
  constructor(private eventService: EventsService, private encyptDecryptService: EncyptDecryptService, private azureLoggerService: MyMonitoringService,
    private messageService: MessageService, private route: Router, private profileLettersService: ProfileLettersService,
    private commonApiService: CommonApiService) {
    this.innerWidth = window.innerWidth;

  }
  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getPlayers();
  }
  //#region method is used for select and deselect current events for create order
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
        "rating": this._players[index].rating,
        "world_rank": this._players[index].world_rank,
        "age": this._players[index].age,
        "gender_id": this._players[index].gender_id
      }
      this._selectedPlayerList.push(data)
      this._players[index].eventAmount = this._players[index].eventAmount + this._players[index].categories_list[catIndex].price;
      this._players[index].isChecked = true;
      this._players[index].categories_list[catIndex].isSelected = true;
      this._totalAmount = this._totalAmount + this._players[index].categories_list[catIndex].price;

      this._length = Array.from(new Set(this._selectedPlayerList.map((r: any) => r.participant_name)));
    } else {
      if (this._selectedPlayerList.findIndex((x: any) => x.category_id == this._players[index].categories_list[catIndex].categoryId + this._players[index].GUID) !== -1) {
        this._selectedPlayerList.splice(this._selectedPlayerList.findIndex((x: any) => x.category_id == this._players[index].categories_list[catIndex].categoryId + this._players[index].GUID), 1)
      }
      this._players[index].eventAmount = this._players[index].eventAmount - this._players[index].categories_list[catIndex].price;
      this._players[index].isChecked = false;
      this._players[index].categories_list[catIndex].isSelected = false;
      this._totalAmount = this._totalAmount - this._players[index].categories_list[catIndex].price;
      this._length = Array.from(new Set(this._selectedPlayerList.map((r: any) => r.participant_name)));
    }
  }
  //#endregion method is used for select and deselect current events for create order
  //#region method us used for get list of players by API calling
  getPlayers() {
    // this._showLoader = true;
    this._showLoader = true

    this.eventService.getPlayers(this._eventId).subscribe({
      next: (data: any) => {
        this._playersList = [];
        this._playersCopy = [];
        this._players = [];
        this._playersCopy = [];
        this._playersList = data.body;
        // this._showLoader = false;
        this._showLoader = false
        for (let i = 0; i < this._playersList.length; i++) {
          this._playerInCategories = [];
          if (this._playersList[i].open_categories.length > 0) {
            for (let j = 0; j < this.categories.length; j++) {
              if (this._playersList[i].open_categories.includes(this.categories[j].category_id)) {
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
              player_id: this._playersList[i].user_id,
              player_name: this._playersList[i].name,
              email: this._playersList[i].email,
              state: this._playersList[i].state,
              club: this._playersList[i].club,
              isChecked: false,
              eventAmount: 0,
              categories_list: this._playerInCategories,
              rating: this._playersList[i].rating,
              world_rank: this._playersList[i].world_rank,
              age: this._playersList[i].age,
              gender_id: this._playersList[i].gender_id,
              GUID: this.generateRandomNumberInRange()
            };
            
            if (this._dummyList != undefined) {
              if (this._players.findIndex((x: any) => x.player_id == this._dummyList.player_id) == -1) {
                this._players.push(this._dummyList)
                this._playersCopy.push(this._dummyList);
              }
            }
          }
        }
      },
      error: (result) => {
        // this._showLoader = false;
        this._showLoader = false
        // this._showLoader = false;
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
  //#endregion method us used for get list of players by API calling
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
  //#region method us used for call API For create regitration order
  payNow() {
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
  //#endregion method us used for call API For create regitration order
  //#region method us used for call API For order creation
  callAPIForOrderCreation() {
    this._selectedPlayerList
    for (let i = 0; i < this._selectedPlayerList.length; i++) {
      if (this._selectedCategoryList.findIndex((x: any) => x == this._selectedPlayerList[i].cat_Id) == -1) {
        this._selectedCategoryList.push(this._selectedPlayerList[i].cat_Id);
      }
    }
    this._showLoader = true;
    // this._skeleton=true
    var list;
    this._players
    // this._categoriesList = [];
    for (let i = 0; i < this._selectedCategoryList.length; i++) {
      this._participantList = [];
      for (let k = 0; k < this._selectedPlayerList.length; k++) {
        if (this._selectedPlayerList[k].cat_Id == this._selectedCategoryList[i]) {

          list =
          {
            "participant_name": this._selectedPlayerList[k].participant_name,
            "ref_id": this._selectedPlayerList[k].ref_id,
            "rating": this._selectedPlayerList[k].rating,
            "world_rank": this._selectedPlayerList[k].world_rank,
            "players": [
              {
                "user_id": this._selectedPlayerList[k].ref_id,
                "state": this._selectedPlayerList[k].state,
                "club": this._selectedPlayerList[k].club,
                "email": this._selectedPlayerList[k].email,
                "name": this._selectedPlayerList[k].participant_name,
                "rating": this._selectedPlayerList[k].rating,
                "world_rank": this._selectedPlayerList[k].world_rank,
                "age": this._selectedPlayerList[k].age,
                "gender_id": this._selectedPlayerList[k].gender_id
              }
            ]
          }
          this._participantList.push(list);
          const dfff = {
            "category_id": this._selectedCategoryList[i],
            "participants": this._participantList
          }
          if (this._categoriesListFinal.findIndex((x: any) => x.category_id == this._selectedCategoryList[i]) == -1) {
            this._categoriesListFinal.push(dfff)
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

    //  if (this._totalAmount > 0 && !Number.isNaN(this._totalAmount)) {
    if (this._selectedPlayerList.length > 0) {
      const data = {
        "event_id": this._eventId,
        "participant_type_id": 1,
        "categories": this._categoriesListFinal,
        "payment_id": this._paymentId == '' || this._paymentId == null || this._paymentId == null ? 0 : this._paymentId
      }
      this.eventService.registerParticipants(data).subscribe({
        next: (result: any) => {
          this._selectedPlayerList=[]
          this._totalAmount = 0
          this._showLoader = false;
          this._length = []
          this.hidePaymentgatway();

          this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: result.body.msg, life: 3000, });
          this.getPlayers();
          // window.open(result.body.payment_url);
          if (result.body.payment_url === '') {
            this.getPlayers();
          }
          else {
            this._payment = window.open(result.body.payment_url, '', 'width=900,height=900,left=200,top=200');

            this.orderStatus(result.body);
          }

          // this.route.navigate([result.body.payment_url]);
          // this.route.navigate([result.body.payment_url]);
          // setTimeout(() => {
          //   this.route.navigate(['/home']);
          // }, 3000);
        },
        error: (result) => {
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
      // this._skeleton=false
      this.messageService.add({
        key: 'bc', severity: 'info', summary: 'Information', detail: 'Select some entries to send.', life: 6000,
      });
    }
  }
  //#endregion method us used for call API For order creation
  //#region method is used for check order status after regresive API Calling
  orderStatus(data: any) {
    this.intervalID = setInterval(() => {

      if (this._payment.closed) {
        clearInterval(this.intervalID)
        this.getPlayers();
      }

    }, 5000);
  }
  //#endregion method is used for check order status after regresive API Calling
  //#region  method is used for search 
  findTeams() {
    this._players = this._playersCopy.filter((item: any) => {
      return item.player_name.toLowerCase().includes(this._searchTeams.toLowerCase());
    });
  }
  //#endregion method is used for search 
  //#region method us used for get first letters of string
  profileLetterService(data: any) {
    return this.profileLettersService.getFirstLetters(data);
  }
  //#endregion method us used for get first letters of string
  radiochange(e: any) {
    this.s = e.target.value;

    if (this.s == "online") {
      this._onlinePaymentDone = true;
      this._offlinePaymentDone = false;
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
