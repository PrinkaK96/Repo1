import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services/Dashboard/dashboard.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
import { MessageService } from 'primeng/api';
import { CreateMixDouble } from './create-mix-double/create-mix-double.component';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';

@Component({
  selector: 'stupa-dshboard-mix-doubles',
  templateUrl: './dshboard-mix-doubles.component.html',
  styleUrls: ['./dshboard-mix-doubles.component.scss'],
  providers: [MessageService, ConfirmationDialogService]
})
export class DshboardMixDoublesComponent {
   //#region Here we are declaring Variables
   _skeleton:boolean=true;
   idies=[1,2,3];
   id=[1,2,3,4,4,4,];
  _showCreateTeam: boolean = false
  _teams: any = [];
  _showcreatemixDoubles: boolean = false;
  _showLoader: boolean = false;
  mixedData: any = [];
  _teamDetail: any=[];
  _searchTeams:any='';
  _teamsCopy: any=[];
  @ViewChild(CreateMixDouble, { static: false }) childRef!: CreateMixDouble;
  azureLoggerConversion: any;
   //#endregion Here we are declaring Variables
  constructor(private dashboardService: DashboardService, private router: Router, private confirmationDialogService: ConfirmationDialogService, private azureLoggerService: MyMonitoringService,
    private messageService: MessageService) { }
  ngOnInit(): void {
    this.getMixDoubles();
  }
   //#region method to open the popup to create-mix-double
  showDialog() {
    this._showcreatemixDoubles = true;
    this.childRef.edit = false;
    this.childRef._mixedName = '';
    this.childRef.mixedData = []
  }
   //#endregion method to open the popup to create-mix-double


   //#region method to open the popup to edit-double
  showDialogEdit(){
    this._showcreatemixDoubles = true;
  }
  //#endregion method to open the popup to edit-double

  
  //#region API CALL to get mix-doubles data
  getMixDoubles() {
    this._showLoader=true
    this.dashboardService.getTeamsByParticipantID(4).subscribe({
      next: (data: any) => {
        this._showLoader=false
        this._teams = data.body;
        this._teamsCopy = data.body;
      },
      error: (result: any) => {
        this._showLoader=false
        this.azureLoggerConversion  = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion )
      },
      complete: () => {
      },
    });
  }
  //#endregion API CALL to get mix-doubles data

  //#region method to navigate back to dashboard
  goBack() {
    this.router.navigate(['/profile-menu']);
  }
  //#endregion method to navigate back to dashboard
  
   //#region method to close popup
  showMixDoublesData(e: any) {
    this._showcreatemixDoubles = false;
    this.childRef._teamForm.reset();
    this.childRef._isSubmitDetails = false;
    this.childRef._maxPlayer = false;
    this.childRef._mixedName = ''
    //this.childRef._playersArray = []
    this.getMixDoubles()
  }
   //#endregion method to close popup

  
     //#region method to open the popup to edit-double
   showEditDialog(mixDoubleData: any) {
    this.mixedData = mixDoubleData;
    this.childRef.edit = true;
    this.childRef._showName = false;
    this.childRef._mixedName = this.childRef._mixedName;
    
    //this.childRef._playersArray = this.mixedData.team_details;
    this.childRef._teamId = this.mixedData.team_id;
    this.childRef._playersArray = this.mixedData.team_details;
    this.childRef._teamForm.controls['category'].setValue(this.mixedData.category.category_description)
      this.childRef._teamForm.controls['_genderType'].setValue(this.mixedData.category.gender_id)
      this.childRef._teamForm.controls['_particpantType'].setValue(this.mixedData.category.participant_type_id)
    this.childRef._teamForm.controls['category'].setValue(this.mixedData.category);
    this.showDialogEdit();

  }
    //#endregion method to open the popup to edit-double

  //#region  API CALL to delete the pair
    deleteMixTeam(deletedId: any,index:any) {
    
    this.confirmationDialogService
      .confirm(
        'Please confirm..',
        'Are you sure ,you want to delete this pair?'
      )
      .then((confirmed) => {
        if (confirmed) {

          this._showLoader=true
          this.dashboardService.deleteTeams(deletedId.team_id).subscribe({
            next: (data: any) => {
              this._showLoader=false
              this._teams.splice(index,1)
              
              
            },
            error: (result: any) => {
              this._showLoader=false
              this.azureLoggerConversion  = result.error.msg
              this.azureLoggerService.logException(this.azureLoggerConversion)
            },
            complete: () => {
            },
          });
        } else {
        }
      })
      .catch(() => { });

  }
  //#endregion  API CALL to delete the pair

  //#region method to save and display the teams-popup after data is being emitted from child
  teamsAfterSave(e:any) {
    this._teams = e;
  }
  //#endregion method to save and display the teams-popup after data is being emitted from child

  //#region  method to search the teams by name
  findTeams() {
    this._teams = this._teamsCopy.filter((item: any) => {
      return (
        item.name
          .toLowerCase()
          .includes(this._searchTeams.toLowerCase()));
    });
  }
  //#endregion  method to search the teams by name

   //#region method to map first letter of teamMembers in Avatar
  getFirstLetters(data: any) {
    if (data.split(' ').length > 1) {
      return data.split(' ')[0].charAt(0).toUpperCase() + data.split(' ')[1].charAt(0).toUpperCase()
    } else {
      return data.split(' ')[0].charAt(0).toUpperCase()
    }
  }
   //#endregion method to map first letter of teamMembers in Avatar

  //#region method to map first letter of pair in Avatar
   getFirstLettersofTeam(data: any) {
    if (data.split('/').length > 1) {
      return data.split('/')[0].charAt(0).toUpperCase() + data.split('/')[1].charAt(0).toUpperCase()
    } else {
      return data.split('/')[0].charAt(0).toUpperCase() 
    }
  }
  //#endregion method to map first letter of pair in Avatar
}
