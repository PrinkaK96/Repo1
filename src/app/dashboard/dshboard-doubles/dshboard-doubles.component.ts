import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DashboardService } from 'src/app/services/Dashboard/dashboard.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
import { CreateDoublesComponent } from './create-doubles/create-doubles.component';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';

@Component({
  selector: 'stupa-dshboard-doubles',
  templateUrl: './dshboard-doubles.component.html',
  styleUrls: ['./dshboard-doubles.component.scss'],
  providers: [MessageService, ConfirmationDialogService],
})
export class DshboardDoublesComponent implements OnInit {
   //#region Here we are declaring Variables
   _skeleton:boolean=false;
   idies=[1,2,3];
   id=[1,2,3,4,4,4,];
  _playerArray: any = [
    { name: 'Player Name123', email: 'riodejaneiro@yopmail.com' },
    { name: 'Player Name123', email: 'riodejaneiro@yopmail.com' },
  ];
  _showcreateDoubles: boolean = false;
  _teams: any = [];
  _showLoader: boolean = false;
  mixedData: any = [];
  _searchTeams: any = '';
  _teamsCopy: any = [];
  _createTeam: boolean = false;
  azureLoggerConversion : any = new Error();
  //#endregion Here we are declaring Variables

  @ViewChild(CreateDoublesComponent, { static: false }) childRef!: CreateDoublesComponent;
  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private confirmationDialogService: ConfirmationDialogService,
    private messageService: MessageService,
    private azureLoggerService: MyMonitoringService,
  ) {}
  ngOnInit() {
    this.getTeams();
  }
  //#region method to open the popup to create--double
  showDialog() {
    this._showcreateDoubles = true;
    //this._createTeam = true;
    this.childRef.edit = false;
    this.childRef._mixedName = '';
    this.childRef._playersArray = []
    this.childRef._players = [];
    this.childRef.mixedData = [];
    this.childRef._doublePlayersArray = []
  }
  //#endregion method to open the popup to create--double

   //#region method to open the popup to edit-double
  showDialogEdit(){
    this._showcreateDoubles = true;
  } 
  //#endregion method to open the popup to edit-double

 
 //#region method to navigate back to dashboard
  goBack() {
    this.router.navigate(['/profile-menu']);
  }
  //#endregion method to navigate back to dashboard

   //#region method to close popup
  closePopPup() {
    this._showcreateDoubles = false;
    this._createTeam = true;
    this.childRef._teamForm.reset();
    this.childRef._isSubmitDetails = false;
    this.childRef._maxPlayer = false;
    this.getTeams()
  }
   //#endregion method to close popup

   //#region API CALL to get doubles data
   getTeams() {
    // this._showLoader = true;
    this._showLoader=true
    this.dashboardService.getTeamsByParticipantID(3).subscribe({
      next: (data: any) => {
        // this._showLoader = false;
        this._showLoader=false
        this._teams = data.body;
        this._teamsCopy = data.body;
      },
      error: (result: any) => {
        // this._showLoader = false;
        this._showLoader=false
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => {
        // this._showLoader = false;
        this._showLoader=false
      },
    });
  }
   //#endregion API CALL to get doubles data
  
   //#region method to open the popup and set values in edit-double
   showEditDialog(mixDoubleData: any) {
    
    this.mixedData = mixDoubleData;
    this._createTeam = false;
    this.childRef.edit = true;
    this.childRef._showName = false;
    this.childRef._mixedName = this.childRef._mixedName;
      this.childRef._teamId = this.mixedData.team_id;
      this.childRef._playersArray = this.mixedData.team_details;
      this.childRef._teamForm.controls['category'].setValue(this.mixedData.category.category_description)
      this.childRef._teamForm.controls['_genderType'].setValue(this.mixedData.category.gender_id)
      this.childRef._teamForm.controls['_particpantType'].setValue(this.mixedData.category.participant_type_id)
      this.childRef._teamForm.controls['category'].setValue(this.mixedData.category)
    this.showDialogEdit();
  }
   //#endregion method to open the popup and set values in edit-double

  //#region  API CALL to delete the pair
   deleteMixTeam(deletedId: any, index: any) {
    this.confirmationDialogService
      .confirm(
        'Please confirm..',
        'Are you sure ,you want to delete this pair?'
      )
      .then((confirmed) => {
        if (confirmed) {
          // this._showLoader = true;
          this._showLoader=true
          this.dashboardService.deleteTeams(deletedId.team_id).subscribe({
            next: (data: any) => {
              // this._showLoader = false;
              this._showLoader=false
              this._teams.splice(index, 1);
            },
            error: (result: any) => {
              // this._showLoader = false;
              this._showLoader=false
              this.azureLoggerConversion = result.error.msg
              this.azureLoggerService.logException(this.azureLoggerConversion)
            },
            complete: () => {},
          });
        } else {
        }
      })
      .catch(() => {});
  }
  //#endregion  API CALL to delete the pair

  //#region method to save and display the teams-popup after data is being emitted from child
  teamsAfterSave(e: any) {
    this._teams = e;
  }
  //#endregion method to save and display the teams-popup after data is being emitted from child

  //#region  method to search the teams by name
  findTeams() {
    this._teams = this._teamsCopy.filter((item: any) => {
      return item.name.toLowerCase().includes(this._searchTeams.toLowerCase());
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
