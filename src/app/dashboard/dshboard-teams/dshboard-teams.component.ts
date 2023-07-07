import { getLocaleMonthNames } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DashboardService } from 'src/app/services/Dashboard/dashboard.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
import { CreateTeamComponent } from './create-team/create-team.component';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
@Component({
  selector: 'stupa-dshboard-teams',
  templateUrl: './dshboard-teams.component.html',
  styleUrls: ['./dshboard-teams.component.scss'],
  providers: [MessageService, ConfirmationDialogService]
})
export class DshboardTeamsComponent {
  //#region Here we are declaring Variables
  _skeleton: boolean = true;
  idies = [1, 2, 3];
  id = [1, 2, 3, 4, 4, 4,];
  _showCreateTeam: boolean = false
  _teams: any = [];
  _playerArray: any = [];
  teamdata: any = [];
  _showLoader = false;
  mixedData: any = [];
  _searchTeams: any = '';
  _teamsCopy: any = [];
  azureLoggerConversion: any = new Error();
  //#endregion Here we are declaring Variables
  event_id: any;
  @ViewChild(CreateTeamComponent, { static: false }) childRef!: CreateTeamComponent;
  constructor(private dashboardService: DashboardService, private router: Router, private confirmationDialogService: ConfirmationDialogService, private azureLoggerService: MyMonitoringService,
    private messageService: MessageService, private encyptDecryptService: EncyptDecryptService,) { }
  ngOnInit(): void {
    this.event_id = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))
    this.getTeams();

  }
  //#region method to open the popup to create-team
  showDialog() {
    this._showCreateTeam = true;
    this.childRef.edit = false;
    this.childRef._playersArray = []
    this.childRef._players = [];
    this.childRef._teamForm.reset();
  }
  //#endregion method to open the popup to create-team

  //#region method to open the popup to edit-team
  showDialogEdit() {
    this._showCreateTeam = true;
  }
  //#endregion method to open the popup to edit-team

  //#region method to close popup
  closePopPup() {
    this._showCreateTeam = false;
    this.childRef._isSubmitDetails = false;
    this.childRef._teamForm.controls['teamName'].setValue('');
    this.childRef._teamForm.reset();
    //this.childRef._playersArray = this.childRef.mixedData.team_details
    this.getTeams();
    //this.childRef._teamForm.reset();
  }
  //#endregion method to close popup

  //#region API CALL to get teams 
  getTeams() {
    // this._showLoader = true;
    this._showLoader = true;
    this.dashboardService.getTeamsByParticipantID(2).subscribe({
      next: (data: any) => {
        // this._showLoader = false;
        this._showLoader = false;
        this._teams = data.body;
        this._teamsCopy = data.body;
        //this.childRef._playersArray= data.body.team_details
      },
      error: (result: any) => {
        // this._showLoader = false;
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)

      },
      complete: () => {
      },
    });
  }
  //#endregion API CALL to get teams 

  //#region method to navigate back to dashboard
  goBack() {
    this.router.navigate(['/profile-menu']);
  }
  //#endregion method to navigate back to dashboard

  //#region method to setValues in case of  edit
  editTeam(mixDoubleData: any) {
    this.childRef.edit = true;
    this.mixedData = mixDoubleData;
    this.childRef._teamId = this.mixedData.team_id;
    this.childRef._playersArray = this.mixedData.team_details;
   
    this.childRef._teamForm.controls['category'].setValue(this.mixedData.category.category_description)
      this.childRef._teamForm.controls['_genderType'].setValue(this.mixedData.category.gender_id)
      this.childRef._teamForm.controls['_particpantType'].setValue(this.mixedData.category.participant_type_id)
    this.childRef._teamForm.controls['teamName'].setValue(this.mixedData.name)
    this.childRef._masterCategoriesList;
    this.showDialogEdit();
  }
  //#endregion  method to setValues in case of  edit

  //#region method to save and display the teams-popup after data is being emitted from child
  teamsAfterSave(e: any) {
    this._teams = e;
  }
  //#endregion  method to save and display the teams-popup after data is being emitted from child

  //#region  API CALL to delete the team
  deleteMixTeam(deletedId: any, index: any) {
    this.confirmationDialogService
      .confirm(
        'Please confirm..',
        'Are you sure ,you want to delete this team?'
      )
      .then((confirmed) => {
        if (confirmed) {

          // this._showLoader = true;
          this._showLoader = true;
          this.dashboardService.deleteTeams(deletedId.team_id).subscribe({
            next: (data: any) => {
              // this._showLoader = false;
              this._showLoader = false;
              this._teams.splice(index, 1)


            },
            error: (result: any) => {
              this._showLoader = false;
              this.azureLoggerConversion = result.error.msg
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
  //#endregion  API CALL to delete the team

  //#region  method to search the teams by name
  findTeams() {
    this._teams = this._teamsCopy.filter((item: any) => {
      return (
        item.name.toLowerCase().includes(this._searchTeams.toLowerCase()));
    });
  }
  //#endregion method to search the teams by name


  //#region method to map first letter of teamName in Avatar
  getFirstLetters(data: any) {
    if (data !== undefined) {
      if (data.split(' ').length > 1) {
        return data.split(' ')[0].charAt(0).toUpperCase() + data.split(' ')[1].charAt(0).toUpperCase()
      } else {
        return data.split(' ')[0].charAt(0).toUpperCase()
      }
    }
  }
  //#endregion method to map first letter of teamName in Avatar
}
