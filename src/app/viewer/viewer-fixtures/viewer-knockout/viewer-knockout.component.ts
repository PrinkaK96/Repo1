import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EncyptDecryptService } from 'src/app/services/EncryptDecrypt/encypt-decrypt.service';
import { FixtureServiceService } from 'src/app/services/fixtures/fixture-service.service';
import { EventsService } from 'src/app/services/WebEventService/events.service';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
import { NgttTournament } from './interfaces';
import { MyMonitoringService } from 'src/app/services/AzureLogging/logging.service';

@Component({
  selector: 'stupa-viewer-knockout',
  templateUrl: './viewer-knockout.component.html',
  styleUrls: ['./viewer-knockout.component.scss'],
  providers:[MessageService, ConfirmationDialogService]
})
export class ViewerKnockoutComponent implements OnInit {
  public singleEliminationTournament!: NgttTournament;
  public doubleEliminationTournament!: NgttTournament;
  public renderedTree: 'se' | 'de' = 'de';
  _fixture: any = [];
  _topPlayersCopy: any = [];
 
  
  
  @Input() _fixtureScreen: boolean = false;
  _controller: boolean = true;
  _showLoader: boolean = false;
  _matchDetailsList: any = [];
  _eventId: any;
  @Input() _currentCategoryId: any;
  @Input() _currentParticipantId: any;
  _participantIdList: any = [];
  _mathesList: any = [];
  _fixtureTreeData: any = [];
  _showTree: boolean = false;
  _isAllAPIExcecuted: boolean = false;
  @Input() isRefreshData: boolean = false;
  @Input() isKnockout: boolean = false;
  @Input() _activeIndex: any
  _showFull: boolean = false;
  _arrangePlayer: any=[];
  _topPlayers: any=[];
  azureLoggerConversion: any = new Error();
  constructor(private fixtureService: FixtureServiceService,
    private messageService: MessageService, private confirmationDialogService: ConfirmationDialogService, private azureLoggerService: MyMonitoringService,
    private encyptDecryptService: EncyptDecryptService, private eventsService: EventsService) { }

  ngOnInit(): void {
    this._eventId = this.encyptDecryptService.decryptUsingAES256(localStorage.getItem('event_id'));
    //this.getFirstRoundKnockout();
    this.getKnockoutTournament();
    this.doubleEliminationTournament = {
      rounds: [
        {
          type: 'Winnerbracket',
          matches: [
            {
              teams: [
                { name: 'Player  A', score: 1 },
                { name: 'Player  B', score: 2 },
              ],
            },
            {
              teams: [
                { name: 'Player  C', score: 1 },
                { name: 'Player  D', score: 2 },
              ],
            },
            {
              teams: [
                { name: 'Player  E', score: 1 },
                { name: 'Player  F', score: 2 },
              ],
            },
            {
              teams: [
                { name: 'Player  G', score: 1 },
                { name: 'Player  H', score: 2 },
              ],
            },
          ],
        },
        {
          type: 'Winnerbracket',
          matches: [
            {
              teams: [
                { name: 'Player  B', score: 1 },
                { name: 'Player  D', score: 2 },
              ],
            },
            {
              teams: [
                { name: 'Player  F', score: 1 },
                { name: 'Player  H', score: 2 },
              ],
            },
          ],
        },
        {
          type: 'Loserbracket',
          matches: [
            {
              teams: [
                { name: 'Player  A', score: 1 },
                { name: 'Player  C', score: 2 },
              ],
            },
            {
              teams: [
                { name: 'Player  E', score: 1 },
                { name: 'Player  G', score: 2 },
              ],
            },
          ],
        },
        {
          type: 'Loserbracket',
          matches: [
            {
              teams: [
                { name: 'Player  C', score: 1 },
                { name: 'Player  B', score: 2 },
              ],
            },
            {
              teams: [
                { name: 'Player  G', score: 1 },
                { name: 'Player  F', score: 2 },
              ],
            },
          ],
        },
        {
          type: 'Winnerbracket',
          matches: [
            {
              teams: [
                { name: 'Player  D', score: 1 },
                { name: 'Player  H', score: 2 },
              ],
            },
          ],
        },
        {
          type: 'Loserbracket',
          matches: [
            {
              teams: [
                { name: 'Player  B', score: 1 },
                { name: 'Player  F', score: 2 },
              ],
            },
          ],
        },
        {
          type: 'Loserbracket',
          matches: [
            {
              teams: [
                { name: 'Player  D', score: 1 },
                { name: 'Player  F', score: 2 },
              ],
            },
          ],
        },
        {
          type: 'Final',
          matches: [
            {
              teams: [
                {
                  name: 'Player  H',
                  score: 1,
                },
                {
                  name: 'Player  F',
                  score: 2,
                },
              ],
            },
          ],
        },
      ],
    };
    this.singleEliminationTournament = {
      rounds: [
        {
          roundName: 'Round 16',
          type: 'Winnerbracket',
          matches: [
            {
              teams: [
                { name: 'Player  A', score: 1 },
                { name: 'Bye', score: 1 },
              ],
            },
            {
              teams: [
                { name: 'Player  C', score: 1 },
                { name: 'Player  D', score: 2 },
              ],
            },
            {
              teams: [
                { name: 'Player  E', score: 1 },
                { name: 'Bye', score: 2 },
              ],
            },
            {
              teams: [
                { name: 'Player  G', score: 1 },
                { name: 'Player  H', score: 2 },
              ],
            },
            {
              teams: [
                { name: 'Player  I', score: 2 },
                { name: 'Player  J', score: 1 },
              ],
            },
            {
              teams: [
                { name: 'Player  K', score: 2 },
                { name: 'Player  L', score: 1 },
              ],
            },
            {
              teams: [
                { name: 'Player  M', score: 1 },
                { name: 'Player  N', score: 2 },
              ],
            },
            {
              teams: [
                { name: 'Player  O', score: 1 },
                { name: 'Player  P', score: 2 },
              ],
            },
          ],
        },
        {
          roundName: 'Quarter-Final',
          type: 'Winnerbracket',
          matches: [
            {
              teams: [
                { name: 'Player  A', score: 1 },
                { name: 'Player D', score: 0 },
              ],
            },
            {
              teams: [
                { name: 'Player  E', score: 1 },
                { name: 'Player  H', score: 2 },
              ],
            },
            {
              teams: [
                { name: 'Player  I', score: 1 },
                { name: 'Player  K', score: 2 },
              ],
            },
            {
              teams: [
                { name: 'Player  N', score: 1 },
                { name: 'Player  P', score: 2 },
              ],
            },
          ],
        },
        {
          roundName: 'Semi-Final',
          type: 'Winnerbracket',
          matches: [
            {
              teams: [
                { name: 'Player  A', score: 1 },
                { name: 'Player  H', score: 2 },
              ],
            },
            {
              teams: [
                { name: 'Player  K', score: 1 },
                { name: 'Player  P', score: 2 },
              ],
            },
          ],
        },
        {
          roundName: 'Final',
          type: 'Final',
          matches: [
            {
              teams: [
                {
                  name: 'Player  G',
                  score: 1,
                },
                {
                  name: 'Player  P',
                  score: 2,
                },
              ],
            },
            // {
            //   teams: [
            //     {
            //       name: 'Player  F',
            //       score: 1
            //     }
            //   ]
            // }
          ],
        },
      ],
    };
  }
  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const chng = changes[propName];
      const cur = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);
      // this.changeLog.push(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }

    
    this.getKnockoutTournament();

  }
  updatedPullList(data: any) {
    this.singleEliminationTournament.rounds[0] = data;
  }
  
  returnUpdatedList(detailsAfterSwap: any) {
    this._arrangePlayer = detailsAfterSwap;
  }
  
  getKnockoutTournament() {
    this._isAllAPIExcecuted = false
    if (this._eventId !== undefined && this._currentCategoryId !== undefined && this._eventId !== null && this._currentCategoryId !== null) {
      this.fixtureService.getKnockoutTournament(this._eventId, this._currentCategoryId).subscribe({
        next: (result: any) => {
          //this.getPlayerList();
          if (result.body.length > 0) {
            this.singleEliminationTournament.rounds = [];
            if (result.body.length == 1) {
              for (let i = 0; i < result.body.length; i++) {
                if (result.body[i].round == 'Final') {
                  this._showTree = true
                  const dd = {
                    roundName: 'Final',
                    type: 'Final',
                    matches: result.body[i].matches


                  }
                  this.singleEliminationTournament.rounds.push(dd)
                } else {
                  this._showTree = false;
                }
              }
            } else {
              this._showTree = true
              for (let i = 0; i < result.body.length; i++) {

                if (result.body[i].round == 'Final') {
                  this._showTree = true
                  const dd = {
                    roundName: 'Final',
                    type: 'Final',
                    matches: result.body[i].matches

                  }
                  this.singleEliminationTournament.rounds.push(dd)
                } else {
                  const dd = {
                    roundName: result.body[i].round,
                    type: 'Winnerbracket',
                    matches: result.body[i].matches
                  }
                  this.singleEliminationTournament.rounds.push(dd)
                }
              }
            }
            this.messageService.add({
              key: 'bc',
              severity: 'success',
              summary: 'Success',
              detail: result.body.msg,
              life: 3000,
            });
          } else {
            this._showTree = false;
            // this._fixtureScreen = false; 
          }
          this._isAllAPIExcecuted = true;
          // this._showTree = this._fixtureScreen
        },
        error: (result: any) => {
          this._showLoader = false;
          this.azureLoggerConversion = result.error.msg
        this.azureLoggerService.logException(this.azureLoggerConversion)
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'Error',
            detail: result.error.msg,
            life: 3000,
          });
        },
        complete: () => { },
      });
    }
  }
 
 
}

