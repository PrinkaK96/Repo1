import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { CommonApiService } from 'src/app/services/Common/common-api.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { JsonDataCallingService } from 'src/app/services/LocalDataJsonDataAPI/json-data-calling.service';
import { ProfileMenuService } from 'src/app/services/ProfileMenu/profile-menu.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'stupa-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
  providers: [MessageService, ConfirmationDialogService]
})
export class AddCategoryComponent {
  _eventForm!: FormGroup;
  _gender: any = [];
  azureLoggerConversion: any = new Error();
  _eventParticipantType: any = [];
  _currentDate: any = new Date();
  _masterCategoriesList: any = [];
  _categoriesList: any = []
  event_id: any;
  _updateFlag: boolean = false;
  editedCategoryId: any;
  _isSubmitCategorytDetail: boolean = false;
  @Output() tabIndex = new EventEmitter<number>();
  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private profileMenuService: ProfileMenuService,
    private jsonDataCallingService: JsonDataCallingService,
    private eventsService: EventsService,
    private commonApiService: CommonApiService,
    private encyptDecryptService: EncyptDecryptService, private router: Router,
    private confirmationDialogService: ConfirmationDialogService,
    private azureLoggerService: MyMonitoringService,
  ) {
  }
  ngOnInit(): void {
    this.event_id = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this.loadEventForm();
    this.getGender();
    this.eventsParticipant();
    this.getMasterCategoriesAdmin();
    this.getCategories();
  }

  ngOnChanges() {
    this.event_id = this.encyptDecryptService.decryptUsingAES256(
      localStorage.getItem('event_id')
    );
    this.loadEventForm();
    this.getGender();
    this.eventsParticipant();
    this.getMasterCategoriesAdmin();
    this.getCategories();
  }
  //#region FormControl for category/class inside Event
  loadEventForm() {
    this._eventForm = this.formBuilder.group({
      categoryName: new FormControl('', Validators.compose([Validators.required])),
      gender: new FormControl('', Validators.compose([Validators.required])),
      participantType: new FormControl('', Validators.compose([Validators.required])),
      bornAfter: new FormControl('', Validators.compose([Validators.required])),
      rank: new FormControl(''),
      maxNoOfRegistrations: new FormControl(''),

    });
  }
  //#endregion FormControl for category/class inside Event

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
      complete: () => { },
    });
  }
  //#endregion fetching jsonData to get to get enum of Gender

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
      complete: () => { },
    });
  }
  //#endregion fetching jsonData to get to get enum of events_participant

  getMasterCategoriesAdmin() {
    if (this.event_id != null) {
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
  addcategory() {
    if (this._eventForm.valid) {
      this._isSubmitCategorytDetail = false;
      var data = {
        category_description: this._eventForm.controls['categoryName'].value,
        dob_cap: this.commonApiService.convertUTCDateToLocalDate(new Date(this._eventForm.controls['bornAfter'].value)),
        rank: this._eventForm.controls['rank'].value != '' ? parseInt(this._eventForm.controls['rank'].value) : 0,
        max_no: this._eventForm.controls['maxNoOfRegistrations'].value != '' ? parseInt(this._eventForm.controls['maxNoOfRegistrations'].value) : 0,
        participant_type_id: this._eventForm.controls['participantType'].value,
        gender_id: this._eventForm.controls['gender'].value
      };
      this.eventsService.createEventCategory(data, this.event_id).subscribe({
        next: (result: any) => {
          this.getCategories();
          this._eventForm.reset();
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
    else {
      this._isSubmitCategorytDetail = true;
      this.messageService.add({
        key: 'bc',
        severity: 'error',
        summary: 'error',
        detail: 'Please fill all required details to add a category/class.',
        life: 3000,
      });
    }

  }

  getCategories() {
    if (this.event_id != null) {
      this.eventsService.getEventCategories(this.event_id).subscribe({
        next: (result: any) => {
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
  updateCategoryInfo(user_info: any) {
    this._updateFlag = true;
    this._eventForm.controls['categoryName'].setValue(user_info.category_description);
    this._eventForm.controls['categoryName'].disable();
    this._eventForm.controls['gender'].setValue(user_info.gender_id);
    this._eventForm.controls['gender'].disable();
    this._eventForm.controls['participantType'].setValue(user_info.participant_type_id);
    this._eventForm.controls['participantType'].disable();
    this._eventForm.controls['maxNoOfRegistrations'].setValue(user_info.max_no);
    this._eventForm.controls['bornAfter'].setValue(new Date(user_info.dob_cap));
    this._eventForm.controls['rank'].setValue(user_info.rank);
    this.editedCategoryId = user_info.id;
  }

  updateCategory() {
    var data = {
      category_description: this._eventForm.controls['categoryName'].value,
      dob_cap: this.commonApiService.convertUTCDateToLocalDate(new Date(this._eventForm.controls['bornAfter'].value)),
      rank: parseInt(this._eventForm.controls['rank'].value),
      max_no: parseInt(this._eventForm.controls['maxNoOfRegistrations'].value),
      participant_type_id: this._eventForm.controls['participantType'].value,
      gender_id: this._eventForm.controls['gender'].value,
      id: this.editedCategoryId
    };
    this.eventsService.updateEventCategories(data, this.event_id).subscribe({
      next: (result: any) => {
        this.getCategories();
        this._updateFlag = false;
        this._eventForm.reset();
        this._eventForm.markAsTouched()
        this.enableFormControls();
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

  deleteCategory(category_id: any) {
    this.confirmationDialogService
      .confirm(
        'Please confirm..',
        'Are you sure you want to delete, all data associated with this category will be lost?'
      )
      .then((confirmed) => {
        if (confirmed) {
          this.eventsService.deleteEventCategory(this.event_id, category_id).subscribe({
            next: (result: any) => {
              this._eventForm.reset();
              this._updateFlag = false;
              this.enableFormControls();
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
        else {
        }
      })
      .catch(() => { });
  }

  eventClicked() {
    this.tabIndex.emit();
  }

  cancelCategory() {
    this._updateFlag = false;
    this._eventForm.reset();
    this.enableFormControls();
  }

  enableFormControls() {
    this._eventForm.controls['categoryName'].enable();
    this._eventForm.controls['participantType'].enable();
    this._eventForm.controls['gender'].enable();
  }
}
