import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { CommonApiService } from 'src/app/services/Common/common-api.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { JsonDataCallingService } from 'src/app/services/LocalDataJsonDataAPI/json-data-calling.service';
import { ProfileMenuService } from 'src/app/services/ProfileMenu/profile-menu.service';
import { SessionExpireService } from 'src/app/services/SessionExpire/session-expire.service';
import { UserProfileService } from 'src/app/services/UserProfile/user-profile.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'stupa-view-admin-event',
  templateUrl: './view-admin-event.component.html',
  styleUrls: ['./view-admin-event.component.scss']
})
export class ViewAdminEventComponent implements OnInit, OnChanges {
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

  _venueFormSubmit: any;
  _masterCategoriesList: any = [];
  _eventParticipantType: any = [];
  _gender: any = [];
  _competitionStandard: any = [
    {
      id: 1,
      gender_id: 1,
      compitition_standard: 'Class 1 2000-2249 p'
    },
    {
      id: 2,
      gender_id: 1,
      compitition_standard: 'Class 2 1750-1999 p'
    },
    {
      id: 3,
      gender_id: 1,
      compitition_standard: 'Class 3 1500-1749 p'
    },
    {
      id: 4,
      gender_id: 1,
      compitition_standard: 'Class 4 1250-1499 p'
    },
    {
      id: 5,
      gender_id: 1,
      compitition_standard: 'Class 5 1000-1249 p'
    },
    {
      id: 6,
      gender_id: 1,
      compitition_standard: 'Class 6 750-999 p'
    },
    {
      id: 7,
      gender_id: 1,
      compitition_standard: 'Class 7 not more than 749 p'
    },
    {
      id: 8,
      gender_id: 1,
      compitition_standard: 'Elite class at least 2250 p'
    },
    {
      id: 9,
      gender_id: 2,
      compitition_standard: 'Elite class at least 1750 p'
    },
    {
      id: 10,
      gender_id: 2,
      compitition_standard: 'Class 1 1500-1749 p'
    },
    {
      id: 11,
      gender_id: 2,
      compitition_standard: 'Class 2 1250-1499 p'
    },
    {
      id: 12,
      gender_id: 2,
      compitition_standard: 'Class 3 1000-1249 p'
    },
    {
      id: 13,
      gender_id: 2,
      compitition_standard: 'Class 4 750-999p'
    },
    {
      id: 14,
      gender_id: 2,
      compitition_standard: 'Class 5 not more than 749 p'
    }
  ];
  _currentCompetitionStandard: any = [];
  _categoriesList: any = []
  @Input() data: any;
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
  }
  ngOnInit(): void {
    if (this.data.length > 0) {
      this.getCountryList();
      this.loadFormFirstTime();
      this.loadVenueDetailForm();
      this.loadOrganiserDetailForm();
      this.loadEventManagementDetailForm();
      this.loadAddClassDetailForm();
      if (localStorage.getItem('event_id')) {
        this._eventId = this.encyptDecryptService.decryptUsingAES256(
          localStorage.getItem('event_id')
        );
        //this.getTournamentByEventId();
      } else {
        this._eventId = ''
        this._eventDetailForm.controls['reg_start_time'].disable();
        this._eventDetailForm.controls['reg_end_time'].disable();
        this._eventDetailForm.controls['event_end_time'].disable();

      }
    }

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (localStorage.getItem('event_id')) {
      this._eventId = this.encyptDecryptService.decryptUsingAES256(
        localStorage.getItem('event_id')
      );
    }
    var a = changes;
    this.data = changes['data'].currentValue;
    if (this.data != undefined) {
      this.getCountryList();
      this.loadFormFirstTime();
      this.loadVenueDetailForm();
      this.loadOrganiserDetailForm();
      this.loadEventManagementDetailForm();
      this.loadAddClassDetailForm();
    }
    if (this.data.venue_details != null) {
      this._venueDetailForm.controls['venue_type'].setValue(this.data.venue_details == null ? '' : this.data.venue_details.venue_type)
      this._venueDetailForm.controls['address'].setValue(this.data.venue_details == null ? '' : this.data.venue_details.address)
      if (this.data.venue_details !== null) {
        for (let i = 0; i < this.data.venue_details.hall_list.length - 1; i++) {
          this.addNewHall();
        }
      }
      this._venueDetailForm.controls['hallInfo'].setValue(this.data.venue_details == null ? '' : this.data.venue_details.hall_list)

    }
    if (this.data.event_management_details != null) {
      this._eventManagementDetailForm.controls['mobile_no'].setValue(this.data.event_management_details == null ? '' : this.data.event_management_details.mobile_no)
      this._eventManagementDetailForm.controls['competition_leader'].setValue(this.data.event_management_details == null ? '' : this.data.event_management_details.competition_leader)
      this._eventManagementDetailForm.controls['sbtf_competition_training'].setValue(this.data.event_management_details == null ? '' : this.data.event_management_details.sbtf_competition_training)

    }
    if (this.data.organiser_details != null) {
      this._organiserDetailForm.controls['organising_association'].setValue(this.data.organiser_details == null ? '' : this.data.organiser_details.organising_association)
      this._organiserDetailForm.controls['contact_person'].setValue(this.data.organiser_details == null ? '' : this.data.organiser_details.contact_person)
      this._organiserDetailForm.controls['telephone_no'].setValue(this.data.organiser_details == null ? '' : this.data.organiser_details.telephone_no)
      this._organiserDetailForm.controls['address'].setValue(this.data.organiser_details == null ? '' : this.data.organiser_details.address)
      this._organiserDetailForm.controls['zip_code'].setValue(this.data.organiser_details == null ? '' : this.data.organiser_details.zip_code)
      this._organiserDetailForm.controls['location'].setValue(this.data.organiser_details == null ? '' : this.data.organiser_details.location)
      this._organiserDetailForm.controls['organiser_email'].setValue(this.data.organiser_details == null ? '' : this.data.organiser_details.organiser_email)
      this._organiserDetailForm.controls['competition_director_email'].setValue(this.data.organiser_details == null ? '' : this.data.organiser_details.competition_director_email)
      this._organiserDetailForm.controls['internet_address'].setValue(this.data.organiser_details == null ? '' : this.data.organiser_details.internet_address)

    }
    if (this.data.categories.length > 0) {
      this._categoriesList = this.data.categories;
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
      published: new FormControl(this.data.published),
      championship_type: new FormControl(this.data.championship_type),
      eventName: new FormControl(this.data.event_name),
      event_start_time: new FormControl(new Date(this.data.event_start_time)),
      event_end_time: new FormControl(new Date(this.data.event_end_time)),
      country_id: new FormControl(''),
      state_id: new FormControl(''),
      address: new FormControl(''),
      reg_start_time: new FormControl(new Date(this.data.reg_start_time)),
      reg_end_time: new FormControl(new Date(this.data.reg_end_time)),
      image_url: new FormControl(this.data.image_url),
      city_name: new FormControl(''),
      event_type: new FormControl(this.data.event_type),
    });
    this._eventDetailForm.controls['event_type'].disable();
    this._eventDetailForm.controls['event_start_time'].disable();
    this._eventDetailForm.controls['event_end_time'].disable();
    this._eventDetailForm.controls['championship_type'].disable();
    this._eventDetailForm.controls['reg_start_time'].disable();
    this._eventDetailForm.controls['reg_end_time'].disable();
  }
  //#endregion  First Time Form Load
  //#region method is used for Upload Image to Azure blob by API Calling
  uploadProfileImage() {
    const formData = new FormData();
    formData.append('file', this._uploadImage)
    this.userProfileService.uploadProfileImage(21, formData).subscribe({
      next: (data: any) => {
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
      zip_code: new FormControl(0, Validators.compose([Validators.required])),
      location: new FormControl('', Validators.compose([Validators.required])),
      organiser_email: new FormControl('', Validators.compose([Validators.required])),
      competition_director_email: new FormControl('', Validators.compose([Validators.required])),
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
  }
  loadAddClassDetailForm() {
    this._addClassDetailForm = this.formBuilder.group({
      category_description: new FormControl('', Validators.compose([Validators.required])),
      participant_type_id: new FormControl('', Validators.compose([Validators.required])),
      gender_id: new FormControl('', Validators.compose([Validators.required])),
      dob_cap: new FormControl('', Validators.compose([Validators.required])),
      selectDate: new FormControl('', Validators.compose([Validators.required])),
      max_no: new FormControl('', Validators.compose([Validators.required])),
      competition_standard: new FormControl('', Validators.compose([Validators.required])),
      points: new FormControl('', Validators.compose([Validators.required])),
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
}
