import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { JsonDataCallingService } from 'src/app/services/LocalDataJsonDataAPI/json-data-calling.service';
import { ProfileMenuService } from 'src/app/services/ProfileMenu/profile-menu.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';


@Component({
  selector: 'stupa-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss'],
  providers:[MessageService,ConfirmationDialogService]
})
export class CreateCategoryComponent implements OnInit {

  issValid: boolean = false;
  _eventParticipantType: any = [];
  _genders: any = [];
  formgroup!: FormGroup;
  changeinValue = "";
  creatCategoryAarry: any = [];

  getdata: any = [];
  azureLoggerConversion: any= new Error();
  _updateFlag:boolean = false;
  constructor(private jsonDataCallingService: JsonDataCallingService,private profileService:ProfileMenuService,
    private azureLoggerService:MyMonitoringService,private messageService : MessageService,    private confirmationDialogService: ConfirmationDialogService) {
    this.formgroup = new FormGroup({
      className: new FormControl("", Validators.required),
      participantType: new FormControl("", Validators.required),
      gender: new FormControl("", Validators.required),
      category_id: new FormControl("")
    })
  }
  ngOnInit() {
    this.getParticipantTypes();
    this.getGenders();
    this.getCategories();
  }

  getParticipantTypes() {
    this.jsonDataCallingService.eventsParticipantType().subscribe({
      next: (result: any) => {
        this._eventParticipantType = result;
      }, error: (result) => {
      },
      complete: () => { },
    })
  }

  getGenders() {
    this.jsonDataCallingService.getGender().subscribe({
      next: (result: any) => {
        this._genders = result;
      }, error: (result) => {
      },
      complete: () => { },
    })
  }
  getCategories(){
    {
      this.profileService.getMasterCategoriesAdmin().subscribe({
        next: (result: any) => {
          this.creatCategoryAarry = result.body;
        },
        error: (result) => { 
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      });
    }
  }
  AddData(e: any) {
    if (this.formgroup.valid) {
      this.issValid = false;
        var data = {
          category_description: this.formgroup.controls['className'].value,
          participant_type_id: this.formgroup.controls['participantType'].value,
          gender_id: this.formgroup.controls['gender'].value  
      };
      this.profileService.createAdminCategory(data).subscribe({
        next: (result: any) => {
          this.getCategories();
          this.formgroup.reset();
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
    else{
      this.issValid = true;
      this.messageService.add({
        key: 'bc',
        severity: 'error',
        summary: 'error',
        detail: 'Please fill all required details to add a category/class.',
        life: 3000,
      });
     }
    

  }
  updateCategoryInfo(user_info:any){
    this._updateFlag = true;
   this.formgroup.controls['category_id'].setValue(user_info.category_id);
    this.formgroup.controls['className'].setValue(user_info.category_description);
    this.formgroup.controls['className'].disable();
    this.formgroup.controls['gender'].setValue(user_info.gender_id);
   // this.formgroup.controls['gender'].disable();
    this.formgroup.controls['participantType'].setValue(user_info.participant_type_id);
   // this.formgroup.controls['participantType'].disable();
   // this.editedCategoryId = user_info.id;
  }
  updateCategory(){
    var data = {
      category_description: this.formgroup.controls['className'].value,
      participant_type_id: this.formgroup.controls['participantType'].value,
      gender_id: this.formgroup.controls['gender'].value,
  };
  this.profileService.updateCategory(data,this.formgroup.controls['category_id'].value).subscribe({
    next: (result: any) => {
      this.getCategories();
      this._updateFlag = false;
      this.formgroup.reset();
      this.formgroup.markAsTouched();
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
  
  deleteCategory(category_id:any) {
    this.confirmationDialogService
    .confirm(
      'Please confirm..',
      'Are you sure you want to delete, all data associated with this category will be lost?'
    )
    .then((confirmed) => {
      if (confirmed) {
        this.profileService.deleteAdminCategory(category_id).subscribe({
          next: (result: any) => {
            this.formgroup.reset();
            this.getCategories();
            this._updateFlag= false;
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
  }

}
