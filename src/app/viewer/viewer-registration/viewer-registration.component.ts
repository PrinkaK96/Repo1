import { Component, OnInit } from '@angular/core';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'stupa-viewer-registration',
  templateUrl: './viewer-registration.component.html',
  styleUrls: ['./viewer-registration.component.scss']
})
export class ViewerRegistrationComponent implements OnInit {
  _selectedFixtureFormat: any = null;
  _display: any = [];
  _selectedParticipantTypes: any;
  event_id: any;
  _displayData: any = [];
  azureLoggerConversion: any = new Error();
  _openPopup: boolean = false;
  _catStartDate: any;
  _catEndDate: any;
  _isSubmit: boolean = false;

  constructor(private azureLoggerService: MyMonitoringService, private encyptDecryptService: EncyptDecryptService, private registrationService: EventsService,) { }
  ngOnInit() {
    this.event_id = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this.getParticipantAndCategories();
    this._catStartDate = localStorage.getItem('ev_regStartDate')
    this._catStartDate = new Date(this._catStartDate)
    this._catEndDate = localStorage.getItem('ev_regEndDate');
    this._catEndDate = new Date(this._catEndDate)
  }
  getParticipantAndCategories() {
    if (this.event_id != undefined || this.event_id != null) {
      this.registrationService.getParticipantTypeAndCategories(this.event_id)
        .subscribe({
          next: (result: any) => {
            this._display = [];
            const datePipe = new DatePipe('en-US');
            //const inputDate = new Date('2023-05-04T10:03:11.428');
            //const outputDate = datePipe.transform(inputDate, 'yyyy-MM-dd HH:mm:ss');
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
                  price: this._displayData[i].price != undefined ? this._displayData[i].price : this._displayData[i].sub_categories[0].price,
                  published: this._displayData[i].published,
                  reg_end_time: this._displayData[i].sub_categories.length > 0 ? this._displayData[i].sub_categories[0].reg_end_time :
                    this._displayData[i].reg_end_time
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
    this._display = []
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
        reg_end_time: this._displayData[i].sub_categories.length > 0 ? this._displayData[i].sub_categories[0].reg_end_time :
          this._displayData[i].reg_end_time
      }
      this._display.push(data);
    }
  }

  enableRegistration(e: any) {
    this._openPopup = true;
  }


}
