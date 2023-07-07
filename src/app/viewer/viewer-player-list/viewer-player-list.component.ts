import { Component } from '@angular/core';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';
@Component({
  selector: 'stupa-viewer-player-list',
  templateUrl: './viewer-player-list.component.html',
  styleUrls: ['./viewer-player-list.component.scss'],
})
export class ViewerPlayerListComponent {

  _eventId: any;
  _participantTypesList: any = []
  _selectedParticipantTypes: any
  _currentParticipantId: any
  _categoryList: any = []
  _categoryId: any;
  _currentCategoryId: any
  _categoryName: any
  _searchByPlayerName: any = '';
  _subcategoryList: any = []
  _players: any = [];
  _playersCopy: any = [];
  _tabChange: boolean = false;
  _tabIndex: any;
  _SubcategoryList: any = [];
  new_SUBcategories: any = [];
  Sub_category_description: any = []

  _dataStored: any = []
  azureLoggerConversion: any = new Error();
  _newList: any = [];
  _newList2: any = [];
  _categoriesArray: any = [];
  _teamList: any = [];
  _teamListCopy: any = [];
  _doubleList: any = [];
  _doubleListCopy: any = [];
  _mixDoubleList: any = [];
  _mixDoubleListCopy: any = [];
  ViewerPlayerList = [
    {
      teamName: "IND", teamPoints: 21312,
      teamsPlayersname: [{
        src: "asdfasdf",
        PlayerName: "govind singh",
        PlayerClub: "club"
      },
      {
        src: "asdfasdf",
        PlayerName: "govind singh",
        PlayerClub: "club"

      },
      {
        src: "asdfasdf",
        PlayerName: "govind singh",
        PlayerClub: "club"

      },
      {
        src: "asdfasdf",
        PlayerName: "govind singh",
        PlayerClub: "club"

      }]
    },
    {
      teamName: "IND", teamPoints: 21312,
      teamsPlayersname: [{
        src: "asdfasdf",
        PlayerName: "govind singh",
        PlayerClub: "club"

      }]
    },
    {
      teamName: "IND", teamPoints: 21312,
      teamsPlayersname: [{
        src: "asdfasdf",
        PlayerName: "govind singh",
        PlayerClub: "club"

      }]
    },
    {
      teamName: "IND", teamPoints: 21312,
      teamsPlayersname: [{
        src: "asdfasdf",
        PlayerName: "govind singh",
        PlayerClub: "club"

      }]
    },
    {
      teamName: "IND", teamPoints: 21312,
      teamsPlayersname: [{
        src: "asdfasdf",
        PlayerName: "govind singh",
        PlayerClub: "club"

      }]
    },
  ]
  // _searchByTeamName: any = '';
  // _searchByDoubleName: any = '';
  // _searchMixDouble: any = '';
  constructor(public encyptDecryptService: EncyptDecryptService, private eventsService: EventsService, private azureLoggerService: MyMonitoringService, private registrationService: EventsService,) { }
  ngOnInit() {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    this.getParticipantTypeAndCategories();
  }
  getParticipantTypeAndCategories() {
    if (this._eventId !== undefined) {
      this.eventsService.getParticipantTypeAndCategories(this._eventId).subscribe({
        next: (result: any) => {
          this._participantTypesList = result.body;
          this._selectedParticipantTypes = this._participantTypesList[0];
          this._currentParticipantId = this._selectedParticipantTypes.participant_type_id;
          this._categoriesArray = this._participantTypesList[0].categories;
          this._newList = this._categoriesArray.filter((x: any) => x.sub_categories.length == 0)
          this._newList2 = this._categoriesArray.map((s: any) => s.sub_categories).flat()
          this._categoryList = [...this._newList, ...this._newList2];
          // this._SubcategoryList = this._participantTypesList[0].categories[1].sub_categories[0].category_description;
          // this.Sub_category_description = this._SubcategoryList[0].sub_categories[0]
          this._currentCategoryId = this._categoryList[0].category_id;
          this._categoryName = this._categoryList[0].category_description;
          this.getPlayerList(this._currentParticipantId, this._currentCategoryId);
          // this.getEventRegistedPlayers();
        },
        error: (result: any) => {
          this.azureLoggerConversion = result.error.msg
          this.azureLoggerService.logException(this.azureLoggerConversion)
        },
        complete: () => { },
      });
    }
  }
  getPlayerList(_currentParticipantId: any, _currentCategoryId: any) {
    this._searchByPlayerName = '';
    // data != "" ? this._categoryList[data.value] : this._categoryList;
    // this._currentCategoryId = data != "" ? data.value.category_id : this._currentCategoryId;
    // this._categoryName = data != "" ? data.value.category_description : this._categoryName;
    this.eventsService.getEventRegistedPlayers(this._eventId, _currentParticipantId, _currentCategoryId).subscribe({
      next: (result: any) => {

        if (this._currentParticipantId == 1) {
          this._players = [];
          this._playersCopy = [];
          // this._showLoader = false;
          //  this._showLoader = false;
          for (let i = 0; i < result.body.length; i++) {
            const data = {
              "user_id": result.body[i].event_participant_details[0].user_id,
              "name": result.body[i].participant_name,
              "email": result.body[i].event_participant_details[0].email,
              "gender_id": result.body[i].event_participant_details[0].gender_id,
              "isSelected": false,
              "club": result.body[i].club,
              "points": result.body[i].points == null ? 0 : result.body[i].points,
              "state": result.body[i].event_participant_details[0].state,
              "participant_id": result.body[i].participant_id,
              "rating": result.body[i].rating,
              "license": result.body[i].event_participant_details[0].license,
              "dob": result.body[i].event_participant_details[0].dob,
            }
            
            this._players.push(data);
            this._playersCopy.push(data);
          }
          // this._totolLength = this._playersCopy.length;
        } else if (this._currentParticipantId == 2) {
          // this._showLoader = false;
          // this._showLoader = false;
          
          this._teamList = []
          this._teamListCopy = [];
          this._teamList = result.body;
          this._teamListCopy = result.body;
          // this._totolLength = this._teamListCopy.length;
        } else if (this._currentParticipantId == 3) {

          // this._showLoader = false;
          // this._showLoader = false;
          this._doubleList = []
          this._doubleListCopy = [];
          this._doubleList = result.body;
          this._doubleListCopy = result.body;
          //  this._totolLength = this._doubleListCopy.length;
        } else if (this._currentParticipantId == 4) {

          // this._showLoader = false;
          //  this._showLoader = false;
          
          this._mixDoubleList = []
          this._mixDoubleListCopy = [];
          this._mixDoubleList = result.body;
          this._mixDoubleListCopy = result.body;
          // this._totolLength = this._mixDoubleListCopy.length;
        }

      },
      error: (result: any) => {
        // this._totolLength = '';
        this._players = [];
        this._playersCopy = [];
        this._teamList = []
        this._mixDoubleList = []
        this._mixDoubleListCopy = [];
        this._doubleList = []
        this._doubleListCopy = [];
        this._teamListCopy = [];
        // this._showLoader = false;
        // this._showLoader = false;
        this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
        // this.messageService.add({ key: 'bc', severity: 'info', summary: 'Info', detail: result.error.msg, life: 3000 });
      },
      complete: () => { },
    });
  }
  setType(data: any) {
    this._searchByPlayerName = '';
    //this._categoryList = data.value.categories
    this._currentParticipantId = data.value.participant_type_id;
    this._categoriesArray = this._participantTypesList.filter((x: any) => x.participant_type_id == data.value.participant_type_id)[0].categories;
    this._newList = this._categoriesArray.filter((x: any) => x.sub_categories.length == 0)
    this._newList2 = this._categoriesArray.map((s: any) => s.sub_categories).flat();
    this._categoryList = [...this._newList, ...this._newList2];
    //this._categoryList = this._participantTypesList.filter((x: any) => x.participant_type_id == data.value.participant_type_id)[0].categories;
    this._currentCategoryId = this._categoryList[0].category_id
    this.getPlayerList(this._currentParticipantId, this._currentCategoryId);
  }

  // getEventRegistedPlayers() {
  //   this.registrationService.getEventRegistedPlayers(this._eventId, this._currentParticipantId, this._currentCategoryId).subscribe({
  //     next: (result: any) => {
  //       this._dataStored = [];
  //       for (let i = 0; i < result.body.length; i++) {
  //         const data = {
  //           "name": result.body[i].participant_name,
  //           "club": result.body[i].name,
  //           "points": result.body[i].points == null ? 0 : result.body[i].points,
  //           "endpoints": result.body[i].event_points == null ? 0 : result.body[i].event_points,
  //           "ranks": result.body[i].world_rank == 0 ? 0 : result.body[i].world_rank,
  //         }
  //         this._dataStored.push(data);
  //       }
  //     },
  //     error: (result: any) => { },
  //     complete: () => { },
  //   })
  // }

  getFirstLettersofTeam(data: any) {
    if (data.split('/').length > 1) {
      return data.split('/')[0].charAt(0).toUpperCase() + data.split('/')[1].charAt(0).toUpperCase()
    } else {
      return data.split('/')[0].charAt(0).toUpperCase()
    }
  }
  searchPlayer() {
    if (this._currentParticipantId == 1) {
      this._players = this._playersCopy.filter((item: any) => {
        return (
          item.name
            .toLowerCase()
            .includes(this._searchByPlayerName.toLowerCase()) ||
          item.email
            .toLowerCase()
            .includes(this._searchByPlayerName.toLowerCase()) ||
          item.state
            .toLowerCase()
            .includes(this._searchByPlayerName.toLowerCase())
        );
      });
    }
    else if (this._currentParticipantId == 2) {
      this._teamList = this._teamListCopy.filter((item: any) => {
        return (
          item.participant_name
            .toLowerCase()
            .includes(this._searchByPlayerName.toLowerCase())
        );
      });

    }
    else if (this._currentParticipantId == 3) {
      this._doubleList = this._doubleListCopy.filter((item: any) => {
        return (
          item.participant_name
            .toLowerCase()
            .includes(this._searchByPlayerName.toLowerCase())
        );
      });
    }
    else {
      this._mixDoubleList = this._mixDoubleListCopy.filter((item: any) => {
        return (
          item.participant_name
            .toLowerCase()
            .includes(this._searchByPlayerName.toLowerCase())
        );
      });
    }
  }
  // searchTeam() {
  //   this._teamList = this._teamListCopy.filter((item: any) => {
  //     return (
  //       item.participant_name
  //         .toLowerCase()
  //         .includes(this._searchByTeamName.toLowerCase()) 
  //     );
  //   });

  // }
  // searchDoubles() {
  //   this._doubleList = this._doubleListCopy.filter((item: any) => {
  //     return (
  //       item.participant_name
  //         .toLowerCase()
  //         .includes(this._searchByDoubleName.toLowerCase()) 
  //     );
  //   });
  // }
  // searchMixDoubles() {
  //   this._mixDoubleList = this._mixDoubleListCopy.filter((item: any) => {
  //     return (
  //       item.participant_name
  //         .toLowerCase()
  //         .includes(this._searchMixDouble.toLowerCase()) 
  //     );
  //   });
  // }
 
}

