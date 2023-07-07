import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { InputMaskModule } from 'primeng/inputmask';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StepsModule } from 'primeng/steps';
import { ArrangeDialogComponent } from 'src/app/event-organize/fixture/m-s-grp-play-off/arrange-dialog/arrange-dialog.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'stupa-common-score',
  standalone: true,
  imports: [
    CommonModule,
    DividerModule,
    InputMaskModule,
    ToastModule,
    DropdownModule,
    TableModule,
    ReactiveFormsModule,
    FormsModule,
    StepsModule,
    ArrangeDialogComponent,
    SelectButtonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './common-score.component.html',
  styleUrls: ['./common-score.component.scss'],
  providers: [MessageService]
})
export class CommonScoreComponent {
  _umpires: any = [
    { name: 'DIvyanshu' },
    { name: 'DIvyanshu' },
    { name: 'DIvyanshu' },
    { name: 'DIvyanshu' },
  ]
  @Input() _currentParticipantId: any = [];
  @Input() _teamMatchFullDetails: any = [];
  @Input() _teamAPlayers: any = [];
  @Input() _teamBPlayers: any = [];
  @Input() _teamAPlayersCopy: any = [];
  @Input() _teamBPlayersCopy: any = [];
  @Input() _parent_match_id: any = '';
  @Input() _teamA_participant_id: any = '';
  @Input() _teamB_participant_id: any = '';
  @Input() _currentCategoryId: any;
  @Input() scoreFullDetails: any;
  @Input() _groupId: any;
  _tabOption: any = [
    { label: 'Players', value: 'on' },
    { label: 'Score', value: 'off' },
  ];
  _selectedTab: any = '';
  _isEditForScoreUpdate: boolean = false;
  @Output() teamMatchCreated = new EventEmitter<any>();
  @Output() isScoreUpadted = new EventEmitter<any>();
  _createdMatchList: any = [];
  _createdMatchListDummy: any = [];
  _event_id: any;
  _scoreArray: any = [];
  _setList: any = [];
  @Input() groupType: any
  _isDark: boolean = true
  constructor(private eventsService: EventsService, private encyptDecryptService: EncyptDecryptService, private messageService: MessageService,) {
    this.getTeamMatches();
  }
  ngOnInit() {
    this._event_id = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this._isDark = localStorage.getItem('isChecked') == 'true' ? true : false;

  }

  ngOnChanges(changes: SimpleChanges) {
    this._event_id = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    for (const propName in changes) {
      const chng = changes[propName];
      const cur = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);
    }
    this.getTeamMatches();
  }
  updateTeamScore(index: any) {
    this._setList = [];
    const data = this._createdMatchList[index]
    const indexX = index
    for (let k = 0; k < this._createdMatchList[index].sets.length; k++) {
      if (this._createdMatchList[index].sets[k] != undefined) {
        if (this._createdMatchList[index].sets[k].value !== undefined) {
          if (parseInt(this._createdMatchList[index].sets[k].value.split('-')[0]) !== null && parseInt(this._createdMatchList[index].sets[k].value.split('-')[1])) {
            const dd = {
              "set": (k + 1),
              "score_A": parseInt(this._createdMatchList[index].sets[k].value.split('-')[0]),
              "score_B": parseInt(this._createdMatchList[index].sets[k].value.split('-')[1])
            }
            this._setList.push(dd);
          } else {
            const dd = {
              "set": (k + 1),
              "score_A": parseInt('00'),
              "score_B": parseInt('00')
            }
            this._setList.push(dd);
          }
        }

      }
    }
    this._createdMatchList[index].sets = this._setList;
    this._createdMatchList[index].group_type = this.groupType;
    this.eventsService.updateTeamScore(this._createdMatchList[index]).subscribe({
      next: (result: any) => {

        this.isScoreUpadted.emit(true);
        this.teamMatchCreated.emit(true);
        this.getTeamMatches();
      },
      error: (result: any) => {
        this._scoreArray = []
        for (let f = 0; f < data.sets.length; f++) {
          const dd = { value: this.digits_countS(data.sets[f].score_A) + '-' + this.digits_countS(data.sets[f].score_B) }
          this._scoreArray.push(dd)
        }
        this._createdMatchList[indexX].sets = this._scoreArray
        this.messageService.add({
          key: 'bc',
          severity: 'info',
          summary: 'Info',
          detail: result.error.msg,
          life: 3000,
        });
        // this._createdMatchList[index].sets = [];
        // for (let i = 0; i < this._setList.length; i++) {
        //   const dd = { value: this.digits_count(this._setList[i].score_A) + '-' + this.digits_count(this._setList[i].score_B) }
        //   this._createdMatchList[index].sets.push(dd);
        // }

      },
      complete: () => { },
    });

  }
  updateScore() {
    this._setList = [];
    for (let k = 0; k < this.scoreFullDetails[0].sets.length; k++) {
      const dd = {
        "set": (k + 1),
        "score_A": this.scoreFullDetails[0].sets[k].value.split('-')[0] == null || this.scoreFullDetails[0].sets[k].value.split('-')[0] == '' ? 0 : parseInt(this.scoreFullDetails[0].sets[k].value.split('-')[0]),
        "score_B": this.scoreFullDetails[0].sets[k].value.split('-')[1] == null || this.scoreFullDetails[0].sets[k].value.split('-')[0] == '' ? 0 : parseInt(this.scoreFullDetails[0].sets[k].value.split('-')[1])
      }
      this._setList.push(dd);
    }

    const data = {
      "event_id": parseInt(this._event_id),
      "category_id": this._currentCategoryId,
      "group_id": this.scoreFullDetails[0].group_id == undefined ? 1 : this.scoreFullDetails[0].group_id,
      "match_id": this.scoreFullDetails[0].match_id,
      "player_A": this.scoreFullDetails[0].participantA_id,
      "player_B": this.scoreFullDetails[0].participantB_id,
      "sets": this._setList
    }
    // this.eventsService.getParticipantTypeAndCategories(JSON.parse(this._currentEventId).event_id).subscribe({
    this.eventsService.updateScore(data).subscribe({
      next: (result: any) => {
        this.isScoreUpadted.emit(true);
        this.teamMatchCreated.emit(true);
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: '',
          detail: result.body.msg,
          life: 3000,
        });
      },
      error: (result: any) => {

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
  isTeamMatchCreated(isCreated: any) {

    this.getTeamMatches();
  }
  getTeamMatches() {

    // this._skeleton=true;
    if (this._parent_match_id !== '' && this._parent_match_id !== null && this._parent_match_id !== undefined) {
      this.eventsService.getTeamMatches(this._event_id, this._parent_match_id).subscribe({
        next: (result: any) => {

          // this._skeleton=true
          if (result.body.length > 0) {
            this._teamMatchFullDetails
            this._createdMatchList = [];
            for (let i = 0; i < result.body.length; i++) {
              this._scoreArray = [];
              for (let f = 0; f < result.body[i].match_details[0].score.length; f++) {

                const dd = { value: this.digits_count(result.body[i].match_details[0].score[f]) + '-' + this.digits_count(result.body[i].match_details[1].score[f]) }
                this._scoreArray.push(dd)
              }

              const dd = {
                "event_id": this._event_id,
                "category_id": this._currentCategoryId,
                "group_id": this._groupId,
                "group_type": 1,
                "parent_match_id": result.body[i].parent_match_id,
                "teamA_participant_id": result.body[i].match_details[0].participant_id,
                "teamB_participant_id": result.body[i].match_details[1].participant_id,
                "match_id": result.body[i].match_id,
                "player_A": result.body[i].match_details[0].participant_name,
                "player_B": result.body[i].match_details[1].participant_name,
                "sets": this._scoreArray,
                "winner": result.body[i].winner
              }
              this._createdMatchList.push(dd)
            }
            this._selectedTab = 'off'
            this._isEditForScoreUpdate = true;
          } else {
            this._selectedTab = 'on'
            this._isEditForScoreUpdate = false;
          }

        },
        error: (result: any) => {

        },
        complete: () => {

        },
      });
    }
  }
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
  digits_countS(n: any) {
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
        return n * 10
      } else {
        return '0' + n;
      }
    }
  }
  getParticipantType() {
    if (this._currentParticipantId == 1) {
      return 'Single'
    } else if (this._currentParticipantId == 2) {
      return 'Teams'
    } else if (this._currentParticipantId == 3) {
      return 'Doubles'
    } else {
      return 'Mix Doubles'
    }
  }
}
