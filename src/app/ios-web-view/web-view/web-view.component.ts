import { Component } from '@angular/core';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { SocketService } from 'src/app/services/Sockets/socket.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';

@Component({
  selector: 'stupa-web-view',
  templateUrl: './web-view.component.html',
  styleUrls: ['./web-view.component.scss']
})
export class WebViewComponent {
  title = 'web-view';
  _eventId: any;
  matchId: any;
  intervalID: any;
  _liveMatcheScoreDetails: any = [
    // {
    //   "parent_match_id": 4724,
    //   "match_id": 471,
    //   "live": true,
    //   "is_active": false,
    //   "start_time": "2023-04-17T09:20:00",
    //   "end_time": "2023-04-17T09:50:00",
    //   "status": "Todo",
    //   "round_level": "R8",
    //   "event_id": 26,
    //   "event_name": "Open Games Chamapionship",
    //   "category_id": 17,
    //   "round_description": "Quarter Final",
    //   "category_description": "U-19 Boys Teams",
    //   "winner": null,
    //   "participant_type_id": 2,
    //   "participant_description": "Team",
    //   "table": 1,
    //   "umpire_name": "Umpire05",
    //   "Rule": "Standard",
    //   "group_id": 826,
    //   "group_type": 2,
    //   "rule_set": 3,
    //   "live_scored": true,
    //   "extra": {
    //     "nameValuePairs": {
    //       "MatchId": 471,
    //       "MatchNumber": 471,
    //       "GameNumber": 3,
    //       "GameWinnerId": 532,
    //       "GameScore": "6-4",
    //       "UmpireId": 39,
    //       "UmpireName": "",
    //       "TournamentName": "Open Games Chamapionship",
    //       "EventName": "U-19 Boys Teams",
    //       "TableNo": "1",
    //       "Deuce": false,
    //       "PlayerSide": "Left",
    //       "SwitchSides": true,
    //       "FinalSet": false,
    //       "FinalPoint": false,
    //       "Status": "score",
    //       "FileName": "",
    //       "Coordinates": "",
    //       "Winner": "playerb",
    //       "ServiceBy": 532,
    //       "ServiceFrom": "left",
    //       "PointEnd": "71",
    //       "PointStart": "01",
    //       "GoldenRule": false,
    //       "isBetting": false,
    //       "tournamentId": 26,
    //       "StartPlaying": false,
    //       "MatchWinnerId": 0,
    //       "EventId": 26,
    //       "PlayerAId": 533,
    //       "PlayerAName": "Sidharth4",
    //       "PlayerAState": "",
    //       "PlayerACountry": "club5",
    //       "PlayerATimeout": false,
    //       "PlayerAHandType": "Righty",
    //       "PlayerAyellowCardCount": 0,
    //       "PlayerARedCardCount": 0,
    //       "PlayerBId": 532,
    //       "PlayerBName": "Sidharth5",
    //       "PlayerBCountry": "club5",
    //       "PlayerBTimeout": false,
    //       "PlayerBHandType": "Righty",
    //       "PlayerBYellowYardCount": 0,
    //       "PlayerBRedCardCount": 0,
    //       "GameScoreA": 6,
    //       "GameScoreB": 4,
    //       "SetScoreA": 1,
    //       "SetScoreB": 1,
    //       "playerAColour": "",
    //       "playerBColour": "",
    //       "CurrentSetScoreA": 1,
    //       "CurrentSetScoreB": 1
    //     }
    //   },
    //   "match_details": [
    //     {
    //       "id": 940,
    //       "participant_id": 533,
    //       "participant_name": "Sidharth4",
    //       "score": [
    //         11,
    //         0,
    //         6,
    //         9,
    //         4,
    //         8,
    //         7
    //       ],
    //       "set_won": 1,
    //       "club": "Kanpur Club",
    //       "team_name": "Korea"
    //     },
    //     {
    //       "id": 941,
    //       "participant_id": 532,
    //       "participant_name": "Sidharth5",
    //       "score": [
    //         0,
    //         11,
    //         4,
    //         11,
    //         11 ,
    //         13,
    //         12
    //       ],
    //       "set_won": 1,
    //       "club": "Kanpur Club",
    //       "team_name": "Chinese Type"
    //     }
    //   ],
    //   "team_match_data": {
    //     "match_id": 4724,
    //     "event_id": 26,
    //     "event_name": "Open Games Chamapionship",
    //     "image_url": "https://stupaprodsguscentral.blob.core.windows.net/cbtm/banners/ben-sauer-R1m90FLHJFY-unsplash.jpg",
    //     "live": true,
    //     "is_active": false,
    //     "start_time": "2023-04-17T09:20:00",
    //     "end_time": "2023-04-17T09:50:00",
    //     "round_level": "R8",
    //     "category_id": 17,
    //     "round_description": "Quarter Final",
    //     "category_description": "U-19 Boys Teams",
    //     "winner": null,
    //     "participant_type_id": 2,
    //     "participant_description": "Team",
    //     "table": 1,
    //     "umpire_name": "Umpire05",
    //     "Rule": "Standard",
    //     "group_id": 826,
    //     "group_type": 2,
    //     "playback_id": "0000A8yAYxhoAu8yE201QT1iiiE02GuydU6O52PFG5vLJfg",
    //     "extra": null,
    //     "match_details": [
    //       {
    //         "id": 9086,
    //         "participant_id": 533,
    //         "participant_name": "Korea",
    //         "score": [
    //           0,
    //           0,
    //           0
    //         ],
    //         "set_won": 1
    //       },
    //       {
    //         "id": 9087,
    //         "participant_id": 532,
    //         "participant_name": "Chinese Type",
    //         "score": [
    //           0,
    //           0,
    //           0
    //         ],
    //         "set_won": 1
    //       }
    //     ]
    //   }
    // }
  ];
  constructor(public encyptDecryptService: EncyptDecryptService, private eventsService: EventsService, private socketService: SocketService) {
    this.getLiveScoredMatches()
    this.callSocketForLiveScore()
  }
  ngOnInit(): void {
    // this.getLiveScoredMatches()

  }
  //#endregion function to set fixture format on selection of participant type
  getLiveScoredMatches() {
    this._eventId = parseInt(window.location.href.split('/')[5]);
    this.matchId = parseInt(window.location.href.split('/')[6]);
    if (this._eventId !== undefined) {
      this.eventsService.getLiveScoredWithMatchId(this._eventId, this.matchId).subscribe({
        next: (result: any) => {
          this._liveMatcheScoreDetails = []
          if (result.body.length > 0) {
            for (let i = 0; i < result.body.length; i++) {
              if (result.body[i].extra.nameValuePairs == undefined) {
                result.body[i].extra.nameValuePairs = result.body[i].extra;
              }
            }
            this._liveMatcheScoreDetails = result.body;
          } else {
            this._liveMatcheScoreDetails = [];
          }
        
        },
        error: (result: any) => {
        },
        complete: () => { },
      });
    }
  }
  trackById(index: number, user: any): string {
    return user.match_id;
  }
  callSocketForLiveScore() {
    //this.socketService.fetchEventResult();
    this.socketService.getLiveScore().subscribe({
      next: (result: any) => {
        result;
        if (result !== null) {
          for (let i = 0; i < this._liveMatcheScoreDetails.length; i++) {
            if (this._liveMatcheScoreDetails[i].match_id == result.MatchId) {
              this._liveMatcheScoreDetails[i].extra.nameValuePairs = result;
              this._liveMatcheScoreDetails[i].match_details[0].score[result.GameNumber] = result.GameScoreA
              this._liveMatcheScoreDetails[i].match_details[1].score[result.GameNumber] = result.GameScoreB
              this._liveMatcheScoreDetails[i].match_details[0].set_won = result.SetScoreA
              this._liveMatcheScoreDetails[i].match_details[1].set_won = result.SetScoreB
            }
          }
          this._liveMatcheScoreDetails = [...this._liveMatcheScoreDetails]
          if (result.GameScore == '0-0') {
            this.getLiveScoredMatches();
          }
        }

      },
      error: (result: any) => {
        result;
      },
      complete: () => { },
    });
  }
  //#region method is used hit regressive API Calling
  viewStatus() {
    this.intervalID = setInterval(() => {
      // this.getLiveScoredMatches()
    }, 60000);
  }
  //#endregion method is used hit regressive API Calling
}
