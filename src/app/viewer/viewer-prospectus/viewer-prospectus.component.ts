import { Component } from '@angular/core';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { SeeAllEventsService } from 'src/app/services/seeAll/see-all-events.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';

@Component({
  selector: 'stupa-viewer-prospectus',
  templateUrl: './viewer-prospectus.component.html',
  styleUrls: ['./viewer-prospectus.component.scss']
})
export class ViewerProspectusComponent {
//#region Variable Declaration Start
 
  _eventId: any;
  _prospectusUrl: any = [];
  _pdfUrl: any='';
_pdfFlag:boolean = false ;
  azureLoggerConversion: any = new Error();
 //#endregion Variable Declaration Start

  constructor(public encyptDecryptService: EncyptDecryptService,  private azureLoggerService: MyMonitoringService,
    private seeAllEvents: SeeAllEventsService,private eventsService:EventsService) { }
  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getEvents();
  }

 
  //#region API call to get prospectus url 
  getEvents(){
    this._pdfFlag = false  
    this.eventsService.getDetailsByEventId(this._eventId).subscribe({
        next: (data: any) => {
          this._prospectusUrl = data.body.filter((url:any)=>url.event_id==this._eventId);
          this._pdfUrl = this._prospectusUrl[0].prospectus;
         if(this._pdfUrl!=null && this._pdfUrl!=''){
          this._pdfFlag = true  
         }
         else{
          this._pdfFlag = false  
         }
          
          
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => {}
      })
    }
     //#endregion  API call to get prospectus url 
}
