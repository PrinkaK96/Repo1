import { Component } from '@angular/core';
import { CommonService } from '../common.service';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-create-tie',
  templateUrl: './create-tie.component.html',
  styleUrls: ['./create-tie.component.scss'],
  providers: [
    DatePipe
  ]
})
export class CreateTieComponent {
  tieList: any = []
  squadList: any = []
  squadListCopy: any = []
  _createTie: boolean = false
  teamAVal: any
  teamBVal: any
  selectedTeam1: any;
  selectedTeam2: any;
  teamAid: any
  teamBid: any
  dateTime: any
  currentDate: any
  addMatches: boolean = false
  _selectedTie: any
  _matchesList: any = []
  _createMatchForm: any
  teamAList: any
  teamBList: any
  _showDoubles: boolean = false
  teamACombo: any = []
  teamBCombo: any = []
  _fieldList: any = [];
  teamASingle: any
  teamBSingle: any
  grp_type: any = [
    { name: 'GP' },
    { name: 'KO' },

  ]
  selectedGrpType: any
  teamADropVal:any
  teamBDropVal:any
  constructor(private commonService: CommonService, private datePipe: DatePipe) {
    this._createMatchForm = new FormGroup({
      table: new FormControl(Number),
      umpire: new FormControl(""),
      match_name: new FormControl(""),
      category_name: new FormControl(""),
      day: new FormControl(Number),
      datetime: new FormControl(""),
    })
  }

  ngOnInit() {
    this._fieldList = [
    ];
    this.getTies()
    this.getSquads()
    this.currentDate = new Date()
    this.selectedGrpType = 'GP'
  }
  setDateTime(data: any) {
    this.dateTime = data.value
  }
  getTies() {
    this.tieList = []
    this.commonService.getTie().subscribe((res) => {
      this.tieList.push(res)
      this.tieList
    })
  }
  getSquads() {
    this.squadList = []
    this.squadListCopy = []
    this.commonService.getSquads().subscribe((res) => {
      this.squadList = res
      this.selectedTeam1 = this.squadList[0].name
    })
  }
  showTie() {
    this._createTie = true
  }
  getSelectedTeam(index: any, teamName: string, data:any) {
    const finalData = this.squadList[index];

    if (teamName === 'teamA') {
      this.teamAVal = finalData.name;
      this.teamAid = finalData.team_id
      this.teamADropVal = data.value
    }
    else {
      this.teamBVal = finalData.name
      this.teamBid = finalData.team_id
      this.teamBDropVal = data.value

    }
  }
  createTie() {
    const body = {
      'datetime': this.dateTime,
      'name': this.teamAVal + ' ' + 'vs' + ' ' + this.teamBVal,
      "tie_number": 0,
      "day": 0,
      "team_A_id": this.teamAid,
      "team_B_id": this.teamBid,
      "group_type": this.selectedGrpType
    }
    this.commonService.createTie(body).subscribe((res) => {
      this.getTies()
    })
    this._createTie = false
    this.dateTime = ''
    this.teamADropVal = ''
    this.teamBDropVal = ''
    this.teamAid = ''
    this.teamBid = ''
    this.selectedGrpType = ''

  }
  closeDialog(data: any) {
    if (data === 'createTie') {
      this._createTie = false
    }
    else {
      this.addMatches = false
    }
  }

  showAddMatches(data: any) {
    this._fieldList = [];
    this._selectedTie = data
    const teamADetails = this._selectedTie.tie_participants[0].team_id
    const teamBDetails = this._selectedTie.tie_participants[1].team_id
    this.teamAList = this.squadList.filter((x: any) => x.team_id == teamADetails)
    this.teamBList = this.squadList.filter((x: any) => x.team_id == teamBDetails)
    this.addMatches = true

  }
  getSelectedPlayer(index: any) {

  }
  addField(isSingle: any) {
    if (isSingle) {
      this._fieldList.push({
        "isSingle": true,
        "player_teamA": '',
        "player_teamB": '',
      })
    } else {
      this._fieldList.push({
        "isSingle": isSingle,
        "dropValuePlayerAOne": [],
        "dropValuePlayerBOne": [],
        "dropValuePlayerATwo": [],
        "dropValuePlayerBTwo": []
      })
    }
  }
  createMatch() {
    this._fieldList
    if (this._fieldList[0].isSingle) {

      const playerTeamA = this._fieldList[0].player_teamA.split('*')
      const playerTeamB = this._fieldList[0].player_teamB.split('*')
      playerTeamA[1]
      const body = {
        "tie_id": this._selectedTie.tie_id,
        "datetime": this._createMatchForm.controls['datetime'].value,
        "table": this._createMatchForm.controls['table'].value,
        "umpire_id": 1,
        "umpire_name": this._createMatchForm.controls['umpire'].value,
        "name": this._createMatchForm.controls['match_name'].value,
        "match_number": 1,
        "day": this._createMatchForm.controls['day'].value,
        "category_name": this._createMatchForm.controls['category_name'].value,
        "player_A_id": parseInt(playerTeamA[1]),
        "player_B_id": parseInt(playerTeamB[1]),
        "name_A": playerTeamA[0],
        "name_B": playerTeamB[0],

      }
      this.commonService.createMatch(body).subscribe((res) => {
      })
      this.getTies()
    } else {
      const dropValuePlayerAOne = this._fieldList[0].dropValuePlayerAOne.split('*')
      const dropValuePlayerBOne = this._fieldList[0].dropValuePlayerBOne.split('*')
      const dropValuePlayerATwo = this._fieldList[0].dropValuePlayerATwo.split('*')
      const dropValuePlayerBTwo = this._fieldList[0].dropValuePlayerBTwo.split('*')
      const body = {
        "tie_id": this._selectedTie.tie_id,
        "datetime": this._createMatchForm.controls['datetime'].value,
        "table": this._createMatchForm.controls['table'].value,
        "umpire_id": 1,
        "umpire_name": this._createMatchForm.controls['umpire'].value,
        "name": this._createMatchForm.controls['match_name'].value,
        "match_number": 1,
        "day": this._createMatchForm.controls['day'].value,
        "category_name": this._createMatchForm.controls['category_name'].value,
        "name_A": dropValuePlayerAOne[0] + '/' + dropValuePlayerBOne[0],
        "name_B": dropValuePlayerATwo[0] + '/' + dropValuePlayerBTwo[0],
        "combo_A": {
          "name": dropValuePlayerAOne[0] + '/' + dropValuePlayerBOne[0],
          "team_id": this.teamAList[0].team_id,
          "doubles_1_id": parseInt(dropValuePlayerAOne[1]),
          "doubles_2_id": parseInt(dropValuePlayerBOne[1])
        },
        "combo_B": {
          "name": dropValuePlayerATwo[0] + '/' + dropValuePlayerBTwo[0],
          "team_id": this.teamBList[0].team_id,
          "doubles_1_id": parseInt(dropValuePlayerATwo[1]),
          "doubles_2_id": parseInt(dropValuePlayerBTwo[1])
        },

      }
      this.commonService.createMatch(body).subscribe((res) => {
        this.getTies();
        this.addMatches = false


      })

    }

  }
}


