import { Component, Input, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { FixtureServiceService } from 'src/app/services/fixtures/fixture-service.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';

@Component({
  selector: 'stupa-viewer-grp-play-off',
  templateUrl: './viewer-grp-play-off.component.html',
  styleUrls: ['./viewer-grp-play-off.component.scss'],
  providers:[MessageService,ConfirmationDialogService]
})
export class ViewerGrpPlayOffComponent {
  //#region Variable Declaration Start
  _activeIndex = 0;
  _schedule: boolean = true;
  _openSchedule: boolean = false;
  _category: any = [];
  _groupPlayOffSteps: any = [
    {
      label: 'Group Creation',
      command: (event: any) => {
        this._activeIndex = 0;
      },
    },
    {
      label: 'Main Draw',
      command: (event: any) => {
        this._activeIndex = 1;
      },
    }
  ];
  _consolationGrPlayOffSteps: any = [
    {
      label: 'Group Creation',
      command: (event: any) => {
        this._activeIndex = 0;
      },
    },
    {
      label: 'Main Draw',
      command: (event: any) => {
        this._activeIndex = 1;
      },
      
    },
    {
      label: 'Consolation',
      command: (event: any) => {
        this._activeIndex = 2;
      },
    },
  ];
  @Input() totalPlayer: any;
  @Input() _currentCategoryId: any;
  @Input() _currentParticipantId: any;
  @Input() _showFixtureFormat: any;
  @Input() _selectedFixtureFormat:any
  _showLoader: boolean = false;
  _fixtureScreen: boolean = false;
  _matchDetailsList: any = [];
  _matchDetailsListCopy: any = [];
  _isMatchesCreated: boolean = false;
  _isMatchesCompleted: boolean = false;
  isRefreshData: boolean = false;
  _isNextStepActive: boolean = false;
  _showFixtureScreen: boolean=false;
  _showSteps: boolean=false;
  azureLoggerConversion: any = new Error();
//#endregion Variable Declaration Start
  constructor(private eventsService: EventsService, private messageService: MessageService, private azureLoggerService: MyMonitoringService,
    private encyptDecryptService: EncyptDecryptService, private fixtureService: FixtureServiceService) {
    
  }
  _eventId: any;
  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getKnockoutTournament();
    this.getGroupMatchDetails(this._currentCategoryId)
    

  }
  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const chng = changes[propName];
      const cur = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);
     
    }
    
    this.getKnockoutTournament();
    this.getGroupMatchDetails(this._currentCategoryId)
  }
  getActive(data: any) {
  }
  tabSelection(data: any) {
    this._category[data.index];
  }
  openDialog() {
    this._openSchedule = true;
  }
  openSchedule(eventData: { schedule: boolean }) {
    this._schedule = eventData.schedule;
  }
  isMatchesCreated(data: any) {
    this._isMatchesCreated = data;
  }
  // get_group_matches_details
  getGroupMatchDetails(categoryId: any) {
    this._showLoader = true;
    this._matchDetailsList = [];
    this._matchDetailsListCopy = [];

    
    if (this._eventId !== undefined && categoryId !== undefined) {
      this.eventsService.getGroupMatchDetailsV2(this._eventId, categoryId, 1)
        .subscribe({
          next: (result: any) => {
            this.isRefreshData = false;
            this._showLoader = false;
            this._showSteps = true;
            this._matchDetailsList = [];
            this._matchDetailsListCopy = [];
          
            if (result.body.length > 0) {
              this._showFixtureScreen = true;
              for (let j = 0; j < result.body.length; j++) {
                const data = {
                  "round_name": 'R' + result.body[j].round,
                  "group_id": result.body[j].group_id,
                  "match_id": result.body[j].match_id,
                  "category_id": result.body[j].category_id,
                  "group_name": result.body[j].group_name,
                  "participantA_id": result.body[j].match_details[0].participant_id,
                  "participantB_id":  result.body[j].match_details[1] == undefined ? '' : result.body[j].match_details[1].participant_id,
                  "participantA_name": result.body[j].match_details[0].participant_name,
                  "participantB_name":  result.body[j].match_details[1] == undefined ? '' : result.body[j].match_details[1].participant_name,
                  "isSelected": false,
                  "event_id": result.body[j].event_id,
                }
                this._matchDetailsList.push(data)
                this._matchDetailsListCopy.push(data)
                
              }
              this._showLoader = false
            }
            else{
              this._showFixtureScreen = false;
              this._showSteps = false;
            }

          },
          error: (result: any) => {
            this._showLoader = false;
            this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
            this.messageService.add({
              key: 'bc',
              severity: 'info',
              summary: 'Info',
              detail: result.error.msg,
              life: 3000,
            });
          },
          complete: () => { },
        });
    }

  }
  getListWithCategoryId(categoryId: any) {
    this.getGroupMatchDetails(categoryId);
  }
  
  isLockedGroup() {
    this._showLoader = true;
    if (this._eventId !== undefined && this._currentCategoryId !== undefined) {
      this.eventsService
        .getGroupList(this._eventId, this._currentCategoryId, 2)
        .subscribe({
          next: (result: any) => {
            this._showLoader = false;
            this._fixtureScreen = result.body[0].locked

          },
          error: (result) => {
            this._showLoader = false;
            this.azureLoggerConversion = result.error.msg
            this.azureLoggerService.logException(this.azureLoggerConversion)
          },
          complete: () => { },
        });
    }

  }
  refreshAllData() {
    this.isRefreshData = true;
    //this.getFirstRoundKnockout();
    this.getGroupMatchDetails(this._currentCategoryId);
  }
  getKnockoutTournament() {
   
    if (this._eventId !== undefined && this._currentCategoryId !== undefined) {
      this.fixtureService.getKnockoutTournament(this._eventId, this._currentCategoryId).subscribe({
        next: (result: any) => {

          this._showLoader = false;
          if (result.body.length > 0) {
            this._isNextStepActive = true;
            
          } else {
            this._activeIndex = 0
            this._isNextStepActive = false;
            this._fixtureScreen = false;
          }

        },
        error: (result: any) => {
          this._showLoader = false;
          this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      });
    }
  }
  
}
