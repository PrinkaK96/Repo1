import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'stupa-arrange-dialog',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    AvatarModule,
    DropdownModule,
    FormsModule
  ],
  templateUrl: './arrange-dialog.component.html',
  styleUrls: ['./arrange-dialog.component.scss'],
  providers: [MessageService]
})
export class ArrangeDialogComponent {
  //#region Variables Declations
  @Input() _teamMatchFullDetails: any = [];
  @Input() _teamBPlayers: any = [];
  @Input() _teamAPlayers: any = [];
  @Input() _teamAPlayersCopy: any = [];
  @Input() _teamBPlayersCopy: any = [];
  _fieldList: any = [
    {
      "isSingle": true,
      "player_teamA": '',
      "player_teamB": '',
      "dropValuePlayerA": [],
      "dropValuePlayerB": []
    }
  ];
  _eventId: any = 0;
  _showLoader: boolean = false
  _matchList: any = [];
  @Input() _parent_match_id: any = '';
  @Input() _teamA_participant_id: any = '';
  @Input() _teamB_participant_id: any = '';
  @Input() _currentCategoryId: any;
  @Output() isTeamMatchCreated = new EventEmitter<any>();
  @Input() _isEditForScoreUpdate: boolean = false;
  @Input() _createdMatchList: any = [];
  _selectedPlayerA: any = [];
  _selectedPlayerB: any = [];
  _selectedPlayerAFrmD: any = [];
  _selectedPlayerBFrmD: any = [];
  _playerBDummyList: any = [];
  _showError: boolean = false;
  _massage: any;
  _currentRule: any;
  innerWidth: any
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }
  _isDark: boolean = true

  //#endregion Variables Declations
  constructor(private encyptDecryptService: EncyptDecryptService, private eventsService: EventsService, private messageService: MessageService) {
    this.innerWidth = window.innerWidth;
  }
  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this._fieldList = [
      {
        "isSingle": true,
        "player_teamA": '',
        "player_teamB": '',
        "dropValuePlayerA": [],
        "dropValuePlayerB": []
      }
    ];
   this._isDark =  localStorage.getItem('isChecked') == 'true' ? true : false;

    this.addDymanicDropdowns();
  }
  ngOnChanges(changes: SimpleChanges) {
    this._fieldList = [
      {
        "isSingle": true,
        "player_teamA": '',
        "player_teamB": '',
        "dropValuePlayerA": [],
        "dropValuePlayerB": []
      }
    ];
    this.addDymanicDropdowns();
  }
  //#region  Method is used for Add Fields into array _fieldList
  addField(isSingle: any) {

    // if (this._fieldList.length < 5) 
    if (this._fieldList.length < this.getTeamMatcehs()) {
      // if (this._fieldList.length < 3) {
      //   this._fieldList.push({
      //     "isSingle": true,
      //     "player_teamA": '',
      //     "player_teamB": '',
      //     "dropValuePlayerA": [],
      //     "dropValuePlayerB": []
      //   })

      // } else {
      //   if (isSingle) {
      //     this._fieldList.push({
      //       "isSingle": true,
      //       "player_teamA": '',
      //       "player_teamB": '',
      //       "dropValuePlayerA": [],
      //       "dropValuePlayerB": []
      //     })
      //   } else {
      //     this._fieldList.push({
      //       "isSingle": isSingle,
      //       "player_teamA": '',
      //       "player_teamB": '',
      //       "dropValuePlayerAOne": [],
      //       "dropValuePlayerBOne": [],
      //       "dropValuePlayerATwo": [],
      //       "dropValuePlayerBTwo": []
      //     })
      //   }

      // }
      if (isSingle) {
        this._fieldList.push({
          "isSingle": true,
          "player_teamA": '',
          "player_teamB": '',
          "dropValuePlayerA": [],
          "dropValuePlayerB": []
        })
      } else {
        this._fieldList.push({
          "isSingle": isSingle,
          "player_teamA": '',
          "player_teamB": '',
          "dropValuePlayerAOne": [],
          "dropValuePlayerBOne": [],
          "dropValuePlayerATwo": [],
          "dropValuePlayerBTwo": []
        })
      }
    }
  }
  //#endregion Method is used for Add Fields into array _fieldList
  //#region method is used for delete Team Sub Matches
  deleteTeamSubMatches() {
    this.eventsService.deleteTeamSubMatches(this._eventId, this._parent_match_id).subscribe({
      next: (result: any) => {
        this._showLoader = false;

        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: result.body.msg,
          life: 3000,
        });
        this.isTeamMatchCreated.emit(true);
      },
      error: (result: any) => {
        this._showLoader = false;
        this.messageService.add({
          key: 'bc',
          severity: 'info',
          summary: 'Info',
          detail: result.error.msg,
          life: 3000,
        });
      },
      complete: () => { },
    });
  }
  //#endregion method is used for delete Team Sub Matches
  //#region method is used for Create Team Matches
  createTeamMatches() {
    this._matchList = [];
    if (this._fieldList.length == this.getTeamMatcehs())
    // if (this._fieldList.length == 5)
    {
      for (let i = 0; i < this._fieldList.length; i++) {
        if (this._fieldList[i].isSingle) {
          const data = {
            "player_teamA": this._fieldList[i].dropValuePlayerA.name,
            "player_teamB": this._fieldList[i].dropValuePlayerB.name,
            "player_teamA_user_id": this._fieldList[i].dropValuePlayerA.user_id,
            "player_teamB_user_id": this._fieldList[i].dropValuePlayerB.user_id
          }
          if (this._fieldList[i].dropValuePlayerA.name !== undefined && this._fieldList[i].dropValuePlayerB.name !== undefined) {
            this._showError = false;
            this._matchList.push(data);
          } else {
            this._massage = "Kindly Select Players In Row " + (i + 1);
            this._showError = true
            break;
          }
        } else {
          if (this._fieldList[i].dropValuePlayerAOne.name !== undefined
            && this._fieldList[i].dropValuePlayerBOne.name !== undefined
            && this._fieldList[i].dropValuePlayerATwo.name !== undefined
            && this._fieldList[i].dropValuePlayerBTwo.name !== undefined) {
            this._showError = false;
            if ((this._fieldList[i].dropValuePlayerAOne.name == this._fieldList[i].dropValuePlayerBOne.name) || (this._fieldList[i].dropValuePlayerATwo.name == this._fieldList[i].dropValuePlayerBTwo.name)) {
              this._massage = "Same Players In Row " + (i + 1);
              this._showError = true
              break;
            } else {
              const data = {
                "player_teamA": this._fieldList[i].dropValuePlayerAOne.name + '/' + this._fieldList[i].dropValuePlayerBOne.name,
                "player_teamB": this._fieldList[i].dropValuePlayerATwo.name + '/' + this._fieldList[i].dropValuePlayerBTwo.name

              }
              this._matchList.push(data);
            }
          } else {
            this._massage = "Kindly Select Players In Row " + (i + 1);
            this._showError = true
            break;
          }
        }
      }
      if (!this._showError) {
        const body = {
          "event_id": this._eventId,
          "category_id": this._currentCategoryId,
          "parent_match_id": this._parent_match_id,
          "teamA_participant_id": this._teamA_participant_id,
          "teamB_participant_id": this._teamB_participant_id,
          "matches": this._matchList
        }
        this.eventsService.createTeamMatches(body).subscribe({
          next: (result: any) => {
            this._showLoader = false;

            this.messageService.add({
              key: 'bc',
              severity: 'success',
              summary: 'Success',
              detail: result.body.msg,
              life: 3000,
            });
            this.isTeamMatchCreated.emit(true);
          },
          error: (result: any) => {
            this._showLoader = false;
            this.messageService.add({
              key: 'bc',
              severity: 'info',
              summary: 'Info',
              detail: result.error.msg,
              life: 3000,
            });
          },
          complete: () => { },
        });
      }
    } else {
      this._showError = true
      this._massage = 'Minimum 3 And Maximum 5 Team Matches Accepted'
    }
  }
  //#endregion method is used for Create Team Matches
  //#region method is used for delete row from array
  deleteRow(index: any) {
    if (this._fieldList.length > 1) {
      if (this._fieldList[index].isSingle) {
        if (this._fieldList[index].player_teamA !== '') {
          this._teamAPlayers.push(this._selectedPlayerA.filter((x: any) => x.name == this._fieldList[index].player_teamA)[0])
        }
        if (this._fieldList[index].player_teamB !== '') {
          this._teamBPlayers.push(this._selectedPlayerB.filter((x: any) => x.name == this._fieldList[index].player_teamB)[0])
        }
      } else {
        if (this._fieldList[index].player_teamA !== '') {
          if (this._fieldList[index].player_teamA.split('/')[0] !== '') {
            this._teamAPlayers.push(this._selectedPlayerAFrmD.filter((x: any) => x.name == this._fieldList[index].player_teamA.split('/')[0])[0])
          }
          if (this._fieldList[index].player_teamA.split('/')[1] !== '') {
            this._teamBPlayers.push(this._selectedPlayerBFrmD.filter((x: any) => x.name == this._fieldList[index].player_teamA.split('/')[1])[0])
          }
        }
        if (this._fieldList[index].player_teamB !== '') {
          if (this._fieldList[index].player_teamB.split('/')[0] !== '') {
            this._teamAPlayers.push(this._selectedPlayerAFrmD.filter((x: any) => x.name == this._fieldList[index].player_teamB.split('/')[0])[0])
          }
          if (this._fieldList[index].player_teamB.split('/')[1] !== '') {
            this._teamBPlayers.push(this._selectedPlayerBFrmD.filter((x: any) => x.name == this._fieldList[index].player_teamB.split('/')[1])[0])
          }
        }
      }
      this._fieldList.splice(index, 1)
    }
  }
  //#endregion  method is used for delete row from array
  //#region used for get first letter upercase
  getFirstLetters(data: any) {
    if (data.split(' ').length > 1) {
      return (
        data.split(' ')[0].charAt(0).toUpperCase() +
        data.split(' ')[1].charAt(0).toUpperCase()
      );
    } else {
      return data.split(' ')[0].charAt(0).toUpperCase();
    }
  }
  //#endregion used for get first letter upercase
  getTeamMatcehs(): any {
    if (localStorage.getItem('team_Matches') !== null) {
      return localStorage.getItem('team_Matches')
    } else {
      return 0
    }

  }
  addDymanicDropdowns() {
    this._currentRule = localStorage.getItem('team_Matches')
    this._fieldList = [];
    if (this._currentRule == '3') {
      for (let i = 0; i < 2; i++) {
        this.addField(true)
      }
      this.addField(false)
    } else if (this._currentRule == '5') {
      for (let i = 0; i < 2; i++) {
        this.addField(true)
      }
      this.addField(false)
      for (let i = 0; i < 2; i++) {
        this.addField(true)
      }
    }
    else if (this._currentRule == '9') {
      for (let i = 0; i < this._currentRule; i++) {
        this.addField(true)
      }
    }
  }
}
