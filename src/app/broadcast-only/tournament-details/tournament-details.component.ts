import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { CommonApiService } from 'src/app/services/Common/common-api.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { JsonDataCallingService } from 'src/app/services/LocalDataJsonDataAPI/json-data-calling.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { BroadcastOnlyService } from 'src/app/services/broadcastOnly/broadcast-only.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'stupa-tournament-details',
  templateUrl: './tournament-details.component.html',
  styleUrls: ['./tournament-details.component.scss'],
  providers: [MessageService, ConfirmationDialogService]
})
export class TournamentDetailsComponent {
  _selectedBanner: any = '';
  _countryList: any;
  azureLoggerConversion: any = new Error();
  _isPublish: any = [];
  _eventDetailForm!: FormGroup;
  _currentDate: any = new Date();
  @Output() matchIndex = new EventEmitter<any>();
  _uploadImage: any;
  _eventUpdatedData: any;
  _updateEventFlag: boolean = false;
  event_id: any;
  _isSubmitEvent:boolean = false;
  constructor(private messageService: MessageService, private confirmationDialogService: ConfirmationDialogService,
    private commonApiService: CommonApiService, private formBuilder: FormBuilder, private broadcastService: BroadcastOnlyService,
    private eventsService: EventsService, private encyptDecryptService: EncyptDecryptService,
    private jsonDataCallingService: JsonDataCallingService, private azureLoggerService: MyMonitoringService, private router: Router) {
    this.getCountryList();
    this.isPublish();
    this.loadTournamentDetails();
    
  }
  ngOnInit(): void {
    if (localStorage.getItem('event_id')) {
      this.event_id = this.encyptDecryptService.decryptUsingAES256(
        localStorage.getItem('event_id')
      );
      this.getDetailsByEventId();
    }
  }

  //#region FormControl for Event details
  loadTournamentDetails() {
    this._eventDetailForm = this.formBuilder.group({
      isPublish: new FormControl('', Validators.compose([Validators.required])),
      eventStartDate: new FormControl('', Validators.compose([Validators.required])),
      eventEndDate: new FormControl('', Validators.compose([Validators.required])),
      eventName: new FormControl('', Validators.compose([Validators.required])),
      address: new FormControl('', Validators.compose([Validators.required])),
      eventCountry: new FormControl('', Validators.compose([Validators.required])),
      description: new FormControl(''),


    });
  }
  //#endregion FormControl for Event details


  //#region Here we are checking image size and format on upload and uploading it 
  fileDetail(file: any) {
    // this._showBanner = true
    //this.showImage = false;

    const maxSize = 800 * 1024; //800KB
    const minSize = 50 * 1024; //50KB
    if (file) {
      const extension = file.item(0).name.split('.')[1];
      if (extension !== 'jpg' && extension !== 'jpeg' && extension !== 'png') {
        // File format not allowed
        this.messageService.add({
          key: 'bc',
          severity: 'info',
          summary: 'Info',
          detail: 'Only the jpg/jpeg/png file types are supported',
          life: 3000,
        });
      }
      else {
        if (file[0].size > maxSize || file[0].size < minSize) {
          this.messageService.add({
            key: 'bc',
            severity: 'info',
            summary: 'Info',
            detail: 'File size must be between 50KB-800KB range',
            life: 3000,
          });
        }
        else {
          // this._showBanner = true;
          this._selectedBanner = file.item(0);
          // this._uploadImage = this._selectedBanner
          // this._selectedUpdateBanner = this._selectedBanner
          let reader = new FileReader();
          reader.onload = (event: any) => {
            this._selectedBanner = event.target.result;
          };
          reader.readAsDataURL(this._selectedBanner);
          this.uploadBanner()
        }
      }
    }
  }
  //#endregion Here we are checking image size and format on upload and uploading it 

  //#region API call to get-Countries
  getCountryList() {
    this.commonApiService.getCountriesList().subscribe({
      next: (result: any) => {
        this._countryList = result.body;
      },
      error: (result:any) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    });
  }
  //#endregion API call to get-Countries

  //#region fetching jsonData to get to get enum of isPublishorNot
  isPublish() {
    this.jsonDataCallingService.getIsPublishOrNot().subscribe({
      next: (result: any) => {
        this._isPublish = result;
      },
      error: (result:any) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    });
  }
  //#endregion fetching jsonData to get to get enum of isPublishorNot

  createTournament() {
    if(this._eventDetailForm.valid && this._selectedBanner!=''){ 
      this._isSubmitEvent = false;
    var data =
    {
      event_name: this._eventDetailForm.controls['eventName'].value,
      country_id: this._eventDetailForm.controls['eventCountry'].value,
      address: this._eventDetailForm.controls['address'].value,
      published: this._eventDetailForm.controls['isPublish'].value=== 'Publish' ? true:false,
      image_url: this._uploadImage,
      description: this._eventDetailForm.controls['description'].value,
      event_start_time:  moment(this._eventDetailForm.controls['eventStartDate'].value).format('YYYY-MM-DD') + 'T00:30:00',
      event_end_time: moment(this._eventDetailForm.controls['eventEndDate'].value).format('YYYY-MM-DD') + 'T23:59:00',
    }
    this.broadcastService.createTournament(data)
      .subscribe({
        next: (result: any) => {
          var eventId = this.encyptDecryptService.encryptUsingAES256(result.body.event_id.toString());
          localStorage.setItem('event_id', eventId);
          localStorage.setItem('data', JSON.stringify(data));
          //this.getDetailsByEventId();
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: result.body.msg,
            life: 1000,
          });
          setTimeout(() => {
            this.matchIndex.emit(0);
          }, 2000);
          
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg;
          this.azureLoggerService.logException(this.azureLoggerConversion);
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
    else{
      this._isSubmitEvent = true;
      this.messageService.add({
        key: 'bc',
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required details',
        life: 3000,
      });
    }
  }
  updateTournament() {
    var data =
    {
      event_name: this._eventDetailForm.controls['eventName'].value,
      country_id: this._eventDetailForm.controls['eventCountry'].value,
      address: this._eventDetailForm.controls['address'].value,
      published: this._eventDetailForm.controls['isPublish'].value=== 'Publish' ? true:false,
      image_url: this._uploadImage,
      description: this._eventDetailForm.controls['description'].value,
      event_start_time:  moment(this._eventDetailForm.controls['eventStartDate'].value).format('YYYY-MM-DD') + 'T00:30:00',
      event_end_time: moment(this._eventDetailForm.controls['eventEndDate'].value).format('YYYY-MM-DD') + 'T23:59:00',
      event_id: parseInt(this.event_id),
      is_active: true

    }
    this.broadcastService.updateTournament(data)
      .subscribe({
        next: (result: any) => {
          this.getDetailsByEventId();
          //this.matchIndex.emit(0);
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
          this.azureLoggerService.logException(this.azureLoggerConversion);
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
  uploadBanner() {
    const formData = new FormData();
    formData.append('file', this._selectedBanner)
    this.broadcastService.updateEventImage(formData).subscribe({
      next: (data: any) => {
        this._uploadImage = data.body.url;
      },
      error: (result: any) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this.messageService.add({
          key: 'bc',
          severity: 'info',
          summary: 'Info',
          detail: result.error.msg,
          life: 3000,
        });
      },
      complete: () =>{
        
      }
    })

  }
  //#region Here we are fetching details by event_ID
  getDetailsByEventId() {
    this.eventsService.getDetailsByEventId(this.event_id).subscribe({
      next: (data: any) => {
        var currentData = data.body.filter((x: any) => x.event_id == this.event_id)[0];
        this._eventUpdatedData = currentData;
        this.getUpdatedData();
      },
      error: (data: any) => {
        this.azureLoggerConversion = data.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => {

      },
    })
  }
  //#endregion Here we are fetching details by event_ID

  //#region Here we are setting values in the formControl on update and after create
  getUpdatedData() {
    this._updateEventFlag = true;
    this._eventDetailForm.controls['eventName'].setValue(this._eventUpdatedData.event_name);
    this._eventDetailForm.controls['eventStartDate'].setValue(new Date(this._eventUpdatedData.event_start_time));
    this._eventDetailForm.controls['eventEndDate'].setValue(new Date(this._eventUpdatedData.event_end_time));
    this._eventDetailForm.controls['eventCountry'].setValue(this._eventUpdatedData.country_id);
    this._eventUpdatedData.published===true ?  this._eventDetailForm.controls['isPublish'].setValue('Publish') : this._eventDetailForm.controls['isPublish'].setValue('Unpublish');
    this._eventDetailForm.controls['description'].setValue(this._eventUpdatedData.description);
    this._eventDetailForm.controls['address'].setValue(this._eventUpdatedData.address);
    this._selectedBanner = this._eventUpdatedData.image_url;
    localStorage.setItem('data', JSON.stringify(this._eventUpdatedData));
  }
  //#endregion Here we are setting values in the formControl on update and after create


  deleteTournament() {
    this.confirmationDialogService
      .confirm(
        'Please confirm..',
        'Are you sure , you want to delete this event?'
      )
      .then((confirmed) => {
        if (confirmed) {
          var data =
          {
            event_name: this._eventDetailForm.controls['eventName'].value,
            country_id: this._eventDetailForm.controls['eventCountry'].value,
            address: this._eventDetailForm.controls['address'].value,
            published: true,
            image_url: this._selectedBanner,
            description: this._eventDetailForm.controls['description'].value,
            event_start_time: this._eventDetailForm.controls['eventStartDate'].value,
            event_end_time: this._eventDetailForm.controls['eventEndDate'].value,
            event_id: this.event_id,
            is_active: 0

          }
          this.broadcastService.updateTournament(data)
            .subscribe({
              next: (result: any) => {
                this.messageService.add({
                  key: 'bc',
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Event deleted successfully.',
                  life: 3000,
                });
                setTimeout(() => {
                  this.router.navigate(['/home/organize']);
                }, 1000);
              },
              error: (result: any) => {
                this.azureLoggerConversion = result.error.msg
                this.azureLoggerService.logException(this.azureLoggerConversion)
              },
              complete: () => { },
            });
        }
        else {
        }
      })
      .catch(() => { });
  }
}

