import { Component, Input, TemplateRef } from '@angular/core';
import { NgttRound, NgttTournament } from '../interfaces';

@Component({
  selector: 'stupa-fix-double-tree',
  templateUrl: './fix-double-tree.component.html',
  styleUrls: ['./fix-double-tree.component.scss']
})
export class FixDoubleTreeComponent {
  //#region Variable
  @Input() matchTemplate!: TemplateRef<any>;
  @Input() tournament!: NgttTournament;
  public losersBracket!: NgttRound[];
  public winnersBracket!: NgttRound[];
  public final: any;
  //#endregion
  constructor() {
  }
  //#region Get Latest Changes
  ngOnChanges(changes: any) {
    this.losersBracket = this.tournament.rounds.filter((round: any) => {
      return round.type === 'Loserbracket';
    });
    this.winnersBracket = this.tournament.rounds.filter((round: any) => {
      return round.type === 'Winnerbracket';
    });
    this.final = this.tournament.rounds.filter((round: any) => {
      return round.type === 'Final';
    }).shift();
  }
  //#endregion
}
