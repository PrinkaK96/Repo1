import { Component, Input, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { FixtureServiceService } from 'src/app/services/fixtures/fixture-service.service';

@Component({
  selector: 'stupa-grp-play-off-consolidation',
  templateUrl: './grp-play-off-consolidation.component.html',
  styleUrls: ['./grp-play-off-consolidation.component.scss'],
  providers: [MessageService]
})
export class GrpPlayOffConsolidationComponent {
  //#region Variables
  _activeIndex = 0;
  _schedule: boolean = true;
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
    },
    {
      label: 'Consolation',
      command: (event: any) => {
        this._activeIndex = 2;
      }
    }

  ];
  @Input() _currentCategoryId: any;
  @Input() _currentParticipantId: any;
  @Input() _matchFinished: any;
  @Input() _fixtureFormat: any;
  @Input() _seedPlayer: any = '';
  @Input() _separation: any;
  @Input() _playerInGroup: any;
  _showLoader: boolean = false;
  _fixtureScreen: boolean = false;
  _matchDetailsList: any = [];
  _matchDetailsListCopy: any = [];
  _isMatchesCreated: boolean = false;
  isRefreshData: boolean = false;
  _isNextStepActive: boolean = false;
  azureLoggerConversion: any = new Error()
  _showSetting: boolean = false

  //#endregion
  constructor(
    private eventsService: EventsService,
    private messageService: MessageService,
    private azureLoggerService: MyMonitoringService,
    private encyptDecryptService: EncyptDecryptService,
    private fixtureService: FixtureServiceService) {
  }
  _eventId: any;
  ngOnInit(): void {
    // this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    // this.getFirstRoundKnockout();
    // this.getGroupMatchDetails(this._currentCategoryId);
    // this.checkCatMatches(this._currentCategoryId);
  }
  ngAfterViewInit() {
    // this.checkCatMatches(this._currentCategoryId);
  }
  ngOnChanges(changes: SimpleChanges) {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getFirstRoundKnockout();
    this.getGroupMatchDetails(this._currentCategoryId);
    this.checkCatMatches(this._currentCategoryId);
  }
  getActive(data: any) {
  }
  //#region This Method is used for Get method boolean value
  openSchedule(eventData: { schedule: boolean }) {
    this._schedule = eventData.schedule;
  }
  //#endregion
  //#region This method is just Get to know Is Matches Created Or Not
  isMatchesCreated(data: any) {
    this._isMatchesCreated = data;
  }
  //#endregion
  //#region This Method Used for get list of Group Matches Detail
  getGroupMatchDetails(categoryId: any) {
    this._matchDetailsList = [];
    this._matchDetailsListCopy = [];
    this._showLoader = true
    if (this._eventId !== undefined && categoryId !== undefined) {
      this.eventsService.getGroupMatchDetailsV2(this._eventId, categoryId, 1)
        .subscribe({
          next: (result: any) => {
            this.isRefreshData = false;
            this._showLoader = false
            this._matchDetailsList = [];
            this._matchDetailsListCopy = [];
            if (result.body.length > 0) {
              for (let j = 0; j < result.body.length; j++) {
                const data = {
                  "round_name": 'R' + result.body[j].round,
                  "group_id": result.body[j].group_id,
                  "match_id": result.body[j].match_id,
                  "category_id": result.body[j].category_id,
                  "group_name": result.body[j].group_name,
                  "participantA_id": result.body[j].match_details[0].participant_id,
                  "participantB_id": result.body[j].match_details[1] == undefined ? '' : result.body[j].match_details[1].participant_id,
                  "participantA_name": result.body[j].match_details[0].participant_name,
                  "participantB_name": result.body[j].match_details[1] == undefined ? '' : result.body[j].match_details[1].participant_name,
                  "isSelected": false,
                  "event_id": result.body[j].event_id,
                }
                this._matchDetailsList.push(data)
                this._matchDetailsListCopy.push(data)
              }
            }
            this._showLoader = false
          },
          error: (result: any) => {
            this._showLoader = false
            this.azureLoggerConversion = result.error.msg
            this.azureLoggerService.logException(this.azureLoggerConversion)
            this._matchDetailsList = [];
            this._matchDetailsListCopy = [];
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
    // this.checkCatMatches(categoryId);
  }
  //#endregion
  //#region This method will get list of Group Matches Base on Category Id
  getListWithCategoryId(categoryId: any) {
    this.getGroupMatchDetails(categoryId);
  }
  //#endregion
  //#region This method is  get First Round of Knockout List
  getFirstRoundKnockout() {
    if (this._eventId !== undefined && this._currentCategoryId !== undefined) {
      this.fixtureService.generateFirstRoundKnockout(this._eventId, this._currentCategoryId).subscribe({
        next: (result: any) => {
          this._showLoader = false
          if (result.body.length > 0) {
            this.isLockedGroup();
            this._isNextStepActive = true;
          } else {
            this._activeIndex = 0;
            this._isNextStepActive = false;
            this._fixtureScreen = false;
          }
        },
        error: (result: any) => {
          this._showLoader = false;
          this.azureLoggerConversion = result.error.msg;
          this.azureLoggerService.logException(this.azureLoggerConversion);
        },
        complete: () => { },
      });
    }
  }
  //#endregion
  //#region This Method is used for Check Is Group Locked Or Not
  isLockedGroup() {
    this._showLoader = true;
    if (this._eventId !== undefined && this._currentCategoryId !== undefined) {
      this.eventsService
        .getGroupList(this._eventId, this._currentCategoryId, 2)
        .subscribe({
          next: (result: any) => {
            this._fixtureScreen = result.body[0].locked
            this._showLoader = false
          },
          error: (result) => {
            this._showLoader = false
            this.azureLoggerConversion = result.error.msg
            this.azureLoggerService.logException(this.azureLoggerConversion)
          },
          complete: () => { },
        });
    }
  }
  //#endregion
  //#region This method is used for Refresh Data
  refreshAllData() {
    this.isRefreshData = true;
    this.getFirstRoundKnockout();
    this.getGroupMatchDetails(this._currentCategoryId);
  }
  //#endregion
  //#region  This method is used for Check Matches finished for particul category
  checkCatMatches(categoryId: any) {
    if (this._eventId != undefined) {
      this.eventsService.checkCatMatchFinished(this._eventId, categoryId).subscribe({
        next: (result: any) => {
          if (result.body) {
            this._matchFinished = true;
          }
          else {
            this._matchFinished = false;
          }
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      });
    }
  }
  showSetting() {
    this._showSetting = true
  }
  //#endregion
}

