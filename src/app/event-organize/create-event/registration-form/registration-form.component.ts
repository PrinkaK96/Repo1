import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { CommonApiService } from 'src/app/services/Common/common-api.service';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
  providers: [MessageService],
})
export class RegistrationFormComponent implements OnInit {
  _participantType: any;
  _fixtureFormat: any = [
    { name: 'Singles', key: 'S' },
    { name: 'Teams', key: 'T' },
    { name: 'Double', key: 'D' },
    { name: 'Mixed Doubles', key: 'MD' },
  ];

  _selectedFixtureFormat: any = null;
  _display: any = [];
  _registrationFee: any;
  _updateFlag: boolean | any;
  _selectedParticipantTypes: any;
  event_id: any;
  @Output() tabIndex = new EventEmitter<number>();
  updatedData: any;
  @Input() _tabIndex: any;
  azureLoggerConversion: any = new Error();
  _regForm!: FormGroup;
  _openPopup: boolean = false;
  _priceChange: any = [];
  _catStartDate: any;
  _catEndDate: any;
  _displayData: any = [];
  _isSubmit: boolean = false;
  constructor(
    private registrationService: EventsService,
    private messageService: MessageService,
    private encyptDecryptService: EncyptDecryptService,
    private azureLoggerService: MyMonitoringService,
    private formBuilder: FormBuilder,
    private commonApiService: CommonApiService
  ) { }
  ngOnInit(): void {
    this.event_id = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    // this.event_id = this.encyptDecryptService.decryptUsingAES256(
    //   sessionStorage.getItem('event_id')
    // );
    this.get_reg_last_date();
    this.getParticipantAndCategories();
    //this.loadRegForm()
    this._catStartDate = localStorage.getItem('ev_regStartDate')
    this._catStartDate = new Date(this._catStartDate)
    this._catEndDate = localStorage.getItem('ev_regEndDate');
    this._catEndDate = new Date(this._catEndDate)
  }
  ngOnChanges() {
    this.event_id = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    // this.event_id = this.encyptDecryptService.decryptUsingAES256(
    //   sessionStorage.getItem('event_id')
    // );
    this._catStartDate = localStorage.getItem('ev_regStartDate')
    this._catStartDate = new Date(this._catStartDate)
    this._catEndDate = localStorage.getItem('ev_regEndDate');
    this._catEndDate = new Date(this._catEndDate)
    this.getParticipantAndCategories();
  }

  loadRegForm() {
    this._regForm = this.formBuilder.group({
      _price: new FormControl(''),
      _enddate: new FormControl('')
    });
  }
  getParticipantAndCategories() {
    if (this.event_id != undefined || this.event_id != null) {
      this.registrationService.getParticipantTypeAndCategories(this.event_id)
        .subscribe({
          next: (result: any) => {
            this._display = [];
            const datePipe = new DatePipe('en-US');
            this._selectedFixtureFormat = result.body;
            this._selectedParticipantTypes = this._selectedFixtureFormat.map(
              (pd: any) => pd.participant_description
            );
            if (this._selectedFixtureFormat[0] != undefined) {
              this._displayData = this._selectedFixtureFormat[0].categories;
              for (let i = 0; i < this._displayData.length; i++) {
                const data = {
                  category_description: this._displayData[i].category_description,
                  category_id: this._displayData[i].category_id,
                  format_description: this._displayData[i].format_description,
                  format_id: this._displayData[i].format_id,
                  gender_id: this._displayData[i].gender_id,
                  max_age: this._displayData[i].max_age,
                  price: this._displayData[i].price,
                  published: this._displayData[i].published,
                  reg_end_time: this._displayData[i].sub_categories.length > 0 ? datePipe.transform(this._displayData[i].sub_categories[0].reg_end_time, 'dd/MM/yyyy HH:mm:ss') :
                  datePipe.transform(this._displayData[i].reg_end_time, 'dd/MM/yyyy HH:mm:ss')
                }
                this._display.push(data);
              }
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
  showRegistrations(e: any) {
    this._display =[]
    this._displayData = []
    const datePipe = new DatePipe('en-US');
    if (e === 'Singles') {
      this._displayData = this._selectedFixtureFormat.filter(
        (x: any) => x.participant_description === 'Singles'
      )[0].categories;
    } else if (e === 'Team') {
      this._displayData = this._selectedFixtureFormat.filter(
        (x: any) => x.participant_description === 'Team'
      )[0].categories;
    } else if (e === 'Doubles') {
      this._displayData = this._selectedFixtureFormat.filter(
        (x: any) => x.participant_description === 'Doubles'
      )[0].categories;
    } else {
      this._displayData = this._selectedFixtureFormat.filter(
        (x: any) => x.participant_description === 'Mix Doubles'
      )[0].categories;
    }

    for (let i = 0; i < this._displayData.length; i++) {
      const data = {
        category_description: this._displayData[i].category_description,
        category_id: this._displayData[i].category_id,
        format_description: this._displayData[i].format_description,
        format_id: this._displayData[i].format_id,
        gender_id: this._displayData[i].gender_id,
        max_age: this._displayData[i].max_age,
        price: this._displayData[i].price,
        published: this._displayData[i].published,
        reg_end_time: this._displayData[i].sub_categories.length > 0 ? datePipe.transform(this._displayData[i].sub_categories[0].reg_end_time, 'dd/MM/yyyy HH:mm:ss') :
        datePipe.transform(this._displayData[i].reg_end_time, 'dd/MM/yyyy HH:mm:ss')
      }
      this._display.push(data);
    }
  }
  enableRegistration(e: any) {
    this._openPopup = true;
  }
  skipParameter(body: any, parameter: any) {
    // Check if the parameter should be skipped.
    if (parameter === null || parameter === undefined || body[parameter].split(' ')[0] == 'Invalid') {
      // Remove the parameter from the body.
      delete body[parameter];
    }

    // Convert the body to JSON and return it.
    return body;
  }
  updateRegistrationFee(category_data: any) {
    const finalData = [];
    for (let i = 0; i < category_data.length; i++) {
      const data = {
        category_id: category_data[i].category_id,
        price: category_data[i].price==null ? 0 :category_data[i].price,
        published: category_data[i].published,
        reg_end_time: moment(category_data[i].reg_end_time).format('YYYY-MM-DD') + 'T00:30:00Z'
      };
      ;
      finalData.push(this.commonApiService.skipParameter(data, "reg_end_time"));
    }
    const updatedParticipantCategory = {
      category_data: finalData,
    };
    if (!this._isSubmit) {
      this.registrationService.updateRegCategory(updatedParticipantCategory, this.event_id).subscribe({
        next: (result: any) => {
          //this._regForm.markAsPristine()
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: result.body.msg,
            life: 3000,
          });
          this.getParticipantAndCategories();
        },
        error: (result) => {
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
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

  }

  priceChange(i: any) {
    this._openPopup = true;
    this._priceChange = i;
    
  }
  eventClicked() {
    this.tabIndex.emit();
  }
  reset() {
    this._display = [];
    this.registrationService.getParticipantTypeAndCategories(this.event_id)
      .subscribe({
        next: (result: any) => {
          if (this._selectedParticipantTypes[0] === 'Singles') {
            this._display = result.body[0].categories;
          }
          else if (this._selectedParticipantTypes[0] === 'Team') {
            this._display = result.body[1].categories
          }
          else if (this._selectedParticipantTypes[0] === 'Doubles') {
            this._display = result.body[2].categories
          }
          else {
            this._display = result.body[3].categories
          }
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      });
  }

  get_reg_last_date() {
    this.registrationService.get_reg_last_date(this.event_id).subscribe({
      next: (result: any) => {
        const msg = result.body.msg;
        // alert(msg)
      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    })
  }

}
