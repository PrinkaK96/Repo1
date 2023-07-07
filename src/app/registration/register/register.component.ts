import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'stupa-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [MessageService]
})
export class RegisterComponent {
  _participantType: any;
  _participantTypeList: any = [];
  event_id: any = '';
  _categories: any = [];
  //@Input() _eventId: any;
  _showLoader: boolean = false;
  _teamCategories: any = [];
  _doubblesCategories: any = [];
  _mixDoubbleCategories: any = [];
  _eventTitle: any = '';
  _loadComponents: boolean = false;
  _participant_Id: any;
  _pageMainTitle: string = 'Add Participants and Categories';
  _pageSubTitle: string = 'To Proceed Further you must add some category in this event and There should be some Players associated with you.';
  _eventId: any;
  azureLoggerConversion: any= new Error();
  _Singlescategories: any=[];
  _newList: any=[];
  _newList2: any=[];
  constructor(private eventService: EventsService, private messageService: MessageService, private encyptDecryptService: EncyptDecryptService, private azureLoggerService : MyMonitoringService,
    private router: Router) { }
  ngOnInit(): void {
   // this.checkPopupBlocker();
    this._eventTitle = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('ev_nm'));
    this._eventId = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this.getParticipantAndCategory();
  }

  ngOnChanges(){
    this.getParticipantAndCategory();
  }
  getParticipantAndCategory() {
    this._showLoader = true;
    if (this._eventId !== undefined) {
      this.eventService.getParticipantTypeAndCategories(this._eventId).subscribe({
        next: (data: any) => {
          this._participantTypeList = data.body;
          this._showLoader = false;
          if (data.body.length > 0) { /*use same parameter for passing categories to different components */
            this._loadComponents = true;
            this._participantType = data.body[0];
            
            // this._categories = data.body[0].categories[0].sub_categories.length>0 ? data.body[0].categories.map((s:any)=>s.sub_categories).flat(): data.body[0].categories;
            this._categories = data.body[0].categories;
          }
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

  }
  // participantclick(event: any) {
  //   if (event.participant_type_id === 1) {
  //     this._participant_Id = 1;
  //     this._Singlescategories = event.categories;
  //     this._newList = this._Singlescategories.filter((x:any)=> x.sub_categories.length==0)
  //     this._newList2 = this._Singlescategories.map((s:any)=>s.sub_categories).flat()
  //     this._categories = [...this._newList, ...this._newList2]

      
  //   }
  //   if (event.participant_type_id === 2) {
  //     this._participant_Id = 1;
  //     this._Singlescategories = event.categories;
  //     this._newList = this._Singlescategories.filter((x:any)=> x.sub_categories.length==0)
  //     this._newList2 = this._Singlescategories.map((s:any)=>s.sub_categories).flat()
  //     this._categories = [...this._newList, ...this._newList2]

  //   }
  //   if (event.participant_type_id === 3) {
  //     this._participant_Id = 3;
  //     this._Singlescategories = event.categories;
  //     this._newList = this._Singlescategories.filter((x:any)=> x.sub_categories.length==0)
  //     this._newList2 = this._Singlescategories.map((s:any)=>s.sub_categories).flat()
  //     this._categories = [...this._newList, ...this._newList2]
  //   }
  //   if (event.participant_type_id === 4) {
  //     this._participant_Id = 4;
  //     this._Singlescategories = event.categories;
  //     this._newList = this._Singlescategories.filter((x:any)=> x.sub_categories.length==0)
  //     this._newList2 = this._Singlescategories.map((s:any)=>s.sub_categories).flat()
  //     this._categories = [...this._newList, ...this._newList2]
  //   }
  // }
  participantclick(event: any) {
    if (event.participant_type_id === 1) {
      this._participant_Id = 1;
      this._categories = event.categories;
    }
    if (event.participant_type_id === 2) {
      this._participant_Id = 2;
      this._categories = event.categories;
    }
    if (event.participant_type_id === 3) {
      this._participant_Id = 3;
      this._categories = event.categories;
    }
    if (event.participant_type_id === 4) {
      this._participant_Id = 4;
      this._categories = event.categories;
    }
  }
  goBack() {
    this.router.navigate(['registration/register', 'organize']);
  }
  checkPopupBlocker() {
    const testPop = window.open('', 'test', 'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=300,height=150,left=800,top=300');
    //testPop?.document.body.title .document.write("<p>This is 'MsgWindow'. I am 200px wide and 100px tall!</p>");
    if (!testPop || testPop.closed || typeof testPop.closed === 'undefined' || (testPop.innerWidth === 0 && testPop.innerHeight === 0)) {
      // Pop-ups are blocked
      this.messageService.add({
        key: 'bc', severity: 'info', summary: 'Error', detail: 'Browser pop-ups must not be blocked for successful registration.', life: 3000,
      });
    } else {
      testPop.close();
    }
  }
}
