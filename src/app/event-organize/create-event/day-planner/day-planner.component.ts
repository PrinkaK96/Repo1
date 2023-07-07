import { Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { CommonSvgMsgComponent } from 'src/app/shared/common-svg-msg/common-svg-msg.component';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { GifLoaderComponent } from 'src/app/shared/gif-loader/gif-loader.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { SkeletonModule } from 'primeng/skeleton';
import { CommonApiService } from 'src/app/services/Common/common-api.service';

@Component({
  selector: 'stupa-day-planner',
  standalone: true,
  imports: [
    CommonModule,
    DividerModule,
    DropdownModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    CommonSvgMsgComponent,
    GifLoaderComponent,
    ToastModule,
    SkeletonModule
  ],
  templateUrl: './day-planner.component.html',
  styleUrls: ['./day-planner.component.scss'],
  providers: [MessageService],
})
export class DayPlannerComponent implements OnInit {
  _skeleton: boolean = true;
  idies = [1, 2, 1, 1, 1, 1];
  innerWidth: any
  _dateAtFirstTime: any = "";
  _currentDateIndex: any = "";
  @Output() tabToIndex = new EventEmitter<number>();
  @Output() tabIndex = new EventEmitter<number>();
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  _eventId: any;
  _eventUpdatedData: any;
  _start_Date: any;
  _start_Month: any;
  _end_Date: any
  _end_Month: any
  _plannerId: any;
  azureLoggerConversion: any = new Error();
  _monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  _dayDifference: any;
  _daysList: any = [];
  _dayPlannerForm!: FormGroup;
  _currentDate: any;
  _isSubmit: boolean = false;
  _showLoader: boolean = false;
  _officialList: any = [];
  _totalMatchs: any;
  _officialForEvent: any = [];
  _slotList: any = [];
  _disableDate: any
  _currentPlannerId: any;
  _deletedSlotList: any = [];
  _tableCount: any = [
    {
      name: '',
      dropDownDetails: []
    }
  ];
  _setStartDate: any = "";
  _isUpdate: boolean = false;
  _currentIndex: number = 0;
  _slots: any = [];
  constructor(private encyptDecryptService: EncyptDecryptService, private router: Router, private commonApiService: CommonApiService,
    private formBuilder: FormBuilder, private eventsService: EventsService, private messageService: MessageService, private azureLoggerService: MyMonitoringService) {
    this._disableDate = new Date().toISOString().slice(0, 11) + '00:00:00';
    this.loadForm();
    this.innerWidth = window.innerWidth;
    this._eventUpdatedData = localStorage.getItem('event_data');
    this._eventUpdatedData = JSON.parse(this._eventUpdatedData);
    this.getEventOfficial();
    if (this._eventUpdatedData !== null) {
      this._currentDate = new Date(this._eventUpdatedData.event_start_time);
      this._start_Date = new Date(this._eventUpdatedData.event_start_time).getDate();
      this._start_Month = this._monthNames[new Date(this._eventUpdatedData.event_start_time).getMonth()];
      this._end_Date = new Date(this._eventUpdatedData.event_end_time).getDate();
      this._end_Month = this._monthNames[new Date(this._eventUpdatedData.event_end_time).getMonth()];
    }
  }
  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))
    this.getPlannerDates();
    this.getEventOfficial();
  }

  ngOnChanges(change: SimpleChange) {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))
    this.getPlannerDates();
    this.getEventOfficial();
  }
  eventClicked() {
    this.tabIndex.emit();
  }
  OfficialClicked() {

    this.router.navigate(['event/add-official']);
  }
  countTime(start: any, end: any) {
    if (start !== null && end !== null) {
      var diff = (start.getTime() - end.getTime()) / 1000;
      diff /= (60);
      return Math.abs(Math.round(diff));
    } else {
      return 0;
    }
  }
  loadForm() {
    this._dayPlannerForm = this.formBuilder.group({
      start_time: new FormControl('', Validators.compose([Validators.required])),
      end_time: new FormControl('', Validators.compose([Validators.required])),
      break_start_time: new FormControl(''),
      break_end_time: new FormControl(''),
      umpires: new FormControl(''),
      tables: new FormControl('', Validators.compose([Validators.required])),
      matches: new FormControl('',),
      match_duration: new FormControl(30, Validators.compose([Validators.required])),
    });
  }
  timeValidator(control: FormControl) {
    if (control.value <= this._dayPlannerForm.controls['start_time'].value || control.value >= this._dayPlannerForm.controls['end_time'].value.value) {
      return { time: true };
    }
    return null;
  }
  getPlannerDates() {
    if (this._eventId != undefined || this._eventId != null) {
      this._showLoader = true;
      this.eventsService.getPlannerDates(this._eventId).subscribe({
        next: (result: any) => {
          this._daysList = [];
          for (let i = 0; i < result.body.length; i++) {
            const data = {
              dayCount: 'Day' + ' ' + (i + 1),
              dayDate: result.body[i].day.split('T')[0].split('-')[2] + ' ' + this._monthNames[result.body[i].day.split('T')[0].split('-')[1] - 1],
              isSelectedDay: i == 0 ? true : false,
              planner_id: result.body[i].intervals.length > 0 ? result.body[i].planner_id : 0,
              dayDateFromBackEnd: result.body[i].day
            }
            this._daysList.push(data);
          }
          this._showLoader = false;
          this._dateAtFirstTime = result.body[0].day.split("T")[0];
          this._currentDateIndex = result.body[0].day;
          this.getEventPlannerDetails(this._daysList[0].planner_id);
        },
        error: (result: any) => {
          this._showLoader = false;
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => {
        },
      })
    }
  }
  updatePlan() {
    if (this._currentPlannerId == 0) {
      this.createEventPlanner();
    } else {
      this.updateDayPlanner();
    }
  }
  createEventPlanner() {
    if (this._dayPlannerForm.valid) {
      if (this._dayPlannerForm.controls['start_time'].value <= this._dayPlannerForm.controls['end_time'].value ||
        this._dayPlannerForm.controls['end_time'].value >= this._dayPlannerForm.controls['start_time'].value) {
        this._showLoader = true;
        this._isSubmit = false;
        this._slotList = [];
        for (let i = 0; i < this._officialForEvent.length; i++) {
          const data = {
            "table": (i + 1),
            "umpire_id": this._officialForEvent[i].user_id > 0 ? this._officialForEvent[i].user_id : 0,
            "umpire_name": this._officialForEvent[i].umpire_name != '' ? this._officialForEvent[i].umpire_name : '',
          }
          this._slotList.push(data);
        }
        this._setStartDate === "" ? this._dateAtFirstTime : this._setStartDate
        if (this._setStartDate === "") {
          this._setStartDate = this._dateAtFirstTime;
          this._currentDate = this._currentDateIndex
        }
        else {
          this._setStartDate = this._setStartDate;
          this._currentDate = this._currentDate
        }
        var data;

        data = {
          "planner": {
            "event_id": parseInt(this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))),
            "date": this._currentDate,
            "start_time": this._setStartDate + "T" + this._dayPlannerForm.controls['start_time'].value.toString().split("GMT")[0].slice(16, 22) + '00' + "Z",
            "end_time": this._setStartDate + "T" + this._dayPlannerForm.controls['end_time'].value.toString().split("GMT")[0].slice(16, 22) + '00' + "Z",
            "umpires": this._dayPlannerForm.controls['umpires'].value,
            "tables": parseInt(this._dayPlannerForm.controls['tables'].value),
            "matches": this._totalMatchs,
            "match_duration": parseInt(this._dayPlannerForm.controls['match_duration'].value),
            "break_start_time": (this._dayPlannerForm.controls['break_start_time'].value != null) ? this._setStartDate + "T" + this._dayPlannerForm.controls['break_start_time'].value.toString().split("GMT")[0].slice(16, 22) + '00' + "Z" : null,
            "break_end_time": (this._dayPlannerForm.controls['break_end_time'].value != null) ? this._setStartDate + "T" + this._dayPlannerForm.controls['break_end_time'].value.toString().split("GMT")[0].slice(16, 22) + '00' + "Z" : null,
          },
          "slots": this._slotList
        }
        const dd = this.commonApiService.skipParameterOne(data.planner, "break_start_time")
        data.planner = this.commonApiService.skipParameterOne(dd, "break_end_time")
        this.eventsService.createDayPlanner(data).subscribe({
          next: (data: any) => {
            this._showLoader = false;
            this._dayPlannerForm.markAsPristine()
            this.messageService.add({
              key: 'bc',
              severity: 'success',
              summary: 'Success',
              detail: data.body.msg,
              life: 3000,
            });

            this._daysList[this._currentIndex].planner_id = data.body.planner_id
            this.getEventPlannerDetails(data.body.planner_id);

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
          complete: () => {

          },
        })
      }
      else {
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Error',
          detail: 'Please enter StartTime/EndTime in the proper format.',
          life: 3000,
        });
      }
    }
    else {
      this._isSubmit = true;
    }
  }
  resetForm() {
    this._isSubmit = false;
    this._dayPlannerForm.reset();
    this.getEventPlannerDetails(this._plannerId)
  }
  getEventOfficial() {
    if (this._eventId != undefined) {
      this._showLoader = true;
      this.eventsService.getEventOfficial(this._eventId, true).subscribe({
        next: (result: any) => {
          this._showLoader = false;
          this._officialList = [];
          this._officialList = result.body;
          this._dayPlannerForm.controls['umpires'].setValue(this._officialList.length);
          this._dayPlannerForm.controls['umpires'].disable();
        },
        error: (result) => {
          this._showLoader = false;
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      })
    }
  }
  onDurationChange() {
    this._totalMatchs = 0;
    this.onTableSelection();
    const diff = this.countTime(this._dayPlannerForm.controls['start_time'].value, this._dayPlannerForm.controls['end_time'].value);
    const diff2 = this.countTime(this._dayPlannerForm.controls['break_start_time'].value, this._dayPlannerForm.controls['break_end_time'].value);
    const finalDiff = diff - diff2
    if (finalDiff > 0) {
      this._totalMatchs = Math.round(Math.abs(Math.round(finalDiff)) / this._dayPlannerForm.controls['match_duration'].value * this._dayPlannerForm.controls['tables'].value)
    }
    else {
      this._totalMatchs = 0
    }
  }
  selectedOfficial(data: any, index: any) {
    const dd = {
      "table": (this._officialForEvent.length + 1),
      "umpire_id": data.value.user_id,
      "umpire_name": data.value.name
    }
    for (let i = 0; i < this._officialForEvent.length; i++) {
      const data = {
        "slot_id": this._officialForEvent[i].slot_id,
        "umpire_id": this._officialForEvent[i].dropV.user_id,
        "table": this._officialForEvent[i].table,
        "planner_id": this._officialForEvent[i].planner_id,
        "umpire_name": this._officialForEvent[i].dropV.name,
        "name": this._officialForEvent[i].dropV.name,
        "user_id": this._officialForEvent[i].dropV.user_id,
        "dropV": this._officialList[this._officialList.findIndex((x: any) => x.user_id == this._officialForEvent[i].dropV.user_id)]
      }
      if (this._officialForEvent.findIndex((x: any) => x.umpire_id == this._officialForEvent[i].dropV.user_id) == -1) {
        this._officialForEvent[i] = data;
      }
    }
  }
  currentDateSelected(index: any) {

    this._currentIndex = index;
    this.getEventOfficial()
    this._plannerId = ''
    this._tableCount = [];
    for (let i = 0; i < this._daysList.length; i++) {
      if (index == i) {
        this._setStartDate = this._daysList[i].dayDateFromBackEnd.split('T')[0];
        this._currentDate = this._daysList[i].dayDateFromBackEnd
        if (this._daysList[i].planner_id !== 0) {
          this.getEventPlannerDetails(this._daysList[i].planner_id);
          this._plannerId = this._daysList[i].planner_id
        } else {
          this._isSubmit = false;
          this._dayPlannerForm.reset();
          this.getEventPlannerDetails(this._daysList[i].planner_id)
        }
        this._daysList[i].isSelectedDay = true;
      } else {
        this._daysList[i].isSelectedDay = false;
      }
    }
  }
  removeOfficial(data: any) {
    this._officialForEvent.splice(this._officialForEvent.findIndex((x: any) => x.user_id == data.user_id), 1)
    this._officialList.push(data)
  }
  getEventPlannerDetails(planner_id: any) {
    if (planner_id !== 0) {
      this._isUpdate = true;
      this._currentPlannerId = planner_id;
      this._showLoader = true;
      this.eventsService.getEventPlannerDetails(this._eventId, planner_id).subscribe({
        next: (result: any) => {
          this._dayPlannerForm.controls['start_time'].setValue(new Date(result.body[0].start_time))
          this._dayPlannerForm.controls['end_time'].setValue(new Date(result.body[0].end_time))
          this._dayPlannerForm.controls['break_start_time'].setValue(result.body[0].break_start_time != null ? new Date(result.body[0].break_start_time) : null)
          this._dayPlannerForm.controls['break_end_time'].setValue(result.body[0].break_end_time != null ? new Date(result.body[0].break_end_time) : null)
          this._dayPlannerForm.controls['umpires'].setValue(result.body[0].umpires)
          this._dayPlannerForm.controls['tables'].setValue(result.body[0].tables)
          this._dayPlannerForm.controls['matches'].setValue(result.body[0].matches)
          this._dayPlannerForm.controls['match_duration'].setValue(result.body[0].match_duration)
          this._showLoader = false;
          this._officialForEvent = [];
          this._slots = result.body[0].slots;
          this._totalMatchs = result.body[0].matches
          for (let i = 0; i < this._slots.length; i++) {
            const data = {
              "slot_id": this._slots[i].slot_id,
              "umpire_id": this._slots[i].umpire_id,
              "table": this._slots[i].table,
              "planner_id": this._slots[i].planner_id,
              "umpire_name": this._slots[i].umpire_name,
              "name": this._slots[i].umpire_name,
              "user_id": this._slots[i].umpire_id,
              "dropV": this._officialList[this._officialList.findIndex((x: any) => x.user_id == this._slots[i].umpire_id)]
            }
            this._officialForEvent.push(data)
          }
        },
        error: (result: any) => {
          this._showLoader = false;
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)

        },
        complete: () => { },
      });
      this.getEventOfficial();
    } else {
      this._isUpdate = false;
      this._currentPlannerId = 0;
      this._officialForEvent = [];
      this._totalMatchs = 0;
      this._dayPlannerForm.reset();
      this.getEventOfficial();
    }

  }
  updateDayPlanner() {
    if (this._dayPlannerForm.valid) {
      if (this._dayPlannerForm.controls['start_time'].value.toString().slice(16, 21) <= this._dayPlannerForm.controls['end_time'].value.toString().slice(16, 21) ||
        this._dayPlannerForm.controls['end_time'].value.toString().slice(16, 21) <= this._dayPlannerForm.controls['start_time'].value.toString().slice(16, 21)) {
        this._showLoader = true;
        this._isSubmit = false;

        this._slotList = [];
        for (let i = 0; i < this._officialForEvent.length; i++) {
          const data = {
            "table": this._officialForEvent[i].table,
            "umpire_id": this._officialForEvent[i].user_id > 0 ? this._officialForEvent[i].user_id : 0,
            "umpire_name": this._officialForEvent[i].umpire_name != '' ? this._officialForEvent[i].umpire_name : '',
            "slot_id": this._officialForEvent[i].slot_id == undefined ? 0 : this._officialForEvent[i].slot_id
          }
          this._slotList.push(data);
        }
        if (this._setStartDate === "") {
          this._setStartDate = this._dateAtFirstTime;
          this._currentDate = this._currentDateIndex
        }
        else {
          this._setStartDate = this._setStartDate;
          this._currentDate = this._currentDate
        }
        var data;
        if (this._dayPlannerForm.controls['break_start_time'].value === null) {
          data = {
            "planner": {
              "event_id": parseInt(this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))),
              "date": this._currentDate,
              "start_time": this._setStartDate + "T" + this._dayPlannerForm.controls['start_time'].value.toString().split("GMT")[0].slice(16, 22) + '00' + "Z",
              "end_time": this._setStartDate + "T" + this._dayPlannerForm.controls['end_time'].value.toString().split("GMT")[0].slice(16, 22) + '00' + "Z",
              "break_end_time": this._dayPlannerForm.controls['break_end_time'].value != null ? this._setStartDate + "T" + this._dayPlannerForm.controls['break_end_time'].value.toString().split("GMT")[0].slice(16, 22) + '00' + "Z" : null,
              "umpires": this._dayPlannerForm.controls['umpires'].value,
              "tables": this._dayPlannerForm.controls['tables'].value,
              "matches": this._totalMatchs,
              "match_duration": this._dayPlannerForm.controls['match_duration'].value,

            },
            "slots": this._slotList,
            "deleted_slots": this._deletedSlotList
          }
        }
        if (this._dayPlannerForm.controls['break_end_time'].value === null) {
          data = {
            "planner": {
              "event_id": parseInt(this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))),
              "date": this._currentDate,
              "start_time": this._setStartDate + "T" + this._dayPlannerForm.controls['start_time'].value.toString().split("GMT")[0].slice(16, 22) + '00' + "Z",
              "end_time": this._setStartDate + "T" + this._dayPlannerForm.controls['end_time'].value.toString().split("GMT")[0].slice(16, 22) + '00' + "Z",
              "break_start_time": this._dayPlannerForm.controls['break_start_time'].value != null ? this._setStartDate + "T" + this._dayPlannerForm.controls['break_start_time'].value.toString().split("GMT")[0].slice(16, 22) + '00' + "Z" : null,
              "umpires": this._dayPlannerForm.controls['umpires'].value,
              "tables": this._dayPlannerForm.controls['tables'].value,
              "matches": this._totalMatchs,
              "match_duration": this._dayPlannerForm.controls['match_duration'].value
            },
            "slots": this._slotList,
            "deleted_slots": this._deletedSlotList
          }
        }
        if (this._dayPlannerForm.controls['break_start_time'].value === null && this._dayPlannerForm.controls['break_end_time'].value === null) {
          data = {
            "planner": {
              "event_id": parseInt(this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))),
              "date": this._currentDate,
              "start_time": this._setStartDate + "T" + this._dayPlannerForm.controls['start_time'].value.toString().split("GMT")[0].slice(16, 22) + '00' + "Z",
              "end_time": this._setStartDate + "T" + this._dayPlannerForm.controls['end_time'].value.toString().split("GMT")[0].slice(16, 22) + '00' + "Z",
              "umpires": this._dayPlannerForm.controls['umpires'].value,
              "tables": this._dayPlannerForm.controls['tables'].value,
              "matches": this._totalMatchs,
              "match_duration": this._dayPlannerForm.controls['match_duration'].value
            },
            "slots": this._slotList,
            "deleted_slots": this._deletedSlotList
          }
        } else {
          data = {
            "planner": {
              "event_id": parseInt(this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))),
              "date": this._currentDate,
              "start_time": this._setStartDate + "T" + this._dayPlannerForm.controls['start_time'].value.toString().split("GMT")[0].slice(16, 22) + '00' + "Z",
              "end_time": this._setStartDate + "T" + this._dayPlannerForm.controls['end_time'].value.toString().split("GMT")[0].slice(16, 22) + '00' + "Z",
              "break_start_time": this._setStartDate + "T" + this._dayPlannerForm.controls['break_start_time'].value.toString().split("GMT")[0].slice(16, 22) + '00' + "Z",
              "break_end_time": this._setStartDate + "T" + this._dayPlannerForm.controls['break_end_time'].value.toString().split("GMT")[0].slice(16, 22) + '00' + "Z",
              "umpires": this._dayPlannerForm.controls['umpires'].value,
              "tables": this._dayPlannerForm.controls['tables'].value,
              "matches": this._totalMatchs,
              "match_duration": this._dayPlannerForm.controls['match_duration'].value
            },
            "slots": this._slotList,
            "deleted_slots": this._deletedSlotList
          }
        }
        this.eventsService.updateDayPlanner(data, this._currentPlannerId).subscribe({
          next: (data: any) => {
            this._daysList[this._currentIndex].planner_id = data.body.planner_id
            this._currentPlannerId = data.body.planner_id;
            this._showLoader = false;
            this._dayPlannerForm.markAsPristine()
            this.messageService.add({
              key: 'bc',
              severity: 'success',
              summary: 'Success',
              detail: data.body.msg,
              life: 3000,
            });

            this.getEventPlannerDetails(this._currentPlannerId);
          },
          error: (data: any) => {
            this._showLoader = false;
            this.azureLoggerConversion = data.error.msg
            this.azureLoggerService.logException(this.azureLoggerConversion)
            this.messageService.add({
              key: 'bc',
              severity: 'info',
              summary: 'Info',
              detail: data.error.msg,
              life: 3000,
            });

          },
          complete: () => {

          },
        })
      }
      else {
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Error',
          detail: 'Please enter StartTime/EndTime in the proper format',
          life: 3000,
        });
      }
    }
    else {
      this._isSubmit = true;
    }
  }
  //generate number of tables(slots) 
  onTableSelection() {
    const _tempOfficialData = [];
    if (this._isUpdate) {
      for (let i = 0; i < this._dayPlannerForm.controls['tables'].value; i++) {
        const data = {
          "slot_id": this._officialForEvent[i] == undefined ? 0 : this._officialForEvent[i].slot_id,
          "umpire_id": this._officialForEvent[i] == undefined ? 0 : this._officialForEvent[i].umpire_id,
          "table": this._officialForEvent[i] == undefined ? i + 1 : this._officialForEvent[i].table,
          "planner_id": this._officialForEvent[i] == undefined ? this._officialForEvent[0].planner_id : this._officialForEvent[i].planner_id,
          "umpire_name": this._officialForEvent[i] == undefined ? 0 : this._officialForEvent[i].umpire_name,
          "name": this._officialForEvent[i] == undefined ? 0 : this._officialForEvent[i].name,
          "user_id": this._officialForEvent[i] == undefined ? 0 : this._officialForEvent[i].umpire_id,
          "dropV": this._officialForEvent[i] == undefined ? 0 : this._officialForEvent[i].dropV
        }
        _tempOfficialData.push(data)
      }
      this._officialForEvent = [];
      this._officialForEvent = _tempOfficialData;
    }
    else {
      this._officialForEvent = [];
      for (let i = 0; i < this._dayPlannerForm.controls['tables'].value; i++) {
        const data = {
          "slot_id": 0,
          "umpire_id": 0,
          "table": i + 1,
          "planner_id": 0,
          "umpire_name": '',
          "name": '',
          "user_id": 0,
          "dropV": ''
        }
        this._officialForEvent.push(data)
      }
    }

    //set total matches variable
    this._totalMatchs = 0;
    const diff = this.countTime(this._dayPlannerForm.controls['start_time'].value, this._dayPlannerForm.controls['end_time'].value);
    const diff2 = this.countTime(this._dayPlannerForm.controls['break_start_time'].value, this._dayPlannerForm.controls['break_end_time'].value);
    const finalDiff = diff - diff2
    if (finalDiff > 0) {
      this._totalMatchs = Math.round(Math.abs(Math.round(finalDiff)) / this._dayPlannerForm.controls['match_duration'].value * this._dayPlannerForm.controls['tables'].value)
    }
    else {
      this._totalMatchs = 0
    }
  }
}
