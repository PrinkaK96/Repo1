import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { CommonApiService } from 'src/app/services/Common/common-api.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { UserProfileService } from 'src/app/services/UserProfile/user-profile.service';
import { MyProfileSidebarComponent } from '../my-profile-sidebar/my-profile-sidebar.component';

@Component({
  selector: 'stupa-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss'],
  providers: [MessageService],
})
export class PersonalDetailsComponent implements OnInit {
  //#region Variable Declaration Start
  _skeleton:boolean=false;
  idies=[1,2];
  id=[1,2,3,4,4,4,];
  _userDetails: any=[];
  _isEdit: boolean = false;
  fileToUpload: any;
  _uploadImage: any;
  fileName: any;
  _formGroupDynamic!: FormGroup
  _fieldList: any = [];
  _showLoader: boolean = false;
  _currentDate: any = new Date();
  event: any;
  _cityList: any = [];
  _state: any;
  azureLoggerConversion: any = new Error();
   //#endregion Variable Declaration Start
  constructor(private userProfileService: UserProfileService,private commonApiService: CommonApiService, private azureLoggerService : MyMonitoringService,
    private messageService: MessageService, private encyptDecryptService: EncyptDecryptService) {
      this.getUserProfile();
    
  }
  ngOnInit(): void {
    this.event = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))
    this.getUserProfile();
  }
   //#region API CALL to get_user_details
  getUserProfile() {
    // this._showLoader = true;
    this._showLoader=true

    
    this.userProfileService.getUserProfile().subscribe({
      next: (result: any) => {
        // this._showLoader = false;
        this._showLoader=false
        this._userDetails = result.body[0];
        this._uploadImage = this._userDetails.image
        this._state = this._userDetails.state_id

        this.getCityList();
      },
      error: (result: any) => {
        // this._showLoader = false;
        this._showLoader=false
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => {

      },
    })
  }
    //#endregion API CALL to get_user_details

   //#region method to make edit flag true , so that user can edit the details
    editUserDetails() {
    this._isEdit = true;
  }
   //#endregion  method to make edit flag true , so that user can edit the details

  
   //#region API CALL to update user details
   updateUserDetails() {
    // this._showLoader = true;
    this._skeleton=true
    this._fieldList=[]
    for (let i = 0; i < this._userDetails.details.length; i++) {
      const fieldDetails = {
        "field_id": this._userDetails.details[i].field_id,
        "data": this._userDetails.details[i].data_type==='date'? this.commonApiService.convertUTCDateTimeToLocalT(this._userDetails.details[i].data).split(',')[0]: this._userDetails.details[i].data,
      }
      this._fieldList.push(fieldDetails);
      
    }
    const body = {
      "image": this._uploadImage=== null ? '' : this._uploadImage,
      "details": this._fieldList
    }
    this.userProfileService.updateUserProfile(body).subscribe({
      next: (result: any) => {
        // this._showLoader = false;
        this._showLoader=false
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: result.body.msg,
          life: 3000,
        });
        // window.location.reload()
        this.getUserProfile()
      },
      error: (result: any) => {
        // this._showLoader = false;
        this._showLoader=false
        this.azureLoggerConversion = result.error.msgs
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => {

      },
    })
    this._isEdit = false;
  }

  //#endregion API CALL to update user details

  //#region method to upload file when dropped
  onFileDropped($event: any) {
    this.uploadFilesSimulator($event);
  }
  //#endregion method to upload file when dropped
  
  //#region API CALL to upload profile image
  uploadProfileImage() {
    // this._showLoader = true;
    this._skeleton=true
    const formData = new FormData();
    formData.append('file', this._uploadImage)
    this.userProfileService.uploadProfileImage(21, formData).subscribe({
      next: (data: any) => {
        // this._showLoader = false;
        this._showLoader=false
        this._uploadImage = data.body.url
      },
      error: (result: any) => {
        // this._showLoader = false;
        this._showLoader=false
      },
      complete: () => {}
    })
  }
  //#endregion API CALL to upload profile image

  //#region method to upload file 
  uploadFilesSimulator(file: FileList) {
    this.fileToUpload = file.item(0);
    this._uploadImage = file.item(0);

    this.fileName = file[0].name;
    let reader = new FileReader();
    reader.onload = (event: any) => {
    };
    reader.addEventListener('load', () => { });
    reader.readAsDataURL(this.fileToUpload);
    this.uploadProfileImage()
  }
   //#endregion method to upload file 

  numberValueSet(evt: any) {
    // prevent: "e", "=", ",", "-", "."
    if ([69, 187, 188, 189, 190].includes(evt.keyCode)) {
      evt.preventDefault();
    }
  }
   //#region API call to get-Cities
   getCityList() {
    this.commonApiService
      .getCityList(this._state)
      .subscribe({
        next: (result: any) => {
          this._cityList = result.body;
        },
        error: (result) => { 
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException( this.azureLoggerConversion)
        },
        complete: () => { },
      });
  }
 //#endregion API call to get-Cities
}
