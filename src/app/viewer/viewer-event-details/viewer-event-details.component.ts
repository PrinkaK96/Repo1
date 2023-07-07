import { Component, OnInit } from '@angular/core';
import { EventsService } from "../.././services/WebEventService/events.service"
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';

@Component({
  selector: 'stupa-viewer-event-details',
  templateUrl: './viewer-event-details.component.html',
  styleUrls: ['./viewer-event-details.component.scss']
})
export class ViewerEventDetailsComponent implements OnInit {
  _eventId: any;
  data:any;
  _fullDetail:any = [];
  _firstRow:any = [];
  _secondRow:any = [];
  _thirdRow:any = [];
  _fourthRow:any = [];
  constructor(private eventsService: EventsService, private encyptDecryptService: EncyptDecryptService,) {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this.getDetails()
  }
  ngOnInit() {

  }

  getDetails() {
    
    this.eventsService.getEvents(this._eventId).subscribe({
      next: (result: any) => {
       this.data = result.body[0];
      },
      error: (result) => {
      },
      complete: () => { },
    })
  }


}
