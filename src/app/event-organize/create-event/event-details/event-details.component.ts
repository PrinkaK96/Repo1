import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MessageService } from 'primeng/api';
import { CommonApiService } from 'src/app/services/Common/common-api.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { UserProfileService } from 'src/app/services/UserProfile/user-profile.service';
import { SessionExpireService } from 'src/app/services/SessionExpire/session-expire.service';
import { DatePipe } from '@angular/common';
import { ProfileMenuService } from 'src/app/services/ProfileMenu/profile-menu.service';
import { JsonDataCallingService } from 'src/app/services/LocalDataJsonDataAPI/json-data-calling.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
  providers: [MessageService, ConfirmationDialogService],
})
export class EventDetailsComponent implements OnInit {
  //#region Here we are declariong Variables
  _dialogStyle = {
    width: '70vw',
  };
  _eventDetailForm!: FormGroup;
  _venueDetailForm!: FormGroup;
  _eventManagementDetailForm!: FormGroup;
  _organiserDetailForm!: FormGroup;
  _addClassDetailForm!: FormGroup;
  _isSubmitEventDetail: boolean = false;
  _isSubmitEvent: boolean = false;
  _selectedBanner: any;
  _showBanner: boolean = false;
  _eventTypes: any = [
    {
      event_type: "International",
      event_type_id: 5

    },
    {
      event_type: "Sweden Tour",
      event_type_id: 6

    },
    {
      event_type: "National",
      event_type_id: 7

    },
    {
      event_type: "District",
      event_type_id: 8

    },
    {
      event_type: "Para Competition",
      event_type_id: 9
    },];
  _currentDate: any = new Date();
  _eventSlider: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    margin: 15,
    navSpeed: 700,
    navText: [
      '<i class="pi pi-chevron-left"></i>',
      '<i class="pi pi-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 3,
      },
    },
    nav: true,
  };
  _countryList: any = [];
  _stateList: any = [];
  _cityList: any = [];
  _selectedUpdateBanner: any;
  _getBannerUrl: any;
  _uploadImage: any;
  showImage: boolean | undefined;
  _updateEventFlag: boolean = false;
  _isImageFlag = false;
  _eventUpdatedData: any;
  _showLoader: boolean = false;
  azureLoggerConversion: any = new Error();
  _eventId: any;
  _isVenueSubmited: boolean = false;
  _isOrganiserSubmited: boolean = false;
  _saveEventManagementSubmit: boolean = false;
  _isClassEventSubmited: boolean = false;
  championShipTypes: any = [
    {
      label: 'Swedesh Championships',
      value: 'sc',
      items: [
        { label: 'Senior SM', value: 'Senior SM' },
        { label: 'Championship', value: 'Championship' },
        { label: 'SM Team SM Youth', value: 'SM Team SM Youth' },
        { label: 'Veteran SM', value: 'Veteran SM' }
      ]
    },
    {
      label: 'Other Championships',
      value: 'oc',
      items: [
        { label: 'District Championship', value: 'District Championship' },
        { label: 'National', value: 'National' },
        { label: 'Region top 12', value: 'Region top 12' },
        { label: 'Region 10:an', value: 'Region 10:an' },
        { label: 'Riks 10:an', value: 'Riks 10:an' }
      ]
    }
  ];
  selectedChampionShipTypes: any = '';
  _verificationStatus: any = [
  ]
  _venueFormSubmit: any;
  _masterCategoriesList: any = [];
  _eventParticipantType: any = [];
  _gender: any = [];
  _competitionStandard: any = [];
  _currentCompetitionStandard: any = [];
  _categoriesList: any = [];
  _updateCategory: boolean = false;
  _editedCategoryId: any;
  _statusId: any = 0;
  _showRejectPopUp: boolean = false;
  _showSentPopUp: boolean = false;
  _verification_message: any;
  _accordionIndex: number = 0;
  _isVenueUpdate: boolean = false;
  _isEventManagementUpdate: boolean = false;
  _isOrganisUpdate: boolean = false;
  _showChooseOne: boolean = false;
  _unSavedEventDetails: any;
  _unSavedEventDetailsDummy: any;
  _pointSystem: any = [{
    id: 1,
    value: 1
  },
  {
    id: 2,
    value: 1.5
  }]
  //#endregion Here we are declariong Variables
  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private eventsService: EventsService,
    private commonApiService: CommonApiService,
    private encyptDecryptService: EncyptDecryptService, private router: Router,
    private confirmationDialogService: ConfirmationDialogService,
    private azureLoggerService: MyMonitoringService,
    private userProfileService: UserProfileService,
    private sessionExpireService: SessionExpireService,
    private profileMenuService: ProfileMenuService,
    private jsonDataCallingService: JsonDataCallingService,) {
    this.getCountryList();
    this.loadFormFirstTime();
    this.loadVenueDetailForm();
    this.loadOrganiserDetailForm();
    this.loadEventManagementDetailForm();
    this.loadAddClassDetailForm();
    this.getDefaultImages();
    this.getMasterCategoriesAdmin();
    this.eventsParticipant();
    this.getCompetitionStandard();
  }
  ngOnInit(): void {
    if (localStorage.getItem('event_id')) {
      this._eventId = this.encyptDecryptService.decryptUsingAES256(
        localStorage.getItem('event_id')
      );
      this.getTournamentByEventId();
    } else {
      this._isVenueUpdate = false;
      this._isEventManagementUpdate = false;
      this._isOrganisUpdate = false;
      this._eventId = ''
      this._eventDetailForm.controls['reg_start_time'].disable();
      this._eventDetailForm.controls['reg_end_time'].disable();
      this._eventDetailForm.controls['event_end_time'].disable();
      this.getTournamentDetailFromLocal();
    }
  }
  //#region API call to get-Countries
  getCountryList() {
    this.commonApiService.getCountriesList().subscribe({
      next: (result: any) => {
        this._countryList = [];
        this._countryList = result.body;
      },
      error: (result) => {
        this._countryList = [];
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        setTimeout(() => {
          this.sessionExpireService.isSectionExpire(result.error.msg)
        }, 2000);
      },
      complete: () => { },
    });
  }
  //#endregion API call to get-Countries
  //#region First Time Form Load
  loadFormFirstTime() {
    this._eventDetailForm = this.formBuilder.group({
      published: new FormControl(false),
      championship_type: new FormControl('', Validators.compose([Validators.required])),
      eventName: new FormControl('', Validators.compose([Validators.required])),
      rank_mult: new FormControl('', Validators.compose([Validators.required])),
      event_start_time: new FormControl('', Validators.compose([Validators.required])),
      event_end_time: new FormControl('', Validators.compose([Validators.required])),
      country_id: new FormControl(''),
      state_id: new FormControl(''),
      address: new FormControl(''),
      reg_start_time: new FormControl('', Validators.compose([Validators.required])),
      reg_end_time: new FormControl('', Validators.compose([Validators.required])),
      image_url: new FormControl('', Validators.compose([Validators.required])),
      city_name: new FormControl(''),
      event_type: new FormControl('', Validators.compose([Validators.required])),
    });
  }
  //#endregion  First Time Form Load
  //#region  API calling for create new Tournament
  createNewEvent() {
    if (this._eventDetailForm.valid && this._selectedBanner) {
      this._isSubmitEvent = false;
      this._isSubmitEventDetail = false;
      const body = {
        "parent_event_id": 0,
        "event_name": this._eventDetailForm.controls['eventName'].value,
        "city_name": this._eventDetailForm.controls['city_name'].value,
        "state_id": 0,
        "country_id": 0,
        "address": this._eventDetailForm.controls['address'].value,
        "event_start_time": moment(this._eventDetailForm.controls['event_start_time'].value).format('YYYY-MM-DD') + 'T00:30:00',
        "event_end_time": moment(this._eventDetailForm.controls['event_end_time'].value).format('YYYY-MM-DD') + 'T23:59:00',
        "reg_start_time": moment(this._eventDetailForm.controls['reg_start_time'].value).format('YYYY-MM-DD') + 'T00:30:00',
        "reg_end_time": moment(this._eventDetailForm.controls['reg_end_time'].value).format('YYYY-MM-DD') + 'T23:59:00',
        "published": false,
        "event_type": this._eventDetailForm.controls['event_type'].value,
        "image_url": this._eventDetailForm.controls['image_url'].value,
        "is_active": true,
        "championship_type": this._eventDetailForm.controls['championship_type'].value,
        "rank_mult": this._eventDetailForm.controls['rank_mult'].value,
        "status_id": this._statusId == 0 ? 12 : this._statusId
      }
      this.eventsService.createNewEvent(body).subscribe({
        next: (result: any) => {
          this._eventId = result.body;
          var eventId = this.encyptDecryptService.encryptUsingAES256(result.body.toString());
          localStorage.setItem('event_id', eventId);
          //localStorage.setItem('event_id', result.body);
          const datePipe = new DatePipe('en-US');
          var regEndDate = datePipe.transform(this._eventDetailForm.controls['reg_end_time'].value, 'dd/MM/yyyy HH:mm:ss');
          var regStartDate = datePipe.transform(this._eventDetailForm.controls['reg_start_time'].value, 'dd/MM/yyyy HH:mm:ss');

          localStorage.setItem('ev_regEndDate', regEndDate == null ? '' : regEndDate);
          localStorage.setItem('ev_regStartDate', regStartDate == null ? '' : regStartDate);
          this._accordionIndex = 1;
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: 'Event Created',
            life: 2000,
          });

        },
        error: (result) => {
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'error',
            detail: result.error.msg,
            life: 3000,
          });
          setTimeout(() => {
            this.sessionExpireService.isSectionExpire(result.error.msg)
          }, 2000);
        },
        complete: () => { },
      });
    }
    else {
      this._isSubmitEventDetail = true;
      this._isImageFlag = true;
      this.messageService.add({
        key: 'bc',
        severity: 'error',
        summary: 'error',
        detail: 'Please fill all required details',
        life: 3000,
      });
    }
  }
  //#endregion API calling for create new Tournament
  //#region method is used for Upload Image to Azure blob by API Calling
  uploadProfileImage() {
    const formData = new FormData();
    formData.append('file', this._uploadImage)
    this.userProfileService.uploadProfileImage(21, formData).subscribe({
      next: (data: any) => {
        this._selectedBanner = data.body.url;
        this._eventDetailForm.controls['image_url'].setValue(data.body.url)
      },
      error: (result: any) => {
        setTimeout(() => {
          this.sessionExpireService.isSectionExpire(result.error.msg)
        }, 2000);
      },
      complete: () => { }
    })
  }
  //#endregion method is used for Upload Image to Azure blob by API Calling
  //#region method is used when user selected given images
  selecteImage(data: any) {
    this.showImage = true;
    this._showBanner = true;
    this._selectedBanner = data.url;
    this._eventDetailForm.controls['image_url'].setValue(data.url)
  }
  //#endregion method is used when user selected given images
  //#region method is used for get stateList base on selected country
  getStateList() {
    this.commonApiService.getStateList(this._eventDetailForm.controls['country_id'].value)
      .subscribe({
        next: (result: any) => {
          this._stateList = result.body;
        },
        error: (result) => {
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
          setTimeout(() => {
            this.sessionExpireService.isSectionExpire(result.error.msg)
          }, 2000);
        },
        complete: () => { },
      });
  }
  //#endregion  method is used for get stateList base on selected country
  //#region API calling for event details base on eventId
  getTournamentByEventId() {
    if (this._eventId !== '' && this._eventId !== null && this._eventId !== undefined) {
      this.eventsService.getEvents(this._eventId).subscribe({
        next: (data: any) => {
          this._showLoader = false;
          var currentData = data.body.filter((x: any) => x.event_id == this._eventId)[0];
          this._statusId = currentData.status.status_id;
          this._eventDetailForm.controls['eventName'].setValue(currentData.event_name)
          this._eventDetailForm.controls['event_start_time'].setValue(new Date(currentData.event_start_time))
          this._eventDetailForm.controls['event_end_time'].setValue(new Date(currentData.event_end_time))
          this._eventDetailForm.controls['reg_start_time'].setValue(new Date(currentData.reg_start_time))
          this._eventDetailForm.controls['reg_end_time'].setValue(new Date(currentData.reg_end_time))
          this._eventDetailForm.controls['published'].setValue(currentData.published)
          this._eventDetailForm.controls['image_url'].setValue(currentData.image_url)
          this._eventDetailForm.controls['event_type'].setValue(currentData.event_type)
          this._eventDetailForm.controls['championship_type'].setValue(currentData.championship_type)
          this._eventDetailForm.controls['rank_mult'].setValue(currentData.rank_mult);

          this._selectedBanner = currentData.image_url;
          //Venue Form
          this._isVenueUpdate = currentData.venue_details == null ? false : true;
          this._isEventManagementUpdate = currentData.event_management_details == null ? false : true;
          this._isOrganisUpdate = currentData.organiser_details == null ? false : true;
          this._venueDetailForm.controls['venue_type'].setValue(currentData.venue_details == null ? '' : currentData.venue_details.venue_type)
          this._venueDetailForm.controls['address'].setValue(currentData.venue_details == null ? '' : currentData.venue_details.address)
          if (currentData.venue_details !== null) {
            for (let i = 0; i < currentData.venue_details.hall_list.length - 1; i++) {
              this.addNewHall();
            }
            this._venueDetailForm.controls['hallInfo'].setValue(currentData.venue_details == null ? '' : currentData.venue_details.hall_list)

          }
          this._eventManagementDetailForm.controls['mobile_no'].setValue(currentData.event_management_details == null ? '' : currentData.event_management_details.mobile_no)
          this._eventManagementDetailForm.controls['competition_leader'].setValue(currentData.event_management_details == null ? '' : currentData.event_management_details.competition_leader)
          this._eventManagementDetailForm.controls['sbtf_competition_training'].setValue(currentData.event_management_details == null ? false : currentData.event_management_details.sbtf_competition_training)
          this._organiserDetailForm.controls['organising_association'].setValue(currentData.organiser_details == null ? '' : currentData.organiser_details.organising_association)
          this._organiserDetailForm.controls['contact_person'].setValue(currentData.organiser_details == null ? '' : currentData.organiser_details.contact_person)
          this._organiserDetailForm.controls['telephone_no'].setValue(currentData.organiser_details == null ? '' : currentData.organiser_details.telephone_no)
          this._organiserDetailForm.controls['address'].setValue(currentData.organiser_details == null ? '' : currentData.organiser_details.address)
          this._organiserDetailForm.controls['zip_code'].setValue(currentData.organiser_details == null ? '' : currentData.organiser_details.zip_code)
          this._organiserDetailForm.controls['location'].setValue(currentData.organiser_details == null ? '' : currentData.organiser_details.location)
          this._organiserDetailForm.controls['organiser_email'].setValue(currentData.organiser_details == null ? '' : currentData.organiser_details.organiser_email)
          this._organiserDetailForm.controls['competition_director_email'].setValue(currentData.organiser_details == null ? '' : currentData.organiser_details.competition_director_email)
          this._organiserDetailForm.controls['internet_address'].setValue(currentData.organiser_details == null ? '' : currentData.organiser_details.internet_address)
          this.getCategories();
          this._verification_message = currentData.verification_message;
          const datePipe = new DatePipe('en-US');
          // var regEndDate = datePipe.transform(this._eventDetailForm.controls['reg_end_time'].value, 'dd/MM/yyyy HH:mm:ss');
          // var regStartDate = datePipe.transform(this._eventDetailForm.controls['reg_start_time'].value, 'dd/MM/yyyy HH:mm:ss');
          var regEndDate = new Date(this._eventDetailForm.controls['reg_end_time'].value).toString();
          var regStartDate = new Date(this._eventDetailForm.controls['reg_start_time'].value).toString();

          localStorage.setItem('ev_regEndDate', regEndDate == null ? '' : regEndDate);
          localStorage.setItem('ev_regStartDate', regStartDate == null ? '' : regStartDate);
          this.isRejected();
        },
        error: (data: any) => {
          this._showLoader = false;
          this.azureLoggerConversion = data.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
          setTimeout(() => {
            this.sessionExpireService.isSectionExpire(data.error.msg)
          }, 2000);

        },
        complete: () => {

        },
      })
    }
  }
  //#endregion API calling for event details base on eventId
  //#region method is used for API calling for update event
  updateEvent() {
    const body = {
      "parent_event_id": 0,
      "event_name": this._eventDetailForm.controls['eventName'].value,
      // "city_name": this._eventDetailForm.controls['city_name'].value,
      // "state_id": this._eventDetailForm.controls['state_id'].value,
      // "country_id": this._eventDetailForm.controls['country_id'].value,
      // "address": this._eventDetailForm.controls['address'].value,
      "event_start_time": moment(this._eventDetailForm.controls['event_start_time'].value).format('YYYY-MM-DD') + 'T00:30:00',
      "event_end_time": moment(this._eventDetailForm.controls['event_end_time'].value).format('YYYY-MM-DD') + 'T23:59:00',
      "reg_start_time": moment(this._eventDetailForm.controls['reg_start_time'].value).format('YYYY-MM-DD') + 'T00:30:00',
      "reg_end_time": moment(this._eventDetailForm.controls['reg_end_time'].value).format('YYYY-MM-DD') + 'T23:59:00',
      "published": this._eventDetailForm.controls['published'].value,
      "event_type": this._eventDetailForm.controls['event_type'].value,
      "image_url": this._eventDetailForm.controls['image_url'].value,
      "is_active": true,
      "rank_mult": this._eventDetailForm.controls['rank_mult'].value,
      "status_id": this._statusId == 0 ? 12 : this._statusId
    }

    this.eventsService.updateEvent(body, this._eventId).subscribe({
      next: (result: any) => {
        const datePipe = new DatePipe('en-US');
        var regEndDate = datePipe.transform(this._eventDetailForm.controls['reg_end_time'].value, 'dd/MM/yyyy HH:mm:ss');
        var regStartDate = datePipe.transform(this._eventDetailForm.controls['reg_start_time'].value, 'dd/MM/yyyy HH:mm:ss');

        localStorage.setItem('ev_regEndDate', regEndDate == null ? '' : regEndDate);
        localStorage.setItem('ev_regStartDate', regStartDate == null ? '' : regStartDate);
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: result.body.msg,
          life: 2000,
        });
      },
      error: (result) => {
        setTimeout(() => {
          this.sessionExpireService.isSectionExpire(result.error.msg)
        }, 2000);
      },
      complete: () => { },
    });
  }
  //#endregion method is used for API calling for update event
  //#region method is used for Call API For delete Event
  deleteTournament() {
    this.confirmationDialogService
      .confirm(
        'Please confirm..',
        'Are you sure , you want to delete this event?'
      )
      .then((confirmed) => {
        if (confirmed) {
          this._showLoader = true;
          this.eventsService.deleteEvents(this._eventId).subscribe({
            next: (result: any) => {
              this._showLoader = false;
              this.messageService.add({
                key: 'bc',
                severity: 'success',
                summary: 'Success',
                detail: result.body.msg,
                life: 3000,
              });
              setTimeout(() => {
                this.router.navigate(['/home/organize']);
              }, 1000);
            },
            error: (result) => {
              this._showLoader = false;
              this.azureLoggerConversion = result.error.msg
              this.azureLoggerService.logException(this.azureLoggerConversion)
              this.messageService.add({
                key: 'bc',
                severity: 'error',
                summary: 'Error',
                detail: result.error.msg,
                life: 3000,
              });
              setTimeout(() => {
                this.sessionExpireService.isSectionExpire(result.error.msg)
              }, 2000);
            },
            complete: () => { },
          });
        }
        else {
        }
      })
      .catch(() => { });



  }
  //#endregion method is used for Call API For delete Event
  //#region method is used for get list of cities base on selected state
  getCityLists() {
    this.commonApiService
      .getCityList(this._eventDetailForm.controls['state_id'].value)
      .subscribe({
        next: (result: any) => {
          this._cityList = result.body;
        },
        error: (result) => {
          this.azureLoggerConversion = result.error.msg;
          this.azureLoggerService.logException(this.azureLoggerConversion);
          setTimeout(() => {
            this.sessionExpireService.isSectionExpire(result.error.msg)
          }, 2000);
        },
        complete: () => { },
      });
  }
  //#endregion  method is used for get list of cities base on selected state
  //#region Method call to enable/disable dates
  enableDatesonCreate() {
    if (this._eventId == '') {
      if (this._eventDetailForm.controls['event_start_time'].value != '') {
        this._eventDetailForm.controls['reg_start_time'].enable();
        this._eventDetailForm.controls['reg_end_time'].enable();
        this._eventDetailForm.controls['event_end_time'].enable();

      } else {
        this._eventDetailForm.controls['reg_start_time'].disable();
        this._eventDetailForm.controls['reg_end_time'].disable();
      }
    }
    else {
      this.enableDates()
    }
  }
  //#endregion Method call to enable/disable dates
  //#region Method call to enable/disable dates on Update
  enableDates() {
    if (this._eventDetailForm.controls['event_start_time'].value != '' || this._eventDetailForm.controls['reg_end_time'].value != '') {
      this.confirmationDialogService
        .confirm(
          'Please confirm..',
          'Are you sure you want to change your event dates because once you change the event date, your previous day planner data will be lost.'
        )
        .then((confirmed) => {
          if (confirmed) {
            this._eventDetailForm.controls['reg_start_time'].enable();
            this._eventDetailForm.controls['reg_end_time'].enable();
          }
          else {
            this._eventDetailForm.controls['event_start_time'].setValue(this.commonApiService.convertUTCDateToLocalDate(new Date(this._eventUpdatedData.event_start_time)));
            this._eventDetailForm.controls['event_end_time'].setValue(this.commonApiService.convertUTCDateToLocalDate(new Date(this._eventUpdatedData.event_end_time)));
          }
        })
        .catch(() => { });
    } else {
      this._eventDetailForm.controls['reg_start_time'].disable();
      this._eventDetailForm.controls['reg_end_time'].disable();
    }
  }
  //#endregion Method call to enable/disable dates on update
  //#region Here we are checking image size and format on upload and uploading it 
  fileDetail(file: any) {
    this.showImage = false;
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
          this._showBanner = true;
          this._selectedBanner = file.item(0);
          this._uploadImage = this._selectedBanner
          //this._selectedUpdateBanner = this._selectedBanner
          let reader = new FileReader();
          reader.onload = (event: any) => {
            this._selectedBanner = event.target.result;
          };
          reader.readAsDataURL(this._selectedBanner);
          this.uploadProfileImage();
        }
      }
    }
  }
  //#endregion Here we are checking image size and format on upload and uploading it 

  //#region API call for file upload 
  //#region API call to get default images
  getDefaultImages() {
    this.eventsService.getDefaultBanners().subscribe({
      next: (result: any) => {
        this._getBannerUrl = result.body;
        // const data = {
        //   "banner_id": 3,
        //   "is_active": true,
        //   "url": "https://stupaprodsguscentral.blob.core.windows.net/cbtm/UserProfile/21/Rectangle%201084%20%282%29.png"
        // }
        // this._getBannerUrl.push(data)
      },
      error: (result) => {
        this.azureLoggerConversion = result.error.msg;
        this.azureLoggerService.logException(this.azureLoggerConversion);
        setTimeout(() => {
          this.sessionExpireService.isSectionExpire(result.error.msg)
        }, 2000);
      },
      complete: () => { },
    });
  }
  //#endregion API call to get default images
  loadEventManagementDetailForm() {
    this._eventManagementDetailForm = this.formBuilder.group({
      sbtf_competition_training: new FormControl(true),
      competition_leader: new FormControl('', Validators.compose([Validators.required])),
      mobile_no: new FormControl('', Validators.compose([Validators.required])),

    });
  }
  loadOrganiserDetailForm() {
    this._organiserDetailForm = this.formBuilder.group({
      organising_association: new FormControl('', Validators.compose([Validators.required])),
      contact_person: new FormControl('', Validators.compose([Validators.required])),
      telephone_no: new FormControl('', Validators.compose([Validators.required])),
      address: new FormControl('', Validators.compose([Validators.required])),
      zip_code: new FormControl('', Validators.compose([Validators.required])),
      location: new FormControl('', Validators.compose([Validators.required])),
      organiser_email: new FormControl('', Validators.compose([Validators.required, Validators.pattern(
        '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'
      )])),
      competition_director_email: new FormControl('', Validators.compose([Validators.required, Validators.pattern(
        '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'
      ),])),
      internet_address: new FormControl('', Validators.compose([Validators.required])),

    });
  }

  loadVenueDetailForm() {

    this._venueDetailForm = this.formBuilder.group({
      venue_type: new FormControl('', Validators.compose([Validators.required])),
      address: new FormControl('', Validators.compose([Validators.required])),
      hallInfo: this.formBuilder.array([])
    });
    this.addNewHall();
  }
  hallInfo(): any {

    return this._venueDetailForm.get('hallInfo') as FormArray;
  }
  NewHall(): FormGroup {

    return this.formBuilder.group({
      length: new FormControl(''),
      width: new FormControl(''),
      heigth: new FormControl(''),
      light: new FormControl(''),
      no_of_table: new FormControl(''),
    });
  }
  addNewHall() {
    this.hallInfo().push(this.NewHall());
    this.addValidation();
  }
  loadAddClassDetailForm() {
    this._addClassDetailForm = this.formBuilder.group({
      category_description: new FormControl('', Validators.compose([Validators.required])),
      participant_type_id: new FormControl('', Validators.compose([Validators.required])),
      gender_id: new FormControl('', Validators.compose([Validators.required])),
      dob_cap: new FormControl(''),
      category_start_date: new FormControl(''),
      max_no: new FormControl(''),
      competition_standard: new FormControl(''),
      points: new FormControl(''),
    });
  }
  generateAlphabets(index: any) {
    var alphabets = [];
    // for (var i = 0; i < count; i++) {
    //   alphabets.push(String.fromCharCode(i + 97));
    // }
    alphabets.push(String.fromCharCode(index + 97));
    return alphabets[0].toUpperCase();

  }
  saveVenueDetails() {

    if (this._venueDetailForm.valid) {
      this._isVenueSubmited = false;
      const venueDetails = {
        "venue_type": this._venueDetailForm.controls['venue_type'].value,
        "address": this._venueDetailForm.controls['address'].value,
        "hall_list": [
          {
            "length": 0,
            "width": 0,
            "heigth": 0,
            "light": 0,
            "no_of_table": 0
          }
        ]
      }
      venueDetails.hall_list = [];
      for (let i = 0; i < this.hallInfo().controls.length; i++) {
        const hallDetail = {
          "length": parseInt(this.hallInfo().controls[i].controls['length'].value == '' ? 0 : this.hallInfo().controls[i].controls['length'].value),
          "width": parseInt(this.hallInfo().controls[i].controls['width'].value == '' ? 0 : this.hallInfo().controls[i].controls['width'].value),
          "heigth": parseInt(this.hallInfo().controls[i].controls['heigth'].value == '' ? 0 : this.hallInfo().controls[i].controls['heigth'].value),
          "light": parseInt(this.hallInfo().controls[i].controls['light'].value == '' ? 0 : this.hallInfo().controls[i].controls['light'].value),
          "no_of_table": parseInt(this.hallInfo().controls[i].controls['no_of_table'].value == '' ? 0 : this.hallInfo().controls[i].controls['no_of_table'].value)
        }
        venueDetails.hall_list.push(hallDetail);
      }
      this._venueFormSubmit = venueDetails;
      const body = {
        "venue_details": this._venueFormSubmit,
        "status_id": this._statusId == 0 ? 12 : this._statusId
      }
      this.justUpdate(body);
      this._isVenueUpdate = true;
      this._accordionIndex = 2;
    } else {
      this._isVenueSubmited = true;
    }
  }
  saveOrganiserDetails() {
    if (this._organiserDetailForm.valid) {
      this._isOrganiserSubmited = false;
      const body = {
        "organiser_details": {
          "organising_association": this._organiserDetailForm.controls['organising_association'].value,
          "contact_person": this._organiserDetailForm.controls['contact_person'].value,
          "telephone_no": this._organiserDetailForm.controls['telephone_no'].value,
          "address": this._organiserDetailForm.controls['address'].value,
          "zip_code": parseInt(this._organiserDetailForm.controls['zip_code'].value),
          "location": this._organiserDetailForm.controls['location'].value,
          "organiser_email": this._organiserDetailForm.controls['organiser_email'].value,
          "competition_director_email": this._organiserDetailForm.controls['competition_director_email'].value,
          "internet_address": this._organiserDetailForm.controls['internet_address'].value,
          "status_id": this._statusId == 0 ? 12 : this._statusId
        },
      }
      this.justUpdate(body);
      this._isOrganisUpdate = true;
      this._accordionIndex = 4;
    } else {
      this._isOrganiserSubmited = true;
    }
  }
  saveEventManagementDetailForm() {
    if (this._eventManagementDetailForm.valid) {
      this._saveEventManagementSubmit = false;
      const body = {
        "event_management_details": {
          "competition_leader": this._eventManagementDetailForm.controls['competition_leader'].value,
          "mobile_no": this._eventManagementDetailForm.controls['mobile_no'].value,
          "sbtf_competition_training": this._eventManagementDetailForm.controls['sbtf_competition_training'].value,
          "status_id": this._statusId == 0 ? 12 : this._statusId
        },
      }
      this.justUpdate(body);
      this._isEventManagementUpdate = true;
      this._accordionIndex = 3;
    } else {
      this._saveEventManagementSubmit = true;
    }

  }
  saveClassDetailsForm() {
    // this._addClassDetailForm.controls['competition_standard'].value == '' || this._addClassDetailForm.controls['points'].value == ''
    if (this._addClassDetailForm.valid) {
      this._showChooseOne = false
      this._isClassEventSubmited = false;
      var data = {
        category_description: this._addClassDetailForm.controls['category_description'].value,
        dob_cap: this._addClassDetailForm.controls['dob_cap'].value == '' || this._addClassDetailForm.controls['dob_cap'].value == null ? null : this.commonApiService.convertUTCDateToLocalDate(new Date(this._addClassDetailForm.controls['dob_cap'].value)),
        rank: this._addClassDetailForm.controls['points'].value != '' ? parseInt(this._addClassDetailForm.controls['points'].value) : null,
        max_no: this._addClassDetailForm.controls['max_no'].value != '' ? parseInt(this._addClassDetailForm.controls['max_no'].value) : null,
        participant_type_id: this._addClassDetailForm.controls['participant_type_id'].value,
        gender_id: this._addClassDetailForm.controls['gender_id'].value,
        competition_standard: this._addClassDetailForm.controls['competition_standard'].value == '' ? null : this._addClassDetailForm.controls['competition_standard'].value,
        category_start_date: this._addClassDetailForm.controls['category_start_date'].value == '' ? null : this.commonApiService.convertUTCDateToLocalDate(new Date(this._addClassDetailForm.controls['category_start_date'].value)),
      };
      if (this._eventId == '') {
        this.messageService.add({
          key: 'bc',
          severity: 'info',
          summary: 'Info',
          detail: 'First Create Event.',
          life: 3000,
        });
      } else {

        this.eventsService.createEventCategory(data, this._eventId).subscribe({
          next: (result: any) => {
            this._addClassDetailForm.reset();
            this.getCategories();
            this.messageService.add({
              key: 'bc',
              severity: 'success',
              summary: 'Success',
              detail: result.body.msg,
              life: 3000,
            });
          },
          error: (result) => {
            this.azureLoggerConversion = result.error.msg
            this.azureLoggerService.logException(this.azureLoggerConversion)
            this.messageService.add({
              key: 'bc',
              severity: 'error',
              summary: 'error',
              detail: result.error.msg,
              life: 3000,
            });
          },
          complete: () => { },
        });
      }
      if (this._addClassDetailForm.controls['competition_standard'].value == '' && this._addClassDetailForm.controls['gender_id'].value !== 3 && this._addClassDetailForm.controls['participant_type_id'].value == 1) {

        this._addClassDetailForm.controls['competition_standard'].addValidators([Validators.required]);
        this._addClassDetailForm.controls['competition_standard'].updateValueAndValidity();
        this._addClassDetailForm.controls['points'].clearValidators();
        this._addClassDetailForm.controls['points'].updateValueAndValidity();
      } else if (this._addClassDetailForm.controls['participant_type_id'].value !== 1) {
        this._addClassDetailForm.controls['points'].clearValidators();
        this._addClassDetailForm.controls['points'].updateValueAndValidity();
        this._addClassDetailForm.controls['competition_standard'].clearValidators();
        this._addClassDetailForm.controls['competition_standard'].updateValueAndValidity();
        this._addClassDetailForm.controls['points'].enable();
      }
      else {

        this._addClassDetailForm.controls['points'].addValidators([Validators.required])
        this._addClassDetailForm.controls['points'].updateValueAndValidity();
        this._addClassDetailForm.controls['competition_standard'].clearValidators();
        this._addClassDetailForm.controls['competition_standard'].updateValueAndValidity();
      }
      this._showChooseOne = true
    }

    else {
      this._isClassEventSubmited = true;
      this._isClassEventSubmited = true;
      this.messageService.add({
        key: 'bc',
        severity: 'error',
        summary: 'error',
        detail: 'Please fill all required details to add a category/class.',
        life: 3000,
      });
    }
  }
  validation(formControlName: any) {
    if (formControlName == 'competition_standard' && this._addClassDetailForm.controls['gender_id'].value !== 3 && this._addClassDetailForm.controls['participant_type_id'].value == 1) {
      this._addClassDetailForm.controls['competition_standard'].addValidators([Validators.required]);
      this._addClassDetailForm.controls['competition_standard'].updateValueAndValidity();
      this._addClassDetailForm.controls['points'].clearValidators();
      this._addClassDetailForm.controls['points'].updateValueAndValidity();
      if (this._addClassDetailForm.controls['competition_standard'].value !== '' && this._addClassDetailForm.controls['competition_standard'].value !== null && this._currentCompetitionStandard.length > 0) {
        this._addClassDetailForm.controls['points'].setValue(this._currentCompetitionStandard.filter((x: any) => x.id == this._addClassDetailForm.controls['competition_standard'].value)[0].max_rating)
        this._addClassDetailForm.controls['points'].disable();
      }
    }
    else if (this._addClassDetailForm.controls['participant_type_id'].value !== 1) {
      this._addClassDetailForm.controls['points'].clearValidators();
      this._addClassDetailForm.controls['points'].updateValueAndValidity();
      this._addClassDetailForm.controls['competition_standard'].clearValidators();
      this._addClassDetailForm.controls['competition_standard'].updateValueAndValidity();
      this._addClassDetailForm.controls['points'].enable();
    }
  }
  numberValueSet(evt: any) {

    // prevent: "e", "=", ",", "-", "."
    if ([69, 187, 188, 189, 190].includes(evt.keyCode)) {
      evt.preventDefault();
    }
  }

  justUpdate(body: any) {
    this.eventsService.updateEvent(body, this._eventId).subscribe({
      next: (result: any) => {
        if (!this._showSentPopUp) {
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: result.body.msg,
            life: 2000,
          });
        }

      },
      error: (result) => {
        this._showSentPopUp = false;
        setTimeout(() => {
          this.sessionExpireService.isSectionExpire(result.error.msg)
        }, 2000);
      },
      complete: () => {
        this.getTournamentByEventId()
      },
    });

  }
  getMasterCategoriesAdmin() {
    if (this._eventId != null || true) {
      this.profileMenuService.getMasterCategoriesAdmin(true).subscribe({
        next: (data: any) => {
          this._masterCategoriesList = data.body;

        },
        error: (data: any) => {
          this.azureLoggerConversion = data.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)

        },
        complete: () => {

        },
      })
    }
  }

  //#region fetching jsonData to get to get enum of events_participant
  eventsParticipant() {
    this.jsonDataCallingService.eventsParticipantType().subscribe({
      next: (result: any) => {
        this._eventParticipantType = result;
      },
      error: (result) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => {
        this.getGender();
      },
    });
  }
  //#endregion fetching jsonData to get to get enum of events_participant
  //#region fetching jsonData to get to get enum of  Gender
  getGender() {
    this.jsonDataCallingService.getGender().subscribe({
      next: (result: any) => {
        this._gender = result;
      },
      error: (result) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { this.getCompetitionStandard() },
    });
  }
  //#endregion fetching jsonData to get to get enum of Gender
  onKeyDown(event: any) {
    if ([69, 187, 188, 189, 190].includes(event.keyCode)) {
      event.preventDefault();
    }
  }
  selectGender() {
    this._currentCompetitionStandard = this._competitionStandard.filter((x: any) => x.gender_id == this._addClassDetailForm.controls['gender_id'].value);
    this._addClassDetailForm.controls['points'].setValue('')
    if (this._addClassDetailForm.controls['participant_type_id'].value == 1) {
      if (this._addClassDetailForm.controls['gender_id'].value == 3) {
        this._addClassDetailForm.controls['points'].addValidators([Validators.required]);
        this._addClassDetailForm.controls['points'].updateValueAndValidity();
        this._addClassDetailForm.controls['competition_standard'].clearValidators();
        this._addClassDetailForm.controls['competition_standard'].updateValueAndValidity();
        this._addClassDetailForm.controls['points'].enable();

      }
      else {
        this._addClassDetailForm.controls['competition_standard'].addValidators([Validators.required]);
        this._addClassDetailForm.controls['competition_standard'].updateValueAndValidity();
        this._addClassDetailForm.controls['points'].clearValidators();
        this._addClassDetailForm.controls['points'].updateValueAndValidity();
      }
    }

  }
  updateCategoryInfo(user_info: any) {
    this._editedCategoryId = user_info.id;
    this._updateCategory = true;
    this._addClassDetailForm.controls['category_description'].setValue(user_info.category_description);
    this._addClassDetailForm.controls['category_description'].disable();
    this._addClassDetailForm.controls['gender_id'].setValue(user_info.gender_id);
    this._addClassDetailForm.controls['gender_id'].disable();
    this.selectGender();
    this._addClassDetailForm.controls['participant_type_id'].setValue(user_info.participant_type_id);
    this._addClassDetailForm.controls['participant_type_id'].disable();
    this._addClassDetailForm.controls['max_no'].setValue(user_info.max_no);
    this._addClassDetailForm.controls['dob_cap'].setValue(user_info.dob_cap == null || user_info.dob_cap == '' ? null : new Date(this.commonApiService.convertUTCDateTimeToLocalT(user_info.dob_cap).split(',')[0]));
    this._addClassDetailForm.controls['points'].setValue(user_info.rank);
    this._addClassDetailForm.controls['competition_standard'].setValue(user_info.competition_standard);
    this._addClassDetailForm.controls['category_start_date'].setValue(user_info.category_start_date == null ? '' : new Date(user_info.category_start_date));
  }
  //#region  method is used for get data of class List By API Calling
  getCategories() {
    if (this._eventId != null) {
      this.eventsService.getEventCategories(this._eventId).subscribe({
        next: (result: any) => {
          this._categoriesList = [];
          this._categoriesList = result.body;
        },
        error: (result) => {
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'error',
            detail: result.error.msg,
            life: 3000,
          });
        },
        complete: () => { },
      });
    }
  }
  //#endregion method is used for get data of class List By API Calling
  deleteCategory(category_id: any) {
    this.confirmationDialogService
      .confirm(
        'Please confirm..',
        'Are you sure you want to delete, all data associated with this category will be lost?'
      )
      .then((confirmed) => {
        if (confirmed) {
          this.eventsService.deleteEventCategory(this._eventId, category_id).subscribe({
            next: (result: any) => {

              this.getCategories();

              this.messageService.add({
                key: 'bc',
                severity: 'success',
                summary: 'Success',
                detail: result.body.msg,
                life: 3000,
              });
            },
            error: (result) => {
              //this._showLoader = false;
              this.azureLoggerConversion = result.error.msg
              this.azureLoggerService.logException(this.azureLoggerConversion)
              this.messageService.add({
                key: 'bc',
                severity: 'error',
                summary: 'error',
                detail: result.error.msg,
                life: 3000,
              });
            },
            complete: () => { },
          });
        }
        else {
        }
      })
      .catch(() => { });
  }
  //#region method is used for get competitionStandard from local Json Data
  getCompetitionStandard() {
    this.jsonDataCallingService.getCompetitionStandard().subscribe({
      next: (result: any) => {
        this._competitionStandard = result;
      },
      error: (result) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => {
        this.verificationStatus();
      },
    });
  }
  //#endregion method is used for get competitionStandard from local Json Data
  //#region method is used for get verification Status from local Json Data
  verificationStatus() {
    this.jsonDataCallingService.getCompetitionStandard().subscribe({
      next: (result: any) => {
        this._verificationStatus = result;
      },
      error: (result) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => {
      },
    });
  }
  //#endregion  method is used for get verification Status from local Json Data

  updateCategory() {
    var data = {
      category_description: this._addClassDetailForm.controls['category_description'].value,
      dob_cap: this._addClassDetailForm.controls['dob_cap'].value == '' || this._addClassDetailForm.controls['dob_cap'].value == null ? null : this.commonApiService.convertUTCDateToLocalDate(new Date(this._addClassDetailForm.controls['dob_cap'].value)),
      rank: this._addClassDetailForm.controls['points'].value != '' ? parseInt(this._addClassDetailForm.controls['points'].value) : 0,
      max_no: this._addClassDetailForm.controls['max_no'].value != '' ? parseInt(this._addClassDetailForm.controls['max_no'].value) : null,
      participant_type_id: this._addClassDetailForm.controls['participant_type_id'].value,
      gender_id: this._addClassDetailForm.controls['gender_id'].value,
      competition_standard: this._addClassDetailForm.controls['competition_standard'].value,
      category_start_date: this._addClassDetailForm.controls['category_start_date'].value == '' ? null : this.commonApiService.convertUTCDateToLocalDate(new Date(this._addClassDetailForm.controls['category_start_date'].value)),
      id: this._editedCategoryId
    };
    this.eventsService.updateEventCategories(data, this._eventId).subscribe({
      next: (result: any) => {
        this._updateCategory = false;
        this._addClassDetailForm.reset();
        this._addClassDetailForm.controls['category_description'].enable();
        this._addClassDetailForm.controls['gender_id'].enable();
        this._addClassDetailForm.controls['participant_type_id'].enable();
        this.getCategories();
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: result.body.msg,
          life: 3000,
        });
      },
      error: (result) => {
        //this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'error',
          detail: result.error.msg,
          life: 3000,
        });
      },
      complete: () => { },
    });
  }
  getStatusByStatusId() {
    this._statusId
    if (this._statusId == 9) {
      return 'Your event has been approved'
    } else if (this._statusId == 10) {
      return 'Make the necessary changes to verify your event'
    } else if (this._statusId == '' || this._statusId == null || this._statusId == 0 || this._statusId == undefined) {
      return 'Verify your event to get it published'
    } else if (this._statusId == 11) {
      return 'Wait until your event get verified'
    } else if (this._statusId == 12) {
      return 'Verify your event to get it published'
    } else {
      return 'Wait until your event get verified'
    }
  }
  getStatusColorByStatusId() {
    this._statusId
    if (this._statusId == 11) {
      return { background: 'rgba(255, 227, 211, 0.36)', color: '#FF783E' }
    } else if (this._statusId == 9) {
      return { background: 'rgba(160, 219, 113, 0.15)', color: '#00720B' };
    } else if (this._statusId == 8) {
      return { background: ' rgba(211, 239, 255, 0.36)', color: '#0780D0' }
    } else if (this._statusId == '' || this._statusId == null) {
      return { background: ' rgba(211, 239, 255, 0.36)', color: '#0780D0' }
    } else if (this._statusId == 10) {
      return { background: 'rgba(255, 227, 211, 0.36)', color: '#FF783E' }
    } else {
      return '#FFD3D3'
    }
  }
  sendForVerification() {
    const venueDetails = {
      "venue_type": this._venueDetailForm.controls['venue_type'].value,
      "address": this._venueDetailForm.controls['address'].value,
      "hall_list": [
        {
          "length": 0,
          "width": 0,
          "heigth": 0,
          "light": 0,
          "no_of_table": 0
        }
      ]
    }
    venueDetails.hall_list = [];
    for (let i = 0; i < this.hallInfo().controls.length; i++) {
      const hallDetail = {
        "length": parseInt(this.hallInfo().controls[i].controls['length'].value),
        "width": parseInt(this.hallInfo().controls[i].controls['width'].value),
        "heigth": parseInt(this.hallInfo().controls[i].controls['heigth'].value),
        "light": parseInt(this.hallInfo().controls[i].controls['light'].value),
        "no_of_table": parseInt(this.hallInfo().controls[i].controls['no_of_table'].value)
      }
      venueDetails.hall_list.push(hallDetail);
    }
    this._venueFormSubmit = venueDetails;
    const body = {
      "parent_event_id": 0,
      "event_name": this._eventDetailForm.controls['eventName'].value,
      "event_start_time": moment(this._eventDetailForm.controls['event_start_time'].value).format('YYYY-MM-DD') + 'T00:30:00',
      "event_end_time": moment(this._eventDetailForm.controls['event_end_time'].value).format('YYYY-MM-DD') + 'T23:59:00',
      "reg_start_time": moment(this._eventDetailForm.controls['reg_start_time'].value).format('YYYY-MM-DD') + 'T00:30:00',
      "reg_end_time": moment(this._eventDetailForm.controls['reg_end_time'].value).format('YYYY-MM-DD') + 'T23:59:00',
      "published": this._eventDetailForm.controls['published'].value,
      "event_type": this._eventDetailForm.controls['event_type'].value,
      "image_url": this._eventDetailForm.controls['image_url'].value,
      "is_active": true,
      "venue_details": this._venueFormSubmit,
      "event_management_details": {
        "competition_leader": this._eventManagementDetailForm.controls['competition_leader'].value,
        "mobile_no": this._eventManagementDetailForm.controls['mobile_no'].value,
        "sbtf_competition_training": this._eventManagementDetailForm.controls['sbtf_competition_training'].value,
      },
      "organiser_details": {
        "organising_association": this._organiserDetailForm.controls['organising_association'].value,
        "contact_person": this._organiserDetailForm.controls['contact_person'].value,
        "telephone_no": this._organiserDetailForm.controls['telephone_no'].value,
        "address": this._organiserDetailForm.controls['address'].value,
        "zip_code": this._organiserDetailForm.controls['zip_code'].value == '' ? 0 : parseInt(this._organiserDetailForm.controls['zip_code'].value),
        "location": this._organiserDetailForm.controls['location'].value,
        "organiser_email": this._organiserDetailForm.controls['organiser_email'].value,
        "competition_director_email": this._organiserDetailForm.controls['competition_director_email'].value,
        "internet_address": this._organiserDetailForm.controls['internet_address'].value,
      },
      "verification_message": "string",
      "status_id": 8
    }
    this._showSentPopUp = true;
    this.justUpdate(body);

  }
  addValidation() {
    this.hallInfo().controls[0].controls['length'].setValidators(Validators.required);
    this.hallInfo().controls[0].controls['length'].updateValueAndValidity();
    this.hallInfo().controls[0].controls['width'].setValidators(Validators.required);
    this.hallInfo().controls[0].controls['width'].updateValueAndValidity();
    this.hallInfo().controls[0].controls['heigth'].setValidators(Validators.required);
    this.hallInfo().controls[0].controls['heigth'].updateValueAndValidity();
    this.hallInfo().controls[0].controls['light'].setValidators(Validators.required);
    this.hallInfo().controls[0].controls['light'].updateValueAndValidity();
    this.hallInfo().controls[0].controls['no_of_table'].setValidators(Validators.required);
    this.hallInfo().controls[0].controls['no_of_table'].updateValueAndValidity();
  }
  isRejected() {
    if (this._statusId == 10) {
      this._showRejectPopUp = true;
    } else {
      this._showRejectPopUp = false;
    }
  }
  closeButtom() {
    this._showRejectPopUp = false;
  }
  //#region method is used for get Details of Form From Local Storage
  getTournamentDetailFromLocal() {
    this._unSavedEventDetailsDummy = localStorage.getItem('_unSavedEventDetails')
    const currentData = JSON.parse(this._unSavedEventDetailsDummy)
    this._eventDetailForm.controls['eventName'].setValue(currentData.event_name);
    this._eventDetailForm.controls['event_start_time'].setValue(currentData.event_start_time.split(' ')[0] == 'Invalid' ? '' : new Date(currentData.event_start_time))
    if (currentData.event_start_time.split(' ')[0] !== 'Invalid') {
      this._eventDetailForm.controls['reg_start_time'].enable();
      this._eventDetailForm.controls['reg_end_time'].enable();
      this._eventDetailForm.controls['event_end_time'].enable();
    } else {
      this._eventDetailForm.controls['reg_start_time'].disable();
      this._eventDetailForm.controls['reg_end_time'].disable();
      this._eventDetailForm.controls['event_end_time'].disable();
    }
    this._eventDetailForm.controls['event_end_time'].setValue(currentData.event_end_time.split(' ')[0] == 'Invalid' ? '' : new Date(currentData.event_end_time))
    this._eventDetailForm.controls['reg_start_time'].setValue(currentData.reg_start_time.split(' ')[0] == 'Invalid' ? '' : new Date(currentData.reg_start_time))
    this._eventDetailForm.controls['reg_end_time'].setValue(currentData.reg_end_time.split(' ')[0] == 'Invalid' ? '' : new Date(currentData.reg_end_time))
    this._eventDetailForm.controls['published'].setValue(currentData.published)
    this._eventDetailForm.controls['image_url'].setValue(currentData.image_url)
    this._eventDetailForm.controls['event_type'].setValue(currentData.event_type)
    //venue Details
    this._eventDetailForm.controls['championship_type'].setValue(currentData.championship_type);
    this._eventDetailForm.controls['rank_mult'].setValue(currentData.rank_mult);
    this._venueDetailForm.controls['venue_type'].setValue(currentData.venue_details == null ? '' : currentData.venue_details.venue_type)
    this._venueDetailForm.controls['address'].setValue(currentData.venue_details == null ? '' : currentData.venue_details.address)
    if (currentData.venue_details !== null) {
      for (let i = 0; i < currentData.venue_details.hall_list.length - 1; i++) {
        this.addNewHall();
      }
      this._venueDetailForm.controls['hallInfo'].setValue(currentData.venue_details == null ? '' : currentData.venue_details.hall_list)

    }
    this._eventManagementDetailForm.controls['mobile_no'].setValue(currentData.event_management_details == null ? '' : currentData.event_management_details.mobile_no)
    this._eventManagementDetailForm.controls['competition_leader'].setValue(currentData.event_management_details == null ? '' : currentData.event_management_details.competition_leader)
    this._eventManagementDetailForm.controls['sbtf_competition_training'].setValue(currentData.event_management_details == null ? false : currentData.event_management_details.sbtf_competition_training)
    this._organiserDetailForm.controls['organising_association'].setValue(currentData.organiser_details == null ? '' : currentData.organiser_details.organising_association)
    this._organiserDetailForm.controls['contact_person'].setValue(currentData.organiser_details == null ? '' : currentData.organiser_details.contact_person)
    this._organiserDetailForm.controls['telephone_no'].setValue(currentData.organiser_details == null ? '' : currentData.organiser_details.telephone_no)
    this._organiserDetailForm.controls['address'].setValue(currentData.organiser_details == null ? '' : currentData.organiser_details.address)
    this._organiserDetailForm.controls['zip_code'].setValue(currentData.organiser_details == null ? '' : currentData.organiser_details.zip_code)
    this._organiserDetailForm.controls['location'].setValue(currentData.organiser_details == null ? '' : currentData.organiser_details.location)
    this._organiserDetailForm.controls['organiser_email'].setValue(currentData.organiser_details == null ? '' : currentData.organiser_details.organiser_email)
    this._organiserDetailForm.controls['competition_director_email'].setValue(currentData.organiser_details == null ? '' : currentData.organiser_details.competition_director_email)
    this._organiserDetailForm.controls['internet_address'].setValue(currentData.organiser_details == null ? '' : currentData.organiser_details.internet_address)
  }
  //#endregion method is used for get Details of Form From Local Storage
  //#region method is used for Set Forms Details In Local Storge
  setEventDetailsInLocal() {
    const venueDetails = {
      "venue_type": this._venueDetailForm.controls['venue_type'].value,
      "address": this._venueDetailForm.controls['address'].value,
      "hall_list": [
        {
          "length": 0,
          "width": 0,
          "heigth": 0,
          "light": 0,
          "no_of_table": 0
        }
      ]
    }
    venueDetails.hall_list = [];
    for (let i = 0; i < this.hallInfo().controls.length; i++) {
      const hallDetail = {
        "length": parseInt(this.hallInfo().controls[i].controls['length'].value == '' ? 0 : this.hallInfo().controls[i].controls['length'].value),
        "width": parseInt(this.hallInfo().controls[i].controls['width'].value == '' ? 0 : this.hallInfo().controls[i].controls['width'].value),
        "heigth": parseInt(this.hallInfo().controls[i].controls['heigth'].value == '' ? 0 : this.hallInfo().controls[i].controls['heigth'].value),
        "light": parseInt(this.hallInfo().controls[i].controls['light'].value == '' ? 0 : this.hallInfo().controls[i].controls['light'].value),
        "no_of_table": parseInt(this.hallInfo().controls[i].controls['no_of_table'].value == '' ? 0 : this.hallInfo().controls[i].controls['no_of_table'].value)
      }
      venueDetails.hall_list.push(hallDetail);
    }
    this._venueFormSubmit = venueDetails;
    this._unSavedEventDetails = {
      "parent_event_id": 0,
      "event_name": this._eventDetailForm.controls['eventName'].value,
      "city_name": this._eventDetailForm.controls['city_name'].value,
      "state_id": 0,
      "country_id": 0,
      "address": this._eventDetailForm.controls['address'].value,
      "event_start_time": moment(this._eventDetailForm.controls['event_start_time'].value).format('YYYY-MM-DD') + 'T00:30:00',
      "event_end_time": moment(this._eventDetailForm.controls['event_end_time'].value).format('YYYY-MM-DD') + 'T23:59:00',
      "reg_start_time": moment(this._eventDetailForm.controls['reg_start_time'].value).format('YYYY-MM-DD') + 'T00:30:00',
      "reg_end_time": moment(this._eventDetailForm.controls['reg_end_time'].value).format('YYYY-MM-DD') + 'T23:59:00',
      "published": false,
      "event_type": this._eventDetailForm.controls['event_type'].value,
      "image_url": this._eventDetailForm.controls['image_url'].value,
      "is_active": true,
      "championship_type": this._eventDetailForm.controls['championship_type'].value,
      "rank_mult": this._eventDetailForm.controls['rank_mult'].value,
      "venue_details": this._venueFormSubmit,
      "organiser_details": {
        "organising_association": this._organiserDetailForm.controls['organising_association'].value,
        "contact_person": this._organiserDetailForm.controls['contact_person'].value,
        "telephone_no": this._organiserDetailForm.controls['telephone_no'].value,
        "address": this._organiserDetailForm.controls['address'].value,
        "zip_code": parseInt(this._organiserDetailForm.controls['zip_code'].value),
        "location": this._organiserDetailForm.controls['location'].value,
        "organiser_email": this._organiserDetailForm.controls['organiser_email'].value,
        "competition_director_email": this._organiserDetailForm.controls['competition_director_email'].value,
        "internet_address": this._organiserDetailForm.controls['internet_address'].value,
      },
      "event_management_details": {
        "competition_leader": this._eventManagementDetailForm.controls['competition_leader'].value,
        "mobile_no": this._eventManagementDetailForm.controls['mobile_no'].value,
        "sbtf_competition_training": this._eventManagementDetailForm.controls['sbtf_competition_training'].value,
      },
    }
    localStorage.setItem('_unSavedEventDetails', JSON.stringify(this._unSavedEventDetails))
  }
  //#endregion method is used for Set Forms Details In Local Storge
  ngOnDestroy() {
    this.setEventDetailsInLocal()
  }
  closePopUp() {
    this._showSentPopUp = false;
  }
  addRequiredValidation() {
    if (this._addClassDetailForm.controls['participant_type_id'].value == 1) {
      this._addClassDetailForm.controls['competition_standard'].addValidators([Validators.required]);
      this._addClassDetailForm.controls['competition_standard'].updateValueAndValidity();
      this._addClassDetailForm.controls['points'].clearValidators();
      this._addClassDetailForm.controls['points'].updateValueAndValidity();

    }
    else {
      this._addClassDetailForm.controls['points'].clearValidators();
      this._addClassDetailForm.controls['points'].updateValueAndValidity();
      this._addClassDetailForm.controls['competition_standard'].clearValidators();
      this._addClassDetailForm.controls['competition_standard'].updateValueAndValidity();
      this._addClassDetailForm.controls['points'].enable();
    }
  }
  setPoints() {
    if (this._addClassDetailForm.controls['competition_standard'].value !== '' && this._addClassDetailForm.controls['competition_standard'].value !== null && this._currentCompetitionStandard.length > 0) {
      this._addClassDetailForm.controls['points'].setValue(this._currentCompetitionStandard.filter((x: any) => x.id == this._addClassDetailForm.controls['competition_standard'].value)[0].max_rating)
      this._addClassDetailForm.controls['points'].disable();
    }
  }
  setValidation() {
    this._addClassDetailForm.controls['points'].clearValidators();
    this._addClassDetailForm.controls['points'].updateValueAndValidity();
    this._addClassDetailForm.controls['competition_standard'].clearValidators();
    this._addClassDetailForm.controls['competition_standard'].updateValueAndValidity();
  }
}
