import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbToastHeader } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
import { DashboardService } from 'src/app/services/Dashboard/dashboard.service';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { ProfileMenuService } from 'src/app/services/ProfileMenu/profile-menu.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { Dropdown } from 'primeng/dropdown';
import { JsonDataCallingService } from 'src/app/services/LocalDataJsonDataAPI/json-data-calling.service';
@Component({
  selector: 'stupa-create-mix-double',
  templateUrl: './create-mix-double.component.html',
  styleUrls: ['./create-mix-double.component.scss'],
  providers: [MessageService]
})
export class CreateMixDouble {
  //#region Here we are declaring Variables
  _abled: any = [{ name: 'Abled' },
    // { name: 'Disabled' }
  ];
  _gender: any = [];
  _playersArray: any = [];
  _selectedPlayer: any
  @Output() closePopPup = new EventEmitter<any>();
  @Output() newMixedTeams = new EventEmitter<any>();
  @Input() mixedData: any = [];
  _playerList: any = [];
  _masterCategoriesList: any = [];
  event_id: any
  _showLoader: boolean = false;
  _players: any = [];
  _teamForm!: FormGroup;
  _maxPlayer: boolean = false;
  _getTeams: any = [];
  _removed: any = []
  _teamId: any;
  _updatedArray: any;
  _isSubmitDetails: boolean = false;
  edit: boolean = false;
  _mixDoublesName: any = [];
  _mixedName: any;
  _showName: boolean = false;
  _showCategory: boolean = true;
  _mixDoublesId: any = [];
  _userIdCheck: any;
  azureLoggerConversion: any = new Error();
  searchedString: any = '';
  _doublePlayersArray: any = [];
  selectedValue: any = '';
  _eventParticipantType: any = [];
  //#endregion Here we are declaring Variables

  constructor(private eventService: EventsService, private profileMenuService: ProfileMenuService, private dashboardService: DashboardService, private messageService: MessageService, private azureLoggerService: MyMonitoringService,
    private encyptDecryptService: EncyptDecryptService, private formBuilder: FormBuilder, private jsonDataCallingService: JsonDataCallingService,) {
    this.getMasterCategories();

    this._teamForm = this.formBuilder.group({
      abled: new FormControl(''),
      _particpantType: new FormControl(''),
      _genderType: new FormControl('', Validators.compose([Validators.required])),
      category: new FormControl('', Validators.compose([Validators.required])),
      teamName: new FormControl(''),
      searched: new FormControl(''),
    });
  }
  ngOnInit(): void {
    this.event_id = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getGender();
    this.getAllPlayers('')
    this.eventsParticipant();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mixedData'].currentValue != '') {
      this.edit = true;
      this._mixedName = this._mixedName;
      this._teamId = this.mixedData.team_id;
      this._playersArray = this.mixedData.team_details;
      this._teamForm.controls['category'].setValue(this.mixedData.category.category_description)
      this._teamForm.controls['_genderType'].setValue(this.mixedData.category.gender_id)
      this._teamForm.controls['_particpantType'].setValue(this.mixedData.category.participant_type_id)
      this._teamForm.controls['category'].setValue(this.mixedData.category);
    }
  }

  //#region method to close the popup 
  closePopUp() {
    this._players = [];
    this._playersArray = [];
    this.getMixDoubles();
    this.closePopPup.emit();
    this.reset();
  }
  //#endregion method to close the popup 

  //#region API call to get_player list inside dropdown to create-pair 
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
  //#endregion API call to get_player list inside dropdown to create-pair 

  //#region API call to get_master_categories to create-pair for that particular category
  getMasterCategories() {
    this.profileMenuService.getMasterCategories().subscribe({
      next: (data: any) => {
        this._masterCategoriesList = data.body.filter((x: any) => x.participant_type_id === 4);
      },
      error: (data: any) => {
        this.azureLoggerConversion = data.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
      },
      complete: () => {

      },
    })
  }
  //#endregion API call to get_master_categories to create-pair for that particular category

  //#region method to call createTeam or updateTeam method on the basis of received Data from parent
  saveTeam() {
    if (this.mixedData.length == 0) {
      this.createTeam();
    }
    else {
      this.updateTeam();
    }
  }
  //#endregion method to call createTeam or updateTeam method on the basis of received Data from parent

  //#region method to add player in the list after selection from dropdown inside the popup
  addPlayer(event: any) {
    if (this._playersArray.length < 2) {
      if (this._playersArray.findIndex((x: any) => x.user_id === event.value.user_id) == -1) {
        if (this._playersArray.findIndex((x: any) => x.gender_id === event.value.gender_id) == -1) {
          this._playersArray.push(event.value);
          this._players.push(event.value.user_id);
          this.selectedValue = event.value.name
          if (this._playersArray.length === 2) {
            this._mixDoublesName = this._playersArray.map((n: any) => n.name);

            this._mixDoublesId = this._playersArray.map((n: any) => n.user_id);
            const userID1 = this._mixDoublesId[0];
            const userID2 = this._mixDoublesId[1];
            const player1 = this._mixDoublesName[0].toString().split(" ")[0];
            const player2 = this._mixDoublesName[1].toString().split(" ")[0];
            if (userID1 < userID2) {
              this._mixedName = player1 + "/" + player2;
              this._userIdCheck = userID1 + "," + userID2;

            }
            else {
              this._mixedName = player2 + "/" + player1;
              this._userIdCheck = userID2 + "," + userID1;
            }




          }
          this.selectedValue = event.value.name
        }
        else {
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'Error',
            detail: 'Select player with different gender',
            life: 3000,
          });

        }
      }
      else {
        //show toast: player already added
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Error',
          detail: 'Player already added',
          life: 3000,
        });
      }
    }
    else {
      this._maxPlayer = true;
    }

  }
  //#endregion method to add player in the list after selection from dropdown inside the popup

  //#region method to remove the player from the list after they are being added from the dropdown inside the popup
  removePlayer(event: any, index: number) {
    this._playersArray.splice(index, 1);
    this._players.splice(index, 1);
    this._removed.push(event.user_id)
  }
  //#endregion method to remove the player from the list after they are being added from the dropdown inside the popup

  //#region API call to get-list of teams after create or update pair   
  getMixDoubles() {
    this._players = [];
    this._playersArray = [];
    this._showLoader = true;
    this.dashboardService.getTeamsByParticipantID(4).subscribe({
      next: (data: any) => {
        this._showLoader = false;
        for (let i = 0; i < data.body.length; i++) {
          if (data.body[i].category.participant_type_id === 4) {
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
  //#endregion API call to get-list of teams after create or update pair 

  //#region API call to create-pair
  createTeam() {
    if (this._teamForm.valid && this._playersArray.length === 2) {
      this._isSubmitDetails = false;
      for (var i = 0; i < this._playersArray.length; i++) {
        const dd = {
          user_id: this._playersArray[i].user_id,
          club_id: this._playersArray[i].club_id,
          club_name: this._playersArray[i].club
        }
        this._doublePlayersArray.push(dd)
      }

      const data = {
        "name": this._mixedName,
        "category_id": this._teamForm.controls['category'].value.category_id,
        "members": this._doublePlayersArray,
        "participant_type_id": 4
      }
      this.eventService.createTeam(data).subscribe({
        next: (data: any) => {
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: 'Pair created successfully',
            life: 5000,
          });
          setTimeout(() => {
            this._players = [];
            this._playersArray = [];
            this._showLoader = false;
            this._doublePlayersArray = []
            this.closePopPup.emit();
            this.reset()
            //this.getMixDoubles();
            this._showName = true;
          }, 2000);



        },
        error: (result) => {
          this._players = [];
          this._doublePlayersArray = []
          this._playersArray = [];
          this._showLoader = false;
          this.azureLoggerConversion = result.error.msg;
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
  //#endregion API call to create-pair

  //#region API call to update-pair
  updateTeam() {
    this._removed = Array.from(new Set(this._removed));

    this._removed = this._removed.filter((item: any) => !this._players.includes(item));
    for (var i = 0; i < this._playersArray.length; i++) {
      const dd = {
        user_id: this._playersArray[i].user_id,
        club_id: this._playersArray[i].club_id,
        club_name: this._playersArray[i].club
      }
      this._doublePlayersArray.push(dd)
    }
    if (this._teamForm.valid && this._playersArray.length === 2) {
      const data = {
        "name": this._mixedName,
        "team_id": this._teamId,
        "added": this._doublePlayersArray,
        "removed": this._removed
      }
      this.dashboardService.updateTeam(data).subscribe({
        next: (data: any) => {
          this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Success',
            detail: 'Mixed Doubles pair updated successfully',
            life: 3000,
          });
          setTimeout(() => {
            this._showLoader = false;
            this._players = [];
            this._removed = [];
            this._doublePlayersArray = []
            this.closePopPup.emit();
            this.reset()
            //this.getMixDoubles();
            this._showName = true;
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
  //#endregion API call to update-pair

  //#region method to check the duplicate pair id when the user is creating the pair
  duplicateTeam() {
    this._doublePlayersArray = [];
    if (this._teamForm.valid) {
      const teamName = this._userIdCheck;
      this.dashboardService.duplicatePair(teamName, this._teamForm.controls['category'].value.category_id).subscribe({
        next: (data: any) => {
          this.messageService.add({
            key: 'bc', severity: 'error', summary: 'Error', detail: 'Pair Exists', life: 2000,
          });
          this._teamForm.controls['teamName'].setValue('');
        },
        error: (result: any) => {
          
          this.saveTeam();
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
  //#endregion method to check the duplicate pair id when the user is creating the pair

  //#region method to reset the popup after create or update pair
  reset() {
    this._teamForm.reset();
    this._playersArray = [];
  }
  //#endregion method to reset the popup after create or update pair

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
  openDropdown(dropdown: Dropdown, event: any) {
    if (event.target.value) {
      dropdown.show();
    } else {
      dropdown.hide();
    }
  }
  getAllPlayers(data: any) {
    var searchText = data.filter == undefined || data.filter == null ? '' : data.filter
    if (searchText !== null && searchText !== undefined) {
      this.dashboardService.getAllPlayersForDashboard(searchText).subscribe({
        next: (data: any) => {
          this._playerList = [];
          if (data.body[1] !== undefined) {
            this._playerList = data.body[1];
          }

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
      complete: () => {
        this.getAllPlayers('');
      },
    });
  }
  //#endregion fetching jsonData to get to get enum of Gender
}
