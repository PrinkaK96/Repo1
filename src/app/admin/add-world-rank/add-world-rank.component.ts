import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EventsService } from 'src/app/services/WebEventService/events.service';


@Component({
  selector: 'stupa-add-world-rank',
  templateUrl: './add-world-rank.component.html',
  styleUrls: ['./add-world-rank.component.scss'],
  providers: [MessageService]
})
export class AddWorldRankComponent implements OnInit {
  gender_id: any;
  _totalPlayers: any
  _tabIndex = 0;
  first = 0;
  saveRankDialog: boolean = false;
  value: any;
  currentSelectedData: any = []
  Players_array: any = []
  openDialog: boolean = false;
  _currenAcceptedPage: number = 1;
  playerService: any;
  search: any = '';
  _ratingHistory: any;
  getRatingHistory: any;
  overlayVisible: boolean = false;
  constructor(private eventsService: EventsService, private messageService: MessageService) {

  }
  ngOnInit() {
    this.gender_id = 1;
    this.get_user_rank()
  }
  AddRank() {
    this.openDialog = true;
  }

  removeDialog() {
    this.openDialog = false
  }
  currentTab(data: any) {
    this.search = ''
    this._tabIndex = data.index;
    if (data.index == 0) {
      this._currenAcceptedPage = 1;
      this.first = 1
      this.gender_id = 1;
      this.get_user_rank();
    }
    else {
      this._currenAcceptedPage = 1;
      this.first = 1
      this.gender_id = 2;
      this.get_user_rank();
    }
  }
  get_user_rank() {
    this.eventsService.getUserRank(this.gender_id, this._currenAcceptedPage, this.search).subscribe({
      next: (data: any) => {
        this._totalPlayers = data.body[0];
        this.Players_array = data.body[1];
      },
      error: (error: any) => {
      },
      complete: () => { },
    })
  }



  editContent(item: any) {
    this.currentSelectedData = [];
    this.saveRankDialog = true
    this.currentSelectedData = item
  }

  add_world_rank() {
    this.eventsService.add_world_rank(this.value, this.currentSelectedData.user_id).subscribe({
      next: (res) => {
        this.Players_array = [];
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: res.body.message,
          life: 3000,
        });
        this.get_user_rank();
        this.saveRankDialog = false;
      },
      error: (error) => {
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Error',
          detail: error.body.message,
          life: 3000,
        });
      },
      complete: () => { },
    }
    )
  }
  paginate(event: any) {
    this.first = event.first;
    this._currenAcceptedPage = event.page + 1;
    if (this.search != '') {
      this.searchPlayers()
    }
    else {
      this.get_user_rank()
    }


  }
  searchPlayers() {
    this.eventsService.getUserRank(this.gender_id, this._currenAcceptedPage, this.search).subscribe({
      next: (data: any) => {
        this._totalPlayers = data.body[0];
        this.Players_array = data.body[1];

      },
      error: (error: any) => {
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Error',
          detail: error.body.msg,
          life: 3000,
        });
      },
      complete: () => { },
    })
  }
  updateRank() {
    this.eventsService.updateWorldRank().subscribe({
      next: (data: any) => {
        this.messageService.add({
          key: 'bc',
          severity: 'success',
          summary: 'Success',
          detail: data.body.msg,
          life: 3000,
        });


      },
      error: (error: any) => {
        this.messageService.add({
          key: 'bc',
          severity: 'error',
          summary: 'Error',
          detail: error.body.msg,
          life: 3000,
        });
      },
      complete: () => { },
    })
  }

  showRanks(value:any,item: any) {
    this.overlayVisible = value
    this.currentSelectedData = item
    this.eventsService.ratingHistory(this.currentSelectedData.user_id, true).subscribe(
      {
        next: (res) => {
          this._ratingHistory = res.body[0]?.rating_history_details;
        },
        error: () => { },
        complete: () => { },
      }
    )
  }
}

// overlayVisible