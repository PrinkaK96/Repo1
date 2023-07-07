import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AllotRankService } from 'src/app/services/allot-rank/allot-rank.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';

@Component({
  selector: 'stupa-allot-rank-pointers',
  templateUrl: './allot-rank-pointers.component.html',
  styleUrls: ['./allot-rank-pointers.component.scss'],
  providers: [MessageService],
})
export class AllotRankPointersComponent implements OnInit {
  _skeleton:boolean=false
  idies=[1,2,3,2]
  idiess=[1,2,3,2,1,1,1]
  _rankPointerForm!: FormGroup;
  event: any;
  @Output() tabIndex = new EventEmitter<number>();
  _selectedFixtureFormat: any = null;
  _display: any;
  _selectedParticipantTypes: any;
  _isSubmitRankPoints: boolean = false;
  _showLoader: boolean = false;
  _rankArray: any = [];
  _showPoints: boolean = false;
  _rounds: any = [];
  @Input() _tabIndex: any;
  azureLoggerConversion: any= new Error();
  constructor(public encyptDecryptService: EncyptDecryptService, private registrationService: EventsService, private azureLoggerService: MyMonitoringService,
    private messageService: MessageService, private allotRankService: AllotRankService, private formBuilder: FormBuilder,) {
    this.loadRankPointerForm()
    this.getParticipantAndCategories();
  }

  ngOnInit() {
    this.event = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this._showPoints = false;
    // this.event = this.encyptDecryptService.decryptUsingAES256(
    //   sessionStorage.getItem('event_id')
    // );
    this.loadRankPointerForm()
    this.getParticipantAndCategories();
  }
  ngOnChanges(changes: SimpleChanges) {
    this.event = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this._showPoints = false;
    // this.event = this.encyptDecryptService.decryptUsingAES256(
    //   sessionStorage.getItem('event_id')
    // );
    this._rounds=[];
    //this.loadRankPointerForm()
    this.getParticipantAndCategories();
    
  }
  loadRankPointerForm() {
    this._rankPointerForm = this.formBuilder.group({
      _category: new FormControl(''),
    });
  }

  eventClicked() {
    this.tabIndex.emit();

  }
  getParticipantAndCategories() {
    if (this.event != undefined || this.event != null) {
      this._showLoader = true;
      this.registrationService.getParticipantTypeAndCategories(this.event)
        .subscribe({
          next: (result: any) => {
            this._showLoader = false;
            this._selectedFixtureFormat = result.body;
            this._selectedParticipantTypes = this._selectedFixtureFormat.map(
              (pd: any) => pd.participant_description
            );
            this._display = this._selectedFixtureFormat[0].categories;
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
  showRegistrations(e: any) {
    this._rounds = [];
    this._showPoints = false;
    if (e === 'Singles') {
      this._display = this._selectedFixtureFormat.filter(
        (x: any) => x.participant_description === 'Singles'
      )[0].categories;
    } else if (e === 'Team') {
      this._display = this._selectedFixtureFormat.filter(
        (x: any) => x.participant_description === 'Team'
      )[0].categories;
    } else if (e === 'Doubles') {
      this._display = this._selectedFixtureFormat.filter(
        (x: any) => x.participant_description === 'Doubles'
      )[0].categories;
    } else {
      this._display = this._selectedFixtureFormat.filter(
        (x: any) => x.participant_description === 'Mix Doubles'
      )[0].categories;
    }
  }
  allotRankPointers() {
    if (this._rankPointerForm.controls['_category'].value != '') {
      this._showLoader = true;
      this._rankArray = []
      this._isSubmitRankPoints = false;

      for (let i = 0; i < this._rounds.length; i++) {
        const data = {
          rank_level: this._rounds[i].round_level,
          points: this._rounds[i].points === null ? 0 : this._rounds[i].points,
        }
        this._rankArray.push(data)
      }
      const _allotedRankPointers = {
        event_id: this.event,
        category_id: this._rankPointerForm.controls['_category'].value,
        ranks: this._rankArray
      }
      this.allotRankService.updateRankPointers(_allotedRankPointers)
        .subscribe({
          next: (result: any) => {
            this._showLoader = false;
            this._rankPointerForm.markAsPristine()
            this.messageService.add({
              key: 'bc',
              severity: 'success',
              summary: 'Success',
              detail: result.body.msg,
              life: 3000,
            });

          },
          error: (result: any) => {
            this.azureLoggerConversion = result.error.msg
            this.azureLoggerService.logException(this.azureLoggerConversion)
            this._showLoader = false;
            this.messageService.add({
              key: 'bc',
              severity: 'error',
              summary: 'Error',
              detail: result.error.msg,
              life: 3000,
            });
          },
          complete: () => { },
        });
    }
    else {
      this._isSubmitRankPoints = true;
      this.messageService.add({
        key: 'bc',
        severity: 'error',
        summary: 'Error',
        detail: "Please choose a category",
        life: 3000,
      });
    }
  }
  getRounds() {
    //this._showLoader = true;
 
    const categoryId = this._rankPointerForm.controls['_category'].value;
    this.allotRankService.getRounds(this.event, categoryId)
      .subscribe({
        next: (result: any) => {
          this._showPoints = true;
          //this._showLoader = false;
          this._rounds = result.body;
          // this.messageService.add({
          //   key: 'bc',
          //   severity: 'success',
          //   summary: 'Success',
          //   detail: 'Points fetched successfully',
          //   life: 3000,
          // });
        },
        error: (result: any) => {
          this._showPoints = false;
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
          //this._showLoader = false;
          // this.messageService.add({
          //   key: 'bc',
          //   severity: 'error',
          //   summary: 'Error',
          //   detail: result.error.msg,
          //   life: 3000,
          // });
        },
        complete: () => { },
      });

  }
  reset() {
    //this._rankPointerForm.controls['_category'].setValue('')
    //this._showPoints = false
    this.getRounds()

  }
}
