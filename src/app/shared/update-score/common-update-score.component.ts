import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'stupa-common-update-score',
  standalone: true,
  imports: [CommonModule,TableModule,AvatarModule],
  templateUrl: './common-update-score.component.html',
  styleUrls: ['./common-update-score.component.scss']
})

export class CommonUpdateScoreComponent implements OnInit{
  @Input() currentParticipantId: any;
  @Input() _fixtureFormat: any;
  @Input() selectedCategoryId: any;
  _matchDetailsList:any=[];
  _eventId:any;
  constructor(
    private eventService: EventsService,
    private encyptDecryptService: EncyptDecryptService, private azureLoggerService: MyMonitoringService,
  ) {}
  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getGroupMatchDetails();
  }
 //#region With this method we are getting Group Matches Details
 getGroupMatchDetails() {
  this._matchDetailsList = [];
 // this._showLoader = false;
  if (
    this._eventId !== undefined &&
    this.selectedCategoryId !== undefined
  ) {
    this.eventService
      .getGroupMatchDetails(
        this._eventId,
        this.selectedCategoryId,
        1
      )
      .subscribe({
        next: (result: any) => {
          //this._showLoader = false;
          //this.getPlayersForMainDraw();
          this._matchDetailsList = result.body;

          if (this._matchDetailsList.length > 0) {
           // this.isMatchesCreated.emit(true);
          } else {
            //this.isMatchesCreated.emit(false);
          }
        },
        error: (result: any) => {
          // this._showLoader = false;
          // this.azureLoggerConversion = result.error.msg
          // this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      });
  }
}
//#endregion
}
