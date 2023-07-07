import { Component, Input, OnInit } from '@angular/core';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { FixtureServiceService } from 'src/app/services/fixtures/fixture-service.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
@Component({
  selector: 'stupa-result-groups',
  templateUrl: './result-groups.component.html',
  styleUrls: ['./result-groups.component.scss']
})
export class ResultGroupsComponent implements OnInit {
  //#region Here we are declariong Variables
  @Input() _currentCategoryId: any;
  @Input() _currentParticipantId: any
  @Input() _selectedFixtureFormat: any

  _groupPlayOffSteps: any = [
    {
      label: 'Group Results',
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
  _consolationSteps: any = [
    {
      label: 'Group Results',
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
    }
  ];
  _activeIndex = 0;
  _eventId: any;
  _isNextStepActive: boolean = false;
  _showPTimeLine: boolean = false;
  azureLoggerConversion: any = new Error();
  //#endregion Here we are declariong Variables

  constructor(private azureLoggerService: MyMonitoringService,
    private encyptDecryptService: EncyptDecryptService, private fixtureService: FixtureServiceService) {
  }
  ngOnInit(): void {
  }
  ngOnChanges() {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getFirstRoundKnockout()
  }

  //#region API call to show p-timeLine active when res.length > 0
  getFirstRoundKnockout() {
    if (this._eventId !== undefined && this._currentCategoryId !== undefined) {
      this.fixtureService.generateFirstRoundKnockout(this._eventId, this._currentCategoryId).subscribe({
        next: (result: any) => {

          //this._showLoader = false;
          if (result.body.length > 0) {
            this._isNextStepActive = true;

          } else {
            this._activeIndex = 0
            this._isNextStepActive = false;

          }

        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
          //this._showLoader = false;
        },
        complete: () => { },
      });
    }

  }
  //#endregion API call to show p-timeLine active when res.length > 0

  _showSteperFlag(e: any) {
    if (e === true) {
      this._showPTimeLine = true;
    }
    else {
      this._showPTimeLine = true;
    }
  }

}
