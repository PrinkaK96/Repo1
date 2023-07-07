import { Component, EventEmitter, HostListener, Input, Output, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';

@Component({
  selector: 'stupa-viewer-group-creation',
  templateUrl: './viewer-group-creation.component.html',
  styleUrls: ['./viewer-group-creation.component.scss'],
  providers:[MessageService,ConfirmationDialogService]
})
export class ViewerGroupCreationComponent {
//#region Variable Declaration Start
_showLoader: boolean = false;
_isLocked: boolean = false;
_isGroupCreated: boolean = false;
__playerStatus: any = 'Players added ';
_groupList: any = [];
_dialogStyle = { width: '95vw' };
_selectedPlayer: any = [];
_winnerCount: any;
_matchDetailsList: any = [];
_searchByPlayerName: any = '';
_eventId: any;
_showGroupMatches: boolean = false;
@Output() isMatchesCreated = new EventEmitter<any>();
@Input() isRefreshData: boolean = false;
@Input() _category = [];
@Input() _currentCategoryId: any;
@Input() _currentParticipantId: any;
_matchFinished: any
azureLoggerConversion: any = new Error()
//#endregion Variable Declaration End




constructor(
  private eventsService: EventsService,
  private messageService: MessageService,
  private encyptDecryptService: EncyptDecryptService,
  private confirmationDialogService: ConfirmationDialogService,
  private azureLoggerService: MyMonitoringService,
) {
  this.getGroupList();
  this.getGroupMatchDetails();
 
}

ngOnInit(): void {
  this._eventId = this.encyptDecryptService.decryptUsingAES256(
    localStorage.getItem('event_id')
  );
  this.getGroupList()
  this.getGroupMatchDetails();
}
ngOnChanges(changes: SimpleChanges) {
  for (const propName in changes) {
    const chng = changes[propName];
    const cur = JSON.stringify(chng.currentValue);
    const prev = JSON.stringify(chng.previousValue);
  }
  this._winnerCount = '';
  this.isRefreshData = false;
  this.getGroupList();
  this.getGroupMatchDetails();
}

//#region This method Used for get List of Groups
getGroupList() {
  this._showLoader = true;
  const event_id = this.encyptDecryptService.decryptUsingAES256(
    localStorage.getItem('event_id')
  );
  const category_id = this._currentCategoryId;
  const group_type = 1;
  if (event_id !== undefined && category_id !== undefined) {
    this.eventsService
      .getGroupListViewer(event_id, category_id, group_type)
      .subscribe({
        next: (result: any) => {
          this._groupList = [];
          this._showLoader = false;
          this._isLocked = false;
          if (result.body.length > 0) {
            this._isGroupCreated = true;
            this._isLocked = result.body[0].locked;
            
            for (let i = 0; i < result.body.length; i++) {
              const data = {
                group_id: result.body[i].group_id,
                group_type: result.body[i].group_type,
                category_id: result.body[i].category_id,
                event_id: result.body[i].event_id,
                group_details: result.body[i].group_details,
                label: 'Group ' + (i + 1),
                showButton: false,
                showDropDown: false,
                data: 'Pictures Folder1',
                playerAdded: 3,
                expandedIcon: 'pi pi-folder-open',
                collapsedIcon: 'pi pi-folder',
                children: [],
              };
              this._groupList.push(data);
            }
          } else {
            this._isGroupCreated = false;
          }
        },
        error: (result: any) => {
          this._groupList = [];
          this._showLoader = false;
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      });
  }
}
//#endregion

//#region With this method we are getting Group Matches Details
getGroupMatchDetails() {
  this._matchDetailsList = [];
  this._showLoader = false;
  if (
    this._eventId !== undefined &&
    this._currentCategoryId !== undefined
  ) {
    this.eventsService
      .getGroupMatchDetailsV3(
        this._eventId,
        this._currentCategoryId,
        1
      )
      .subscribe({
        next: (result: any) => {
          this._showLoader = false;
          //this.getPlayersForMainDraw();
          this._matchDetailsList = result.body;

          if (this._matchDetailsList.length > 0) {
            this.isMatchesCreated.emit(true);
          } else {
            this.isMatchesCreated.emit(false);
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
  this.checkCatMatches(this._currentCategoryId)
}
//#endregion

//#region This method is used for check Matches base on category Id
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
//#endregion

showMatches() {
  this._showGroupMatches = true;
}

showGroups() {
  this._showGroupMatches = false;
  this._isLocked = true;
}

isWinner(data: any) {
  if (data.winner == null) {
    return true;
  } else {
    return false;
  }
}
getSetScor(users: any) {
  if (users.winner !== null) {
    return users.match_details[0].set_won + '-' + users.match_details[1].set_won;
  } else {
    return '';
  }
}
}

