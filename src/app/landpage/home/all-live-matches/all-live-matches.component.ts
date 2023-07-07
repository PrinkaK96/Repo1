import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { SeeAllEventsService } from 'src/app/services/seeAll/see-all-events.service';


@Component({
  selector: 'stupa-all-live-matches',
  templateUrl: './all-live-matches.component.html',
  styleUrls: ['./all-live-matches.component.scss'],
  providers: [MessageService],
})
export class AllLiveMatchesComponent {
  _sellAllOngoing: any;
  _updateEventOnView:any;
  isSigned: boolean;
  _eventId: any;
  azureLoggerConversion: any= new Error();
  constructor(private messageService: MessageService, private seeAllEvents:SeeAllEventsService, private azureLoggerService: MyMonitoringService,
    private router: Router,private encyptDecryptService: EncyptDecryptService){
    if (
      localStorage.getItem('reqToken') !== 'undefined' &&
      localStorage.getItem('reqToken') !== null
    ) {
      this.isSigned = true;
    } else {
      this.isSigned = false;
    }
    
  }
  p:any;
  _showLoader: boolean = false;

  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    if(this.isSigned===true){
      
      this.seeAllEvents.sellAllOngoing('ongoing_events').subscribe({
        next: (data: any) => {
          
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () =>{
          
        }
      })
    }
    else{
    this.seeAllEvents.sellAllOngoingAtHome('ongoing_events').subscribe({
      next: (data: any) => {
        this._sellAllOngoing = data.body;
      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => {
        
      }
    })
  }
  }
  updateEvent(e:any){
    this._updateEventOnView = e;
    //localStorage.setItem('event_data',JSON.stringify(this._updateEventOnView))
    if (e.broadcast) {
      this.router.navigate(['/broadcasting']);
    } else {
      this.router.navigate(['/event/create-event']);
    }

  }
}
