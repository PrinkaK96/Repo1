import { Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'stupa-update-score',
  templateUrl: './update-score.component.html',
  styleUrls: ['./update-score.component.scss'],
  providers: [MessageService],
})
export class UpdateScoreComponent implements OnInit {
  // val1!:string;
  _skeleton: boolean = false;
  idies = [1, 2, 3]
  id = [2];
  tables = [1, 2, 3]
  five = [1, 2, 3, 4, 5]
  __data: any;
  // __sets: any;
  faded = 'save';
  _tabOption: any = [
    { label: 'Sub Matches', value: 'on' },
    { label: 'Update Score', value: 'off' },
  ];
  _selectedTab: any = 'on';
  @Input() _matchFullDetails: any = [];
  _scoreSlotForm: FormGroup;
  _event_id: any;
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
  _createdMatchList: any = [];
  _setList: any = [];
  _scoreArray: any = [];
  _isSuccess: boolean = false
  _responseMessage: any = '';
  _isEditForScoreUpdate: boolean = false;
  @Output() teamMatchCreated = new EventEmitter<any>();
  @Output() isScoreUpadted = new EventEmitter<any>();
  @Input() _groupId: any;
  _setListCopy: any = [];
  innerWidth:any
  azureLoggerConversion: any = new Error();
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  constructor(private eventsService: EventsService,
    private formBuilder: FormBuilder,
    private encyptDecryptService: EncyptDecryptService,
    private messageService: MessageService, private azureLoggerService: MyMonitoringService
  ) {
    this._scoreSlotForm = this.formBuilder.group({
      col1: new FormControl('', Validators.compose([Validators.required])),
      col2: new FormControl('', Validators.compose([Validators.required])),
      col3: new FormControl('', Validators.compose([Validators.required])),
    });
    this.innerWidth = window.innerWidth;

  }

  ngOnInit() {
    this._event_id = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getTeamMatches();
    this._matchFullDetails;
  }
  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const chng = changes[propName];
      const cur = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);
      this._responseMessage = ''
      // this.changeLog.push(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }
    this.getTeamMatches();
  }
  selectedTab(data: any) {
  }
  updateScore() {
    this._setList = [];
    for (let k = 0; k < this._matchFullDetails[0].sets.length; k++) {
      const dd = {
        "set": (k + 1),
        "score_A": this._matchFullDetails[0].sets[k].value.split('-')[0] == null || this._matchFullDetails[0].sets[k].value.split('-')[0] == '' ? 0 : parseInt(this._matchFullDetails[0].sets[k].value.split('-')[0]),
        "score_B": this._matchFullDetails[0].sets[k].value.split('-')[1] == null || this._matchFullDetails[0].sets[k].value.split('-')[0] == '' ? 0 : parseInt(this._matchFullDetails[0].sets[k].value.split('-')[1])
      }
      this._setList.push(dd);
    }

    const data = {
      "event_id": parseInt(this._event_id),
      "category_id": this._matchFullDetails[0].category_id,
      "group_id": this._matchFullDetails[0].group_id,
      "match_id": this._matchFullDetails[0].match_id,
      "player_A": this._matchFullDetails[0].participantA_id,
      "player_B": this._matchFullDetails[0].participantB_id,
      "sets": this._setList
    }
    // this.eventsService.getParticipantTypeAndCategories(JSON.parse(this._currentEventId).event_id).subscribe({
    this.eventsService.updateScore(data).subscribe({
      next: (result: any) => {

        this._responseMessage = result.body.msg;
        this._scoreSlotForm.reset();
        this._responseMessage = '';
        this.isScoreUpadted.emit(true);
        this.teamMatchCreated.emit(true);
      },
      error: (result: any) => {
        this._responseMessage = '';
        this._responseMessage = result.error.msg;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        // if(result.error.msg!=undefined){
        //   this._responseMessage = result.error.msg;
        // }
        // else{
        //   this._responseMessage = 'Please fill valid scores';
        // }
      },
      complete: () => { },
    });
  }
  getTeamMatches() {
    // this._skeleton=true;
    if (this._parent_match_id !== '' && this._parent_match_id !== null && this._parent_match_id !== undefined) {
      this.eventsService.getTeamMatches(this._event_id, this._parent_match_id).subscribe({
        next: (result: any) => {
          // this._skeleton=true
          this._responseMessage = '';
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

          this._responseMessage = '';
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
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
  updateTeamScore(index: any) {

    this._setList = [];
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
    this.eventsService.updateTeamScore(this._createdMatchList[index]).subscribe({
      next: (result: any) => {

        this._isSuccess = true;
        this._responseMessage = result.body.msg;
        this.getTeamMatches();
      },
      error: (result: any) => {
        this._isSuccess = false;
        this._responseMessage = result.error.msg;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this.messageService.add({
          key: 'bc',
          severity: 'warn',
          summary: 'Warning!',
          detail: result.error.msg,
          life: 3000,
        });
        this.getTeamMatches();
        // this._createdMatchList[index].sets = [];
        // for (let i = 0; i < this._setList.length; i++) {
        //   const dd = { value: this.digits_count(this._setList[i].score_A) + '-' + this.digits_count(this._setList[i].score_B) }
        //   this._createdMatchList[index].sets.push(dd);
        // }

      },
      complete: () => { },
    });

  }
  isTeamMatchCreated(isCreated: any) {
    this.teamMatchCreated.emit(true);
  }
}
