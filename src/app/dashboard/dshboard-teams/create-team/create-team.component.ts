import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DashboardService } from 'src/app/services/Dashboard/dashboard.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { ProfileMenuService } from 'src/app/services/ProfileMenu/profile-menu.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { JsonDataCallingService } from 'src/app/services/LocalDataJsonDataAPI/json-data-calling.service';
@Component({
  selector: 'stupa-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.scss'],
  providers: [MessageService]
})
export class CreateTeamComponent implements OnInit, OnChanges {
  //#region Here we are declaring Variables
  _abled: any = [{ name: 'Abled' },
    // { name: 'Disabled' }
  ];
  _gender: any = [];
  _editFeild: boolean = true;
  _heading: any = 'Team Name sample 123';
  _playersArray: any = [];
  @Output() closePopPup = new EventEmitter<any>();
  _playerList: any = [];
  _masterCategoriesList: any = [];
  event_id: any
  _showLoader: boolean = false;
  _players: any = [];
  _teamForm!: FormGroup;
  _showEdit: boolean = false
  @Output() newMixedTeams = new EventEmitter<any>();
  @Input() mixedData: any = [];
  @Input() eventId: any = [];

  _teamId: any;
  _removed: any = [];
  _getTeams: any = [];
  _isSubmitDetails: boolean = false;
  edit: boolean = false;
  selectedValue: any = null;
  _showCategory: boolean = true;
  azureLoggerConversion: any = new Error();
  _eventParticipantType: any = [];
  //#endregion Here we are declaring Variables

  constructor(private eventService: EventsService, private profileMenuService: ProfileMenuService, private messageService: MessageService, private azureLoggerService: MyMonitoringService,
    private encyptDecryptService: EncyptDecryptService, private formBuilder: FormBuilder, private dashboardService: DashboardService, private jsonDataCallingService: JsonDataCallingService,
  ) {
    this.event_id = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))


    this._teamForm = this.formBuilder.group({
      _particpantType: new FormControl(''),
      _genderType: new FormControl('', Validators.compose([Validators.required])),
      category: new FormControl('', Validators.compose([Validators.required])),
      teamName: new FormControl({ value: '', disabled: true }, Validators.compose([Validators.required])),
    });

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mixedData'].currentValue != '') {
      this.edit = true
      this._teamId = this.mixedData.team_id;
      this._playersArray = this.mixedData.team_details;
      this._teamForm.controls['category'].setValue(this.mixedData.category.category_description);
      this._teamForm.controls['_genderType'].setValue(this.mixedData.category.gender_id)
      // this._teamForm.controls['_particpantType'].setValue(2)
      this._teamForm.controls['teamName'].setValue(this.mixedData.name)
      this._masterCategoriesList
    }

  }
  ngOnInit(): void {
    this.event_id = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'))
    this.getGender();
    this.eventsParticipant()
  }

  //#region method to edit the team Name inside teams popup
  editFeild(edit: boolean) {
    this._editFeild = edit;
    this._teamForm.get('teamName')?.enable();
    if (this._heading == '') {
      this._heading = 'Team Name sample 123';
    }
  }
  //#endregion method to edit the team Name inside teams popup

  //#region method to disable the edit-field on editTeam 
  disableField() {
    this._teamForm.get('teamName')?.disable();
  }
  //#endregion method to disable the edit-field on editTeam 

  //#region method to close the popup 
  closePopUp() {
    this._players = [];
    this._playersArray = [];
    this.getTeamsByParticipantID();
    this.closePopPup.emit();
    this.reset();
  }
  //#endregion method to  close the popup 

  //#region API call to get_player list inside dropdown to create-team  
  getPlayers() {

    this._players = [];
    this._playersArray = [];
    this._playerList = [];
    this.eventService.getPlayers(null).subscribe({
      next: (data: any) => {
        this._playerList = data.body
      },
      error: (result) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    });
  }
  //#endregion API call to get_player list inside dropdown to create-team  

  //#region API call to get_master_categories to create-team for that particular category 
  getMasterCategories() {
    if (this._teamForm.controls['_genderType'].value !== '' && this._teamForm.controls['_genderType'].value !== null) {
      this.profileMenuService.getMasterCategoriesByPartcipantTypeAndGenderId(false, this._teamForm.controls['_genderType'].value, 2).subscribe({
        next: (data: any) => {
          this._masterCategoriesList = [];
          this._masterCategoriesList = data.body;
          // .filter((x: any) => x.participant_type_id === 2)
        },
        error: (data: any) => {
          this.azureLoggerService.logException(data.error.msg)
        },
        complete: () => {

        },
      })
    }
  }
  //#endregion API call to get_master_categories to create-team for that particular category 

  //#region method to call createTeam or updateTeam method on the basis of received Data from parent
  saveTeam() {
    if (this.mixedData.length == 0) {
      this.createTeam();

    }
    else {
      this._showEdit = true;
      this.updateTeam();
    }
  }
  //#endregion method to call createTeam or updateTeam method on the basis of received Data from parent

  //#region API call to create-team
  createTeam() {
    if (this._teamForm.valid && this._playersArray.length > 1 && this._playersArray.length < 6) {
      this._isSubmitDetails = false;
      const data2 = this._teamForm.controls['teamName'].value.replace(/\s/g, " ");

      const data = {
        "user_id": 0,
        "name": data2,
        "category_id": this._teamForm.controls['category'].value.category_id,
        "members": this._players,
        // "abled": this._teamForm.controls['abled'].value.name === 'Abled' ? true : false,
        "participant_type_id": 2
      }
      this.eventService.createTeam(data).subscribe({
        next: (data: any) => {
          this.messageService.add({
            key: 'bc', severity: 'success', summary: 'Success', detail: 'Team Created Successfully', life: 1000,
          });

          setTimeout(() => {
            this._players = [];
            this._playersArray = [];
            this.closePopPup.emit();
            this.reset();
          }, 2000);
        },
        error: (result) => {
          this._players = [];
          this._playersArray = [];
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'Error',
            detail: result.body.msg,
            life: 3000,
          });
        },
        complete: () => {

        },
      });
    }
    else {
      this._isSubmitDetails = true;
    }
  }
  //#endregion API call to create-team

  //#region API call to update-team
  updateTeam() {
    this._removed = Array.from(new Set(this._removed));
    // const playersArray = new Set(this._players)
    // const removedArray = new Set(this._removed)
    // this._players = [...playersArray,...removedArray]
    this._removed = this._removed.filter((item: any) => !this._players.includes(item));

    if (this._teamForm.valid && this._playersArray.length > 1) {
      const data = {
        "team_id": this._teamId,
        "name": this._teamForm.controls['teamName'].value,
        "added": this._players,
        "removed": this._removed
      }
      this.dashboardService.updateTeam(data).subscribe({
        next: (data: any) => {
          this._removed = [];
          this._players = [];
          //this._showLoader = false;
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: 'Team Updated Successfully',
            life: 1000,
          });
          setTimeout(() => {
            this.closePopPup.emit();
            this.reset()
          }, 2000);
        },
        error: (result) => {
          this._showLoader = false;
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'Error',
            detail: result.body.msg,
            life: 3000,
          });
        },
        complete: () => {

        },
      });
    }
    else {
      this._isSubmitDetails = true;
    }
  }
  //#endregion API call to update-team

  //#region API call to get-list of teams after create or update team 
  getTeamsByParticipantID() {
    this._showLoader = true;
    this.dashboardService.getTeamsByParticipantID(2).subscribe({
      next: (data: any) => {
        this._showLoader = false;
        for (let i = 0; i < data.body.length; i++) {
          if (data.body[i].category.participant_type_id === 2) {
            this._getTeams.push(data.body[i]);
            this.newMixedTeams.emit(this._getTeams)
          }
        }
      },
      error: (result: any) => {
        this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => {
      },
    });
  }
  //#endregion API call to get-list of teams after create or update team 

  //#region method to add player in the list after selection from dropdown inside the popup
  addPlayer(event: any) {
    const players = [];
    if (this._playersArray.length < 5) {
      this._isSubmitDetails = false;
      if (this._playersArray.findIndex((x: any) => x.user_id === event.value.user_id) == -1) {
        this._playersArray.push(event.value);
        //  players.push(event.value.user_id);
        this._players.push(event.value.user_id)
        this.selectedValue = event.value.name

      }

      else {
        //show toast: player already added
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Error',
          detail: 'Player already added',
          life: 1000,
        });
      }
    }
    else {
      this._isSubmitDetails = true;
    }

  }
  //#endregion method to add player in the list after selection from dropdown inside the popup

  //#region method to remove the player from the list after they are being added from the dropdown inside the popup
  removePlayer(event: any, index: number) {
    this._playersArray.splice(index, 1);
    this._players.splice(index, 1);
    this._removed.push(event.user_id);

  }
  //#endregion method to remove the player from the list after they are being added from the dropdown inside the popup

  //#region method to check the duplicate team name when the user is creating the team
  duplicateTeam() {

    if (this._teamForm.valid) {
      const teamName = this._teamForm.controls['teamName'].value.replace(/\s/g, "");
      this.dashboardService.duplicateTeamName(teamName).subscribe({
        next: (data: any) => {
          this.messageService.add({
            key: 'bc', severity: 'error', summary: 'Error', detail: 'Team Name Exists', life: 2000,
          });
          this._teamForm.controls['teamName'].setValue('');
        },
        error: (result: any) => {
          this.createTeam();
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => {
        },
      });
    }
    else {
      this._isSubmitDetails = true;
    }
  }
  //#endregion method to check the duplicate team name when the user is creating the team

  //#region method to reset the popup after create or update team

  reset() {
    this._teamForm.reset();
    this._playersArray = [];
  }
  //#endregion method to reset the popup after create or update team

  //#region method to reset the placeholder of the dropdown after the player is being selected for addition in the list
  clearDropdown(event: any) {
    this.selectedValue = null;
  }
  //#endregion method to reset the placeholder of the dropdown after the player is being selected for addition in the list

  //#region method to show category dropdown when EventType is Abled and showing class dropdown  when EventType is DisAbled
  selectEventType(data: any) {
    if (data.value.name === 'Abled') {
      this._showCategory = true;
    }
    else {
      this._showCategory = false;
    }
  }
  //#endregion method to show category dropdown when EventType is Abled and showing class dropdown  when EventType is DisAbled


  //#region method to map first initials of players 
  getFirstLetters(data: any) {
    if (data.split(' ').length > 1) {
      return data.split(' ')[0].charAt(0).toUpperCase() + data.split(' ')[1].charAt(0).toUpperCase()
    } else {
      return data.split(' ')[0].charAt(0).toUpperCase()
    }
  }
  //#endregion method to map first initials of players 
  //#region method is used for get list of player with search and without search
  getAllPlayers(data: any) {
    var searchText = data.filter == undefined || data.filter == null ? '' : data.filter
    if (searchText !== null && searchText !== undefined) {
      this.dashboardService.getAllPlayersinDashboard(searchText, this._teamForm.controls['_genderType'].value).subscribe({
        next: (data: any) => {
          this._playerList = [];
          this._playerList = data.body[1];
          // if (data.body[1] !== undefined) {
          //   if (searchText == '') {
          //     this._playerList = data.body[1];
          //   } else {
          //     this._playerList = data.body;
          //   }

          // }

        },
        error: (result: any) => {
          this._playerList = [];
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)

        },
        complete: () => {
        },
      });
    }
  }
  //#endregion  method is used for get list of player with search and without search
  //#region method is used for call API For Team Creation
  addPlayerInTeam(event: any) {
    const players = [];
    if (this._playersArray.length < 5) {
      this._isSubmitDetails = false;
      if (this._playersArray.findIndex((x: any) => x.user_id === event.value.user_id) == -1) {
        this._playersArray.push(event.value);
        //  players.push(event.value.user_id);
        const clubDetails = {
          "user_id": event.value.user_id,
          "club_id": event.value.club_id,
          "club_name": event.value.club
        }
        this._players.push(clubDetails)
        this.selectedValue = event.value.name

      }

      else {
        //show toast: player already added
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Error',
          detail: 'Player already added',
          life: 1000,
        });
      }
    }
    else {
      this._isSubmitDetails = true;
    }

  }
  //#endregion method is used for call API For Team Creation

  //#region fetching jsonData to get to get enum of events_participant
  eventsParticipant() {
    this.jsonDataCallingService.eventsParticipantType().subscribe({
      next: (result: any) => {
        this._eventParticipantType = result;

        this.getMasterCategories();
        this.getAllPlayers('');
        this._teamForm.controls['_particpantType'].setValue(2)
      },
      error: (result) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    });
  }
  //#endregion fetching jsonData to get to get enum of events_participant

  //#region fetching jsonData to get to get enum of  Gender
  getGender() {
    this.jsonDataCallingService.getGender().subscribe({
      next: (result: any) => {
        this._gender = result;
        this.getMasterCategories();
        this.getAllPlayers('');
      },
      error: (result) => {
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => { },
    });
  }
  //#endregion fetching jsonData to get to get enum of Gender
}
