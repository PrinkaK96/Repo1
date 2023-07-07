import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { UserProfileService } from 'src/app/services/UserProfile/user-profile.service';
@Component({
  selector: 'stupa-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss'],
  providers:[MessageService]
})
export class RoleManagementComponent {
   //#region Variable Declaration Start
   _skeleton:boolean=false;
  idies=[1,2,3];
  id=[1,2,3,4,4,4,];
  cards:any
  event: any;
  _showLoader: boolean = false;
  azureLoggerConversion: any= new Error();
   //#endregion Variable Declaration Start

  constructor(private userProfileService: UserProfileService,
    private encyptDecryptService: EncyptDecryptService,private messageService:MessageService,private azureLoggerService :MyMonitoringService ) {
    
  }

  ngOnInit(): void {
    this.event = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getUserRole();
  }

   //#region API call to get details ofthe user_role
  getUserRole(){
    // this._showLoader = true;
    this._showLoader=true;
    this.userProfileService.getUserRole().subscribe({
      next: (result: any) => {
        // this._showLoader = false;
        this._showLoader=false;
        this.cards = [result.body];
      },
      error: (result: any) => {
        // this._showLoader = false;
        this._showLoader=false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(result.error.msg)
      },
      complete: () => {

      },
    })
  }
   //#endregion API call to get details ofthe user_role
}
