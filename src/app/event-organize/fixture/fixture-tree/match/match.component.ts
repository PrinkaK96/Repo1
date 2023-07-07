import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { RankingsComponent } from 'src/app/event-organize/rankings/rankings.component';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'stupa-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
})
export class MatchComponent implements AfterViewInit {
  //#region Variables
  @Input() match: any;
  @Input() round: any;
  @Input() index: any;
  @Input() parentIndex: any;
  @Input() fillList: any;
  @Input() _currentParticipantId: any;
  @Input() selectedCategoryId: any;
  @Input() viewer: boolean = false;
  @Output('updatedPullList') updatedPullList = new EventEmitter<any>();
  @ViewChild(RankingsComponent)
  @Output() isScoreUpdated = new EventEmitter<any>();
  @Output() refreshTree = new EventEmitter<any>();
  @Input() groupType: any
  _showScorePanel: boolean = false;
  _showPanel: boolean = false;
  _eventId: any;
  _teamMatchDetails: any = [];
  _crownShow: boolean = true;
  azureLoggerConversion: any = new Error();
  _updateScore: boolean = false;
  _matchFullDetails: any = [];
  _scoreArray: any = [];
  _parent_match_id: any = '';
  _groupId: any;
  //#region
  constructor(
    private eventsService: EventsService, private azureLoggerService: MyMonitoringService,
    private encyptDecryptService: EncyptDecryptService
  ) {
    this._currentParticipantId;
  }

  ngAfterViewInit(): void {
    this._currentParticipantId;
  }

  ngOnInit() {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this._currentParticipantId;
    this.match

  }
  //#region With This method we are able to know index of current round
  getIndex(match_index: any) {
    if (this.round == 0) {
      return match_index + 1 + this.index + 1 * this.index;
    } else {
      return '';
    }
  }
  //#endregion
  //#region This method is used for show and hide score
  showScore(data: any, details: any) {

    if (details == '') {
      this._showScorePanel = false;
    } else {

      this.eventsService
        .getTeamMatches(this._eventId, details.match_id)
        .subscribe({
          next: (result: any) => {
            this._teamMatchDetails = result.body;
            if (
              this._currentParticipantId === 1 ||
              this._currentParticipantId === 3 ||
              this._currentParticipantId === 4
            ) {
              this._showPanel = data;
            } else {
              this._showScorePanel = data;
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
  //#region This method is used for get first letter
  getFirstLetters(data: any) {
    if (data.split(' ').length > 1) {
      return (
        data.split(' ')[0].charAt(0).toUpperCase() +
        data.split(' ')[1].charAt(0).toUpperCase()
      );
    } else {
      return data.split(' ')[0].charAt(0).toUpperCase();
    }
  }
  //#endregion
  //#region This method return true or false value base on it we are able to show hide score
  isShowScoreTeams(data: any) {
    if (
      data[0].participant_name !== null &&
      data[1].participant_name !== null
    ) {
      if (
        data[0].participant_name == 'BYE' ||
        data[1].participant_name == 'BYE'
      ) {
        data[0].set_won = '';
        data[1].set_won = '';
        return false;
      } else {
        if (data[0].set_won > 0 || data[1].set_won > 0) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      data[0].set_won = '';
      data[1].set_won = '';
      return false;
    }
  }
  //#endregion
  //#region This method return true or false value base on it we are able to show hide score
  isShowScore(data: any) {

    if (
      data[0].participant_name !== null &&
      data[1].participant_name !== null
    ) {
      if (
        data[0].participant_name == 'BYE' ||
        data[1].participant_name == 'BYE'
      ) {
        data[0].set_won = '';
        data[1].set_won = '';
        return false;
      } else {
        if (data[0].set_won > 0 || data[1].set_won > 0) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      data[0].set_won = '';
      data[1].set_won = '';
      return false;
    }
  }
  //#endregion
  showCrown(participant_id: any, winderId: any) {
    if (participant_id == winderId) {
      return true;
    }
    else {
      return false;
    }
  }

  showEdit(data: any) {
    this._matchFullDetails = [];
    this._scoreArray = []
    this._groupId = data.group_id;
    if (this._currentParticipantId == 2) {
      this._parent_match_id = data.match_id;
      this.eventsService.getTeamParticipantsDetails(this._eventId, this.selectedCategoryId, data.match_id).subscribe({
        next: (result: any) => {
          this._matchFullDetails = result.body
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      });
    } else {
      for (let f = 0; f < data.match_details[0].score.length; f++) {
        const dd = { value: this.digits_count(data.match_details[0].score[f]) + '-' + this.digits_count(data.match_details[1].score[f]) }
        this._scoreArray.push(dd)
      }

      const dd = {
        "table": data.table,
        "start_time": data.start_time,
        "umpire_name": data.umpire_name,
        "round_name": data.round_description,
        "match_id": data.match_id,
        "group_id": data.group_id,
        "participantA_id": data.match_details[0].participant_id,
        "participantB_id": data.match_details[1].participant_id,
        "participantA_name": data.match_details[0].participant_name,
        "participantB_name": data.match_details[1].participant_name,
        "sets": this._scoreArray
      }
      this._matchFullDetails.push(dd);
    }
    this._updateScore = true;
  }
  //#region Method is used for count digits
  digits_count(n: any) {
    if (n == 0) { return '00'; }
    else if (n == undefined) {
      return '00-00';
    } else if (n == 10) {
      return n;
    } else {
      var count = 0;
      if (n >= 1) ++count;

      while (n / 10 >= 1) {
        n /= 10;
        ++count;
      }
      if (count > 1) {
        return n
      } else {
        return '0' + n;
      }
    }
  }
  //#endregion  Method is used for count digits
  showEditIcon(details: any) {
    if (details !== undefined) {
      if (details.winner == null) {
        if (details.match_details[0].participant_name == null || details.match_details[1].participant_name == null) {
          return false;
        } else {
          return true;
        }

      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  refreshScoreTree() {
    this.refreshTree.emit();
  }
}
